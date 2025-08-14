const sgMail = require('@sendgrid/mail');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

// Initialize services
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class EmailService {
  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || 'noreply@yourdomain.com';
    this.fromName = process.env.SENDGRID_FROM_NAME || process.env.PLATFORM_NAME || 'App Team';
    
    // Brand header that will be added to ALL emails
    this.brandHeader = process.env.rAIcruited_LOGO_URL ? `
      <div style="text-align: center; background-color: #f8f9fa; padding: 20px 0; border-bottom: 3px solid #2563eb; margin-bottom: 20px;">
        <img src="${process.env.rAIcruited_LOGO_URL}" alt="${this.fromName}" style="height: 50px; max-width: 200px;" />
      </div>
    ` : '';
    
    // Brand footer for all emails
    this.brandFooter = `
      <div style="text-align: center; background-color: #f8f9fa; padding: 15px; border-top: 1px solid #e9ecef; color: #6b7280; font-size: 12px; margin-top: 30px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} ${this.fromName}. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">This email was sent from ${this.fromName}</p>
      </div>
    `;
  }

  // Helper function to properly capitalize names
  capitalizeName(name) {
    if (!name) return name;
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Wrapper function to add branding to any email content
  wrapWithBrand(emailContent) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        ${this.brandHeader}
        <div style="padding: 0 20px;">
          ${emailContent}
        </div>
        ${this.brandFooter}
      </div>
    `;
  }

  /**
   * Send welcome email to guardian when student registers
   */
  async sendWelcomeEmail(studentId) {
    try {
      // Get student info
      const { data: student, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', studentId)
        .single();

      if (error) throw error;

      // Get guardian email from student_statistics
      const { data: stats, error: statsError } = await supabase
        .from('student_statistics')
        .select('guardian_email')
        .eq('user_id', studentId)
        .single();

      if (statsError) throw statsError;
      if (!stats?.guardian_email) {
        throw new Error('Guardian email not found');
      }

      const guardianEmail = stats.guardian_email;
      const studentName = this.capitalizeName(student.full_name);

      const msg = {
        to: guardianEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: `Welcome to ${this.fromName} - ${studentName} has joined!`,
        html: this.wrapWithBrand(`
          <h1>Welcome to ${this.fromName}!</h1>
          <p>Dear Parent/Guardian,</p>
          <p>We're excited to let you know that <strong>${studentName}</strong> has successfully registered for our educational platform.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul>
              <li>Your child will be able to interact with our AI learning assistant</li>
              <li>You'll receive weekly summaries of their conversations and learning progress</li>
              <li>All interactions are monitored for safety and educational value</li>
            </ul>
          </div>
          
          <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
          <p>Best regards,<br>The ${this.fromName} Team</p>
        `)
      };

      await sgMail.send(msg);
      
      console.log(`✅ Welcome email sent to ${guardianEmail} for student ${studentName}`);
      return { success: true, message: 'Welcome email sent successfully' };

    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send acceptance email to guardian when student is approved using SendGrid template
   */
  async sendAcceptanceEmail(studentId) {
    try {
      // Get student info
      const { data: student, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', studentId)
        .single();

      if (error) throw error;

      // Get guardian email from student_statistics
      const { data: stats, error: statsError } = await supabase
        .from('student_statistics')
        .select('guardian_email')
        .eq('user_id', studentId)
        .single();

      if (statsError) throw statsError;
      if (!stats?.guardian_email) {
        throw new Error('Guardian email not found');
      }

      const guardianEmail = stats.guardian_email;
      const studentName = this.capitalizeName(student.full_name);

      const onboardingUrl = process.env.rAIcruited_ONBOARDING_URL || 'https://onboardingre-production.up.railway.app';

      // Send acceptance email to guardian
      const guardianMsg = {
        to: guardianEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        templateId: process.env.SENDGRID_ACCEPTANCE_TEMPLATE_ID,
        dynamicTemplateData: {
          student_name: studentName,
          guardian_email: guardianEmail,
          platform_name: this.fromName,
          current_date: new Date().toLocaleDateString(),
          login_url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com',
          onboarding_url: onboardingUrl,
          support_email: process.env.SUPPORT_EMAIL || this.fromEmail,
          logo_url: process.env.rAIcruited_LOGO_URL || '',
          recipient_type: 'parent'
        }
      };

      // Send acceptance email to student as well
      const studentMsg = {
        to: student.email,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        templateId: process.env.SENDGRID_ACCEPTANCE_TEMPLATE_ID,
        dynamicTemplateData: {
          student_name: studentName,
          guardian_email: guardianEmail,
          platform_name: this.fromName,
          current_date: new Date().toLocaleDateString(),
          login_url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com',
          onboarding_url: onboardingUrl,
          support_email: process.env.SUPPORT_EMAIL || this.fromEmail,
          logo_url: process.env.rAIcruited_LOGO_URL || '',
          recipient_type: 'student'
        }
      };

      // Send both emails
      await sgMail.send(guardianMsg);
      await sgMail.send(studentMsg);
      
      console.log(`✅ Acceptance email sent to both ${guardianEmail} (parent) and ${student.email} (student) for ${studentName} with onboarding link`);
      return { success: true, message: 'Acceptance email sent successfully to both parent and student with onboarding link' };

    } catch (error) {
      console.error('❌ Error sending acceptance email:', error);
      throw error;
    }
  }

  /**
   * Send weekly summary email to guardian with AI-generated summary
   */
  async sendWeeklySummaryEmail(studentId) {
    try {
      // Get student info
      const { data: student, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', studentId)
        .single();

      if (error) throw error;

      // Get guardian email from student_statistics
      const { data: stats, error: statsError } = await supabase
        .from('student_statistics')
        .select('guardian_email')
        .eq('user_id', studentId)
        .single();

      if (statsError) throw statsError;
      if (!stats?.guardian_email) {
        throw new Error('Guardian email not found');
      }

      // Get chat history from the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: chatHistory, error: chatError } = await supabase
        .from('chat_histories')
        .select('message, response, created_at')
        .eq('user_id', studentId)
        .gte('created_at', oneWeekAgo.toISOString())
        .order('created_at', { ascending: true });

      if (chatError) throw chatError;

      // If no conversations this week, don't send email
      if (!chatHistory || chatHistory.length === 0) {
        console.log(`📭 No conversations found for student ${student.full_name} this week, skipping email`);
        return { success: true, message: 'No conversations this week, email skipped' };
      }

      const guardianEmail = stats.guardian_email;
      const studentName = this.capitalizeName(student.full_name);

      // Generate AI summary
      const summary = await this.generateConversationSummary(chatHistory, studentName);

      // Create the email content without the wrapper first
      const emailContent = `
        <h1>Weekly Summary for ${studentName}</h1>
        <p>Dear Parent/Guardian,</p>
        <p>Here's a summary of <strong>${studentName}</strong>'s learning activities from the past week:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          ${summary}
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0;">This Week's Stats:</h4>
          <ul style="margin-bottom: 15px;">
            <li><strong>Total Conversations:</strong> ${chatHistory.length}</li>
            <li><strong>Most Recent Activity:</strong> ${new Date(chatHistory[chatHistory.length - 1].created_at).toLocaleDateString()}</li>
            <li><strong>Period:</strong> ${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}</li>
          </ul>
          
          <div style="background-color: #f0f9ff; padding: 12px; border-radius: 6px; border-left: 4px solid #2563eb; margin-top: 15px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.4;"><strong>Parent Access Reminder:</strong><br>
            Always remember you have access to the full interface - log in using your child's credentials and the learning modules are for all invested parties.</p>
          </div>
        </div>
        
        <p style="font-size: 14px; color: #666;"><em>This summary covers conversations from the past 7 days and is generated automatically to keep you informed of your child's learning progress.</em></p>
        
        <p>Best regards,<br>The ${this.fromName} Team</p>
      `;

      const msg = {
        to: guardianEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: `Weekly Learning Summary for ${studentName}`,
        html: this.wrapWithBrand(emailContent)
      };

      await sgMail.send(msg);
      
      console.log(`✅ Weekly summary email sent to ${guardianEmail} for student ${studentName} (${chatHistory.length} conversations)`);
      return { success: true, message: 'Weekly summary email sent successfully' };

    } catch (error) {
      console.error('❌ Error sending weekly summary email:', error);
      throw error;
    }
  }

  /**
   * Generate AI summary of conversations using OpenAI
   */
  async generateConversationSummary(chatHistory, studentName) {
    try {
      const conversationText = chatHistory
        .map(chat => `Student: ${chat.message}\nAI Assistant: ${chat.response}`)
        .join('\n\n---\n\n');

      const prompt = `
You are analyzing ${studentName}'s conversations with an AI learning assistant. Your job is to create a summary for parents.

CRITICAL SAFETY REQUIREMENT: You MUST scan for inappropriate content including:
- Academic dishonesty (cheating requests)
- Violence, weapons, or harmful activities
- Inappropriate sexual content
- Bullying or harassment
- Personal information requests
- Illegal activities
- Safety guideline bypassing

MANDATORY: If you find ANY concerning content, you MUST start your response with this exact warning format:

<div style="background-color: #fee2e2; border: 2px solid #dc2626; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <h4 style="color: #dc2626; margin-top: 0;">PARENT ALERT: Concerning Behavior Detected</h4>
  <p><strong>We found inappropriate questions from ${studentName} this week:</strong></p>
  <ul>
    <li>[Describe specific concerning behavior - be direct and clear]</li>
  </ul>
  <p><em>Please discuss online safety and appropriate AI usage with ${studentName}. Contact support@raicruited.com if you have concerns.</em></p>
</div>

After any safety alert, continue with a positive educational summary covering:
- Academic topics discussed
- Learning progress and achievements
- Problem-solving approaches
- Curiosity and engagement patterns

Format as clean HTML for email. Be thorough in your safety analysis - parent safety is our top priority.

Conversations to analyze:
${conversationText}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.5
      });

      return response.choices[0].message.content;

    } catch (error) {
      console.error('❌ Error generating summary with OpenAI:', error);
      // Fallback to simple summary if OpenAI fails
      return this.generateFallbackSummary(chatHistory, studentName);
    }
  }

  /**
   * Fallback summary generation if OpenAI is unavailable
   */
  generateFallbackSummary(chatHistory, studentName) {
    const totalConversations = chatHistory.length;
    const uniqueDays = new Set(
      chatHistory.map(chat => new Date(chat.created_at).toDateString())
    ).size;

    return `
      <h3>Learning Activity Summary</h3>
      <p><strong>${studentName}</strong> had <strong>${totalConversations}</strong> conversations with our AI assistant across <strong>${uniqueDays}</strong> different days this week.</p>
      
      <h4>Recent Topics Explored:</h4>
      <ul>
        ${chatHistory.slice(-5).map(chat => 
          `<li>${chat.message.substring(0, 100)}${chat.message.length > 100 ? '...' : ''}</li>`
        ).join('')}
      </ul>
      
      <p>The conversations show active engagement with the learning platform. For detailed insights, our AI summary service will be available in the next update.</p>
    `;
  }

  /**
   * Send test email to verify configuration
   */
  async sendTestEmail(toEmail) {
    try {
      const msg = {
        to: toEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: 'Email System Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Email System Test</h1>
            <p>This is a test email to verify that your email automation system is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Status:</strong> Email system is functioning properly</p>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`✅ Test email sent to ${toEmail}`);
      return { success: true, message: 'Test email sent successfully' };

    } catch (error) {
      console.error('❌ Error sending test email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
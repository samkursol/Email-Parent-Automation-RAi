const sgMail = require('@sendgrid/mail');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

// Initialize services
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class EmailService {
  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || 'noreply@yourdomain.com';
    this.fromName = process.env.SENDGRID_FROM_NAME || process.env.PLATFORM_NAME || 'App Team';
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
      const studentName = student.full_name;

      const msg = {
        to: guardianEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: `Welcome to ${this.fromName} - ${studentName} has joined!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to ${this.fromName}!</h1>
            <p>Dear Parent/Guardian,</p>
            <p>We're excited to let you know that <strong>${studentName}</strong> has successfully registered for our educational platform.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
              <ul>
                <li>Your child will be able to interact with our AI learning assistant</li>
                <li>You'll receive weekly summaries of their conversations and learning progress</li>
                <li>All interactions are monitored for safety and educational value</li>
              </ul>
            </div>
            
            <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
            <p>Best regards,<br>The ${this.fromName} Team</p>
          </div>
        `
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
   * Send acceptance email to guardian when student is approved
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
      const studentName = student.full_name;

      const msg = {
        to: guardianEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: `🎉 ${studentName}'s Application Accepted!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Congratulations!</h1>
            <p>Dear Parent/Guardian,</p>
            <p>We're thrilled to inform you that <strong>${studentName}</strong>'s application has been <strong>accepted</strong>!</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin-top: 0;">What This Means:</h3>
              <ul>
                <li><strong>${studentName}</strong> now has full access to our learning platform</li>
                <li>They can start having educational conversations with our AI assistant</li>
                <li>You'll receive weekly progress summaries via email</li>
                <li>All interactions are safe, monitored, and educationally focused</li>
              </ul>
            </div>
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Next Steps:</strong> ${studentName} can log in and start exploring the platform immediately!</p>
            </div>
            
            <p>We're excited to support ${studentName}'s learning journey. If you have any questions, please feel free to contact us.</p>
            <p>Best regards,<br>The ${this.fromName} Team</p>
          </div>
        `
      };

      await sgMail.send(msg);
      
      console.log(`✅ Acceptance email sent to ${guardianEmail} for student ${studentName}`);
      return { success: true, message: 'Acceptance email sent successfully' };

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
      const studentName = student.full_name;

      // Generate AI summary
      const summary = await this.generateConversationSummary(chatHistory, studentName);

      const msg = {
        to: guardianEmail,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: `📊 Weekly Learning Summary for ${studentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Weekly Summary for ${studentName}</h1>
            <p>Dear Parent/Guardian,</p>
            <p>Here's a summary of <strong>${studentName}</strong>'s learning activities from the past week:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
              ${summary}
            </div>
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #1e40af;">This Week's Stats:</h4>
              <ul style="margin-bottom: 0;">
                <li><strong>Total Conversations:</strong> ${chatHistory.length}</li>
                <li><strong>Most Recent Activity:</strong> ${new Date(chatHistory[chatHistory.length - 1].created_at).toLocaleDateString()}</li>
                <li><strong>Period:</strong> ${oneWeekAgo.toLocaleDateString()} - ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #64748b;"><em>This summary covers conversations from the past 7 days and is generated automatically to keep you informed of your child's learning progress.</em></p>
            
            <p>Best regards,<br>The ${this.fromName} Team</p>
          </div>
        `
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
Please create a friendly, informative summary of ${studentName}'s conversations with our AI learning assistant this week. 

Focus on:
- Key topics and subjects discussed
- Learning moments and educational progress
- Types of questions asked (academic, curiosity-driven, problem-solving)
- Overall engagement patterns and learning style
- Any notable achievements or breakthroughs

Keep the tone positive and highlight educational value. Format the response as clean HTML (no <html> or <body> tags, just content divs, paragraphs, lists, etc.) suitable for email.

Conversations from this week:
${conversationText}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7
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
        subject: '🧪 Email Automation Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Email System Test</h1>
            <p>This is a test email to verify that your email automation system is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Status:</strong> ✅ Email system is functioning properly</p>
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
const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const schedulerService = require('../services/schedulerService');

// Middleware for basic request logging
router.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

/**
 * Send welcome email to guardian when student registers
 * POST /api/emails/welcome
 * Body: { studentId: string }
 */
router.post('/welcome', async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ 
        error: 'studentId is required',
        example: { studentId: 'uuid-string' }
      });
    }

    const result = await emailService.sendWelcomeEmail(studentId);
    res.json(result);

  } catch (error) {
    console.error('❌ Welcome email error:', error);
    res.status(500).json({ 
      error: 'Failed to send welcome email',
      message: error.message 
    });
  }
});

/**
 * Send acceptance email to guardian when student is approved
 * POST /api/emails/acceptance
 * Body: { studentId: string }
 */
router.post('/acceptance', async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ 
        error: 'studentId is required',
        example: { studentId: 'uuid-string' }
      });
    }

    const result = await emailService.sendAcceptanceEmail(studentId);
    res.json(result);

  } catch (error) {
    console.error('❌ Acceptance email error:', error);
    res.status(500).json({ 
      error: 'Failed to send acceptance email',
      message: error.message 
    });
  }
});

/**
 * Send weekly summary email for a specific student
 * POST /api/emails/weekly-summary
 * Body: { studentId: string }
 */
router.post('/weekly-summary', async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ 
        error: 'studentId is required',
        example: { studentId: 'uuid-string' }
      });
    }

    const result = await emailService.sendWeeklySummaryEmail(studentId);
    res.json(result);

  } catch (error) {
    console.error('❌ Weekly summary email error:', error);
    res.status(500).json({ 
      error: 'Failed to send weekly summary email',
      message: error.message 
    });
  }
});

/**
 * Trigger weekly summary for a specific student (alternative endpoint)
 * POST /api/emails/weekly-summary/:studentId
 */
router.post('/weekly-summary/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await schedulerService.sendWeeklySummaryForStudent(studentId);
    res.json(result);

  } catch (error) {
    console.error('❌ Weekly summary email error:', error);
    res.status(500).json({ 
      error: 'Failed to send weekly summary email',
      message: error.message 
    });
  }
});

/**
 * Manually trigger weekly summaries for all students
 * POST /api/emails/send-all-weekly-summaries
 */
router.post('/send-all-weekly-summaries', async (req, res) => {
  try {
    // This should be protected in production with authentication
    console.log('🔄 Manual trigger: sending all weekly summaries');
    
    // Run the weekly summary job
    schedulerService.sendWeeklySummaries()
      .then(() => {
        console.log('✅ Manual weekly summaries job completed');
      })
      .catch(error => {
        console.error('❌ Manual weekly summaries job failed:', error);
      });

    // Return immediately (job runs in background)
    res.json({ 
      success: true, 
      message: 'Weekly summary job started in background',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error triggering weekly summaries:', error);
    res.status(500).json({ 
      error: 'Failed to trigger weekly summaries',
      message: error.message 
    });
  }
});

/**
 * Send test email to verify system is working
 * POST /api/emails/test
 * Body: { email?: string } (optional, defaults to a test email)
 */
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;
    const testEmail = email || 'test@example.com';

    const result = await emailService.sendTestEmail(testEmail);
    res.json(result);

  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      message: error.message 
    });
  }
});

/**
 * Send demo emails with sample data (for testing without database)
 * POST /api/emails/demo
 * Body: { email: string, type: 'welcome' | 'acceptance' | 'weekly' }
 */
router.post('/demo', async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'email is required',
        example: { email: 'your@email.com', type: 'welcome' }
      });
    }

    const demoData = {
      studentName: 'Demo Student',
      guardianEmail: email,
      chatHistory: [
        {
          message: "What's the difference between mitosis and meiosis?",
          response: "Great question! Mitosis and meiosis are both types of cell division, but they serve different purposes...",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          message: "Can you help me understand photosynthesis?",
          response: "Of course! Photosynthesis is the process by which plants convert sunlight into energy...",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          message: "How do I solve quadratic equations?",
          response: "Quadratic equations can be solved using several methods. Let's start with the quadratic formula...",
          created_at: new Date().toISOString()
        }
      ]
    };

    let result;
    switch (type) {
      case 'welcome':
        result = await sendDemoWelcomeEmail(demoData);
        break;
      case 'acceptance':
        result = await sendDemoAcceptanceEmail(demoData);
        break;
      case 'weekly':
        result = await sendDemoWeeklySummary(demoData);
        break;
      default:
        return res.status(400).json({ 
          error: 'Invalid type. Must be: welcome, acceptance, or weekly',
          validTypes: ['welcome', 'acceptance', 'weekly']
        });
    }

    res.json(result);

  } catch (error) {
    console.error('❌ Demo email error:', error);
    res.status(500).json({ 
      error: 'Failed to send demo email',
      message: error.message 
    });
  }
});

// Demo email functions
async function sendDemoWelcomeEmail(demoData) {
  const sgMail = require('@sendgrid/mail');
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com';
  const fromName = process.env.SENDGRID_FROM_NAME || process.env.PLATFORM_NAME || 'Demo App';

  const msg = {
    to: demoData.guardianEmail,
    from: {
      email: fromEmail,
      name: fromName
    },
    subject: `Welcome to ${fromName} - ${demoData.studentName} has joined!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to ${fromName}!</h1>
        <p>Dear Parent/Guardian,</p>
        <p>We're excited to let you know that <strong>${demoData.studentName}</strong> has successfully registered for our educational platform.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
          <ul>
            <li>Your child will be able to interact with our AI learning assistant</li>
            <li>You'll receive weekly summaries of their conversations and learning progress</li>
            <li>All interactions are monitored for safety and educational value</li>
          </ul>
        </div>
        
        <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
        <p>Best regards,<br>The ${fromName} Team</p>
      </div>
    `
  };

  await sgMail.send(msg);
  return { success: true, message: 'Demo welcome email sent successfully' };
}

async function sendDemoAcceptanceEmail(demoData) {
  const sgMail = require('@sendgrid/mail');
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com';
  const fromName = process.env.SENDGRID_FROM_NAME || process.env.PLATFORM_NAME || 'Demo App';

  // Check if we have a template ID, if so use it, otherwise fall back to HTML
  const msg = process.env.SENDGRID_ACCEPTANCE_TEMPLATE_ID ? {
    to: demoData.guardianEmail,
    from: {
      email: fromEmail,
      name: fromName
    },
    templateId: process.env.SENDGRID_ACCEPTANCE_TEMPLATE_ID,
    dynamicTemplateData: {
      student_name: demoData.studentName,
      guardian_email: demoData.guardianEmail,
      platform_name: fromName,
      current_date: new Date().toLocaleDateString(),
      login_url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com',
      support_email: process.env.SUPPORT_EMAIL || fromEmail,
      // Add any other variables your template uses
    }
  } : {
    to: demoData.guardianEmail,
    from: {
      email: fromEmail,
      name: fromName
    },
    subject: `🎉 ${demoData.studentName}'s Application Accepted!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Congratulations!</h1>
        <p>Dear Parent/Guardian,</p>
        <p>We're thrilled to inform you that <strong>${demoData.studentName}</strong>'s application has been <strong>accepted</strong>!</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="color: #15803d; margin-top: 0;">What This Means:</h3>
          <ul>
            <li><strong>${demoData.studentName}</strong> now has full access to our learning platform</li>
            <li>They can start having educational conversations with our AI assistant</li>
            <li>You'll receive weekly progress summaries via email</li>
            <li>All interactions are safe, monitored, and educationally focused</li>
          </ul>
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Next Steps:</strong> ${demoData.studentName} can log in and start exploring the platform immediately!</p>
        </div>
        
        <p>We're excited to support ${demoData.studentName}'s learning journey. If you have any questions, please feel free to contact us.</p>
        <p>Best regards,<br>The ${fromName} Team</p>
      </div>
    `
  };

  await sgMail.send(msg);
  const templateUsed = process.env.SENDGRID_ACCEPTANCE_TEMPLATE_ID ? 'using SendGrid template' : 'using fallback HTML';
  return { success: true, message: `Demo acceptance email sent successfully ${templateUsed}` };
}

async function sendDemoWeeklySummary(demoData) {
  const sgMail = require('@sendgrid/mail');
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com';
  const fromName = process.env.SENDGRID_FROM_NAME || process.env.PLATFORM_NAME || 'Demo App';

  // Generate AI summary
  const conversationText = demoData.chatHistory
    .map(chat => `Student: ${chat.message}\nAI Assistant: ${chat.response}`)
    .join('\n\n---\n\n');

  let summary;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ 
        role: "user", 
        content: `Create a friendly summary of ${demoData.studentName}'s learning activities. Focus on educational progress and engagement. Format as HTML for email. Conversations: ${conversationText}`
      }],
      max_tokens: 400,
      temperature: 0.7
    });
    summary = response.choices[0].message.content;
  } catch (error) {
    summary = `
      <h3>Learning Activity Summary</h3>
      <p><strong>${demoData.studentName}</strong> had <strong>${demoData.chatHistory.length}</strong> educational conversations this week.</p>
      <h4>Topics Explored:</h4>
      <ul>
        <li>Cell division (mitosis and meiosis)</li>
        <li>Photosynthesis in plants</li>
        <li>Quadratic equations and problem-solving</li>
      </ul>
      <p>The conversations show great curiosity and engagement with STEM subjects!</p>
    `;
  }

  const msg = {
    to: demoData.guardianEmail,
    from: {
      email: fromEmail,
      name: fromName
    },
    subject: `📊 Weekly Learning Summary for ${demoData.studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Weekly Summary for ${demoData.studentName}</h1>
        <p>Dear Parent/Guardian,</p>
        <p>Here's a summary of <strong>${demoData.studentName}</strong>'s learning activities from the past week:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          ${summary}
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #1e40af;">This Week's Stats:</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Total Conversations:</strong> ${demoData.chatHistory.length}</li>
            <li><strong>Most Recent Activity:</strong> ${new Date(demoData.chatHistory[demoData.chatHistory.length - 1].created_at).toLocaleDateString()}</li>
            <li><strong>Period:</strong> Past 7 days</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #64748b;"><em>This is a demo summary showing how weekly reports will look once your child starts using the platform.</em></p>
        
        <p>Best regards,<br>The ${fromName} Team</p>
      </div>
    `
  };

  await sgMail.send(msg);
  return { success: true, message: 'Demo weekly summary email sent successfully' };
}

/**
 * Run comprehensive email system test
 * POST /api/emails/test-all
 */
router.post('/test-all', async (req, res) => {
  try {
    const result = await schedulerService.sendTestEmails();
    res.json(result);

  } catch (error) {
    console.error('❌ Email system test error:', error);
    res.status(500).json({ 
      error: 'Failed to run email system test',
      message: error.message 
    });
  }
});

/**
 * Get scheduler status and next email times
 * GET /api/emails/schedule-info
 */
router.get('/schedule-info', (req, res) => {
  try {
    const scheduleInfo = schedulerService.getScheduleInfo();
    res.json(scheduleInfo);
  } catch (error) {
    console.error('❌ Error getting schedule info:', error);
    res.status(500).json({ 
      error: 'Failed to get schedule info',
      message: error.message 
    });
  }
});

/**
 * Health check for email service
 * GET /api/emails/health
 */
router.get('/health', (req, res) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      scheduler: schedulerService.getScheduleInfo(),
      services: {
        sendgrid: !!process.env.SENDGRID_API_KEY,
        supabase: !!((process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)),
        openai: !!process.env.OPENAI_API_KEY
      },
      environment: {
        fromEmail: process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || 'Not set',
        port: process.env.PORT || 3001
      }
    };

    res.json(health);
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({ 
      error: 'Health check failed',
      message: error.message 
    });
  }
});

/**
 * Get API documentation
 * GET /api/emails/docs
 */
router.get('/docs', (req, res) => {
  const docs = {
    title: 'Email Automation API',
    version: '1.0.0',
    description: 'API for sending automated emails to parents/guardians',
    endpoints: {
      'POST /api/emails/welcome': {
        description: 'Send welcome email when student registers',
        body: { studentId: 'string (required)' }
      },
      'POST /api/emails/acceptance': {
        description: 'Send acceptance email when student is approved',
        body: { studentId: 'string (required)' }
      },
      'POST /api/emails/weekly-summary': {
        description: 'Send weekly summary email for specific student',
        body: { studentId: 'string (required)' }
      },
      'POST /api/emails/send-all-weekly-summaries': {
        description: 'Trigger weekly summaries for all students (admin)',
        body: {}
      },
      'POST /api/emails/test': {
        description: 'Send test email',
        body: { email: 'string (optional)' }
      },
      'POST /api/emails/test-all': {
        description: 'Run comprehensive email system test',
        body: {}
      },
      'GET /api/emails/schedule-info': {
        description: 'Get scheduler status and next email times'
      },
      'GET /api/emails/health': {
        description: 'Health check for email service'
      },
      'GET /api/emails/docs': {
        description: 'This documentation'
      }
    },
    examples: {
      sendWelcome: 'curl -X POST http://localhost:3001/api/emails/welcome -H "Content-Type: application/json" -d \'{"studentId":"your-student-uuid"}\'',
      sendAcceptance: 'curl -X POST http://localhost:3001/api/emails/acceptance -H "Content-Type: application/json" -d \'{"studentId":"your-student-uuid"}\'',
      sendWeeklySummary: 'curl -X POST http://localhost:3001/api/emails/weekly-summary -H "Content-Type: application/json" -d \'{"studentId":"your-student-uuid"}\'',
      healthCheck: 'curl http://localhost:3001/api/emails/health'
    }
  };

  res.json(docs);
});

module.exports = router;
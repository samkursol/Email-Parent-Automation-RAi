// Email template utilities and HTML templates

export interface WelcomeEmailData {
  studentName: string
  guardianEmail: string
  schoolName?: string
  sport?: string
  graduationYear?: number
}

export class EmailTemplates {
  /**
   * Generate welcome email HTML matching acceptance template structure
   */
  static generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    const { studentName, schoolName, sport, graduationYear } = data
    const platformName = process.env.PLATFORM_NAME || 'RaiCRUITED'
    const logoUrl = process.env.RAICRUITED_LOGO_URL || ''
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${logoUrl ? `
        <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid #e9ecef;">
          <img src="${logoUrl}" alt="${platformName}" style="height: 60px; max-width: 200px;" />
        </div>
        ` : ''}
        <h1 style="color: #2563eb;">🚀 Welcome to ${platformName}!</h1>
        <p>Dear Parent/Guardian,</p>
        <p>We're excited to welcome <strong>${studentName}</strong> to ${platformName}, your child's new AI-powered learning assistant!</p>
        
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="color: #1d4ed8; margin-top: 0;">Welcome to Our Platform</h3>
          <p><strong>${studentName}</strong> has successfully registered and can now:</p>
          <ul>
            <li>Access personalized AI tutoring support</li>
            <li>Get help with homework and learning challenges</li>
            <li>Receive guidance tailored to their academic goals</li>
            <li>Track their learning progress over time</li>
          </ul>
          ${schoolName ? `<p><strong>School:</strong> ${schoolName}</p>` : ''}
          ${sport ? `<p><strong>Sport:</strong> ${sport}</p>` : ''}
          ${graduationYear ? `<p><strong>Expected Graduation:</strong> ${graduationYear}</p>` : ''}
        </div>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="color: #15803d; margin-top: 0;">What You Can Expect:</h3>
          <ul>
            <li>Weekly email summaries of <strong>${studentName}</strong>'s learning activities</li>
            <li>Safe, monitored, and educationally focused interactions</li>
            <li>Progress insights and learning recommendations</li>
            <li>24/7 access to AI learning support</li>
          </ul>
        </div>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Getting Started:</strong> ${studentName} can log in and start exploring the platform immediately!</p>
        </div>
        
        <p>We're thrilled to support ${studentName}'s learning journey. If you have any questions, please feel free to contact us.</p>
        <p>Best regards,<br>The ${platformName} Team</p>
      </div>
    `
  }

  /**
   * Generate welcome email subject line (matching acceptance email style)
   */
  static generateWelcomeEmailSubject(studentName: string): string {
    const platformName = process.env.PLATFORM_NAME || 'RaiCRUITED'
    return `🚀 Welcome ${studentName} to ${platformName}!`
  }

  /**
   * Generate welcome email plain text version
   */
  static generateWelcomeEmailText(data: WelcomeEmailData): string {
    const { studentName, schoolName, sport, graduationYear } = data
    
    return `
Welcome to RAi!

Dear Parent/Guardian,

We're excited to welcome ${studentName} to RAi, an innovative AI-powered learning platform designed to support students in their academic journey.

Student Profile:
- Student Name: ${studentName}
${schoolName ? `- School: ${schoolName}` : ''}
${sport ? `- Sport: ${sport}` : ''}
${graduationYear ? `- Expected Graduation: ${graduationYear}` : ''}

What RAi Offers:

📚 Personalized Learning Support
AI-powered assistance tailored to your child's learning style and academic needs

📊 Progress Tracking
Regular updates on learning progress and academic improvements

🎯 Goal-Oriented Learning
Focused support for college prep, sports achievements, and academic excellence

📧 Parent Updates
Weekly summaries of your child's interactions and learning progress

We'll send you weekly updates about ${studentName}'s learning journey, including conversation highlights and progress insights.

If you have any questions or concerns, please don't hesitate to reach out to our support team. We're here to ensure ${studentName} has the best possible learning experience.

Thank you for trusting RAi with your child's education!

Best regards,
The RAi Team

---
This email was sent to ${data.guardianEmail} because ${studentName} registered for RAi.
© 2024 RAi. All rights reserved.
    `.trim()
  }
}
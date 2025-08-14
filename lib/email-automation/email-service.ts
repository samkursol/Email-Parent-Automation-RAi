import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import { EmailTemplates, WelcomeEmailData } from './email-templates'

// Initialize Supabase with Service Role Key for full database access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface StudentStatistics {
  id: string
  user_id: string
  student_name?: string
  guardian_email: string
  school_name?: string
  sport?: string
  graduation_year?: number
  gpa?: number
  sat_score?: number
  act_score?: number
  // Add other fields as needed
}

interface ChatHistory {
  user_id: string
  message: string
  response: string
  created_at: string
}

export class EmailService {
  /**
   * Get student information and guardian email from student_statistics table
   */
  async getStudentInfo(userId: string): Promise<StudentStatistics | null> {
    try {
      const { data, error } = await supabase
        .from('student_statistics')
        .select('*')
        .eq('user_id', userId) // or .eq('id', userId) depending on your schema
        .single()

      if (error) {
        console.error('Error fetching student info:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception in getStudentInfo:', error)
      return null
    }
  }

  /**
   * Get chat history for a specific user from chat_histories table
   */
  async getChatHistory(userId: string): Promise<ChatHistory[]> {
    try {
      const { data, error } = await supabase
        .from('chat_histories')
        .select('user_id, message, response, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }) // Most recent first

      if (error) {
        console.error('Error fetching chat history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Exception in getChatHistory:', error)
      return []
    }
  }

  /**
   * Get recent chat activity for email reporting
   */
  async getRecentChatActivity(userId: string, daysBack: number = 7): Promise<ChatHistory[]> {
    try {
      const dateThreshold = new Date()
      dateThreshold.setDate(dateThreshold.getDate() - daysBack)

      const { data, error } = await supabase
        .from('chat_histories')
        .select('user_id, message, response, created_at')
        .eq('user_id', userId)
        .gte('created_at', dateThreshold.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching recent chat activity:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Exception in getRecentChatActivity:', error)
      return []
    }
  }

  /**
   * Send welcome email to parent/guardian using SendGrid template
   */
  async sendWelcomeEmail(userId: string): Promise<boolean> {
    try {
      // Get student information
      const studentInfo = await this.getStudentInfo(userId)
      if (!studentInfo) {
        console.error('Student not found for welcome email:', userId)
        return false
      }

      if (!studentInfo.guardian_email) {
        console.error('No guardian email found for student:', userId)
        return false
      }

      // Check if we have a welcome template ID, otherwise use fallback
      const welcomeTemplateId = process.env.SENDGRID_WELCOME_TEMPLATE_ID
      
      let msg
      if (welcomeTemplateId) {
        // Use SendGrid dynamic template
        msg = {
          to: studentInfo.guardian_email,
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
            name: process.env.SENDGRID_FROM_NAME || 'RAi Team'
          },
          templateId: welcomeTemplateId,
          dynamicTemplateData: {
            student_name: studentInfo.student_name || 'Student',
            guardian_email: studentInfo.guardian_email,
            school_name: studentInfo.school_name || '',
            sport: studentInfo.sport || '',
            graduation_year: studentInfo.graduation_year || '',
            platform_name: process.env.PLATFORM_NAME || 'RAi',
            current_date: new Date().toLocaleDateString(),
            app_url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com',
            support_email: process.env.SUPPORT_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'support@yourdomain.com'
          }
        }
        console.log('Using SendGrid welcome template:', welcomeTemplateId)
      } else {
        // Fallback to custom HTML (your original approach)
        const emailData: WelcomeEmailData = {
          studentName: studentInfo.student_name || 'Student',
          guardianEmail: studentInfo.guardian_email,
          schoolName: studentInfo.school_name,
          sport: studentInfo.sport,
          graduationYear: studentInfo.graduation_year
        }

        const subject = EmailTemplates.generateWelcomeEmailSubject(emailData.studentName)
        const htmlContent = EmailTemplates.generateWelcomeEmailHTML(emailData)
        const textContent = EmailTemplates.generateWelcomeEmailText(emailData)

        msg = {
          to: studentInfo.guardian_email,
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
            name: process.env.SENDGRID_FROM_NAME || 'RAi Team'
          },
          subject: subject,
          text: textContent,
          html: htmlContent,
        }
        console.log('Using fallback HTML template (no SENDGRID_WELCOME_TEMPLATE_ID found)')
      }

      await sgMail.send(msg)
      console.log(`Welcome email sent successfully to ${studentInfo.guardian_email}`)
      
      // Log the email send
      await this.logEmailSent(userId, 'welcome', studentInfo.guardian_email)
      
      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  /**
   * Test welcome email with a specific user
   */
  async testWelcomeEmail(userId: string): Promise<{ success: boolean; message: string; emailPreview?: string }> {
    try {
      // Get student information
      const studentInfo = await this.getStudentInfo(userId)
      if (!studentInfo) {
        return { success: false, message: `Student not found with ID: ${userId}` }
      }

      if (!studentInfo.guardian_email) {
        return { success: false, message: `No guardian email found for student: ${studentInfo.student_name || userId}` }
      }

      // Generate email preview
      const emailData: WelcomeEmailData = {
        studentName: studentInfo.student_name || 'Student',
        guardianEmail: studentInfo.guardian_email,
        schoolName: studentInfo.school_name,
        sport: studentInfo.sport,
        graduationYear: studentInfo.graduation_year
      }

      const subject = EmailTemplates.generateWelcomeEmailSubject(emailData.studentName)
      const htmlContent = EmailTemplates.generateWelcomeEmailHTML(emailData)

      return {
        success: true,
        message: `Welcome email ready for ${emailData.studentName} (${studentInfo.guardian_email})`,
        emailPreview: htmlContent
      }
    } catch (error) {
      return { success: false, message: `Error generating welcome email: ${error.message}` }
    }
  }

  /**
   * Log email sending to database (optional - you can implement this based on your needs)
   */
  private async logEmailSent(userId: string, emailType: string, recipientEmail: string): Promise<void> {
    try {
      // This would require an email_logs table - implement if needed
      console.log(`Email logged: ${emailType} sent to ${recipientEmail} for user ${userId}`)
    } catch (error) {
      console.error('Error logging email:', error)
    }
  }

  /**
   * Test the Supabase connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('student_statistics')
        .select('*', { count: 'exact' })
        .limit(1)

      if (error) {
        console.error('Connection test failed:', error)
        return false
      }

      console.log('Supabase connection successful')
      return true
    } catch (error) {
      console.error('Exception in connection test:', error)
      return false
    }
  }
}

export default EmailService
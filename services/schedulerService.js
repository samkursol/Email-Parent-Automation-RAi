const cron = require('node-cron');
const emailService = require('./emailService');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class SchedulerService {
  constructor() {
    this.isRunning = false;
    this.weeklyEmailDay = process.env.WEEKLY_EMAIL_DAY || '0'; // Default: Sunday
    this.weeklyEmailHour = process.env.WEEKLY_EMAIL_HOUR || '9'; // Default: 9 AM
    this.weeklyEmailMinute = process.env.WEEKLY_EMAIL_MINUTE || '0'; // Default: 0 minutes
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Scheduler is already running');
      return;
    }

    // Create cron expression for weekly summary emails
    // Format: 'minute hour day-of-month month day-of-week'
    const cronExpression = `${this.weeklyEmailMinute} ${this.weeklyEmailHour} * * ${this.weeklyEmailDay}`;
    
    console.log(`📅 Setting up weekly email schedule: ${cronExpression}`);
    console.log(`📧 Weekly summary emails will be sent every ${this.getDayName(this.weeklyEmailDay)} at ${this.weeklyEmailHour}:${this.weeklyEmailMinute.padStart(2, '0')}`);

    // Schedule weekly summary emails
    cron.schedule(cronExpression, async () => {
      console.log('🔄 Starting weekly summary email job...');
      await this.sendWeeklySummaries();
    }, {
      timezone: "America/New_York" // Adjust timezone as needed
    });

    // Optional: Schedule a daily health check (every day at midnight)
    cron.schedule('0 0 * * *', () => {
      console.log('💓 Daily health check - Email scheduler is running');
    });

    this.isRunning = true;
    console.log('✅ Email scheduler started successfully');
  }

  stop() {
    // Note: node-cron doesn't provide a direct way to stop specific schedules
    // In a production environment, you'd want to store references to the scheduled jobs
    this.isRunning = false;
    console.log('🛑 Email scheduler stopped');
  }

  async sendWeeklySummaries() {
    try {
      console.log('📊 Fetching all active students for weekly summaries...');

      // Get all students with guardian emails
      const { data: students, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          student_statistics!inner(guardian_email)
        `)
        .not('student_statistics.guardian_email', 'is', null);

      if (error) {
        console.error('❌ Error fetching students:', error);
        return;
      }

      if (!students || students.length === 0) {
        console.log('📭 No students found with guardian emails');
        return;
      }

      console.log(`👥 Found ${students.length} students, processing weekly summaries...`);

      let successCount = 0;
      let errorCount = 0;

      for (const student of students) {
        try {
          console.log(`📤 Processing weekly summary for ${student.full_name}...`);
          
          const result = await emailService.sendWeeklySummaryEmail(student.id);
          
          if (result.success) {
            successCount++;
            console.log(`✅ ${student.full_name}: ${result.message}`);
          }

          // Add delay to avoid rate limiting (SendGrid free tier has limits)
          await this.delay(2000); // 2 second delay between emails

        } catch (error) {
          errorCount++;
          console.error(`❌ Failed to send weekly summary for ${student.full_name}:`, error.message);
        }
      }

      console.log(`📈 Weekly summary job completed:`);
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ❌ Failed: ${errorCount}`);
      console.log(`   📊 Total processed: ${students.length}`);



    } catch (error) {
      console.error('❌ Critical error in weekly summary job:', error);
    }
  }

  /**
   * Send weekly summaries for a specific student (manual trigger)
   */
  async sendWeeklySummaryForStudent(studentId) {
    try {
      console.log(`📤 Manually triggering weekly summary for student ID: ${studentId}`);
      
      const result = await emailService.sendWeeklySummaryEmail(studentId);
      
      console.log(`✅ Manual weekly summary result: ${result.message}`);
      return result;

    } catch (error) {
      console.error(`❌ Error sending manual weekly summary for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Send test email to verify system is working
   */
  async sendTestEmails() {
    try {
      console.log('🧪 Running email system test...');
      
      // Get a sample student for testing
      const { data: testStudent, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          student_statistics!inner(guardian_email)
        `)
        .not('student_statistics.guardian_email', 'is', null)
        .limit(1)
        .single();

      if (error || !testStudent) {
        console.log('⚠️  No test student found, sending basic test email instead');
        return await emailService.sendTestEmail('test@example.com');
      }

      console.log(`🎯 Using ${testStudent.full_name} as test student`);
      
      // Test welcome email
      await emailService.sendWelcomeEmail(testStudent.id);
      await this.delay(1000);
      
      // Test acceptance email
      await emailService.sendAcceptanceEmail(testStudent.id);
      await this.delay(1000);
      
      // Test weekly summary
      await emailService.sendWeeklySummaryEmail(testStudent.id);
      
      console.log('✅ All test emails sent successfully');
      return { success: true, message: 'All test emails sent successfully' };

    } catch (error) {
      console.error('❌ Error running email tests:', error);
      throw error;
    }
  }

  /**
   * Get upcoming scheduled email times
   */
  getScheduleInfo() {
    const now = new Date();
    const nextWeeklyEmail = new Date();
    
    // Calculate next weekly email time
    const targetDay = parseInt(this.weeklyEmailDay);
    const currentDay = now.getDay();
    let daysUntilNext = (targetDay - currentDay + 7) % 7;
    
    if (daysUntilNext === 0) {
      // If it's the same day, check if the time has passed
      const targetTime = new Date();
      targetTime.setHours(parseInt(this.weeklyEmailHour), parseInt(this.weeklyEmailMinute), 0, 0);
      
      if (now > targetTime) {
        daysUntilNext = 7; // Next week
      }
    }
    
    nextWeeklyEmail.setDate(now.getDate() + daysUntilNext);
    nextWeeklyEmail.setHours(parseInt(this.weeklyEmailHour), parseInt(this.weeklyEmailMinute), 0, 0);

    return {
      isRunning: this.isRunning,
      nextWeeklyEmail: nextWeeklyEmail.toISOString(),
      schedule: {
        day: this.getDayName(this.weeklyEmailDay),
        time: `${this.weeklyEmailHour}:${this.weeklyEmailMinute.padStart(2, '0')}`
      },
      cronExpression: `${this.weeklyEmailMinute} ${this.weeklyEmailHour} * * ${this.weeklyEmailDay}`
    };
  }

  /**
   * Utility function to add delays between operations
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get day name from day number
   */
  getDayName(dayNumber) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[parseInt(dayNumber)] || 'Unknown';
  }


}

module.exports = new SchedulerService();
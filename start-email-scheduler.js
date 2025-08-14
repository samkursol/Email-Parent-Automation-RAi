#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const schedulerService = require('./services/schedulerService');

console.log('🚀 Starting rAIcruited Email Scheduler...');
console.log('==========================================');

// Start the scheduler
schedulerService.start();

// Keep the process running
process.on('SIGINT', () => {
  console.log('');
  console.log('🛑 Received SIGINT, stopping email scheduler...');
  schedulerService.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('');
  console.log('🛑 Received SIGTERM, stopping email scheduler...');
  schedulerService.stop();
  process.exit(0);
});

// Log schedule information
const scheduleInfo = schedulerService.getScheduleInfo();
console.log('');
console.log('📅 SCHEDULE ACTIVE:');
console.log(`   Day: ${scheduleInfo.schedule.day}`);
console.log(`   Time: ${scheduleInfo.schedule.time}`);
console.log(`   Next Email: ${new Date(scheduleInfo.nextWeeklyEmail).toLocaleString()}`);
console.log('');
console.log('✅ Email scheduler is now running...');
console.log('   Press Ctrl+C to stop');

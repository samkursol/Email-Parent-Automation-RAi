#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const schedulerService = require('./services/schedulerService');

console.log('🧪 Manual Weekly Summary Test');
console.log('==============================');

async function runManualTest() {
  try {
    console.log('📤 Sending weekly summaries to all eligible students...');
    await schedulerService.sendWeeklySummaries();
    console.log('✅ Manual test completed');
  } catch (error) {
    console.error('❌ Manual test failed:', error.message);
  }
}

runManualTest();

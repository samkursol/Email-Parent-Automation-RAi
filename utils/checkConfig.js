const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');
const OpenAI = require('openai');

async function checkConfiguration() {
  console.log('🔍 Checking Email Automation Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  
  console.log(`SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`FROM_EMAIL: ${process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || '⚠️  Using default'}`);
  console.log(`PLATFORM_NAME: ${process.env.PLATFORM_NAME || '⚠️  Using default'}\n`);

  // Test Supabase connection
  console.log('🗄️  Testing Supabase Connection...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test database connection by checking tables
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log(`❌ Supabase connection failed: ${error.message}`);
    } else {
      console.log('✅ Supabase connection successful');
      
      // Check required tables
      const tables = ['profiles', 'student_statistics', 'chat_histories'];
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('*').limit(1);
          console.log(`   📋 Table '${table}': ${error ? '❌ Error - ' + error.message : '✅ Accessible'}`);
        } catch (err) {
          console.log(`   📋 Table '${table}': ❌ Error - ${err.message}`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Supabase setup error: ${error.message}`);
  }

  // Test SendGrid
  console.log('\n📧 Testing SendGrid Configuration...');
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid API key configured');
  } catch (error) {
    console.log(`❌ SendGrid setup error: ${error.message}`);
  }

  // Test OpenAI
  console.log('\n🤖 Testing OpenAI Configuration...');
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✅ OpenAI client configured');
  } catch (error) {
    console.log(`❌ OpenAI setup error: ${error.message}`);
  }

  console.log('\n🔍 Configuration check complete!');
}

module.exports = { checkConfiguration };
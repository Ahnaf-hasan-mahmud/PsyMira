const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo_1785948785352@psymira.com',
    password: 'Password123!'
  });
  
  if (error) {
    console.error("Login error:", error);
    return;
  }
  console.log("Logged in:", data.user.id);
  
  const { data: acts, error: actError } = await supabase.from('activities').select('*');
  if (actError) {
    console.error("Activities error:", actError);
  } else {
    console.log(`Found ${acts.length} activities for user.`);
    if (acts.length > 0) {
      console.log("Sample activity:", acts[0]);
    }
  }
}
check();

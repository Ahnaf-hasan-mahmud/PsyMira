const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Signing up mock user...");
  const email = `test_${Date.now()}@example.com`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: "Password123!",
    options: {
      data: {
        name: "Test User",
        dob: "1990-01-01",
        username: `testuser_${Date.now()}`,
        bio: "Test bio",
        occupation: "Student",
        gender: "Male",
        phone_number: "1234567890",
        interests: ["Reading", "Coding"]
      }
    }
  });

  if (error) {
    console.error("SignUp Error:", error);
    return;
  }
  
  console.log("User created:", data.user?.id);
  
  console.log("Checking profile...");
  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profError) {
    console.error("Profile Query Error:", profError);
  } else {
    console.log("Profile Data:", profile);
  }
}

test();

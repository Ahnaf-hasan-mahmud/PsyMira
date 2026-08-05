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
  const email = `test_${Date.now()}@example.com`;
  const password = "Password123!";
  
  console.log("Signing up:", email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
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

  if (signUpError) {
    console.error("SignUp Error:", signUpError);
    return;
  }
  
  const userId = signUpData.user.id;
  console.log("User ID:", userId);
  
  for (let i=0; i<10; i++) {
    await new Promise(r => setTimeout(r, 1000));
    console.log(`Checking profile (attempt ${i+1})...`);
    const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!profError) {
      console.log("Profile Data:", JSON.stringify(profile, null, 2));
      return;
    }
  }
  console.log("Profile never created.");
}

test();

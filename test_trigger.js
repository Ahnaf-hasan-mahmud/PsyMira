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
  const mockId = '2785223b-9a18-4246-bee3-a8af86e584b3'; // the id created earlier
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: mockId,
      name: "Test User",
      date_of_birth: "1990-01-01",
      username: `testuser_${Date.now()}`,
      bio: "Test bio",
      occupation: "Student",
      gender: "Male",
      phone_number: "1234567890",
      interests: ["Reading", "Coding"]
    });
    
  if (error) {
    console.error("Direct Insert Error:", error);
  } else {
    console.log("Direct Insert Success:", data);
  }
}

test();

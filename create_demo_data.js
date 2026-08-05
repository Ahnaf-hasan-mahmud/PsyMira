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

async function run() {
  const ts = Date.now();
  const email = `demo_${ts}@psymira.com`;
  const password = "Password123!";
  
  console.log(`Creating user: ${email}...`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: "Demo User",
        username: `demo_${ts}`
      }
    }
  });

  if (error) {
    console.error("SignUp Error:", error);
    return;
  }
  
  const userId = data.user.id;
  console.log(`User created with ID: ${userId}`);
  
  // Wait a moment for the profile trigger to complete
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("Generating 14 days of activities...");
  const activities = [];
  const now = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    date.setHours(10, 0, 0, 0); // set to morning
    
    // 1. Daily Mood
    activities.push({
      user_id: userId,
      kind: 'mood',
      minutes: 1,
      mood: 65 + Math.floor(Math.random() * 25), // 65-90
      calm: 60 + Math.floor(Math.random() * 30),
      emotion: 'Reflective',
      created_at: date.toISOString()
    });
    
    // 2. Random Breathing or Game
    if (Math.random() > 0.3) {
      date.setHours(14, 0, 0, 0);
      const isGame = Math.random() > 0.5;
      if (isGame) {
        activities.push({
          user_id: userId,
          kind: 'game',
          minutes: 3,
          mood: 0,
          calm: 0,
          game_id: 'bubbles',
          title: 'Bubble Pop',
          created_at: date.toISOString()
        });
      } else {
        activities.push({
          user_id: userId,
          kind: 'breathing',
          minutes: 5,
          mood: 0,
          calm: 0,
          technique: 'Box Breathing',
          created_at: date.toISOString()
        });
      }
    }
    
    // 3. Random Story every few days
    if (i % 3 === 0) {
      date.setHours(20, 0, 0, 0);
      activities.push({
        user_id: userId,
        kind: 'story',
        minutes: 10,
        mood: 0,
        calm: 0,
        story_id: 'silent-lake',
        title: 'The Silent Lake',
        emotion: 'Stillness',
        created_at: date.toISOString()
      });
    }
  }
  
  console.log("Inserting activities into DB...");
  const { error: insertError } = await supabase.from('activities').insert(activities);
  
  if (insertError) {
    console.error("Insert Error:", insertError);
  } else {
    console.log(`Successfully inserted ${activities.length} activities.`);
    console.log("====================================================");
    console.log("DEMO ACCOUNT CREATED SUCCESSFULLY");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("Login with these credentials to view the populated dashboard.");
    console.log("====================================================");
  }
}

run();

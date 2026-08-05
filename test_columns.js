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
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error("Query Error:", error);
  } else if (data.length > 0) {
    console.log("Existing columns:", Object.keys(data[0]));
  } else {
    // If no data, try inserting a test row to see EXACTLY what fails
    console.log("No data, testing individual columns...");
    const mockId = '2785223b-9a18-4246-bee3-a8af86e584b3'; // the id created earlier
    const cols = ['name', 'date_of_birth', 'username', 'bio', 'occupation', 'gender', 'phone_number', 'interests'];
    
    for (let col of cols) {
      let insertData = { id: mockId };
      if (col === 'date_of_birth') insertData[col] = '1990-01-01';
      else if (col === 'interests') insertData[col] = ['Testing'];
      else insertData[col] = 'Test';
      
      const { error: err } = await supabase.from('profiles').upsert(insertData);
      if (err) {
         if (err.code === '42501') {
           // RLS error means the column exists and it tried to insert
           console.log(`Column ${col} exists (RLS blocked).`);
         } else {
           console.log(`Column ${col} ERROR:`, err.message);
         }
      } else {
         console.log(`Column ${col} exists (Inserted).`);
      }
    }
  }
}
test();

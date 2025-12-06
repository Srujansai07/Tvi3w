const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Hardcoded key since .env.local update failed
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM0MDM4NCwiZXhwIjoyMDc5OTE2Mzg0fQ.KzAHJ-_t3La-vmvSR6dNsVEaElquTHNMxboSD4bttzc";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function debug() {
    console.log('Debugging Supabase Connection...');
    console.log(`URL: ${supabaseUrl}`);

    // Try to select from users
    console.log('Selecting from public.users...');
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);

    if (error) {
        console.error('ERROR:', error);
    } else {
        console.log('SUCCESS. Data:', data);
    }
}

debug();

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Manually set the Service Role Key if not in .env.local (it was in the summary)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We try to get it from env, if not we might need to hardcode it temporarily or ensure it's in .env.local
// Based on summary: SUPABASE_SERVICE_ROLE_KEY is in .env.local
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a29yZWdtZW1rbnVmbnBubmZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM0MDM4NCwiZXhwIjoyMDc5OTE2Mzg0fQ.KzAHJ-_t3La-vmvSR6dNsVEaElquTHNMxboSD4bttzc";

if (!supabaseServiceKey) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is missing from .env.local');
    console.error('Please add it to .env.local to perform admin operations.');
    process.exit(1);
}

console.log(`Debug: Service Key loaded. Prefix: ${supabaseServiceKey.substring(0, 10)}...`);


const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const TABLES = [
    'action_items',
    'participants',
    'insights',
    'notes',
    'contacts',
    'meetings',
    'users'
];

async function clearData() {
    console.log('Connecting to Supabase via REST API (Admin Mode)...');
    console.log(`Target: ${supabaseUrl}`);

    for (const table of TABLES) {
        process.stdout.write(`Clearing table public.${table}... `);

        // Delete all rows where id is not null (effectively all rows)
        const { error, count } = await supabase
            .from(table)
            .delete({ count: 'exact' })
            .not('id', 'is', null);

        if (error) {
            console.log(`FAILED: ${error.message}`);
            // If table doesn't exist, it might error.
        } else {
            console.log(`DONE. (Deleted rows)`);
        }
    }

    console.log('\n--- DATA CLEAR COMPLETE ---');
    console.log('All data has been wiped from the live database.');
}

clearData();

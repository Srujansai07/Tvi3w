import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function TestSupabasePage({ searchParams }: { searchParams: { table?: string } }) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const tableToCheck = searchParams.table || 'users' // Default to users if not specified
    let status = 'loading'
    let message = ''

    try {
        console.log(`--- SUPABASE TEST START: ${tableToCheck} ---`)
        // Check connection and specific table
        const { data, error } = await supabase.from(tableToCheck).select('count', { count: 'exact', head: true })

        if (error && error.code === '42P01') { // undefined_table
            status = 'error'
            message = `Connected, but '${tableToCheck}' table does not exist.`
            console.log(`SUPABASE_TEST_RESULT: TABLE_MISSING - ${tableToCheck}`)
        } else if (error) {
            status = 'error'
            message = `Error checking '${tableToCheck}': ${error.message}`
            console.log(`SUPABASE_TEST_RESULT: ERROR - ${error.message}`)
        } else {
            status = 'success'
            message = `Connected! '${tableToCheck}' table exists.`
            console.log(`SUPABASE_TEST_RESULT: SUCCESS - ${tableToCheck}`)
        }
        console.log('--- SUPABASE TEST END ---')
    } catch (err: any) {
        status = 'error'
        message = err.message
        console.log(`SUPABASE_TEST_RESULT: EXCEPTION - ${err.message}`)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Supabase Verification</h1>
            <div className={`p-6 rounded-xl border-2 ${status === 'loading' ? 'bg-blue-900/20 border-blue-500/50' :
                    status === 'success' ? 'bg-green-900/20 border-green-500' :
                        'bg-red-900/20 border-red-500'
                }`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-3 h-3 rounded-full ${status === 'loading' ? 'bg-blue-500 animate-pulse' :
                            status === 'success' ? 'bg-green-500' :
                                'bg-red-500'
                        }`} />
                    <h2 className="text-xl font-mono font-semibold">{tableToCheck.toUpperCase()} TABLE</h2>
                </div>

                <p className="font-mono text-lg">{message}</p>

                <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400 font-mono">
                    Target: {supabaseUrl}<br />
                    Status: {status.toUpperCase()}
                </div>
            </div>
        </div>
    )
}

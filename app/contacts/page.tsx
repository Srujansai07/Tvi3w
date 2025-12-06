import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ContactsPage() {
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login')
    }

    const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('name', { ascending: true })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
                        <p className="text-gray-400">Manage your contacts and connections</p>
                    </div>
                    <Link
                        href="/contacts/new"
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Add Contact
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
                        Error loading contacts: {error.message}
                    </div>
                )}

                {contacts && contacts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {contacts.map((contact: any) => (
                            <div
                                key={contact.id}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        {contact.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white">{contact.name || 'Unnamed Contact'}</h3>
                                        <p className="text-gray-400 text-sm">{contact.email || 'No email'}</p>
                                    </div>
                                </div>
                                {(contact.company || contact.role) && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-gray-300 text-sm">
                                            {contact.role && <span>{contact.role}</span>}
                                            {contact.role && contact.company && <span> at </span>}
                                            {contact.company && <span className="font-medium">{contact.company}</span>}
                                        </p>
                                    </div>
                                )}
                                {contact.phone && (
                                    <p className="text-gray-400 text-sm mt-2">📞 {contact.phone}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No contacts yet</h3>
                        <p className="text-gray-400 mb-6">Add your first contact to get started</p>
                        <Link
                            href="/contacts/new"
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors inline-block"
                        >
                            Add Your First Contact
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

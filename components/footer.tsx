import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            Tvi3W
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Your AI-powered meeting assistant for smarter productivity.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Features</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/meetings" className="hover:text-white">Meetings</Link></li>
                            <li><Link href="/calendar" className="hover:text-white">Calendar</Link></li>
                            <li><Link href="/analysis" className="hover:text-white">AI Analysis</Link></li>
                            <li><Link href="/templates" className="hover:text-white">Templates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Resources</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                            <li><Link href="/export" className="hover:text-white">Export Data</Link></li>
                            <li><Link href="/reports" className="hover:text-white">Reports</Link></li>
                            <li><Link href="/settings" className="hover:text-white">Settings</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Connect</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="https://github.com/Srujansai07/Tvi3w" target="_blank" className="hover:text-white">GitHub</a></li>
                            <li><Link href="/activity" className="hover:text-white">Activity Feed</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © 2024 Tvi3W. All rights reserved.
                    </p>
                    <div className="flex gap-4 mt-4 md:mt-0 text-gray-500 text-sm">
                        <span>Made with ❤️</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

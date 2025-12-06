export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage users, settings, and system configuration.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
                        <p className="text-gray-400 text-sm">View and manage user accounts.</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-4">⚙️</div>
                        <h3 className="text-xl font-semibold text-white mb-2">System Settings</h3>
                        <p className="text-gray-400 text-sm">Configure application settings.</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
                        <p className="text-gray-400 text-sm">View usage statistics and reports.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

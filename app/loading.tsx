export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-700"></div>
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-white mt-4 text-lg">Loading...</p>
            </div>
        </div>
    )
}

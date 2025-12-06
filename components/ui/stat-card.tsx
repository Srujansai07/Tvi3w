interface StatCardProps {
    icon: string
    label: string
    value: number | string
    gradient: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red'
    link?: string
    linkLabel?: string
}

const gradientClasses = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    purple: 'from-purple-600 to-purple-800',
    orange: 'from-orange-600 to-orange-800',
    yellow: 'from-yellow-600 to-yellow-800',
    red: 'from-red-600 to-red-800',
}

const textClasses = {
    blue: 'text-blue-200',
    green: 'text-green-200',
    purple: 'text-purple-200',
    orange: 'text-orange-200',
    yellow: 'text-yellow-200',
    red: 'text-red-200',
}

export default function StatCard({ icon, label, value, gradient, link, linkLabel }: StatCardProps) {
    return (
        <div className={`bg-gradient-to-br ${gradientClasses[gradient]} rounded-xl p-6 shadow-xl`}>
            <div className="text-4xl mb-2">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-1">{label}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
            {link && linkLabel && (
                <a
                    href={link}
                    className={`${textClasses[gradient]} text-sm hover:underline mt-2 inline-block`}
                >
                    {linkLabel} →
                </a>
            )}
        </div>
    )
}

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
    return (
        <div
            className={`glass rounded-xl p-6 ${hover ? 'hover:scale-105 transition-transform cursor-pointer' : ''
                } ${className}`}
        >
            {children}
        </div>
    )
}

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon?: string
}

export function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
    const changeColors = {
        positive: 'text-green-400',
        negative: 'text-red-400',
        neutral: 'text-gray-400',
    }

    return (
        <Card>
            {icon && <div className="text-3xl mb-2">{icon}</div>}
            <div className="text-sm text-gray-400 mb-2">{title}</div>
            <div className="text-3xl font-bold text-white">{value}</div>
            {change && (
                <div className={`text-xs mt-2 ${changeColors[changeType]}`}>
                    {changeType === 'positive' && '↑ '}
                    {changeType === 'negative' && '↓ '}
                    {change}
                </div>
            )}
        </Card>
    )
}

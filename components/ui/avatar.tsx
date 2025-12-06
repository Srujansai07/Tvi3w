interface AvatarProps {
    url?: string | null
    name?: string | null
    size?: 'sm' | 'md' | 'lg'
}

export default function Avatar({ url, name, size = 'md' }: AvatarProps) {
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-16 w-16 text-xl',
    }

    const initial = name?.[0]?.toUpperCase() || '?'

    if (url) {
        return (
            <img
                src={url}
                alt={name || 'User avatar'}
                className={`${sizeClasses[size]} rounded-full object-cover`}
            />
        )
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold`}>
            {initial}
        </div>
    )
}

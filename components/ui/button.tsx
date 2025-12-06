import { ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    href?: string
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
    className?: string
    type?: 'button' | 'submit' | 'reset'
}

const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-300',
}

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    onClick,
    disabled = false,
    loading = false,
    className = '',
    type = 'button',
}: ButtonProps) {
    const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `

    const content = loading ? (
        <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
        </>
    ) : (
        children
    )

    if (href && !disabled) {
        return (
            <Link href={href} className={baseClasses}>
                {content}
            </Link>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={baseClasses}
        >
            {content}
        </button>
    )
}

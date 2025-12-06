interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <textarea
                {...props}
                className={`
          w-full rounded-lg bg-gray-700 border-gray-600 text-white 
          px-4 py-3 
          focus:ring-blue-500 focus:border-blue-500
          placeholder:text-gray-500
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-y min-h-[100px]
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    )
}

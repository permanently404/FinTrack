interface CardProps {
    children: React.ReactNode
    className?: string
    title?: string
}

export function Card({ children, className = '', title }: CardProps) {
    return (
        <div className={`bg-card rounded-xl shadow-sm border border-border ${className}`}>
            {title && <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>}
            {children}
        </div>
    )
}
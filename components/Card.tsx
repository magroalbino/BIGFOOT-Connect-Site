import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div
            className={`bg-lime-50 rounded-xl shadow-md p-4 border border-lime-200 ${className}`}
        >
            {children}
        </div>
    )
}

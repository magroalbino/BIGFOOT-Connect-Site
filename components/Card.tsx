// components/Card.tsx
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
}

export const Card = ({ title, children }: CardProps) => (
    <div className="bg-[#f4ffdd] rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">{title}</h2>
        {children}
    </div>
);

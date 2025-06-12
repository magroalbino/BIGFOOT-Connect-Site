'use client'

import { useState } from 'react'

export default function AuthButton() {
    const [connected, setConnected] = useState(false)

    const handleClick = () => {
        setConnected(prev => !prev)
    }

    return (
        <button
            onClick={handleClick}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${connected ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
        >
            {connected ? 'Connected' : 'Connect'}
        </button>
    )
}

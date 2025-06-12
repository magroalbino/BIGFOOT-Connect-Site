'use client'

import { useState } from 'react'

export default function PairingForm() {
    const [code, setCode] = useState('')
    const [isPaired, setIsPaired] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (code.trim() !== '') {
            // Simula emparelhamento
            setIsPaired(true)
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl border border-gray-200">
            {isPaired ? (
                <div className="text-center text-green-600 font-semibold">Device successfully paired!</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-700">Enter Pairing Code</h2>
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
                        placeholder="e.g. BFC-123-XYZ"
                    />
                    <button
                        type="submit"
                        className="w-full bg-lime-600 text-white py-2 rounded-md hover:bg-lime-700 transition"
                    >
                        Pair Device
                    </button>
                </form>
            )}
        </div>
    )
}

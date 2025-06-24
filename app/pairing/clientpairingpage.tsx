'use client';

import { useState } from 'react';
import { QRCode } from 'qrcode.react';

type Props = {
    pairingCode: string;
};

export default function ClientPairingPage({ pairingCode }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePairing = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/pairing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: pairingCode }),
            });
            if (!response.ok) throw new Error('Falha no pareamento');
            alert('Pareamento concluído com sucesso!');
        } catch {
            setError('Erro ao confirmar pareamento. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Conectar Extensão</h1>
                <div className="flex justify-center mb-4">
                    <QRCode
                        value={pairingCode}
                        size={200}
                        aria-label={`Código de pareamento: ${pairingCode}`}
                    />
                </div>
                <p className="text-center text-gray-600 mb-4">Escaneie ou insira o código:</p>
                <input
                    type="text"
                    value={pairingCode}
                    readOnly
                    id="pairing-code"
                    className="w-full p-2 border border-gray-300 rounded text-center text-gray-700"
                    aria-labelledby="pairing-code-label"
                />
                <label id="pairing-code-label" className="sr-only">
                    Código de pareamento
                </label>
                {error && <p className="text-red-600 text-center mt-2">{error}</p>}
                <button
                    onClick={handlePairing}
                    disabled={isLoading}
                    className={`w-full p-3 rounded mt-4 text-white font-semibold transition-colors duration-200 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    aria-label="Confirmar pareamento com a extensão"
                >
                    {isLoading ? 'Confirmando...' : 'Confirmar Pareamento'}
                </button>
            </div>
        </main>
    );
}

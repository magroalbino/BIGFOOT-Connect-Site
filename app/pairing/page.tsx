// Página de pareamento

export default function PairingPage() {
    return (
        <main>
            <h1>Página de emparelhamento</h1>
        </main>
    );
}

// app/pairing/page.tsx
import QRCode from 'qrcode.react';

export default function PairingPage() {
  const pairingCode = "1234-5678"; // Gerado via utils/
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Conectar Extensão</h1>
      <QRCode value={pairingCode} size={200} className="mx-auto mb-4" />
      <p className="text-center text-gray-600 mb-4">Escaneie ou insira o código:</p>
      <input
        type="text"
        value={pairingCode}
        readOnly
        className="w-full p-2 border rounded text-center"
      />
      <button className="w-full bg-blue-600 text-white p-3 rounded mt-4">
        Confirmar Pareamento
      </button>
    </div>
  );
}

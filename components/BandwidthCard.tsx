// components/BandwidthCard.tsx
export default function BandwidthCard({ amount }: { amount: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700">Banda Compartilhada</h3>
      <p className="text-2xl font-bold text-blue-600">{amount}</p>
      <p className="text-sm text-gray-500">Última atualização: agora</p>
    </div>
  );
}

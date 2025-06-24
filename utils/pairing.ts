export function generatePairingCode(): string {
  // Gera um código no formato XXXX-XXXX com números aleatórios
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `${part1}-${part2}`;
}
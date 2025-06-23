// components/WalletBalance.tsx
'use client';
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

export default function WalletBalance({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const connection = new Connection('https://api.devnet.solana.com');
    connection.getTokenAccountBalance(new PublicKey(publicKey)).then((res) => {
      setBalance(res.value.uiAmount || 0);
    });
  }, [publicKey]);
  return <p>Saldo: {balance} BFT</p>;
}

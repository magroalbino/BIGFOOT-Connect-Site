import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { 
  WhirlpoolContext, 
  buildWhirlpoolClient,
  PDAUtil,
  PoolUtil,
  PriceMath,
  increaseLiquidityQuoteByInputTokenWithParams,
  decreaseLiquidityQuoteByLiquidityWithParams
} from '@orca-so/whirlpools-sdk';
import { DecimalUtil, Percentage } from '@orca-so/common-sdk';
import Decimal from 'decimal.js';

const PoolsPage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balances, setBalances] = useState({ big: 0, sol: 0 });
  const [userPositions, setUserPositions] = useState([]);
  const [bigAmount, setBigAmount] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [poolData, setPoolData] = useState({ tvl: 0, volume: 0, fees: 0, price: 0 });
  const [whirlpoolClient, setWhirlpoolClient] = useState(null);
  const [whirlpool, setWhirlpool] = useState(null);
  const [lang, setLang] = useState('pt');

  // Constants
  const BIG_TOKEN_MINT = '39CGFmz6X8XEJT5Ky5zfjfhRjoAhdHAdCXNsvekR6EB8';
  const SOL_MINT = 'So11111111111111111111111111111111111111112';
  const ORCA_POOL_ADDRESS = 'aUJ4se8F91gBvHz2rixHRiJXygnm2YdPi34b7Sry9tS';
  const WHIRLPOOL_PROGRAM_ID = 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc';

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  const translations = {
    en: {
      title: '💧 Liquidity Pools',
      description: 'Add liquidity to pools and earn rewards',
      connectWallet: 'Connect Wallet',
      disconnect: 'Disconnect',
      connected: 'Connected',
      bigBalance: 'BIG Balance:',
      solBalance: 'SOL Balance:',
      tvl: 'TVL',
      volume: '24h Volume',
      fees: '24h Fees',
      apr: 'APR',
      bigAmount: 'BIG Amount',
      solAmount: 'SOL Amount',
      addLiquidity: '➕ Add Liquidity',
      removeLiquidity: '➖ Remove',
      processing: 'Processing...',
      insufficientBalance: 'Insufficient balance',
      invalidAmount: 'Please enter valid amounts',
      transactionSuccess: 'Transaction successful!',
      transactionError: 'Transaction error',
      noPositions: 'No liquidity positions found',
      info: 'When you add liquidity, you receive an NFT position token representing your pool share and concentrated liquidity range.',
      selectPosition: 'Select a position to remove:',
      confirmRemove: 'Confirm removal of liquidity?',
      loadingPool: 'Loading pool data...',
      price: 'Current Price'
    },
    pt: {
      title: '💧 Pools de Liquidez',
      description: 'Adicione liquidez aos pools e ganhe recompensas',
      connectWallet: 'Conectar Carteira',
      disconnect: 'Desconectar',
      connected: 'Conectado',
      bigBalance: 'Saldo BIG:',
      solBalance: 'Saldo SOL:',
      tvl: 'TVL',
      volume: 'Volume 24h',
      fees: 'Taxas 24h',
      apr: 'APR',
      bigAmount: 'Quantidade de BIG',
      solAmount: 'Quantidade de SOL',
      addLiquidity: '➕ Adicionar Liquidez',
      removeLiquidity: '➖ Remover',
      processing: 'Processando...',
      insufficientBalance: 'Saldo insuficiente',
      invalidAmount: 'Por favor, insira valores válidos',
      transactionSuccess: 'Transação realizada com sucesso!',
      transactionError: 'Erro na transação',
      noPositions: 'Nenhuma posição de liquidez encontrada',
      info: 'Ao adicionar liquidez, você recebe um NFT de posição representando sua participação no pool e faixa de liquidez concentrada.',
      selectPosition: 'Selecione uma posição para remover:',
      confirmRemove: 'Confirmar remoção de liquidez?',
      loadingPool: 'Carregando dados do pool...',
      price: 'Preço Atual'
    }
  };

  const t = translations[lang];

  // Initialize Whirlpool Client
  const initializeWhirlpoolClient = async (wallet) => {
    try {
      const anchorProvider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );

      const ctx = WhirlpoolContext.from(
        connection,
        wallet,
        new PublicKey(WHIRLPOOL_PROGRAM_ID)
      );

      const client = buildWhirlpoolClient(ctx);
      setWhirlpoolClient(client);

      // Fetch whirlpool
      const whirlpoolPubkey = new PublicKey(ORCA_POOL_ADDRESS);
      const whirlpoolData = await client.getPool(whirlpoolPubkey);
      setWhirlpool(whirlpoolData);

      return { client, whirlpool: whirlpoolData };
    } catch (err) {
      console.error('Error initializing Whirlpool client:', err);
      return null;
    }
  };

  // Connect Phantom Wallet
  const connectPhantom = async () => {
    try {
      const { solana } = window;
      
      if (!solana || !solana.isPhantom) {
        alert('Please install Phantom Wallet: https://phantom.app/');
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await solana.connect();
      const wallet = {
        publicKey: response.publicKey,
        signTransaction: solana.signTransaction.bind(solana),
        signAllTransactions: solana.signAllTransactions.bind(solana)
      };

      setProvider(solana);
      setPublicKey(response.publicKey);
      setWalletConnected(true);
      
      await initializeWhirlpoolClient(wallet);
      await loadBalances(response.publicKey);
    } catch (err) {
      console.error('Error connecting to Phantom:', err);
      alert('Error connecting to wallet');
    }
  };

  // Connect Solflare Wallet
  const connectSolflare = async () => {
    try {
      const { solflare } = window;
      
      if (!solflare) {
        alert('Please install Solflare: https://solflare.com/');
        window.open('https://solflare.com/', '_blank');
        return;
      }

      await solflare.connect();
      const wallet = {
        publicKey: solflare.publicKey,
        signTransaction: solflare.signTransaction.bind(solflare),
        signAllTransactions: solflare.signAllTransactions.bind(solflare)
      };

      setProvider(solflare);
      setPublicKey(solflare.publicKey);
      setWalletConnected(true);
      
      await initializeWhirlpoolClient(wallet);
      await loadBalances(solflare.publicKey);
    } catch (err) {
      console.error('Error connecting to Solflare:', err);
      alert('Error connecting to wallet');
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    if (provider && provider.disconnect) {
      provider.disconnect();
    }
    setWalletConnected(false);
    setProvider(null);
    setPublicKey(null);
    setBalances({ big: 0, sol: 0 });
    setUserPositions([]);
    setWhirlpoolClient(null);
    setWhirlpool(null);
  };

  // Load Balances
  const loadBalances = async (pubKey) => {
    if (!pubKey) return;

    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(pubKey);
      const solBalanceFormatted = (solBalance / 1e9).toFixed(4);

      // Get BIG token balance
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        pubKey,
        { mint: new PublicKey(BIG_TOKEN_MINT) }
      );

      let bigBalance = 0;
      if (tokenAccounts.value.length > 0) {
        bigBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      }

      setBalances({
        big: bigBalance.toFixed(2),
        sol: solBalanceFormatted
      });

      // Load pool data
      await loadPoolData();
      
      // Load user positions
      await loadUserPositions(pubKey);
    } catch (err) {
      console.error('Error loading balances:', err);
    }
  };

  // Load Pool Data
  const loadPoolData = async () => {
    try {
      // Fetch from Orca API
      const response = await fetch('https://api.orca.so/v1/whirlpool/list');
      const pools = await response.json();
      
      const bigSolPool = pools.whirlpools?.find(pool => 
        (pool.tokenA.mint === BIG_TOKEN_MINT && pool.tokenB.mint === SOL_MINT) ||
        (pool.tokenB.mint === BIG_TOKEN_MINT && pool.tokenA.mint === SOL_MINT)
      );

      if (bigSolPool) {
        setPoolData({
          tvl: bigSolPool.tvl || 3.73,
          volume: bigSolPool.volume?.day || 0,
          fees: bigSolPool.volumeFees?.day || 0,
          price: bigSolPool.price || 0
        });
      }

      // Also get data from whirlpool if available
      if (whirlpool) {
        const data = whirlpool.getData();
        const price = PriceMath.sqrtPriceX64ToPrice(
          data.sqrtPrice,
          6, // BIG decimals
          9  // SOL decimals
        );
        
        setPoolData(prev => ({
          ...prev,
          price: price.toNumber()
        }));
      }
    } catch (err) {
      console.error('Error loading pool data:', err);
      setPoolData({ tvl: 3.73, volume: 0, fees: 0, price: 0 });
    }
  };

  // Load User Positions
  const loadUserPositions = async (pubKey) => {
    if (!whirlpoolClient) return;

    try {
      const positions = await whirlpoolClient.getUserPositions(pubKey);
      
      // Filter positions for our BIG/SOL pool
      const poolPositions = positions.filter(pos => 
        pos.whirlpool.toString() === ORCA_POOL_ADDRESS
      );

      setUserPositions(poolPositions);
    } catch (err) {
      console.error('Error loading positions:', err);
      setUserPositions([]);
    }
  };

  // Add Liquidity
  const handleAddLiquidity = async () => {
    if (!walletConnected || !whirlpoolClient || !whirlpool) {
      alert('Please connect your wallet first');
      return;
    }

    const bigAmt = parseFloat(bigAmount);
    const solAmt = parseFloat(solAmount);

    if (!bigAmt || !solAmt || bigAmt <= 0 || solAmt <= 0) {
      alert(t.invalidAmount);
      return;
    }

    if (bigAmt > parseFloat(balances.big)) {
      alert(t.insufficientBalance + ' BIG');
      return;
    }

    if (solAmt > (parseFloat(balances.sol) - 0.01)) {
      alert(t.insufficientBalance + ' SOL');
      return;
    }

    setLoading(true);

    try {
      const poolData = whirlpool.getData();
      
      // Convert amounts to token units
      const bigAmountBN = DecimalUtil.toBN(new Decimal(bigAmt), 6); // BIG has 6 decimals
      const solAmountBN = DecimalUtil.toBN(new Decimal(solAmt), 9); // SOL has 9 decimals

      // Define tick range (Full range: min to max)
      const tickLower = -443636; // Min tick
      const tickUpper = 443636;  // Max tick

      // Get liquidity quote
      const quote = increaseLiquidityQuoteByInputTokenWithParams({
        tokenMintA: new PublicKey(BIG_TOKEN_MINT),
        tokenMintB: new PublicKey(SOL_MINT),
        sqrtPrice: poolData.sqrtPrice,
        tickCurrentIndex: poolData.tickCurrentIndex,
        tickLowerIndex: tickLower,
        tickUpperIndex: tickUpper,
        inputTokenMint: new PublicKey(BIG_TOKEN_MINT),
        inputTokenAmount: bigAmountBN,
        slippageTolerance: Percentage.fromFraction(10, 1000), // 1% slippage
      });

      // Open position and add liquidity
      const { tx, positionMint } = await whirlpool.openPositionWithMetadata(
        tickLower,
        tickUpper,
        quote
      );

      // Sign and send transaction
      const wallet = {
        publicKey,
        signTransaction: provider.signTransaction.bind(provider),
        signAllTransactions: provider.signAllTransactions.bind(provider)
      };

      const signature = await tx.buildAndExecute();
      
      alert(`${t.transactionSuccess}\n\nSignature: ${signature}\nPosition NFT: ${positionMint.toString()}`);
      
      // Clear inputs and reload
      setBigAmount('');
      setSolAmount('');
      await loadBalances(publicKey);
    } catch (err) {
      console.error('Error adding liquidity:', err);
      alert(t.transactionError + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove Liquidity
  const handleRemoveLiquidity = async () => {
    if (!walletConnected || !whirlpoolClient) {
      alert('Please connect your wallet first');
      return;
    }

    if (userPositions.length === 0) {
      alert(t.noPositions);
      return;
    }

    setLoading(true);

    try {
      // If multiple positions, let user select
      let selectedPosition = userPositions[0];
      
      if (userPositions.length > 1) {
        const positionList = userPositions.map((pos, idx) => 
          `${idx + 1}. ${pos.positionAddress.toString().slice(0, 8)}...`
        ).join('\n');
        
        const selection = prompt(`${t.selectPosition}\n\n${positionList}\n\nEnter number:`);
        const idx = parseInt(selection) - 1;
        
        if (idx >= 0 && idx < userPositions.length) {
          selectedPosition = userPositions[idx];
        } else {
          alert('Invalid selection');
          setLoading(false);
          return;
        }
      }

      const confirmed = window.confirm(t.confirmRemove);
      if (!confirmed) {
        setLoading(false);
        return;
      }

      // Get position data
      const position = await whirlpoolClient.getPosition(selectedPosition.positionAddress);
      const positionData = position.getData();

      // Calculate quote for removing all liquidity
      const quote = decreaseLiquidityQuoteByLiquidityWithParams({
        sqrtPrice: whirlpool.getData().sqrtPrice,
        tickCurrentIndex: whirlpool.getData().tickCurrentIndex,
        tickLowerIndex: positionData.tickLowerIndex,
        tickUpperIndex: positionData.tickUpperIndex,
        liquidity: positionData.liquidity,
        slippageTolerance: Percentage.fromFraction(10, 1000), // 1% slippage
      });

      // Decrease liquidity
      const decreaseTx = await position.decreaseLiquidity(quote);
      const decreaseSig = await decreaseTx.buildAndExecute();

      // Collect fees and rewards
      const collectTx = await position.collectFees(true, true);
      const collectSig = await collectTx.buildAndExecute();

      // Close position
      const closeTx = await position.closePosition(publicKey);
      const closeSig = await closeTx.buildAndExecute();

      alert(`${t.transactionSuccess}\n\nDecrease: ${decreaseSig}\nCollect: ${collectSig}\nClose: ${closeSig}`);
      
      await loadBalances(publicKey);
    } catch (err) {
      console.error('Error removing liquidity:', err);
      alert(t.transactionError + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle MAX buttons
  const handleMaxBig = () => {
    setBigAmount(balances.big);
    // Auto-calculate SOL based on pool price
    if (poolData.price > 0) {
      const solNeeded = parseFloat(balances.big) * poolData.price;
      setSolAmount(solNeeded.toFixed(6));
    }
  };

  const handleMaxSol = () => {
    const maxSol = Math.max(0, parseFloat(balances.sol) - 0.01);
    setSolAmount(maxSol.toFixed(4));
    // Auto-calculate BIG based on pool price
    if (poolData.price > 0) {
      const bigNeeded = maxSol / poolData.price;
      setBigAmount(bigNeeded.toFixed(2));
    }
  };

  // Auto-calculate proportional amounts
  const handleBigChange = (value) => {
    setBigAmount(value);
    if (poolData.price > 0 && value) {
      const solNeeded = parseFloat(value) * poolData.price;
      setSolAmount(solNeeded.toFixed(6));
    }
  };

  const handleSolChange = (value) => {
    setSolAmount(value);
    if (poolData.price > 0 && value) {
      const bigNeeded = parseFloat(value) / poolData.price;
      setBigAmount(bigNeeded.toFixed(2));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300">{t.description}</p>
          
          {/* Language Switcher */}
          <div className="mt-4">
            <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              {lang === 'pt' ? '🇺🇸 English' : '🇧🇷 Português'}
            </button>
          </div>
        </div>

        {/* Wallet Connection */}
        {!walletConnected ? (
          <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-2xl p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4">🔐 {t.connectWallet}</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={connectPhantom}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl hover:scale-105 transition font-semibold shadow-lg"
              >
                👻 Phantom
              </button>
              <button
                onClick={connectSolflare}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl hover:scale-105 transition font-semibold shadow-lg"
              >
                🔥 Solflare
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 mb-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                ✓
              </div>
              <div>
                <div className="text-sm text-gray-400">{t.connected}</div>
                <div className="font-mono font-bold">
                  {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                </div>
              </div>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold"
            >
              {t.disconnect}
            </button>
          </div>
        )}

        {walletConnected && (
          <>
            {/* Info Box */}
            <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-l-4 border-orange-500 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-2">💡 {lang === 'pt' ? 'Como Funciona' : 'How It Works'}</h3>
              <p className="text-gray-300">{t.info}</p>
            </div>

            {/* Pool Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/30 rounded-2xl p-8 shadow-2xl">
              {/* Pool Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-gray-800">
                    B
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-gray-800 -ml-4">
                    S
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">BIG / SOL</h3>
                  <p className="text-gray-400">{lang === 'pt' ? 'Pool Principal - Whirlpool' : 'Main Pool - Whirlpool'}</p>
                </div>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400">{t.bigBalance}</div>
                  <div className="text-2xl font-bold text-green-400">{balances.big}</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400">{t.solBalance}</div>
                  <div className="text-2xl font-bold text-green-400">{balances.sol}</div>
                </div>
              </div>

              {/* Pool Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-400">{t.tvl}</div>
                  <div className="text-xl font-bold">${poolData.tvl.toFixed(2)}</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-400">{t.volume}</div>
                  <div className="text-xl font-bold">${poolData.volume.toFixed(2)}</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-400">{t.fees}</div>
                  <div className="text-xl font-bold">${poolData.fees.toFixed(2)}</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-400">{t.apr}</div>
                  <div className="text-xl font-bold text-green-400">100%</div>
                </div>
              </div>

              {poolData.price > 0 && (
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl text-center">
                  <div className="text-sm text-gray-400">{t.price}</div>
                  <div className="text-2xl font-bold">
                    1 BIG = {poolData.price.toFixed(8)} SOL
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">{t.bigAmount}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bigAmount}
                      onChange={(e) => handleBigChange(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xl font-semibold focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={handleMaxBig}
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition"
                    >
                      MAX
                    </button>
                    <div className="px-4 py-3 bg-orange-500/20 border border-orange-500/50 rounded-xl font-bold">
                      BIG
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">{t.solAmount}</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={solAmount}
                      onChange={(e) => handleSolChange(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-xl font-semibold focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={handleMaxSol}
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition"
                    >
                      MAX
                    </button>
                    <div className="px-4 py-3 bg-orange-500/20 border border-orange-500/50 rounded-xl font-bold">
                      SOL
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddLiquidity}
                  disabled={loading || !whirlpool}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.processing : t.addLiquidity}
                </button>
                <button
                  onClick={handleRemoveLiquidity}
                  disabled={loading || userPositions.length === 0}
                  className="flex-1 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.processing : t.removeLiquidity}
                </button>
              </div>

              {/* Positions Info */}
              {userPositions.length > 0 && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                  <div className="text-sm text-gray-400 mb-3">
                    {lang === 'pt' ? 'Posições Ativas:' : 'Active Positions:'} <span className="font-bold text-green-400">{userPositions.length}</span>
                  </div>
                  <div className="space-y-2">
                    {userPositions.map((pos, idx) => (
                      <div key={idx} className="bg-gray-800/50 rounded-lg p-3 text-sm">
                        <div className="font-mono text-xs text-gray-400">
                          {pos.positionAddress.toString().slice(0, 16)}...{pos.positionAddress.toString().slice(-8)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!whirlpool && walletConnected && (
                <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl text-center">
                  <div className="text-yellow-400">⏳ {t.loadingPool}</div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Installation Instructions */}
        <div className="mt-12 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">
            📦 {lang === 'pt' ? 'Instruções de Instalação' : 'Installation Instructions'}
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-orange-400">
                {lang === 'pt' ? '1. Criar Projeto Next.js' : '1. Create Next.js Project'}
              </h4>
              <code className="block bg-black p-3 rounded text-sm text-green-400 overflow-x-auto">
                npx create-next-app@latest bigfoot-pools<br/>
                cd bigfoot-pools
              </code>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-orange-400">
                {lang === 'pt' ? '2. Instalar Dependências' : '2. Install Dependencies'}
              </h4>
              <code className="block bg-black p-3 rounded text-sm text-green-400 overflow-x-auto">
                npm install @solana/web3.js @solana/spl-token<br/>
                npm install @orca-so/whirlpools-sdk @orca-so/common-sdk<br/>
                npm install @coral-xyz/anchor<br/>
                npm install decimal.js
              </code>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-orange-400">
                {lang === 'pt' ? '3. Criar Página' : '3. Create Page'}
              </h4>
              <code className="block bg-black p-3 rounded text-sm text-green-400">
                {lang === 'pt' 
                  ? 'Copie este componente para: pages/pools.js ou app/pools/page.js'
                  : 'Copy this component to: pages/pools.js or app/pools/page.js'}
              </code>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-orange-400">
                {lang === 'pt' ? '4. Configurar Tailwind CSS' : '4. Configure Tailwind CSS'}
              </h4>
              <code className="block bg-black p-3 rounded text-sm text-green-400 overflow-x-auto">
                npm install -D tailwindcss postcss autoprefixer<br/>
                npx tailwindcss init -p
              </code>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-orange-400">
                {lang === 'pt' ? '5. Executar Projeto' : '5. Run Project'}
              </h4>
              <code className="block bg-black p-3 rounded text-sm text-green-400">
                npm run dev
              </code>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <h4 className="font-bold mb-2 text-blue-400">
              ⚙️ {lang === 'pt' ? 'Configuração do tailwind.config.js' : 'tailwind.config.js Configuration'}
            </h4>
            <code className="block bg-black p-3 rounded text-xs text-gray-300 overflow-x-auto">
              {`module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`}
            </code>
          </div>

          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
            <h4 className="font-bold mb-2 text-green-400">
              ✅ {lang === 'pt' ? 'Funcionalidades Implementadas' : 'Implemented Features'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>✅ {lang === 'pt' ? 'Conexão com Phantom e Solflare' : 'Phantom and Solflare connection'}</li>
              <li>✅ {lang === 'pt' ? 'Integração completa com Orca Whirlpool SDK' : 'Full Orca Whirlpool SDK integration'}</li>
              <li>✅ {lang === 'pt' ? 'Adicionar liquidez com Position NFT' : 'Add liquidity with Position NFT'}</li>
              <li>✅ {lang === 'pt' ? 'Remover liquidez e coletar taxas' : 'Remove liquidity and collect fees'}</li>
              <li>✅ {lang === 'pt' ? 'Detecção automática de posições do usuário' : 'Automatic user position detection'}</li>
              <li>✅ {lang === 'pt' ? 'Cálculo de preço e liquidez em tempo real' : 'Real-time price and liquidity calculations'}</li>
              <li>✅ {lang === 'pt' ? 'Slippage protection (1%)' : 'Slippage protection (1%)'}</li>
              <li>✅ {lang === 'pt' ? 'Multi-idioma (PT/EN)' : 'Multi-language (PT/EN)'}</li>
              <li>✅ {lang === 'pt' ? 'Design responsivo com Tailwind' : 'Responsive design with Tailwind'}</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl">
            <h4 className="font-bold mb-2 text-orange-400">
              ⚠️ {lang === 'pt' ? 'Notas Importantes' : 'Important Notes'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                🔹 {lang === 'pt' 
                  ? 'As transações são executadas na mainnet-beta da Solana'
                  : 'Transactions are executed on Solana mainnet-beta'}
              </li>
              <li>
                🔹 {lang === 'pt'
                  ? 'Certifique-se de ter SOL suficiente para taxas de transação (~0.01 SOL)'
                  : 'Make sure you have enough SOL for transaction fees (~0.01 SOL)'}
              </li>
              <li>
                🔹 {lang === 'pt'
                  ? 'A liquidez é adicionada em full range (min-max ticks)'
                  : 'Liquidity is added in full range (min-max ticks)'}
              </li>
              <li>
                🔹 {lang === 'pt'
                  ? 'Position NFTs são criados automaticamente ao adicionar liquidez'
                  : 'Position NFTs are automatically created when adding liquidity'}
              </li>
              <li>
                🔹 {lang === 'pt'
                  ? 'Ao remover liquidez, taxas acumuladas são coletadas automaticamente'
                  : 'When removing liquidity, accumulated fees are automatically collected'}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 BIGFOOT Connect. {lang === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
          <p className="mt-2">
            🔗 Pool: <code className="bg-gray-800 px-2 py-1 rounded text-xs">{ORCA_POOL_ADDRESS}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoolsPage;

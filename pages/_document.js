import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Preconnect para melhor performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://www.gstatic.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://api.bigfootconnect.tech" />
        <link rel="dns-prefetch" href="https://explorer.solana.com" />
        
        {/* Favicon e App Icons - MELHORADO */}
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/images/android-chrome-512x512.png" />
        
        {/* Manifest para PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags de compatibilidade */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BIGFOOT Connect" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#1F948C" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FF6B35" media="(prefers-color-scheme: light)" />
        <meta name="msapplication-TileColor" content="#1F948C" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        
        {/* Open Graph Default */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BIGFOOT Connect" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:image" content="https://bigfootconnect.tech/images/logo.png" />
        
        {/* Twitter Card Default */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@BIGFOOT_Connect" />
        <meta name="twitter:creator" content="@BIGFOOT_Connect" />
        <meta name="twitter:image" content="https://bigfootconnect.tech/images/logo.png" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/images/logo.png"
          as="image"
          type="image/png"
        />
        
        {/* Copyright and Author */}
        <meta name="author" content="BIGFOOT Connect Team" />
        <meta name="copyright" content="© 2025 BIGFOOT Connect" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Verificação para ferramentas de busca (adicione suas chaves se tiver) */}
        {/* <meta name="google-site-verification" content="your-verification-code" /> */}
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BIGFOOT Connect",
              "url": "https://bigfootconnect.tech",
              "logo": "https://bigfootconnect.tech/images/logo.png",
              "description": "Compartilhe seu poder computacional e ganhe recompensas em tokens BIG",
              "sameAs": [
                "https://x.com/BIGFOOT_Connect",
                "https://discord.gg/mkfmncN5Sa",
                "https://t.me/+qrkA9s2VTxVhMzcx",
                "https://www.youtube.com/@bigfootconnect"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "contact@bigfootconnect.tech",
                "contactType": "Customer Service"
              }
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BIGFOOT Connect",
              "url": "https://bigfootconnect.tech",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://bigfootconnect.tech/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Security Headers (complementar ao next.config.js) */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        {/* No-JS Fallback Style */}
        <noscript>
          <style>{`
            .requires-js {
              display: none !important;
            }
            .no-js-message {
              display: block !important;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: #ef4444;
              color: white;
              padding: 1rem;
              text-align: center;
              z-index: 9999;
              font-weight: 600;
            }
          `}</style>
        </noscript>
      </Head>
      
      <body>
        {/* No-JS Warning */}
        <noscript>
          <div className="no-js-message">
            ⚠️ JavaScript é necessário para o funcionamento do BIGFOOT Connect. Por favor, habilite JavaScript no seu navegador.
          </div>
        </noscript>
        
        {/* Main Content */}
        <Main />
        
        {/* Next.js Scripts */}
        <NextScript />
        
        {/* Portal for Modals */}
        <div id="modal-root"></div>
        
        {/* Portal for Notifications */}
        <div id="notification-root"></div>
      </body>
    </Html>
  );
}

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../utils/translations';

export default function Footer() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Discord',
      url: 'https://discord.gg/mkfmncN5Sa',
      icon: (
        <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.211.375-.444.864-.608 1.249a18.233 18.233 0 0 0-5.487 0 12.66 12.66 0 0 0-.617-1.249.077.077 0 0 0-.078-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.033.027C.533 9.045-.32 13.579.099 18.057a.086.086 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.057.076.076 0 0 0 .084-.027c.461-.63.873-1.295 1.226-1.993a.076.076 0 0 0-.041-.105 13.181 13.181 0 0 1-1.872-.896.076.076 0 0 1-.008-.127c.126-.094.252-.191.371-.291a.074.074 0 0 1 .077-.01c3.927 1.794 8.18 1.794 12.061 0a.074.074 0 0 1 .078.01c.12.1.245.197.371.291a.076.076 0 0 1-.006.127 12.316 12.316 0 0 1-1.874.896.076.076 0 0 0-.041.105c.36.698.772 1.362 1.226 1.993a.076.076 0 0 0 .084.027 19.888 19.888 0 0 0 6.001-3.057.076.076 0 0 0 .03-.057c.5-5.177-.838-9.664-3.568-13.661a.06.06 0 0 0-.032-.027ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.094 2.157 2.42 0 1.334-.955 2.418-2.157 2.418Zm7.956 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.175 1.094 2.157 2.42 0 1.334-.947 2.418-2.157 2.418Z" />
      )
    },
    {
      name: 'Telegram',
      url: 'https://t.me/+qrkA9s2VTxVhMzcx',
      icon: (
        <path d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12S18.628 0 12 0zm5.292 7.665-1.68 7.92c-.126.558-.456.696-.923.435l-2.553-1.885-1.232 1.188c-.136.135-.25.25-.512.25l.184-2.626 4.776-4.318c.207-.184-.046-.287-.322-.104l-5.902 3.7-2.544-.795c-.552-.174-.563-.552.116-.816l9.933-3.826c.46-.173.861.105.713.807z" />
      )
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/BIGFOOT_Connect',
      icon: (
        <path d="M20.662 3H17.27l-4.42 5.713L8.63 3H3l6.911 9.283L3.3 21h3.393l4.718-6.085L15.48 21h5.52l-7.091-9.576L20.662 3zm-3.663 16h-1.218l-3.8-5.16-4.14 5.16H6.999l5.3-6.644L6.7 5h1.215l3.58 4.865L15.504 5h1.224l-5.05 6.434L17 19z" />
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@bigfootconnect',
      icon: (
        <path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.7-.9-2.1-.9C17.2 2.7 12 2.7 12 2.7s-5.2 0-8.6.2c-.4 0-1.3 0-2.1.9-.6.7-.8 2.4-.8 2.4S0 8.3 0 10.4v2.5c0 2.1.2 4.2.2 4.2s.2 1.7.8 2.4c.8.9 1.8.9 2.3 1C6.8 20.9 12 20.9 12 20.9s5.2 0 8.6-.2c.4 0 1.3 0 2.1-.9.6-.7.8-2.4.8-2.4s.2-2.1.2-4.2v-2.5c0-2.1-.2-4.2-.2-4.2zM9.6 15.5V8.5l6.4 3.5-6.4 3.5z" />
      )
    }
  ];

  const footerLinks = [
    {
      title: t.footerAbout || 'Sobre',
      links: [
        { label: t.footerWhitepaper || 'Whitepaper', href: '/docs/whitepaper.pdf' },
        { label: t.footerRoadmap || 'Roadmap', href: '/#roadmap' },
        { label: t.footerToken || 'Token BIG', href: '/#token' },
      ]
    },
    {
      title: t.footerResources || 'Recursos',
      links: [
        { label: t.footerDashboard || 'Dashboard', href: '/dashboard' },
        { label: t.footerPools || 'Pools', href: '/pools' },
        { label: t.footerDownload || 'Download', href: '/#download' },
      ]
    },
    {
      title: t.footerSupport || 'Suporte',
      links: [
        { label: t.footerContact || 'Contato', href: '/#contact' },
        { label: 'Discord', href: 'https://discord.gg/mkfmncN5Sa' },
        { label: 'Telegram', href: 'https://t.me/+qrkA9s2VTxVhMzcx' },
      ]
    }
  ];

  return (
    <footer className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'} border-t-2 mt-auto transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-2xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                BIGFOOT Connect
              </span>
            </Link>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>
              {t.footerDescription || 'Compartilhe seu poder computacional e ganhe recompensas em tokens BIG.'}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:-translate-y-1"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-white font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${theme === 'dark' ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} transition-colors text-sm`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`${theme === 'dark' ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} transition-colors text-sm`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'} mb-6`}></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm text-center md:text-left`}>
            © {currentYear} BIGFOOT Connect. {t.footerRights || 'Todos os direitos reservados.'}
          </p>
          
          <div className="flex gap-6 text-sm">
            <Link 
              href="/privacy" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} transition-colors`}
            >
              {t.footerPrivacy || 'Privacidade'}
            </Link>
            <Link 
              href="/terms" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} transition-colors`}
            >
              {t.footerTerms || 'Termos'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

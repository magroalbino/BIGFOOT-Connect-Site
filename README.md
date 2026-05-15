# 🌐 BIGFOOT Connect — Site

Site oficial do ecossistema **BIGFOOT Connect**, construído com **Next.js**, **React**, **Tailwind CSS** e **Firebase**.  
Serve como porta de entrada para a comunidade, apresentando o projeto, permitindo autenticação, acesso ao dashboard do utilizador, informações sobre o token BIG, pools de liquidez, whitepaper, roadmap e muito mais.

---

## ✨ Funcionalidades

- **Landing page** com hero, whitepaper, tokenomics, roadmap e contato  
- **Autenticação completa** — login, registro, recuperação e redefinição de senha (Firebase Auth)  
- **Dashboard do utilizador** — gráfico de BIG tokens, sistema de claim (resgate) integrado com a Phantom Wallet e a Bridge API  
- **Painel administrativo** — visualização de estatísticas globais de BIG tokens (acesso restrito a administradores)  
- **Página de Pools** — informações sobre a pool de liquidez BIG/SOL na Orca  
- **Internacionalização** — português (Brasil) e inglês, com deteção automática do idioma do navegador  
- **Tema escuro / claro** — alternância suave e persistente  
- **SEO otimizado** — meta tags, Open Graph, Twitter Cards, dados estruturados (JSON‑LD)  
- **PWA ready** — manifest, favicons, tema de cores  
- **Acessibilidade** — foco visível, suporte a `prefers-reduced-motion` e `prefers-contrast`

---

## 🧱 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Next.js](https://nextjs.org/) (páginas e API routes) |
| UI | [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) |
| Autenticação | [Firebase Authentication](https://firebase.google.com/products/auth) |
| Base de dados | [Firestore](https://firebase.google.com/products/firestore) |
| Blockchain | Solana (Phantom Wallet, tokens SPL) |
| Deploy | [Vercel](https://vercel.com/) |
| Fontes | Space Grotesk, Plus Jakarta Sans (Google Fonts) |
| Ícones | [Lucide React](https://lucide.dev/) |

---

## 🎨 Temas

O site suporta temas escuro e claro, controlados pelo atributo data-theme no <body> e pela classe .light-mode.
A preferência do utilizador é guardada em localStorage e aplicada antes da renderização para evitar flash.

---

## 👥 Contribuição

Este é um projeto privado, mas se desejar contribuir com sugestões ou correções, pode abrir uma issue ou entrar em contato com a equipe através de contact@bigfootconnect.tech.
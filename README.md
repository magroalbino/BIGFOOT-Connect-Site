# 🦶 BIGFOOT Connect - Next.js

> Compartilhe seu poder computacional, ajude a descentralizar a rede e ganhe recompensas em tokens BIG

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.12-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Contato](#-contato)

## 🎯 Sobre o Projeto

**BIGFOOT Connect** é uma plataforma descentralizada que permite aos usuários compartilharem seu poder computacional ocioso e receberem recompensas em tokens **BIG** na blockchain Solana.

### ✨ Destaques

- 🔐 Autenticação segura com Firebase
- 💰 Sistema de recompensas em BIG Points
- 👥 Programa de referência (10% de bônus)
- 📊 Dashboard com métricas em tempo real
- 🌍 Suporte multilíngue (PT/EN)
- 🌓 Dark/Light mode
- 📱 Totalmente responsivo
- ⚡ Performance otimizada

## 🚀 Funcionalidades

### Para Usuários

- ✅ Registro e login com email/senha
- ✅ Dashboard personalizado com estatísticas
- ✅ Gráficos interativos de BIG Points
- ✅ Configuração de carteira Solana
- ✅ Sistema de referência com link personalizado
- ✅ Filtro de dados por mês
- ✅ Histórico completo de ganhos

### Para Administradores

- ✅ Painel administrativo exclusivo
- ✅ Visualização de todos os usuários
- ✅ Métricas globais de BIG Points
- ✅ Análise mensal detalhada
- ✅ Gráficos de evolução diária
- ✅ Exportação de dados (futura)

## 🛠️ Tecnologias

### Core

- **[Next.js 14.2](https://nextjs.org/)** - Framework React
- **[React 18.3](https://react.dev/)** - Biblioteca UI
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS
- **[Firebase 10.12](https://firebase.google.com/)** - Backend (Auth + Firestore)

### Bibliotecas

- **[Chart.js 4.4](https://www.chartjs.org/)** - Gráficos interativos
- **[react-chartjs-2](https://react-chartjs-2.js.org/)** - Wrapper React para Chart.js
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Papaparse](https://www.papaparse.com/)** - Processamento de CSV

### Ferramentas

- **ESLint** - Linter
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0
- **Git**

## 💻 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/fabricioricard/BIGFOOT-Connect.git
cd BIGFOOT-Connect
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Firebase:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.bigfootconnect.tech
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## ⚙️ Configuração

### Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication** (Email/Password)
3. Ative **Firestore Database**
4. Copie as credenciais para `.env.local`

### Estrutura do Firestore

```
users/
  └── {userId}/
      ├── email: string
      ├── uid: string
      ├── referredBy: string | null
      ├── createdAt: timestamp
      ├── updatedAt: timestamp
      ├── walletAddress: string
      ├── referralEarnings: number
      └── bigpoints_earnings/
          └── {YYYY-MM-DD}/
              └── bigpoints: number
```

### Administradores

Para adicionar admins, edite o arquivo `config/firebase.js`:

```javascript
export const ADMIN_EMAILS = [
  'seu-email@example.com',
  'outro-admin@example.com'
];
```

## 📖 Uso

### Páginas Disponíveis

- **`/`** - Homepage
- **`/login`** - Login de usuários
- **`/register`** - Registro de novos usuários
- **`/dashboard`** - Dashboard do usuário (protegido)
- **`/admin`** - Painel administrativo (apenas admins)

### Autenticação

```javascript
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Login
await signInWithEmailAndPassword(auth, email, password);

// Logout
await signOut(auth);
```

### Proteção de Rotas

```javascript
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  );
}

// Para rotas admin
<ProtectedRoute adminOnly>
  <div>Apenas admins</div>
</ProtectedRoute>
```

### Tradução

```javascript
import { useTranslation } from '../utils/translations';

export default function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('heroTitle')}</h1>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

## 📁 Estrutura do Projeto

```
bigfoot-connect-nextjs/
├── 📄 package.json              # Dependências e scripts
├── 📄 next.config.js            # Configuração do Next.js
├── 📄 tailwind.config.js        # Configuração do Tailwind
├── 📄 postcss.config.js         # Configuração do PostCSS
├── 📄 .gitignore                # Arquivos ignorados pelo Git
├── 📄 .env.local                # Variáveis de ambiente (não commitado)
├── 📄 README.md                 # Este arquivo
│
├── 📂 public/
│   ├── 📂 images/               # Imagens (logo, favicon)
│   └── 📂 docs/                 # Documentos (whitepaper.pdf)
│
├── 📂 config/
│   └── 📄 firebase.js           # Configuração do Firebase
│
├── 📂 components/
│   ├── 📄 Layout.js             # Layout wrapper
│   ├── 📄 Header.js             # Cabeçalho
│   ├── 📄 Footer.js             # Rodapé
│   └── 📄 ProtectedRoute.js     # HOC de proteção de rotas
│
├── 📂 pages/
│   ├── 📄 _app.js               # App wrapper global
│   ├── 📄 _document.js          # Document customizado
│   ├── 📄 index.js              # Homepage
│   ├── 📄 login.js              # Página de login
│   ├── 📄 register.js           # Página de registro
│   ├── 📄 dashboard.js          # Dashboard do usuário
│   └── 📄 admin.js              # Painel admin
│
├── 📂 styles/
│   └── 📄 globals.css           # Estilos globais + Tailwind
│
└── 📂 utils/
    ├── 📄 translations.js       # Sistema de tradução
    └── 📄 helpers.js            # Funções auxiliares
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 3000)

# Build
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint

# Análise
npm run analyze      # Analisa tamanho do bundle
```

## 🚀 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fabricioricard/BIGFOOT-Connect)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify

```bash
npm run build
npm run export
```

Faça upload da pasta `out/` para o Netlify.

### Docker

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t bigfoot-connect .
docker run -p 3000:3000 bigfoot-connect
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga o padrão de código existente
- Adicione testes quando apropriado
- Atualize a documentação
- Mantenha commits claros e descritivos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**BIGFOOT Connect Team**

- 🌐 Website: [bigfootconnect.tech](https://bigfootconnect.tech)
- 📧 Email: contact@bigfootconnect.tech
- 💬 Discord: [discord.gg/mkfmncN5Sa](https://discord.gg/mkfmncN5Sa)
- 📱 Telegram: [t.me/+qrkA9s2VTxVhMzcx](https://t.me/+qrkA9s2VTxVhMzcx)
- 🐦 X (Twitter): [@BIGFOOT_Connect](https://x.com/BIGFOOT_Connect)
- 🎥 YouTube: [@bigfootconnect](https://www.youtube.com/@bigfootconnect)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework incrível
- [Vercel](https://vercel.com/) - Platform de deploy
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Solana](https://solana.com/) - Blockchain
- Comunidade open source

---

<div align="center">
  
**Feito com ❤️ pela equipe BIGFOOT Connect**

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

</div>

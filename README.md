# 🌐 BIGFOOT Connect

Projeto inspirado na arquitetura da extensão **Grass**, com foco em **compartilhamento de banda ociosa** de forma segura, escalável e fácil de usar.  
Este repositório contém o **painel web (frontend + backend)** da aplicação, desenvolvido com **Next.js 14 (App Router)**, **Prisma ORM** e **NextAuth** para autenticação.

---

## 📁 Estrutura do Projeto

```
/bigfoot-connect
├── app/
│   ├── layout.tsx               # Layout padrão com Header
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # Dashboard do usuário
│   ├── pairing/                 # Página de pareamento com extensão
│   └── api/                     # Rotas de API (Next.js)
│       ├── auth/[...nextauth].ts
│       ├── pairing/route.ts
│       └── user/route.ts
├── components/                  # Componentes reutilizáveis (Header, AuthButton, etc.)
├── lib/                         # Configurações de Prisma e NextAuth
├── prisma/                      # Schema do banco de dados
├── public/                      # Arquivos públicos (ex: logo)
├── services/                    # Regras de negócio (pareamento, etc.)
├── utils/                       # Funções utilitárias (gerador de código)
├── styles/                      # Estilos globais (Tailwind, CSS)
├── .env.example                 # Exemplo de variáveis de ambiente
├── package.json
├── next.config.js
└── README.md
```

---

## 🔐 Funcionalidades principais

- ✅ Login com Google (NextAuth)
- ✅ Geração de código de pareamento único
- ✅ API para que a **extensão do navegador** possa se conectar
- ✅ Dashboard com status de conexão
- ✅ Código limpo e modular baseado em boas práticas

---

## 🧪 Como rodar localmente

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/bigfoot-connect.git
cd bigfoot-connect
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure o banco de dados e variáveis:**

Crie um arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Preencha as variáveis, incluindo:
- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`

4. **Configure o banco de dados com Prisma:**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Inicie o servidor:**

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy na Vercel

Este projeto está pronto para ser publicado no [Vercel](https://vercel.com/):

1. Conecte o repositório GitHub à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Clique em **Deploy**

---

## 🧩 Integração com a extensão

A extensão BIGFOOT Connect fará requisições para:

- `POST /api/pairing` → Enviar `deviceId` e receber `pairingCode`
- `GET /api/pairing?code=ABC123` → Verificar código e associar dispositivo ao usuário

---

## 📌 Tecnologias utilizadas

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma + SQLite/PostgreSQL**
- **NextAuth.js** (Google OAuth)
- **Tailwind CSS** (opcional)
- **Vercel** (deploy gratuito e otimizado)

---

## 📄 Licença

Este projeto é open-source e pode ser adaptado conforme suas necessidades.  
Licença: [MIT](LICENSE)

---

## 🤝 Contribuições

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir um _pull request_ ou _issue_.

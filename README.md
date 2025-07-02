# 🦶 BIGFOOT Connect Site

Website oficial do **BIGFOOT Connect**, desenvolvido em **HTML**, **CSS** e **JavaScript**, com suporte a autenticação via Supabase e integração com carteira Solana.

---

## 📁 Estrutura do Projeto

```
├── css/                  # Estilos globais e animações
│   └── animations.css
│
├── dashboard/            # Scripts e recursos do painel do usuário
│
├── images/               # Logos e imagens visuais do site
│
├── lib/                  # Bibliotecas auxiliares (como bcrypt.js)
│
├── index.html            # Página principal (landing page)
├── login.html            # Página de login do usuário
├── register.html         # Página de cadastro
├── dashboard.html        # Página do dashboard após login
│
├── package.json          # Dependências do projeto
├── package-lock.json     # Lockfile de dependências
├── vercel.json           # Configuração para deploy na Vercel
├── .gitignore            # Arquivos ignorados pelo Git
├── LICENSE               # Licença do projeto (MIT)
└── README.md             # Documentação do projeto
```

---

## 🚀 Como Executar

1. 📥 Clone o repositório:
   ```bash
   git clone https://github.com/magroalbino/BIGFOOT-Connect-Site.git
   ```

2. 📁 Acesse o diretório:
   ```bash
   cd BIGFOOT-Connect-Site
   ```

3. (Opcional) Instale as dependências se estiver usando recursos locais de bcrypt:
   ```bash
   npm install
   ```

4. 🌐 Abra `index.html` em seu navegador para visualizar a landing page.

---

## 🧠 Tecnologias Utilizadas

- HTML5
- CSS3 (com animações personalizadas)
- JavaScript Vanilla
- Supabase (banco de dados e autenticação)
- bcrypt.js (criptografia de senhas no navegador)
- Solana Wallet (integração futura)

---

## 🔐 Funcionalidades

- Login e cadastro de usuários
- Armazenamento seguro com hash de senha (bcrypt)
- Suporte multilíngue (🇧🇷 / 🇺🇸)
- Salvamento de endereço de carteira Solana no Supabase
- Dashboard com informações do usuário

---

## 🧪 Em Desenvolvimento

- Integração total com a extensão do BIGFOOT Connect
- Sistema de recompensas descentralizado
- Compatibilidade com dispositivos móveis

---

## 🤝 Contribuições

Contribuições são **muito bem-vindas**!

Se quiser sugerir melhorias, relatar bugs ou colaborar com novas funcionalidades:

1. Faça um fork deste repositório
2. Crie uma branch com sua feature: `git checkout -b minha-feature`
3. Envie um pull request!

---

## 📄 Licença

Distribuído sob a licença **MIT**.  
Consulte `LICENSE` para mais informações.

---

## 🌍 Deploy

Hospedado facilmente com [Vercel](https://vercel.com/). O arquivo `vercel.json` já está configurado para facilitar o deploy.

---

## 🛠 Autor

Desenvolvido com 💡 por [@magroalbino](https://github.com/magroalbino)
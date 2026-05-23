# Nike Ava X Mesh — Landing Page com Stripe

Landing page de produto completa, pronta para deploy no **Vercel** com **Stripe Checkout** integrado.

---

## 🗂 Estrutura do projeto

```
nike-ava-vercel/
├── api/
│   └── checkout.js       ← Serverless function (cria sessão Stripe)
├── public/
│   ├── index.html        ← Landing page principal
│   └── sucesso.html      ← Página de confirmação pós-pagamento
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 Deploy no Vercel (passo a passo)

### 1. Crie uma conta Stripe
1. Acesse [stripe.com](https://stripe.com) e crie sua conta
2. No Dashboard vá em **Developers → API Keys**
3. Copie a **Secret Key** (começa com `sk_live_...` ou `sk_test_...` para testes)

### 2. Suba o projeto no GitHub
```bash
git init
git add .
git commit -m "Nike Ava landing + Stripe"
git remote add origin https://github.com/SEU_USUARIO/nike-ava-landing.git
git push -u origin main
```

### 3. Importe no Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Selecione o repositório `nike-ava-landing`
4. Clique em **Deploy** (sem alterar nada por enquanto)

### 4. Configure as variáveis de ambiente no Vercel
Após o deploy inicial, vá em:
**Project Settings → Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (sua chave Stripe) |
| `NEXT_PUBLIC_BASE_URL` | `https://seu-projeto.vercel.app` |

Depois clique em **Redeploy** para aplicar as variáveis.

---

## 💳 Personalizações no `api/checkout.js`

| Campo | Onde alterar | Exemplo |
|-------|-------------|---------|
| Preço | `unit_amount: 15199` | 15199 = 151,99 € (centavos) |
| Moeda | `currency: 'eur'` | `'brl'` para reais |
| Países de entrega | `allowed_countries` | `['BR', 'US']` |
| Imagem do produto | `images: [...]` | URL da sua imagem |
| Nome do produto | `name: ...` | Qualquer texto |

---

## 🧪 Testando com Stripe

No modo de teste (`sk_test_...`), use estes cartões:

| Cartão | Número | Resultado |
|--------|--------|-----------|
| Visa aprovado | `4242 4242 4242 4242` | ✅ Pagamento aprovado |
| Cartão recusado | `4000 0000 0000 0002` | ❌ Recusado |

- Data: qualquer data futura
- CVV: qualquer 3 dígitos

---

## ✅ Fluxo do pagamento

1. Cliente escolhe o tamanho na landing page
2. Clica em **"In den Warenkorb"**
3. Modal de confirmação abre (mostra produto + tamanho + preço)
4. Cliente clica em **"Sicher mit Stripe bezahlen"**
5. API `/api/checkout` cria sessão no Stripe
6. Cliente é redirecionado para o Stripe Checkout (página segura da Stripe)
7. Após pagamento, é redirecionado para `/sucesso.html`

---

## 🌐 Domínio personalizado

No Vercel vá em **Project → Settings → Domains** e adicione o seu domínio.
Depois atualize a variável `NEXT_PUBLIC_BASE_URL` com o novo domínio.

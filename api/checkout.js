// api/checkout.js — Vercel Serverless Function
// Cria uma sessão de pagamento Stripe e redireciona o cliente

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { size, quantity = 1 } = req.body || {};

    if (!size) {
      return res.status(400).json({ error: 'Tamanho não informado' });
    }

    // URL base — usa a variável de ambiente ou fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',           // ← troque para 'brl' se quiser BRL
            product_data: {
              name: `Nike Ava X Mesh — EU ${size}`,
              description: 'Ultraleicht · Limitierte Edition · SNKRS Exklusiv',
              images: [
                'https://imgnike-a.akamaihd.net/1920x1920/11407753A1.jpg',
              ],
              metadata: { size },
            },
            unit_amount: 15199,        // ← valor em centavos: 151,99 €
          },
          quantity: Number(quantity),
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/?cancelado=1`,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH', 'PT', 'BR'],
      },
      metadata: { size, source: 'nike-ava-landing' },
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

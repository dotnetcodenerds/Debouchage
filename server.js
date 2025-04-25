// server.js (Node.js + Express Backend for Stripe Checkout)

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')('sk_test_51RHi4lSD9MXPIidLGZIyyvbQOmUZc9BWrVNRon8ZzXEomfXkgIMhYb4zlTGzhQ23UvhzcLiwJuI5xxRDhlVCv6jS00Ngmsx6L0');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // This will serve HTML files from /public

// This handles Stripe redirect
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/success.html'));
});

app.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/cancel.html'));
});

app.post('/create-checkout-session', async (req, res) => {
  const { amount, plan } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `${plan} Subscription`,
            },
            unit_amount: parseInt(amount), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4242/success',
      cancel_url: 'http://localhost:4242/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(4242, () => console.log('Server running on http://localhost:4242'));

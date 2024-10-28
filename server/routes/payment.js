import express from 'express';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-subscription', auth, async (req, res) => {
  try {
    const { paymentMethodId, priceId } = req.body;
    
    // Create or get customer
    let customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: req.user.email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Update user's plan
    await User.findByIdAndUpdate(req.user._id, {
      plan: subscription.plan.nickname.toLowerCase(),
    });

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ error: 'Subscription creation failed' });
  }
});

router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await stripe.subscriptions.del(subscriptionId);
    
    // Update user's plan to free
    await User.findByIdAndUpdate(req.user._id, { plan: 'free' });

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ error: 'Subscription cancellation failed' });
  }
});

export default router;
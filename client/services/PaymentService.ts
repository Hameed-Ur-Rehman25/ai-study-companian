import { API_BASE_URL } from '../config/api';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export class PaymentService {
    static async createCheckoutSession(priceId?: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers if needed
                },
                body: JSON.stringify({
                    price_id: priceId,
                    // These URLs should point to your actual frontend routes
                    success_url: `${window.location.origin}/pricing?success=true`,
                    cancel_url: `${window.location.origin}/pricing?canceled=true`,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const session = await response.json();

            // Redirect to Stripe Checkout
            window.location.href = session.url;

        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    }

    static async getProducts() {
        const response = await fetch(`${API_BASE_URL}/api/payment/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    }
}

import stripe
import os
from typing import Optional, Dict, Any, List
from fastapi import HTTPException

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeService:
    def __init__(self):
        self.api_key = os.getenv("STRIPE_SECRET_KEY")
        if not self.api_key:
            print("Warning: STRIPE_SECRET_KEY is not set")
        
        # Hardcoded for now, but in a real app these would be in DB or Config
        self.products = [
            {
                "id": "price_pro_subscription",
                "name": "Pro Subscription",
                "description": "Unlimited PDF summaries and chat messages",
                "amount": 999, # $9.99
                "currency": "usd"
            }
        ]

    async def create_checkout_session(
        self, 
        price_id: str, 
        success_url: str, 
        cancel_url: str,
        user_id: Optional[str] = None,
        mode: str = "subscription"
    ) -> Dict[str, Any]:
        """
        Create a Stripe Checkout Session
        """
        try:
            # For this MVP, we'll create a price object on the fly if it doesn't exist
            # checks or just use ad-hoc line items for simplicity if no price_id is passed
            # But normally we pass a price ID from Stripe.
            
            # Since we don't have real Price IDs from the user's Stripe account yet,
            # we will create a session with line_items defined directly (if mode allows) 
            # or we assume the frontend sends a valid price ID or we map our internal ID to a created one.
            
            # For simplicity in this "setup" phase, let's just define a ad-hoc product line item
            # In production, you'd use price key: 'price_...'
            
            checkout_session_params = {
                "payment_method_types": ["card"],
                "line_items": [
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {
                                "name": "AI Study Companion Pro",
                                "description": "Unlimited Access",
                            },
                            "unit_amount": 999, # $9.99
                            "recurring": {
                                "interval": "month"
                            }
                        },
                        "quantity": 1,
                    },
                ],
                "mode": "subscription",
                "success_url": success_url,
                "cancel_url": cancel_url,
            }
            
            if user_id:
                checkout_session_params["client_reference_id"] = user_id
                
            checkout_session = stripe.checkout.Session.create(**checkout_session_params)
            
            return {"url": checkout_session.url}
            
        except Exception as e:
            print(f"Error creating checkout session: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def get_products(self) -> List[Dict[str, Any]]:
        return self.products

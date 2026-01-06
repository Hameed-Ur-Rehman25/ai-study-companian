from fastapi import APIRouter, Depends, HTTPException
from app.services.stripe_service import StripeService
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class CheckoutRequest(BaseModel):
    price_id: Optional[str] = None
    success_url: str
    cancel_url: str
    user_id: Optional[str] = None

def get_stripe_service():
    return StripeService()

@router.post("/checkout")
async def create_checkout_session(
    request: CheckoutRequest,
    stripe_service: StripeService = Depends(get_stripe_service)
):
    try:
        return await stripe_service.create_checkout_session(
            price_id=request.price_id,
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            user_id=request.user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products")
async def get_products(
    stripe_service: StripeService = Depends(get_stripe_service)
):
    return stripe_service.get_products()

import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest){
    try{
        const body = await req.text()
        const signature = headers().get("stripes-signature")

        if(!signature){
            return new Response("Invalid signature", {status:400})
        }

        const event = stripe.webhooks.constructEvent(body, signature,process.env.STRIPE_WEBHOOK_SECRET!)

        if(event.type=== 'checkout.session.completed'){
            if(!event.data.object.customer_details?.email){
                throw new Error('Missing user email')
            }

            const session = event.data.object as Stripe.Checkout.Session

           
            const {userId, orderId} = session.metadata || {
                userId: null,
                orderId: null,
            }
            if(!userId || !orderId) {
                throw new Error('Invalid request metadata')
            }
        }
    }catch(err){
        console.log(err)
    }
}
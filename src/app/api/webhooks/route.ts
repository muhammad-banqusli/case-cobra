import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = headers().get("stripe-signature");

        if (!signature) {
            return new Response("Invalid signature", { status: 400 });
        }

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        if (event.type === "checkout.session.completed") {
            if (!event.data.object.customer_details?.email) {
                throw new Error("Missing user email");
            }

            const session = event.data.object as Stripe.Checkout.Session;

            const { userId, orderId } = session.metadata || {
                userId: null,
                orderId: null,
            };
            if (!userId || !orderId) {
                throw new Error("Invalid request metadata");
            }

            const billingAddress = session.customer_details!.address;
            const shippingAddress = session.shipping_details!.address;

            const updatedOrder = await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    ShippingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postal_code!,
                            state: shippingAddress!.state!,
                            street: shippingAddress!.line1!,
                        },
                    },
                    BillingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postal_code!,
                            state: billingAddress!.state!,
                            street: billingAddress!.line1!,
                        },
                    },
                },
            });

            const { error } = await resend.emails.send({
                from: "CaseCobra <abunnor8@gmail.com>",
                to: [event.data.object.customer_details.email],
                subject: "Thanks for your order!",
                react: OrderReceivedEmail({
                    orderId,
                    orderDate: updatedOrder.createdAt.toLocaleDateString(),
                    // @ts-ignore
                    shippingAddress: {
                        name: session.customer_details!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        postalCode: shippingAddress!.postal_code!,
                        street: shippingAddress!.line1!,
                        state: shippingAddress!.state,
                    },
                }),
            });
            if (error) {
                console.error(error);
            }
        }

        return NextResponse.json({ result: event, ok: true });
    } catch (err) {
        console.error(err);
        // send this to sentry
        // sentry is an error loggin tool that helps you debug
        return NextResponse.json(
            { message: "Something went wrong", ok: false },
            { status: 500 }
        );
    }
}

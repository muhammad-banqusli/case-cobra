"use client";

import { getPaymentsStatus } from "@/app/thank-you/actions";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PhonePreview } from "@/components";
import { formatPrice } from "@/lib/utils";

export default function ThankYou() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "";

    const { data } = useQuery({
        queryKey: ["get-payment-status"],
        queryFn: async () => await getPaymentsStatus({ orderId }),
        retry: true,
        retryDelay: 500,
    });

    if (data === undefined) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="size-8 animate-spin text-zinc-500" />
                    <h3 className="font-semibold text-xl">
                        Loading your order...
                    </h3>
                    <p>This won't take long.</p>
                </div>
            </div>
        );
    } else if (data === false) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="size-8 animate-spin text-zinc-500" />
                    <h3 className="font-semibold text-xl">
                        Verfiying your payment...
                    </h3>
                    <p>This might take a moment.</p>
                </div>
            </div>
        );
    }

    const { configuration, BillingAddress, ShippingAddress, amount } = data;

    const { color } = configuration;

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <div className="max-w-xl">
                    <p className="text-base font-medium text-primary">
                        Thank you!
                    </p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight">
                        Your case is on the way!
                    </h1>
                    <p>
                        We've received your order and we're now processing it.
                    </p>
                    <div className="mt-12 text-sm font-medium">
                        <p className="text-zinc-900">Order number</p>
                        <p className="mt-2 text-zinc-500">{orderId}</p>
                    </div>
                </div>
                <div className="mt-10 border-t border-zinc-200">
                    <div className="mt-10 flex flex-auto flex-col">
                        <h4 className="font-semibold text-zinc-900">
                            <p className="mt-2 text-sm text-zinc-900">
                                We at CaseCobra believe that a phone case doen't
                                only need to llk good, but also last for years
                                to come. We offer a 5-year print guarantee: If
                                you casee isn't of the highest quality, we will
                                replace it for free.
                            </p>
                        </h4>
                    </div>
                </div>
                <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/50 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
                    <PhonePreview
                        croppedImageUrl={configuration.croppedImageUrl!}
                        color={color!}
                    />
                </div>
                <div>
                    <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                        <div>
                            <p className="font-medium text-gray-900">
                                Shipping address
                            </p>
                            <div className="mt-2 text-zinc-700">
                                <address className="not-italic">
                                    <span className="block">
                                        {ShippingAddress?.name}
                                    </span>
                                    <span className="block">
                                        {ShippingAddress?.street}
                                    </span>
                                    <span className="block">
                                        {ShippingAddress?.postalCode}{" "}
                                        {ShippingAddress?.city}
                                    </span>
                                </address>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">
                                Billing address
                            </p>
                            <div className="mt-2 text-zinc-700">
                                <address className="not-italic">
                                    <span className="block">
                                        {BillingAddress?.name}
                                    </span>
                                    <span className="block">
                                        {BillingAddress?.street}
                                    </span>
                                    <span className="block">
                                        {BillingAddress?.postalCode}{" "}
                                        {BillingAddress?.city}
                                    </span>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
                    <div>
                        <p className="font-medium">Payment Status</p>
                        <p className="mt-2 text-zinc-700">Paid</p>
                    </div>

                    <div>
                        <p className="font-medium">Shipping Method</p>
                        <p className="mt-2 text-zinc-700">DHL, takes up to 3 working days</p>
                    </div>
                </div>
                <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
                    <div className="flex justify-between">
                        <p className="font-medium text-zinc-900">
                            Subtotal
                        </p>
                        <p className="text-zinc-700">
                            {formatPrice(amount)}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-zinc-900">
                            Shipping
                        </p>
                        <p className="text-zinc-700">
                            {formatPrice(0)}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-medium text-zinc-900">
                            Total
                        </p>
                        <p className="text-zinc-700">
                            {formatPrice(amount)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

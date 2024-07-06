"use client";

import { OrderStatus } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { changeOrderStatus } from "@/app/dashboard/actions";
import { useRouter } from "next/navigation";

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
    awaiting_shipment: "Awaiting Shipment",
    fullfilled: "Fullfilled",
    shipped: "Shipped",
};

export default function StatusDropdown({
    id,
    orderStatus,
}: {
    id: string;
    orderStatus: OrderStatus;
}) {
    const router = useRouter();
    const { mutate } = useMutation({
        mutationKey: ["change-order-status"],
        mutationFn: changeOrderStatus,
        onSuccess: () => router.refresh(),
    });
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-52 flex justify-between items-center"
                >
                    {LABEL_MAP[orderStatus]}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {Object.keys(OrderStatus).map((status) => (
                    <DropdownMenuItem
                        onClick={() =>
                            mutate({ id, newStatus: status as OrderStatus })
                        }
                        key={status}
                        className={cn(
                            "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
                            { "bg-zinc-100": orderStatus === status }
                        )}
                    >
                        <Check
                            className={cn(
                                "mr-2 size-4 text-primary",
                                orderStatus === status
                                    ? "opacity-100"
                                    : "opacity-0"
                            )}
                        />
                        {LABEL_MAP[status as OrderStatus]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

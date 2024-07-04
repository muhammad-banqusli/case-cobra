"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { PHONES } from "@/constants";
import ReviewColumn from "./ReviewColumn";
import { cn } from "@/lib/utils";

const splitArray = <T,>(array: Array<T>, numParts: number): Array<Array<T>> => {
    const result: Array<Array<T>> = [];

    for (let i = 0; i < array.length; i++) {
        const index = i % numParts;
        if (!result[index]) result[index] = [];

        result[index].push(array[i]);
    }

    return result;
};

const ReviewGrid = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isInview = useInView(containerRef, { once: true, amount: 0.4 });
    const columns = splitArray(PHONES, 3);
    const column1 = columns[0];
    const column2 = columns[1];
    const column3 = splitArray(columns[2], 2);

    return (
        <div
            ref={containerRef}
            className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
        >
            {isInview ? (
                <>
                    <ReviewColumn
                        reviews={[...columns[0], ...columns[2], ...columns[1]]}
                        reviewClassName={(reviewIndex) =>
                            cn({
                                "md:hidden":
                                    reviewIndex >=
                                    column1.length + column3[0].length,
                                "lg:hidden": reviewIndex >= column1.length,
                            })
                        }
                        msPerPixel={10}
                    />
                    <ReviewColumn
                        reviews={[...column2, ...column3[1]]}
                        className="hidden md:block"
                        reviewClassName={(reviewIndex) =>
                            reviewIndex >= column2.length ? "lg:hidden" : ""
                        }
                        msPerPixel={15}
                    />
                    <ReviewColumn
                        reviews={column3.flat()}
                        className="hidden md:block"
                       
                        msPerPixel={8}
                    />
                </>
            ) : null}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b border-t border-slate-100 from-slate-100"/>
            <div className="pointer-events-none absolute inset-x-0 h-32 bottom-0 bg-gradient-to-t from-slate-100"/>
        </div>
    );
};

export default ReviewGrid;

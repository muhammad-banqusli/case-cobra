import { Star, Check } from "lucide-react";

interface TestimonyCardProps {
    testimony: {
        rating: number;
        regTextOne: string;
        regTextTwo: string;
        boldText: string;
        name: string;
        image:string
    };
}

export default function TestimonyCard({ testimony }: TestimonyCardProps) {
    const { rating, regTextOne, regTextTwo, boldText, name, image } = testimony;
    return (
        <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
            <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
                <div className="flex gap-0.5 mb-2">
                    {Array(rating)
                        .fill(1)
                        .map((_, i) => (
                            <Star
                                key={i}
                                className="h-5 w-5 text-green-600 fill-green-600"
                            />
                        ))}
                </div>
                <div className="text-lg leading-8">
                    <p>
                        {regTextOne}
                        <span className="p-0.5 bg-slate-800 text-white">
                            {boldText}
                        </span>
                        {regTextTwo}
                    </p>
                </div>
                <div className="flex gap-4 mt-2">
                    <img
                        src={image}
                        alt="user"
                        className="rounded-full h-12 w-12 object-contain"
                    />
                    <div className="flex flex-col">
                        <p className="font-semibold">{name}</p>
                        <div className="flex gap-1.5 items-center text-zinc-500">
                            <Check className="h-4 w-4 stroke-[3px] text-green-600" />
                            <p className="text-sm">Verified Purchase</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

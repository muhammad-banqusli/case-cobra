import { DesignConfigurator } from "@/components";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function Page({ searchParams }: PageProps) {
    const id = Array.isArray(searchParams.id) ? searchParams.id[0] : searchParams.id;

    if (!id || typeof id !== "string") {
        return notFound();
    }

    const configuration = await db.configuration.findUnique({
        where: {
            id,
        },
    });

    if (!configuration) {
        return notFound();
    }

    const { imageUrl, width, height } = configuration;

    return (
        <DesignConfigurator
            configId={configuration.id}
            imageDimensions={{ width, height }}
            imageUrl={imageUrl}
        />
    );
}

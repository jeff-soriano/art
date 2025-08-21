import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArticArtDetailsType,
    ArticConfigType,
    ArticPaginationType,
} from '@/lib/articApi'

type Props = {
    data: ArticArtDetailsType[]
    config: ArticConfigType | null
    isLoading: boolean
    pagination: ArticPaginationType | null
    error: string | null
}

function ImageGridImpl({ data, config, isLoading, pagination, error }: Props) {
    if (pagination?.total === 0) {
        return (
            <div className="font-serif text-center text-xl md:text-2xl lg:text-3xl mt-2">
                No results found
            </div>
        )
    }

    return (
        <>
            {error && (
                <div className="font-serif text-red-500 text-center text-xl md:text-2xl lg:text-3xl mt-2">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 p-4 lg:w-4/5 mx-auto">
                {config &&
                    data &&
                    data.map(
                        ({ id, image_id, thumbnail, title, artist_title }) => {
                            return (
                                <div
                                    key={id}
                                    className="relative w-full min-h-[200px] aspect-[4/3] group cursor-pointer motion-safe:animate-[fadeIn_0.5s_ease-in-out]"
                                >
                                    <Link
                                        className="w-full h-full relative block"
                                        href={`art/${id}`}
                                    >
                                        <Image
                                            src={`${config.iiif_url}/${image_id}/full/400,/0/default.jpg`}
                                            alt={
                                                thumbnail?.alt_text ||
                                                `${title} by ${artist_title}`
                                            }
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <p className="text-sm line-clamp-1">
                                                {title}
                                            </p>
                                            <p className="text-xs line-clamp-1">
                                                {artist_title}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            )
                        }
                    )}
                {isLoading && (
                    <>
                        {Array.from({ length: 50 }).map((_, index) => (
                            <div
                                key={`skeleton-${index}`}
                                className="relative w-full h-48 aspect-[4/3] group motion-safe:animate-pulse"
                            >
                                <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                        ))}
                        <span className="sr-only">Loading...</span>
                    </>
                )}
            </div>
        </>
    )
}

export const ImageGrid = React.memo(ImageGridImpl)

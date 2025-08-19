import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArticArtDetailsType, ArticConfigType } from '@/lib/articApi'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    data: ArticArtDetailsType[]
    config: ArticConfigType | null
    isLoading: boolean
}

function ImageGridImpl({ data, config, isLoading }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 p-4 lg:w-4/5 mx-auto">
            {config &&
                data &&
                data.map(({ id, image_id, thumbnail, title, artist_title }) => {
                    return (
                        <div
                            key={id}
                            className="relative w-full min-h-[200px] aspect-[4/3] group"
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
                })}
            {isLoading && (
                <div className="col-span-full flex justify-center items-center">
                    <FaSpinner className="w-10 h-10 animate-spin" />
                </div>
            )}
        </div>
    )
}

export const ImageGrid = React.memo(ImageGridImpl)

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArticArtDataType, ArticConfigType } from '@/lib/articApi'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    data: ArticArtDataType[]
    config: ArticConfigType | null
    isLoading: boolean
}

function ImageGridImpl({ data, config, isLoading }: Props) {
    return (
        <>
            {data.map((data) => {
                return (
                    <div
                        key={data.id}
                        className="relative w-full aspect-[4/3] group"
                    >
                        <Link href={`art/${data.id}`}>
                            <Image
                                src={`${config?.iiif_url}/${data.image_id}/full/400,/0/default.jpg`}
                                alt={
                                    data.thumbnail?.alt_text ||
                                    `${data.title} by ${data.artist_title}`
                                }
                                fill
                                className="object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <p className="text-sm line-clamp-1">
                                    {data.title}
                                </p>
                                <p className="text-xs line-clamp-1">
                                    {data.artist_title}
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
        </>
    )
}

export const ImageGrid = React.memo(ImageGridImpl)

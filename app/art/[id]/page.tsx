'use client'

import { useArticContext } from '@/app/ArticProvider'
import {
    ArticArtDetailsType,
    ArticConfigType,
    getArtDetails,
} from '@/lib/articApi'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'

export default function ArtPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)

    const [artData, setArtData] = useState<ArticArtDetailsType | null>(null)
    const [artConfig, setArtConfig] = useState<ArticConfigType | null>(null)
    const { data, config } = useArticContext()

    useEffect(() => {
        const fetchArtData = async () => {
            const artData = data.find((art) => art.id === parseInt(id)) as
                | ArticArtDetailsType
                | undefined

            if (!artData) {
                const artDetails = await getArtDetails(id)
                setArtData(artDetails.data)
                setArtConfig(artDetails.config)
            } else {
                setArtData(artData)
                setArtConfig(config)
            }
        }

        fetchArtData()
    }, [data, config, id])

    if (!artData || !artConfig) return <div>Art not found</div>

    return (
        <div className="w-full flex flex-col gap-2 p-4 md:w-3/4 mx-auto lg:max-w-4xl">
            <Link href="/" className="text-sm text-gray-500 hover:underline">
                &larr; Back to search
            </Link>

            <div className="w-full  min-h-[300px] relative aspect-[4/3] mx-auto">
                <Image
                    src={`${artConfig.iiif_url}/${artData.image_id}/full/843,/0/default.jpg`}
                    alt={
                        artData.thumbnail?.alt_text ||
                        `${artData.title} by ${artData.artist_title}`
                    }
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            <div className="text-left p-4 grid grid-cols-1 md:grid-cols-2 mx-auto text-center gap-4">
                <div className="flex flex-col gap-1">
                    <h2>
                        <strong>{artData.artist_display}</strong>
                    </h2>
                    <h3>
                        <strong>
                            <em>{artData.title}</em>{' '}
                        </strong>
                        , {artData.date_display}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {artData.medium_display}
                    </p>
                </div>

                <p
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: artData.description }}
                />
            </div>
        </div>
    )
}

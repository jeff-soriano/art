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
    const [isLoading, setIsLoading] = useState(true)
    const { data, config } = useArticContext()

    useEffect(() => {
        const fetchArtData = async () => {
            setIsLoading(true)
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
            setIsLoading(false)
        }

        fetchArtData()
    }, [data, config, id])

    // Skeleton loading state
    if (isLoading)
        return (
            <div className="w-full flex flex-col gap-2 p-4 md:w-3/4 mx-auto lg:max-w-4xl">
                <Link
                    href="/"
                    className="text-sm text-gray-500 hover:underline"
                >
                    &larr; Back to search
                </Link>

                {/* Skeleton Layout */}
                <div className="flex flex-col gap-8">
                    {/* Image Skeleton */}
                    <div className="w-full min-h-[300px] relative aspect-[4/3] mx-auto motion-safe:animate-pulse">
                        <div className="rounded-lg bg-gray-200 h-full dark:bg-gray-700"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 motion-safe:animate-pulse">
                        {/* First column Skeleton */}
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded motion-safe:animate-pulse w-2/3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded motion-safe:animate-pulse w-1/3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded motion-safe:animate-pulse w-1/3"></div>
                        </div>
                        {/* Second column Skeleton */}
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded motion-safe:animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded motion-safe:animate-pulse w-5/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded motion-safe:animate-pulse w-4/5"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded motion-safe:animate-pulse w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        )

    // Art not found
    if (!artData || !artConfig)
        return (
            <div className=" text-center w-full flex flex-col gap-2 p-4 md:w-3/4 mx-auto lg:max-w-4xl">
                <h2 className="text-2xl font-bold">Art not found</h2>
                <Link
                    href="/"
                    className="text-sm text-gray-500 hover:underline"
                >
                    &larr; Back to search
                </Link>
            </div>
        )

    // Art found
    return (
        <div className="w-full flex flex-col gap-2 p-4 md:w-3/4 mx-auto lg:max-w-4xl">
            <Link href="/" className="text-sm text-gray-500 hover:underline">
                &larr; Back to search
            </Link>

            <div className="w-full min-h-[300px] relative aspect-[4/3] mx-auto motion-safe:animate-[fadeIn_0.5s_ease-in-out]">
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
            <div className="text-left p-4 grid grid-cols-1 md:grid-cols-2 gap-4 motion-safe:animate-[fadeIn_0.5s_ease-in-out]">
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

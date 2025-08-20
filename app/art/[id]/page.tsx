'use client'

import { useArticContext } from '@/app/ArticProvider'
import {
    ArticArtDetailsType,
    ArticConfigType,
    getArtDetails,
} from '@/lib/articApi'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'

export default function ArtPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)

    const [artData, setArtData] = useState<ArticArtDetailsType | null>(null)
    const [artConfig, setArtConfig] = useState<ArticConfigType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { data, config } = useArticContext()

    useEffect(() => {
        // Scroll to the top of the page so that we're not in the middle
        // of the page when we navigate to a new art piece
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const fetchArtData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Try to find the art details in the current data
                const artData = data.find((art) => art.id === parseInt(id)) as
                    | ArticArtDetailsType
                    | undefined

                // If we don't find the art details, fetch them from the API
                if (!artData) {
                    const artDetails = await getArtDetails(id)

                    if (!artDetails || !artDetails.data) {
                        throw new Error('Art not found')
                    }

                    setArtData(artDetails.data)
                    setArtConfig(artDetails.config)
                } else {
                    setArtData(artData)
                    setArtConfig(config)
                }
                setIsLoading(false)
            } catch (error) {
                console.error(error)
                setError('Art not found')
            } finally {
                setIsLoading(false)
            }
        }

        fetchArtData()
    }, [data, config, id])

    // Skeleton loading state
    if (isLoading)
        return (
            <>
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
            </>
        )

    // Art not found
    if (error || !artData || !artConfig)
        return (
            <h2 className="font-serif text-center text-xl md:text-2xl lg:text-3xl mt-2">
                Art not found
            </h2>
        )

    // Art found
    return (
        <>
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
                <div className="flex flex-col gap-2">
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
                    <div>
                        <p className="text-sm font-semibold">Department</p>
                        <p className="text-sm text-gray-500">
                            {artData.department_title}
                        </p>
                    </div>
                </div>

                <p
                    className="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: artData.description }}
                />
            </div>
        </>
    )
}

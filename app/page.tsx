'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
    getSearchResults,
    ArticArtDataType,
    ArticConfigType,
    ArticPaginationType,
} from '@/lib/articApi'
import { FaSearch, FaSpinner } from 'react-icons/fa'

export default function Home() {
    const [artData, setArtData] = useState<ArticArtDataType[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [config, setConfig] = useState<ArticConfigType | null>(null)
    const [pagination, setPagination] = useState<ArticPaginationType | null>(
        null
    )
    const sentinelRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(false)

    const getResults = useCallback(
        async (query: string, getNextPage: boolean = false) => {
            // If we're already loading, don't get the results again
            if (isLoading) return

            // Set loading to true
            setIsLoading(true)

            // If we're not getting the next page, get the first page
            if (!getNextPage) {
                const results = await getSearchResults(query, 1)

                setArtData(results.data)
                setConfig(results.config)
                setPagination(results.pagination)

                setIsLoading(false)
                return
            }

            // If we're getting the next page, and we have a pagination object,
            // increment the page number by 1
            // Otherwise, set the page number to 1
            const pageNumber =
                getNextPage && !!pagination ? pagination.current_page + 1 : 1

            // If we have a pagination object, check that we are less than
            // the total pages
            if (pagination && pageNumber > pagination.total_pages) {
                setIsLoading(false)
                return
            }

            // Get the results
            const results = await getSearchResults(query, pageNumber)

            // Add the new results to the existing data
            setArtData((prev) => {
                // De-dupe the results
                const existingIds = new Set(prev.map((p) => p.id))
                const newData = results.data.filter(
                    (result) => !existingIds.has(result.id)
                )

                return [...prev, ...newData]
            })

            // Set the config and pagination
            setConfig(results.config)
            setPagination(results.pagination)

            // Set loading to false
            setIsLoading(false)
        },
        [isLoading, pagination]
    )

    useEffect(() => {
        getResults(searchQuery)
    }, [])

    // Infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                const hasMore =
                    pagination &&
                    pagination.current_page < pagination.total_pages

                // If the sentinel is intersecting, we have more results, and we're not loading,
                // get the next page of results
                if (entry.isIntersecting && hasMore && !isLoading) {
                    getResults(searchQuery, true)
                }
            },
            { root: null, threshold: 0, rootMargin: '600px' }
        )

        observer.observe(sentinel)

        return () => observer.disconnect()
    }, [getResults, searchQuery, isLoading, pagination])

    return (
        <main className="flex flex-col font-sans min-h-screen p-8 pt-2 gap-4">
            <div className="flex items-center justify-center w-full h-9 md:w-3/4 lg:w-1/2 md:h-12 mx-auto">
                <label htmlFor="search" className="relative w-full h-full">
                    <input
                        className="border w-full p-2 md:p-4 md:text-lg rounded-xl rounded-r-none border-r-0 h-full border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="search"
                        name="search"
                        type="search"
                        aria-label="Search for art (i.e. 'monet')"
                        aria-autocomplete="none"
                        placeholder="Search for art (i.e. 'monet')"
                        autoComplete="off"
                        spellCheck="false"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>
                <div className="h-full">
                    <button
                        className="p-2 pl-4 bg-gray-200 rounded-r-xl border border-gray-200 h-full cursor-pointer hover:bg-gray-300"
                        onClick={() => getResults(searchQuery)}
                    >
                        <FaSearch className="w-6 md:w-10 h-full" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-4 lg:w-4/5 mx-auto">
                {artData.map((data) => {
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
                <div id="sentinel" ref={sentinelRef} />
            </div>
        </main>
    )
}

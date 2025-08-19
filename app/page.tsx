'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { FaSearch, FaSpinner } from 'react-icons/fa'
import { useArticContext } from './ArticProvider'

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const sentinelRef = useRef<HTMLDivElement>(null)
    const { data, config, pagination, isLoading, runSearch } = useArticContext()

    useEffect(() => {
        runSearch(searchQuery, false)
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
                    runSearch(searchQuery, true)
                }
            },
            { root: null, threshold: 0, rootMargin: '600px' }
        )

        observer.observe(sentinel)

        return () => observer.disconnect()
    }, [runSearch, searchQuery, isLoading, pagination])

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
                        onClick={() => runSearch(searchQuery, true)}
                    >
                        <FaSearch className="w-6 md:w-10 h-full" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-4 lg:w-4/5 mx-auto">
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
                <div id="sentinel" ref={sentinelRef} />
            </div>
        </main>
    )
}

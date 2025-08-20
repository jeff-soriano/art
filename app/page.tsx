'use client'

import { useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useArticContext } from './ArticProvider'
import { ImageGrid } from './components/ImageGrid'

export default function Home() {
    const sentinelRef = useRef<HTMLDivElement>(null)
    const currentSearchQueryRef = useRef('')
    const { data, config, pagination, isLoading, runSearch, query, setQuery } =
        useArticContext()

    useEffect(() => {
        currentSearchQueryRef.current = query
        runSearch(query, false)
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
                    runSearch(currentSearchQueryRef.current, true)
                }
            },
            { root: null, threshold: 0, rootMargin: '600px' }
        )

        observer.observe(sentinel)

        return () => observer.disconnect()
    }, [runSearch, isLoading, pagination])

    return (
        <main className="flex flex-col font-sans min-h-screen p-8 pt-2 gap-4">
            <div
                role="search"
                className="flex items-center justify-center w-full h-9 md:w-3/4 lg:w-1/2 md:h-12 mx-auto"
            >
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
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                runSearch(query, false)
                            }
                        }}
                    />
                </label>
                <div className="h-full">
                    <button
                        aria-label="Search"
                        className="p-2 pl-4 bg-gray-200 rounded-r-xl border border-gray-200 h-full cursor-pointer hover:bg-gray-300"
                        onClick={() => runSearch(query, false)}
                    >
                        <FaSearch className="w-6 md:w-10 h-full text-black" />
                    </button>
                </div>
            </div>

            <ImageGrid data={data} config={config} isLoading={isLoading} />
            <div id="sentinel" ref={sentinelRef} />
        </main>
    )
}

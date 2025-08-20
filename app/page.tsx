'use client'

import { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useArticContext } from './ArticProvider'
import { ImageGrid } from './components/ImageGrid'

export default function Home() {
    const sentinelRef = useRef<HTMLDivElement>(null)
    const currentSearchQueryRef = useRef('')
    const [ariaLiveText, setAriaLiveText] = useState('')
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

    // This search function is used when the user initiates a search,
    // as opposed to when the user is scrolling through the results.
    // Here we update the aria live text for when the search is complete.
    const handleSearch = () => {
        setAriaLiveText('Searching...')
        runSearch(query, false)
        setTimeout(() => {
            setAriaLiveText(
                `Search results for ${query} complete, found ${pagination?.total} results`
            )
        }, 1000)
    }

    return (
        <main className="flex flex-col font-sans min-h-screen p-8 pt-2 gap-4">
            <div
                role="search"
                className="flex items-center justify-center w-full h-9 md:w-3/4 lg:w-1/2 md:h-12 mx-auto"
            >
                <label htmlFor="search" className="relative w-full h-full">
                    <span className="sr-only">Search</span>
                    <input
                        className="border w-full p-2 md:p-4 md:text-lg rounded-xl rounded-r-none border-r-0 h-full border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="search"
                        name="search"
                        type="search"
                        aria-label="Search"
                        aria-autocomplete="none"
                        placeholder="Search for art (i.e. 'monet')"
                        autoComplete="off"
                        spellCheck="false"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch()
                            }
                        }}
                    />
                </label>
                <div className="h-full">
                    <button
                        aria-label="Search button"
                        className="p-2 pl-4 bg-gray-200 rounded-r-xl border border-gray-200 h-full cursor-pointer hover:bg-gray-300"
                        onClick={handleSearch}
                    >
                        <FaSearch className="w-6 md:w-10 h-full text-black" />
                    </button>
                </div>
            </div>

            <ImageGrid data={data} config={config} isLoading={isLoading} />
            <div id="sentinel" ref={sentinelRef} />
            <div aria-live="polite" className="sr-only">
                {isLoading ? 'Loading...' : ariaLiveText}
            </div>
        </main>
    )
}

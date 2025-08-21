'use client'

import {
    ArticArtDetailsType,
    ArticConfigType,
    ArticPaginationType,
    getSearchResults,
} from '@/lib/articApi'
import { createContext, useState, useCallback, useContext } from 'react'

export type ArticContextType = {
    query: string
    data: ArticArtDetailsType[]
    config: ArticConfigType | null
    pagination: ArticPaginationType | null
    isLoading: boolean
    error: string | null
    runSearch: (query: string, getNextPage: boolean) => Promise<void>
    setQuery: (query: string) => void
}

const ArticContext = createContext<ArticContextType | undefined>(undefined)

export function ArticProvider({ children }: { children: React.ReactNode }) {
    const [query, setQuery] = useState('')
    const [data, setData] = useState<ArticArtDetailsType[]>([])
    const [config, setConfig] = useState<ArticConfigType | null>(null)
    const [pagination, setPagination] = useState<ArticPaginationType | null>(
        null
    )
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const runSearch = useCallback(
        async (query: string, getNextPage: boolean = false) => {
            try {
                // If we're already loading, don't get the results again
                if (isLoading) return

                // Set loading to true
                setIsLoading(true)
                setError(null)

                // If we're not getting the next page, get the first page
                if (!getNextPage) {
                    const results = await getSearchResults(query, 1)

                    setData(results.data)
                    setConfig(results.config)
                    setPagination(results.pagination)

                    setIsLoading(false)
                    return
                }

                // If we're getting the next page, and we have a pagination object,
                // increment the page number by 1
                // Otherwise, set the page number to 1
                const pageNumber =
                    getNextPage && !!pagination
                        ? pagination.current_page + 1
                        : 1

                // If we have a pagination object, check that we are less than
                // the total pages
                if (pagination && pageNumber > pagination.total_pages) {
                    setIsLoading(false)
                    return
                }

                // Get the results
                const results = await getSearchResults(query, pageNumber)

                // Add the new results to the existing data
                setData((prev) => {
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
            } catch (e) {
                setError(
                    (e as Error)?.message ||
                        'Something went wrong while fetching art.'
                )
            } finally {
                setIsLoading(false)
            }
        },
        [isLoading, pagination]
    )

    return (
        <ArticContext.Provider
            value={{
                data,
                config,
                pagination,
                isLoading,
                error,
                runSearch,
                query,
                setQuery,
            }}
        >
            {children}
        </ArticContext.Provider>
    )
}

export function useArticContext() {
    const context = useContext(ArticContext)
    if (!context) {
        throw new Error('useArticContext must be used within an ArticProvider')
    }
    return context
}

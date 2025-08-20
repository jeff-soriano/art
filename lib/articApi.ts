/**
 * Utility file for the Art Instute of Chicago Api
 * Api docs found here: https://api.artic.edu/docs/
 */

const BASE_URL = 'https://api.artic.edu/api/v1/artworks'

const fieldsToInclude = [
    'id',
    'title',
    'thumbnail',
    'date_display',
    'artist_display',
    'description',
    'medium_display',
    'artist_title',
    'image_id',
    'department_title',
]

// This type does not represent every key/value available for objects returned from the api
// It only has what we'll actually use
export type ArticArtDetailsType = {
    id: number
    title: string
    thumbnail: {
        alt_text: string
        height: number
        lqip: string
        width: number
    }
    date_display: string
    artist_display: string
    description: string
    medium_display: string
    artist_title: string
    image_id: string
    department_title: string
}

export type ArticConfigType = {
    iiif_url: string
    website_url: string
}

export type ArticSearchResultsType = {
    config: ArticConfigType
    data: ArticArtDetailsType[]
    pagination: ArticPaginationType
}

export type ArticArtDetailsResponseType = {
    config: ArticConfigType
    data: ArticArtDetailsType
}

export type ArticPaginationType = {
    current_page: number
    limit: number
    offset: number
    total: number
    total_pages: number
}

export const getSearchResults = async (
    query: string,
    pageNumber: number
): Promise<ArticSearchResultsType> => {
    const res = await fetch(
        `${BASE_URL}/search?q=${query}&fields=${fieldsToInclude.join(',')}&limit=50&page=${pageNumber}`
    )
    if (!res.ok) throw new Error('Search failed')
    return res.json()
}

export const getArtDetails = async (
    id: string
): Promise<ArticArtDetailsResponseType> => {
    const res = await fetch(
        `${BASE_URL}/${id}?fields=${fieldsToInclude.join(',')}`
    )
    if (!res.ok) throw new Error('Art details failed')
    return res.json()
}

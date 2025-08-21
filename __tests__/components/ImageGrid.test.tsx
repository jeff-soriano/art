import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { ImageGrid } from '@/app/components/ImageGrid'
import {
    ArticArtDetailsType,
    ArticConfigType,
    ArticPaginationType,
} from '@/lib/articApi'

const iiif = 'https://www.artic.edu/iiif/2'

describe('ImageGrid', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders cards with next/image src', () => {
        render(
            <ImageGrid
                data={[
                    {
                        id: 10,
                        title: 'T',
                        artist_title: 'A',
                        image_id: 'img',
                        thumbnail: {},
                    } as ArticArtDetailsType,
                ]}
                config={{ iiif_url: iiif } as ArticConfigType}
                isLoading={false}
                pagination={{ total: 1 } as ArticPaginationType}
                error={null}
            />
        )

        const link = screen.getByRole('link', { name: /t/i })
        expect(link).toHaveAttribute('href', 'art/10')

        const img = link.querySelector('img')!
        const imgSrc = img.getAttribute('src') || ''

        // Next.js transforms the URL, so we need to decode it and check for the pattern
        const decodedSrc = decodeURIComponent(imgSrc)
        expect(decodedSrc).toMatch(/iiif\/2\/img\/full\/400/)
    })

    test('shows empty state when total is 0', () => {
        render(
            <ImageGrid
                data={[]}
                config={{ iiif_url: iiif } as ArticConfigType}
                isLoading={false}
                pagination={{ total: 0 } as ArticPaginationType}
                error={null}
            />
        )

        expect(screen.getByText(/No results found/i)).toBeInTheDocument()
    })

    test('shows error message when error is present', () => {
        render(
            <ImageGrid
                data={[]}
                config={{ iiif_url: iiif } as ArticConfigType}
                isLoading={false}
                pagination={{ total: 1 } as ArticPaginationType}
                error={'Error'}
            />
        )

        expect(screen.getByText(/Error/i)).toBeInTheDocument()
    })
})

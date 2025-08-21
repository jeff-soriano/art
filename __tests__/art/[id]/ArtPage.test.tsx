import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { ArticProvider } from '@/app/ArticProvider'
import ArtPage from '@/app/art/[id]/page'
import { getArtDetails } from '@/lib/articApi'

// Mock window.scrollTo since jsdom doesn't implement it
Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true,
})

jest.mock('@/lib/articApi', () => ({
    getArtDetails: jest.fn(),
}))

describe('ArtPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render detailed art page', async () => {
        // Mock the getArtDetails function
        const mockArtDetails = {
            data: {
                id: 777,
                title: 'Starry Test',
                artist_title: 'Vincent van Test',
                image_id: 'img777',
                thumbnail: {},
                artist_display: 'Vincent van Test',
                date_display: '1889',
                medium_display: 'Oil on canvas',
                department_title: 'European Painting',
                description: '<p>Sample description.</p>',
            },
            config: { iiif_url: 'https://www.artic.edu/iiif/2' },
        }
        ;(getArtDetails as jest.Mock).mockResolvedValue(mockArtDetails)

        await act(async () => {
            render(
                <ArticProvider>
                    <ArtPage params={Promise.resolve({ id: '777' })} />
                </ArticProvider>
            )
        })

        // Check that the art page is rendered
        expect(screen.getByText('Starry Test')).toBeInTheDocument()
        expect(screen.getByText('Vincent van Test')).toBeInTheDocument()
        expect(screen.getByText(/1889/)).toBeInTheDocument()
        expect(screen.getByText('Oil on canvas')).toBeInTheDocument()
        expect(screen.getByText('European Painting')).toBeInTheDocument()
        expect(screen.getByText('Sample description.')).toBeInTheDocument()

        // Check that the image src contains the expected IIIF URL pattern
        const img = screen.getByTestId('art-image')
        const imgSrc = img.getAttribute('src') || ''
        const decodedSrc = decodeURIComponent(imgSrc)
        expect(decodedSrc).toMatch(/iiif\/2\/img777\/full\/843/)
    })

    it('should show art not found on api error', async () => {
        // Mock the getArtDetails function to throw an error
        ;(getArtDetails as jest.Mock).mockRejectedValue(new Error('API error'))

        await act(async () => {
            render(
                <ArticProvider>
                    <ArtPage params={Promise.resolve({ id: '777' })} />
                </ArticProvider>
            )
        })

        // Check that the art not found message is displayed
        expect(screen.getByText('Art not found')).toBeInTheDocument()
    })
})

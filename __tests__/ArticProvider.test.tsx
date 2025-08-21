import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ArticProvider, useArticContext } from '@/app/ArticProvider'
import { getSearchResults } from '@/lib/articApi'

jest.mock('@/lib/articApi', () => ({
    getSearchResults: jest.fn(),
}))

function Consumer() {
    const { data, isLoading, runSearch, config } = useArticContext()
    return (
        <div>
            <h1>Consumer</h1>
            <div data-testid="loading">{String(isLoading)}</div>
            <div data-testid="count">{data.length}</div>
            <div data-testid="images">
                {data.map((item) => (
                    <div key={item.id} data-testid={`image-${item.id}`}>
                        {item.title}
                    </div>
                ))}
            </div>
            <div data-testid="config">{String(config?.iiif_url)}</div>
            <button onClick={() => runSearch('monet', false)}>searchP1</button>
            <button onClick={() => runSearch('monet', true)}>nextPage</button>
        </div>
    )
}

describe('ArticProvider', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // Smoke test
    it('should render the ArticProvider', () => {
        render(
            <ArticProvider>
                <Consumer />
            </ArticProvider>
        )

        expect(screen.getByText('Consumer')).toBeInTheDocument()
    })

    // Mock the getSearchResults function
    it('should fetch search results', async () => {
        const mockSearchResults = {
            data: [
                {
                    id: 1,
                    title: 'A',
                    artist_title: 'X',
                    image_id: 'img1',
                    thumbnail: {},
                },
                {
                    id: 2,
                    title: 'B',
                    artist_title: 'Y',
                    image_id: 'img2',
                    thumbnail: {},
                },
            ],
            config: { iiif_url: 'https://www.artic.edu/iiif/2' },
            pagination: {
                total: 2,
                limit: 50,
                offset: 0,
                total_pages: 1,
                current_page: 1,
            },
        }

        // Mock the function to return our test data
        ;(getSearchResults as jest.Mock).mockResolvedValue(mockSearchResults)

        render(
            <ArticProvider>
                <Consumer />
            </ArticProvider>
        )

        // Initially, data should be empty
        expect(screen.getByTestId('count')).toHaveTextContent('0')
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
        expect(screen.getByTestId('config')).toHaveTextContent('undefined')

        // Trigger the search
        fireEvent.click(screen.getByText('searchP1'))

        // Wait for loading to be true
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('true')
        })

        // Wait for loading to be false (finished loading)
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })

        // Check if data loaded
        expect(screen.getByTestId('count')).toHaveTextContent('2')
        expect(screen.getByTestId('images')).toHaveTextContent('A')
        expect(screen.getByTestId('images')).toHaveTextContent('B')
        expect(screen.getByTestId('config')).toHaveTextContent(
            'https://www.artic.edu/iiif/2'
        )
    })

    it('should fail gracefully when the API call fails', async () => {
        // Mock the getSearchResults function to throw an error
        ;(getSearchResults as jest.Mock).mockRejectedValue(
            new Error('API error')
        )

        render(
            <ArticProvider>
                <Consumer />
            </ArticProvider>
        )

        // Trigger the search
        fireEvent.click(screen.getByText('searchP1'))

        // Wait for loading to be true
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('true')
        })

        // Wait for loading to be false (finished loading)
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })

        // Check that nothing is loaded
        // since the api call failed
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
        expect(screen.getByTestId('count')).toHaveTextContent('0')
    })
})

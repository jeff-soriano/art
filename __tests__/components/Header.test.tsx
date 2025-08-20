import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Header } from '@/app/components/Header'

describe('Header', () => {
    it('should render', () => {
        render(<Header />)
        expect(screen.getByText('ART')).toBeInTheDocument()
    })
})

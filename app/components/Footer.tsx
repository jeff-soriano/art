import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

export const Footer = () => {
    return (
        <footer className="flex flex-col gap-3 flex-wrap items-center justify-center p-2">
            <hr className="w-1/2 border-gray-200" />
            <Link
                href="https://github.com/jeff-soriano/art"
                className="text-2xl hover:text-gray-500"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaGithub />
            </Link>
            <p>&copy; 2025 Jeff Soriano</p>
        </footer>
    )
}

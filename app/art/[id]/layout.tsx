import Link from 'next/link'
import { Header } from '@/app/components/Header'

export default function ArtPageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen w-full flex flex-col gap-2 p-4 md:w-3/4 mx-auto lg:max-w-4xl">
            <Header />
            <Link href="/" className="text-sm text-gray-500 hover:underline">
                &larr; Back to search
            </Link>
            {children}
        </div>
    )
}

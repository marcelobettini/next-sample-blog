import { Metadata } from "next"
import Link from "next/link"

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
            <div className="max-w-md">
                {/* Visual Finesse: Un código de error sutil pero claro */}
                <span className="text-6xl font-extrabold text-blue-500 block mb-4 select-none">
                    404
                </span>

                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Nada por aquí
                </h1>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Parece que la página que buscas no existe o ha sido movida a otra ubicación.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/blog"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md active:scale-95"
                    >
                        Ir al Blog
                    </Link>

                    <Link
                        href="/"
                        className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-lg transition-all"
                    >
                        Inicio
                    </Link>
                </div>
            </div>
        </main>
    )
}

export const metadata: Metadata = {
    title: 'Página no encontrada | Next Blog',
    description: 'Lo sentimos, la página que buscas no existe.',
    robots: {
        index: false,
        follow: true,
        nocache: true,
    },
}
import { Metadata } from "next"
import Link from "next/link"
export default function NotFound() {
    return (
        <div role="alert" className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl">Nada por aquí</h1>
            <p>La página que estás buscando no existe.</p>
            <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Volver a la página principal
            </Link>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Next Blog - Página no encontrada',
    description: 'Lo sentimos, la página que buscas no existe.',
    robots: {
        index: false, // No indexar
        follow: true,  // Permitir que sigan los enlaces (como el de "Volver al inicio")
        nocache: true,
    },
}
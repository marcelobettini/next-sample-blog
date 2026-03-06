"use client"

import Link from "next/link"

export default function BlogPostError() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl">Nada por aquí</h1>
            <p>La publicación que estás buscando no existe.</p>
            <Link href="/blog" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Volver a la lista de artículos
            </Link>
        </div>
    )
}

// src/app/blog/loading.tsx

export default function BlogLoading() {
    // Generamos 9 para que las filas queden completas en el grid de 3
    const skeletonCards = Array.from({ length: 9 })

    return (
        <div className="container mx-auto mt-8 px-4 flex flex-col items-center justify-center  gap-4">
            {/* Configuración de Grid:
          - 1 columna por defecto (móvil)
          - 2 columnas en tablets (sm/md)
          - 3 columnas en desktop (lg+) 
      */}
            <div className="h-6 w-50 text-center bg-gray-100 animate-pulse rounded-md mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 w-full">
                {skeletonCards.map((_, i) => (
                    <article
                        key={i}
                        className="flex flex-col gap-4 bg-white rounded-lg p-6 border border-gray-100 shadow-sm"
                    >
                        <header>
                            {/* Título: simula una línea de texto */}
                            <div className="h-6 w-full bg-gray-400 animate-pulse rounded-md mb-2" />
                            <div className="h-6 w-full bg-gray-400 animate-pulse rounded-md mb-4" />
                        </header>

                        {/* Autor: simula un texto corto */}
                        <div className="space-y-2 flex-1">
                            <div className="h-3 w-4/12 bg-gray-300 animate-pulse rounded" />
                        </div>

                        {/* Footer: alineado igual que tus posts reales */}
                        <footer className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
                            <div className="h-4 w-10 bg-blue-300 animate-pulse rounded" />
                            <div className="h-4 w-10 bg-indigo-300 animate-pulse rounded" />
                            <div className="h-4 w-10 bg-indigo-300 animate-pulse rounded" />
                        </footer>
                    </article>
                ))}
            </div>
        </div>
    )
}

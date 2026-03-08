export default function LoadingPost() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col justify-center" aria-busy="true">

            {/* 1. Skeleton del Botón de Volver (Esencial para evitar el salto del header) */}
            <nav className="mb-6 w-full max-w-[80ch] mx-auto">
                <div className="h-5 w-48 bg-gray-200 animate-pulse rounded-md" />
            </nav>

            <article className="grid grid-cols-1 gap-6 bg-white rounded-lg shadow-sm p-6 md:p-10 mx-auto border border-gray-100 w-full">
                <header>
                    {/* Título: 2 líneas para simular el estilo uppercase robusto */}
                    <div className="h-9 w-full bg-gray-200 animate-pulse rounded-md mb-4" />
                    <div className="h-9 w-2/3 bg-gray-200 animate-pulse rounded-md mb-6" />

                    {/* Metadata: Por autor • #tags */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" /> {/* Autor */}
                        <div className="h-4 w-4 bg-gray-100 animate-pulse rounded-full" /> {/* Separador */}
                        <div className="flex gap-2">
                            <div className="h-6 w-12 bg-gray-50 animate-pulse rounded" /> {/* Tag 1 */}
                            <div className="h-6 w-12 bg-gray-50 animate-pulse rounded" /> {/* Tag 2 */}
                        </div>
                    </div>
                </header>

                {/* 2. Cuerpo del Post: Varias líneas para simular lectura relajada */}
                <div className="space-y-4">
                    <div className="h-5 w-full bg-gray-100 animate-pulse rounded" />
                    <div className="h-5 w-[98%] bg-gray-100 animate-pulse rounded" />
                    <div className="h-5 w-[96%] bg-gray-100 animate-pulse rounded" />
                    <div className="h-5 w-[40%] bg-gray-100 animate-pulse rounded" />
                </div>

                {/* 3. Sección de Comentarios (Si no la ponemos, el layout saltará al cargar) */}
                <section className="mt-10 border-t border-gray-100 pt-8">
                    <div className="h-7 w-48 bg-gray-200 animate-pulse rounded-md mb-6" /> {/* Título Comentarios */}
                    <div className="space-y-6">
                        {/* Simulamos 2 comentarios */}
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <div className="h-4 w-24 bg-blue-100 animate-pulse rounded mb-3" /> {/* Username */}
                                <div className="h-4 w-full bg-slate-200 animate-pulse rounded mb-2" /> {/* Texto 1 */}
                                <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded" /> {/* Texto 2 */}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Footer: Reacciones alineadas a la derecha */}
                <footer className="flex items-center justify-end gap-6 mt-8 border-t border-gray-50 pt-6">
                    <div className="h-6 w-12 bg-blue-50 animate-pulse rounded-md" /> {/* Views */}
                    <div className="h-6 w-12 bg-green-50 animate-pulse rounded-md" /> {/* Likes */}
                    <div className="h-6 w-12 bg-red-50 animate-pulse rounded-md" /> {/* Dislikes */}
                </footer>

            </article>
        </div>
    )
}
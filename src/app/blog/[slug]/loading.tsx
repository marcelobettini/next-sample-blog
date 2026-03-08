export default function LoadingSinglePost() {
    return (
        <div className="container mx-auto px-4 flex flex-col items-center justify-center h-screen">
            {/* Mantenemos el mismo ancho md:w-[80ch] para evitar que el contenedor "salte" */}
            <article className="grid grid-cols-1 gap-6 bg-white rounded-lg p-6 md:w-[80ch] mx-auto">

                <header>
                    {/* Título: Simulamos un título de 2 líneas con alturas de texto 2xl */}
                    <div className="h-8 w-3/4 bg-gray-400 animate-pulse rounded-md mb-2" />
                </header>

                {/* Cuerpo: Simulamos varios párrafos de texto con anchos irregulares */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
                        <div className="h-4 w-[98%] bg-gray-300 animate-pulse rounded" />
                        <div className="h-4 w-[95%] bg-gray-300 animate-pulse rounded" />
                        <div className="h-4 w-[40%] bg-gray-300 animate-pulse rounded" />
                    </div>

                </div>

                {/* Footer: Alineado a la derecha con los 3 indicadores */}
                <footer className="flex items-center justify-end gap-4 mt-6">
                    {/* Views */}
                    <div className="h-5 w-14 bg-blue-300 animate-pulse rounded-full" />
                    {/* Likes */}
                    <div className="h-5 w-14 bg-indigo-300 animate-pulse rounded-full" />
                    {/* Dislikes */}
                    <div className="h-5 w-14 bg-indigo-300 animate-pulse rounded-full" />
                </footer>

            </article>
        </div>
    )
}
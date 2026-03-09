import { Metadata } from "next"
import Link from "next/link"
import type { PostExcerptWithAuthor } from "@/types/types"
import { notFound } from "next/navigation"
import { fetchTags } from "@/services/blogService"
import { getPaginatedPosts } from "@/services/orchestrator"
import SearchBar from "../components/SearchBar"


export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; tag?: string }>
}) {
  const sParams = await searchParams
  const currentPage = Number(sParams.page) || 1
  const q = sParams.q || ''
  const tag = sParams.tag || ''

  // Ejecución en paralelo de Posts y Tags
  const postsPromise = getPaginatedPosts({ page: currentPage, q, tag })
  const tagsPromise = fetchTags()

  const [{ data: posts, totalPages, totalResults, isInvalid }, tags] =
    await Promise.all([postsPromise, tagsPromise])

  if (isInvalid) notFound()

  return (
    <main className="container mx-auto mt-5 px-4 flex flex-col items-center justify-center  gap-4">
      <h1 className="text-4xl font-bold mb-8">Artículos</h1>
      {/* SearchBar con la lista de tags inyectada desde el servidor */}
      <SearchBar tags={tags} totalResults={totalResults} />

      {posts && posts.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post: PostExcerptWithAuthor) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}?page=${currentPage}`} className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lime-300 transition-all duration-400 flex flex-col">
              {/* Evitamos .toUpperCase() en el JS, mejor usar CSS: uppercase */}
              <h2 className="text-2xl text-gray-800 font-semibold mb-4 uppercase">{post.title}</h2>
              <p className="text-gray-600">{post.authorName}</p>
              <small className="text-indigo-800 italic text-end">#{post.tags.join(", #")}</small>
            </Link>
          ))}
          {/* Controles de Paginación (Simples con Links) */}
          <nav className="flex items-center gap-4 mt-12 mb-28">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="px-4 py-2 bg-gray-200 text-blue-600 rounded hover:bg-gray-300 transition"
              >
                Anterior
              </Link>
            )}

            <span className="font-medium text-gray-300">
              Página {currentPage} de {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Siguiente
              </Link>
            )}
          </nav>
        </div>
      ) :
        (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="text-6xl mb-4">🔍</span>
            <h2 className="text-2xl font-bold text-gray-800">No encontramos nada</h2>
            <p className="text-gray-500 max-w-sm mt-2">
              No hay artículos que coincidan con <span className="font-semibold text-gray-800">"{q || tag}"</span>.
              Intenta con otras palabras o limpia los filtros.
            </p>
            <Link
              href="/blog"
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Ver todos los artículos
            </Link>
          </div>
        )

      }

    </main>
  )
}


export const metadata: Metadata = {
  title: 'Next Blog - Artículos',
  description: 'Explora nuestros artículos de prueba hechos con Next.js y TypeScript.',
}
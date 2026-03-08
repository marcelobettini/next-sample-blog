import { Metadata } from "next"
import Link from "next/link"
import type { Post, PostExcerptWithAuthor, PostsResponse } from "@/types/types"
import { notFound } from "next/navigation"

// 1. Capa de Servicios (Acceso a Datos)
async function fetchPosts(page: number = 1, limit: number = 12): Promise<PostsResponse> {
  // Calculamos cuántos posts saltar
  const skip = (page - 1) * limit

  // Forzamos el límite a 12 para que el grid de 3 columnas sea simétrico
  const res = await fetch(
    `https://dummyjson.com/posts?limit=${limit}&skip=${skip}&select=title,userId,tags,views`,
    { next: { revalidate: 3600, tags: ['posts'] } }
  )

  if (!res.ok) throw new Error('Error al obtener posts')
  return res.json()
}

async function fetchUserById(id: number) {
  const res = await fetch(`https://dummyjson.com/users/${id}`, {
    next: { revalidate: 3600, tags: ['users'] }, // Cache de 1 hora para los usuarios 
    cache: 'force-cache', // Forzamos cache para usuarios, asumiendo que no cambian frecuentemente
  })
  if (!res.ok) throw new Error(`Error al obtener usuario ${id}`)
  return res.json()
}

// 2. Capa de Orquestación (Lógica de Negocio)
export async function getPaginatedPosts(currentPage: number) {
  const limit = 12
  const { posts, total } = await fetchPosts(currentPage, limit)

  // Paso A: Cálculo manual del total de páginas
  const totalPages = Math.ceil(total / limit)
  // VALIDACIÓN DE RANGO:
  // Si la página solicitada es menor a 1 o mayor al total disponible (manipulación de url)...
  if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
    return { data: null, totalPages, isInvalid: true }
  }

  // Paso B: Extraer IDs únicos para evitar peticiones redundantes (tu Hash Map optimizado)
  const uniqueUserIds = Array.from(new Set(posts.map(p => p.userId)))

  // Paso C: Fetch en paralelo de todos los usuarios necesarios
  const usersData = await Promise.all(uniqueUserIds.map(id => fetchUserById(id)))

  // Paso D: Crear un Hash Map(O(1) de búsqueda)
  const userMap = new Map(usersData.map(u => [u.id, `${u.firstName} ${u.lastName}`]))

  // Paso E: Hidratación (Data Join)
  const data = posts.map((post: Post) => ({
    id: post.id,
    title: post.title,
    tags: post.tags,
    authorName: userMap.get(post.userId) || 'Autor desconocido'
  }))

  return { data, totalPages, total, isInvalid: false }
}

// 3. Componente de UI (Next.js Server Component)

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const sParams = await searchParams
  const currentPage = Number(sParams.page) || 1
  const { data: posts, totalPages, isInvalid } = await getPaginatedPosts(currentPage)

  if (isInvalid) {
    notFound() // Esto limpia el warning y redirige al 404 real
  }
  return (
    <main className="container mx-auto mt-5 px-4 flex flex-col items-center justify-center  gap-4">
      <h1 className="text-4xl font-bold mb-8">Artículos</h1>
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
      </div>
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

        <span className="font-medium text-gray-700">
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
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Next Blog - Artículos',
  description: 'Explora nuestros artículos de prueba hechos con Next.js y TypeScript.',
}
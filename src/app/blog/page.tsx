import { Metadata } from "next"
import Link from "next/link"
import type { Post } from "@/types/types"

// 1. Capa de Servicios (Acceso a Datos)
async function fetchPosts() {
  const res = await fetch('https://dummyjson.com/posts?select=title,userId,tags,views')
  if (!res.ok) throw new Error('Error al obtener posts')
  return res.json()
}

async function fetchUserById(id: number) {
  const res = await fetch(`https://dummyjson.com/users/${id}`)
  if (!res.ok) throw new Error(`Error al obtener usuario ${id}`)
  return res.json()
}

// 2. Capa de Orquestación (Lógica de Negocio)
export async function getPostsWithAuthors() {
  const { posts } = await fetchPosts()

  // Paso A: Extraer IDs únicos para evitar peticiones redundantes
  const uniqueUserIds = Array.from(new Set(posts.map((p: any) => p.userId)))

  // Paso B: Fetch en paralelo de todos los usuarios necesarios
  const usersData = await Promise.all(
    uniqueUserIds.map((id) => fetchUserById(id as number))
  )

  // Paso C: Crear un Hash Map (O(1) de búsqueda)
  const userMap = new Map(
    usersData.map((user) => [user.id, `${user.firstName} ${user.lastName}`])
  )

  // Paso D: Hidratación (Data Join)
  return posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    tags: post.tags,
    authorName: userMap.get(post.userId) || 'Autor desconocido'
  }))
}

// 3. Componente de UI (Next.js Server Component)

export default async function Blog() {
  const posts: Post[] = await getPostsWithAuthors()
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Artículos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: Post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lime-300 transition-all duration-400 flex flex-col">
            <h2 className="text-2xl text-gray-800 font-semibold mb-4">{post.title}</h2>
            <p className="text-gray-600">{post.authorName}</p>
            <small className="text-indigo-800 italic text-end">#{post.tags.join(", #")}</small>
          </Link>
        ))}
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Next Blog - Artículos',
  description: 'Explora nuestros artículos de prueba hechos con Next.js y TypeScript.',
}
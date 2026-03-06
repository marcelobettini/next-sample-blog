import { Metadata } from "next"
import Link from "next/link"
import type { Post } from "@/types/types"

export default async function Blog() {
  const data: { posts: Post[] } = await fetch("https://dummyjson.com/posts?select=title,userId,tags,views").then((res) => res.json())
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Artículos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.posts.map((post: Post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lime-300 transition-all duration-400 flex flex-col">
            <h2 className="text-2xl text-gray-800 font-semibold mb-4">{post.title}</h2>
            <p className="text-gray-600">Author:{post.userId}</p>
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
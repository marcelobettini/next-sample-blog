import type { Comment, Post } from "@/types/types"
import { Metadata } from "next"
import { Abel } from "next/font/google"
import { notFound } from "next/navigation"

const abel = Abel({
    weight: "400", variable: "--font-abel",
    subsets: ["latin"],
})
export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    // Ejecución en paralelo: Mejoramos el Time to Interactive (TTI)
    const postPromise: Promise<Post> = fetch(`https://dummyjson.com/posts/${slug}`, {
        next: { revalidate: 3600 * 24, tags: ['post'] } // Cache de 1 día para el post
    }).then(res => res.json())

    const authorPromise: Promise<string> = fetch(`https://dummyjson.com/users/${slug}`, {
        cache: 'no-store',
    }).then(res => res.json()).then(user => `${user.firstName} ${user.lastName}`)

    const commentsPromise: Promise<Comment[]> = fetch(`https://dummyjson.com/posts/${slug}/comments`, {
        next: { revalidate: 3600, tags: ['comments'] } // Cache de 1 hora para comentarios
    }).then(res => res.json())

    const [post, author, comments] = await Promise.all([postPromise, authorPromise, commentsPromise])

    // VALIDACIÓN CRÍTICA:
    // Si la API devuelve un mensaje de error o no tiene ID, disparamos el 404 de Next.js
    if (!post.id) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <article className="grid grid-cols-1 gap-6 bg-white rounded-lg p-6  mx-auto">
                <header>
                    {/* Evitamos .toUpperCase() en el JS, mejor usar CSS: uppercase */}
                    <h2 className="text-2xl text-gray-800 font-semibold mb-4 uppercase">{post.title}</h2>
                    <p className="text-gray-600 italic mb-2">Por {author}</p>
                </header>
                <p className="text-gray-700 ">{post.body}</p>
                {comments?.length > 0 && (
                    <section className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-600 italic">Comentarios</h3>
                        <ul className="space-y-4">
                            {comments.map((comment: Comment) => (
                                <li key={comment.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                    <p className="text-sm text-blue-600 font-bold mb-1">
                                        @{comment.user.username}
                                    </p>
                                    <p className={`text-gray-700 ${abel.className}`}>
                                        {comment.body}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                <footer className="flex items-center justify-end gap-4 ">
                    <small className="text-blue-800 italic">👀 {post.views}</small>
                    <small className="text-indigo-800 italic">👍 {post.reactions.likes}</small>
                    <small className="text-indigo-800 italic">👎 {post.reactions.dislikes}</small>
                </footer>
            </article>
        </div>
    )
}
// Metadata dinámico: Personalizamos el SEO para cada post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = await fetch(`https://dummyjson.com/posts/${slug}`).then(res => res.json())

    return {
        title: `${post.title} | Next Blog`,
        description: post.body.substring(0, 160)
    }
}



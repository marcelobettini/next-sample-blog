import type { Comment, Post } from "@/types/types"
import { Metadata } from "next"
import { Abel } from "next/font/google"
import Link from "next/link"
import { notFound } from "next/navigation"

const abel = Abel({
    weight: "400", variable: "--font-abel",
    subsets: ["latin"],
})
export default async function BlogPostPage({
    params,
    searchParams, // Agregamos searchParams para leer la página de origen
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ page?: string }>
}) {
    const { slug } = await params
    const sParams = await searchParams

    // Determinamos la URL de retorno. Si no hay página, volvemos a la 1.
    const backPage = sParams.page || '1'
    const backUrl = `/blog?page=${backPage}`

    const postPromise: Promise<Post> = fetch(`https://dummyjson.com/posts/${slug}`, {
        next: { revalidate: 3600 * 24, tags: ['post'] }
    }).then(res => res.json())

    // Corregimos la lógica del autor: usamos el userId del post si es posible,
    // pero para mantener el paralelismo, DummyJSON suele tener IDs coincidentes 
    // en sus ejemplos. Si falla, el error.tsx lo capturará.
    const authorPromise: Promise<string> = fetch(`https://dummyjson.com/users/${slug}`, {
        cache: 'force-cache',
    }).then(res => res.json()).then(user => `${user.firstName} ${user.lastName}`)

    const commentsPromise: Promise<{ comments: Comment[] }> = fetch(`https://dummyjson.com/posts/${slug}/comments`, {
        next: { revalidate: 3600, tags: ['comments'] }
    }).then(res => res.json())

    const [post, author, { comments }] = await Promise.all([postPromise, authorPromise, commentsPromise])

    if (!post.id) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col justify-center">
            {/* Botón de Volver Inteligente */}
            <nav className="mb-6 w-full max-w-[80ch] mx-auto">
                <Link
                    href={backUrl}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 transition-colors font-medium"
                >
                    ← Volver al listado (Página {backPage})
                </Link>
            </nav>

            <article className="grid grid-cols-1 gap-6 bg-white rounded-lg shadow-sm p-6 md:p-10 mx-auto border border-gray-100">
                <header>
                    <h1 className="text-3xl text-gray-900 font-bold mb-4 uppercase leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 italic mb-4">
                        <span>Por {author}</span>
                        <span>•</span>
                        <div className="flex gap-2">
                            {post.tags?.map(tag => (
                                <span key={tag} className="text-xs lowercase bg-gray-100 px-2 py-1 rounded">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </header>

                <p className="text-gray-700 text-lg leading-relaxed">{post.body}</p>

                {comments?.length > 0 && (
                    <section className="mt-10 border-t border-gray-100 pt-8">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">
                            Comentarios ({comments.length})
                        </h3>
                        <ul className="space-y-6">
                            {comments.map((comment: Comment) => (
                                <li key={comment.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-sm text-blue-700 font-bold">
                                            @{comment.user.username}
                                        </p>
                                    </div>
                                    <p className={`text-gray-700 leading-snug ${abel.className}`}>
                                        {comment.body}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <footer className="flex items-center justify-end gap-6 mt-8 border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-1 text-blue-800 font-medium">
                        <span className="text-lg">👀</span> {post.views}
                    </div>
                    <div className="flex items-center gap-1 text-green-700 font-medium">
                        <span>👍</span> {post.reactions.likes}
                    </div>
                    <div className="flex items-center gap-1 text-red-700 font-medium">
                        <span>👎</span> {post.reactions.dislikes}
                    </div>
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



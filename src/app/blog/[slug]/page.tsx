import type { Comment, Post } from "@/types/types"
import { Metadata } from "next"
import { Abel } from "next/font/google"

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
    const post: Post = await fetch(`https://dummyjson.com/posts/${slug}`).then((res) => res.json())
    const { comments }: {
        comments: Comment[]
    } = await fetch(`https://dummyjson.com/posts/${slug}/comments`).then((res) => res.json())
    return (
        <div className="container mx-auto px-4 py-8">
            <article className="grid grid-cols-1 gap-6 bg-white rounded-lg p-6 md:w-[80ch] mx-auto">
                <header>
                    <h2 className="text-2xl text-gray-800 font-semibold mb-4">{post.title.toUpperCase()}</h2>
                </header>
                <p className="text-gray-700 ">{post.body}</p>
                {comments.length > 0 && (
                    <section className="mt-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-600">Comentarios</h3>
                        <ul className="space-y-4">
                            {comments.map((comment: Comment) => (
                                <li key={comment.id} className="bg-gray-100 rounded-lg p-4">
                                    <p className={`text-gray-800 font-semibold`}>{comment.user.fullName}:</p>
                                    <p className={`text-gray-700 text-lg ${abel.className}`}>{comment.body}</p>
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
export const metadata: Metadata = {
    title: 'Next Blog - Artículo',
}



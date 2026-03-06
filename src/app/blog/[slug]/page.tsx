import type { Post } from "@/types/types"
export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post: Post = await fetch(`https://dummyjson.com/posts/${slug}`).then((res) => res.json())
    return (
        <div className="container mx-auto px-4 py-8">
            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded-lg p-6">
                <header>
                    <h2 className="text-2xl text-gray-800 font-semibold mb-4">{post.title}</h2>
                </header>
                <p className="text-gray-700">{post.body}</p>
                <footer className="flex items-center justify-end gap-4">
                    <small className="text-blue-800">👀 {post.views}</small>
                    <small className="text-indigo-800 italic">👍 {post.reactions.likes}</small>
                    <small className="text-indigo-800 italic">👎 {post.reactions.dislikes}</small>
                </footer>
            </article>
        </div>
    )
}



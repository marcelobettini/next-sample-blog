
export default async function Home() {
  const data = await fetch("https://dummyjson.com/posts").then((res) => res.json())
  console.log(data)
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Artículos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.posts.map((post: any) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lime-300 transition-all duration-400">
            <h2 className="text-2xl text-gray-800 font-semibold mb-4">{post.title}</h2>
            <p className="text-gray-700">{post.body.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </main>
  )
}

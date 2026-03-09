// CAPA DE SERVICIOS: Acá van las funciones que hablan con la API


import { PostsResponse } from "@/types/types"

const BASE_URL = 'https://dummyjson.com/posts'
export const LIMIT = 12

// Obtener lista de tags (Cacheada por 24h)
export async function fetchTags(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/tag-list`, {
        next: { revalidate: 86400 }
    })
    if (!res.ok) throw new Error('Error al obtener tags')
    return res.json()
}

// Servicio genérico para manejar los 3 tipos de búsqueda de la API
export async function fetchFromApi(endpoint: string, page: number): Promise<PostsResponse> {
    const skip = (page - 1) * LIMIT
    const separator = endpoint.includes('?') ? '&' : '?'
    const url = `${BASE_URL}${endpoint}${separator}limit=${LIMIT}&skip=${skip}&select=title,userId,tags,views`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('Error en la petición a la API')
    return res.json()
}


// 1. Capa de Servicios (Acceso a Datos)
export async function fetchPosts(page: number = 1, limit: number = 12): Promise<PostsResponse> {
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

export async function fetchUserById(id: number) {
    const res = await fetch(`https://dummyjson.com/users/${id}`, {
        next: { revalidate: 3600, tags: ['users'] }, // Cache de 1 hora para los usuarios 
        cache: 'force-cache', // Forzamos cache para usuarios, asumiendo que no cambian frecuentemente
    })
    if (!res.ok) throw new Error(`Error al obtener usuario ${id}`)
    return res.json()
}

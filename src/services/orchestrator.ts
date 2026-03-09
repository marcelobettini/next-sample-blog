// CAPA DE ORQUESTACIÓN: Este es el orquestador que recibe el resultado de las funciones que hablan con la API y arma los resultados para el render

import { PostExcerptWithAuthor } from "@/types/types"
import { fetchFromApi, fetchUserById } from "./blogService"
import { LIMIT } from "./blogService"

export async function getPaginatedPosts({
    page = 1,
    q = '',
    tag = ''
}: {
    page?: number
    q?: string
    tag?: string
}) {
    let endpoint = ''

    // ESTRATEGIA EXCLUSIVA: El orden de los IF define la prioridad si ambos existieran por error.
    if (tag) {
        endpoint = `/tag/${tag}`
    } else if (q) {
        endpoint = `/search?q=${q}`
    } else {
        endpoint = '' // Listado general
    }

    // 1. Fetch de Posts (ya paginados por la API)
    const { posts, total } = await fetchFromApi(endpoint, page)
    const totalPages = Math.ceil(total / LIMIT)

    // 2. Validación de Estado Inválido (Finesse)
    if (page > totalPages && totalPages > 0) {
        return { data: null, totalPages, totalResults: 0, isInvalid: true }
    }

    // 3. Hidratación de Autores (Tu Hash Map Optimizado)
    const uniqueUserIds = Array.from(new Set(posts.map(p => p.userId)))
    const usersData = await Promise.all(
        uniqueUserIds.map(id => fetchUserById(id as number))
    )

    const userMap = new Map(
        usersData.map(u => [u.id, `${u.firstName} ${u.lastName}`])
    )

    // 4. Transformación al ViewModel
    const data: PostExcerptWithAuthor[] = posts.map(post => ({
        id: post.id,
        title: post.title,
        tags: post.tags,
        authorName: userMap.get(post.userId) || 'Autor desconocido'
    }))

    return {
        data,
        totalPages,
        isInvalid: false,
        totalResults: total ?? 0 //El Orquestador es el último punto de la lógica de negocio antes de la UI. Aquí es donde debemos asegurar que, pase lo que pase con la API, devolvamos un número válido.
    }
}
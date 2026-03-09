// src/components/SearchBar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface SearchBarProps {
    tags: string[]
    totalResults: number
}

export default function SearchBar({ tags = [], totalResults = 0 }: SearchBarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Sincronizamos el estado inicial con la URL
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '')

    // Función para actualizar la URL (Source of Truth)
    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams()
        if (value) params.set(name, value)
        params.set('page', '1') // Reset a página 1 siempre
        return params.toString()
    }, [])

    // Efecto para el Debounce de la búsqueda por texto
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== (searchParams.get('q') || '')) {
                router.push(`/blog?${createQueryString('q', query)}`)
                setSelectedTag('') // Limpiamos el tag visualmente
            }
        }, 400)
        return () => clearTimeout(timer)
    }, [query, router, createQueryString, searchParams])

    // Manejador del cambio de Tag (Instantáneo)
    const handleTagChange = (tag: string) => {
        setSelectedTag(tag)
        setQuery('') // Limpiamos el query visualmente
        router.push(`/blog?${createQueryString('tag', tag)}`)
    }

    return (
        <div className="w-full max-w-4xl mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">

                {/* Input de Búsqueda */}
                <div className="flex-grow w-full">
                    <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Buscar por título</label>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Escribe para buscar..."
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Selector de Tags */}
                <div className="w-full md:w-64">
                    <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Filtrar por Tag</label>
                    <select
                        value={selectedTag}
                        onChange={(e) => handleTagChange(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all capitalize text-gray-700"
                    >
                        <option value="">Todos los temas</option>
                        {tags.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* El Badge de Finesse: Indicador de resultados */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                    {query || selectedTag ? 'Resultados encontrados:' : 'Total de artículos:'}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold animate-in fade-in zoom-in duration-300">
                    {totalResults}
                </span>
                {(query || selectedTag) && (
                    <button
                        onClick={() => { setQuery(''); setSelectedTag(''); router.push('/blog') }}
                        className="text-xs text-red-500 hover:underline ml-2"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    )
}
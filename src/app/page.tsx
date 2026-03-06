import { Metadata } from "next"

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl font-bold">Página principal</h1>
            <p>Bienvenido a nuestro blog de prueba hecho con Next.js y TypeScript.</p>
        </div>

    )
}

export const metadata: Metadata = {
    title: 'Next Blog - Página principal',
    description: 'Bienvenido a nuestro blog de prueba hecho con Next.js y TypeScript.',
}
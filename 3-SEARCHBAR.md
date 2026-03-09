# Arquitectura de Búsqueda Profesional en Next.js App Router

### Tarea:

Agregar un searchbar a la página del listado de artículos. Este searchbar buscará por dos criterios: 1. buscar por título y 2. buscar por un tag.

El endpoint "https://dummyjson.com/posts/tag-list" devuelve una lista de los tags posibles, de los cuáles el usuario podrá elegir solamente uno para realizar la búsqueda a través de este otro endpoint: 'https://dummyjson.com/posts/tag/[tag name]' donde tag name es uno de los elementos del listado de tags.

La otra función de búsqueda será por palabra o palabras clave. Este es el endpoint: 'https://dummyjson.com/posts/search?q=[word]' donde word es la palabra o palabras que deseamos buscar.

## Recomendación de nivel profesional:

La URL debe ser la única "Fuente de Verdad" (Source of Truth). En el ecosistema de Next.js App Router, usar el estado local (useState) para búsquedas que afectan al listado principal es un error de principiante; rompe el SEO, impide compartir búsquedas mediante enlaces y deshabilita la potencia de la caché del servidor.

## Plan de acción - Consideraciones base

### El Dilema del Estado: Cliente vs. Servidor

**Arquitectura recomendada: Híbrida.**

* `SearchBar` (Client Component): Necesitamos que sea un Client Component para capturar eventos de teclado (`onChange`), clics y para manejar la interacción inmediata del usuario.

* `BlogPage` (Server Component): Seguirá siendo el encargado de recibir los `searchParams` y pedir los datos al Orquestador.

**Modularización. `SearchBar` debe ser un componente separado para mantener la página limpia. El flujo será:**

  **a.** El usuario interactúa con `SearchBar`.

  **b.** `SearchBar` actualiza la URL (`/blog?q=hola&tag=history`).

  **c.** Next.js detecta el cambio de URL y re-renderiza la página en el servidor con los nuevos parámetros.


### El Desafío Técnico: Limitaciones de la API
Analizando la API de dummyjson, detecto un problema de "Filtros No Combinables":

No hay un endpoint que permita buscar por palabra clave Y filtrar por tag simultáneamente (/search?q=x&tag=y no existe).

__Solución: KISS (Keep It Simple, Stupid). En lugar de complicar la lógica con combinaciones, forzaremos la exclusividad: el usuario puede buscar por palabra O por tag, pero no ambos a la vez. Esto simplifica enormemente la implementación y mejora la UX al evitar el temido "No se encontraron resultados" que ocurre cuando un usuario busca "Recetas de cocina" pero tiene seleccionado el tag "Tecnología".__

### 1. El Concepto de "Radio-Search" (Comportamiento)

La regla de negocio será: El último filtro interactuado gana.

- Si el usuario escribe en el buscador, el selector de tags se resetea a "Todos".

- Si el usuario elige un tag, el input de búsqueda se vacía.

- La URL solo tendrá ?q=... o ?tag=..., nunca ambos.


### 2. Plan de Acción Detallado

**Paso 1: Servicios de Datos (Data Layer)**

Añadiremos tres funciones de bajo nivel muy sencillas:

1. `fetchPostsByQuery(q, skip)`: Llama a /posts/search?q=....

2. `fetchPostsByTag(tag, skip)`: Llama a /posts/tag/....

3. `fetchTags()`: Llama a /posts/tag-list (esto se usará para llenar el select).

**Paso 2: El Orquestador de "Rama Única" (Logic Layer)**

La función `getPaginatedPosts` se convierte en un simple distribuidor de tráfico con una estructura de decisión:

* **SI** existe tag: Llama al servicio de tags.

* **SINO SI** existe q: Llama al servicio de búsqueda por palabras.

* **SINO**: Llama al listado general (default).


**Paso 3: Componente `SearchBar` (Client Component)**

Este componente recibirá la lista de `tags` (desde el servidor) y los valores actuales de la URL (`q` y `tag`).

* **Estado Local Efímero**: Usará estados para los inputs para que la escritura sea fluida.

* **Lógica Mutua Exclusiva**:

    * Al escribir en el input (con _debounce_): Limpia el valor del select interno y empuja a la URL `?q=valor`.

    * Al cambiar el select: Limpia el input de texto y empuja a la URL `?tag=valor`.

**Paso 4: La Página de Blog (Server Component)** 

La página simplemente extrae los parámetros de la URL y los pasa al Orquestador.

```ts
const { q, tag, page } = await searchParams;
const { data, totalPages } = await getPaginatedPosts({ q, tag, page });
```


### Verificación de "Finesse" y Casos Borde

* Reseteo de Paginación: Cada vez que el usuario cambie el tag o busque una palabra, debemos forzar `page=1` en la URL. No puedes estar en la página 5 de "Todos" y pretender que exista una página 5 de "Historia".

* Estado de "Todos": El selector de tags debe tener una opción inicial llamada "Todos los tags" que simplemente elimine el parámetro `tag` de la URL para volver al listado original.

* Loading State: Como la búsqueda ahora es exclusiva, el `loading.tsx` funcionará de forma excelente, ya que solo estamos esperando una respuesta de la API a la vez.

### Ventaja Competitiva de esta Estrategia

* Performance: Al usar los endpoints nativos de la API (`/search` o `/tag`), la velocidad de respuesta es máxima. No procesamos nada en nuestro servidor.

* Claridad en la URL: El usuario ve `/blog?q=javascript` o `/blog?tag=coding`. Es limpio, legible y fácil de compartir.

* Mantenibilidad: El código se reduce al evitar lógica de filtrado manual.
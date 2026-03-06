# Caché en Next.js
## Estrategias de Caché para Datos con Diferente Frecuencia de Actualización

La Eficiencia de Caché en Next.js con el App Router es un superpoder porque te permite definir estrategias de frescura de datos distintas para cada origen, incluso si terminan mezcladas en el mismo componente.

En nuestro caso, tenemos dos tipos de datos con naturalezas muy diferentes:

1. Posts: Cambian con frecuencia (se publican nuevos, suben las vistas).

2. Autores: Cambian casi nunca (el nombre y apellido de un usuario es estático por meses o años).


**Ejemplo Concreto de Configuración**

Podemos modificar nuestras funciones de servicio para que se comporten de forma inteligente:

```ts
// Los posts se revalidan cada hora (3600 segundos)
async function fetchPosts() {
  const res = await fetch('https://dummyjson.com/posts?...', { 
    next: { revalidate: 3600, tags: ['posts'] } 
  });
  return res.json();
}

// Los autores son "inmortales" (se cachean de forma persistente)
async function fetchUserById(id) {
  const res = await fetch(`https://dummyjson.com/users/${id}`, { 
    cache: 'force-cache' 
  });
  return res.json();
}
```

### ¿Qué ganamos con esto? (El escenario real)

Imaginate que un usuario visita la página a las 10:00 AM. Next.js guarda ambos en caché.

A las 10:30 AM: Otro usuario entra. Next.js no hace ninguna petición a la API externa. Sirve todo desde su caché interna (velocidad instantánea).

A las 11:05 AM (Pasó la hora de los posts): Un tercer usuario entra.

Next.js detecta que los Posts han expirado: hace el fetch a dummyjson.com/posts.

Next.js detecta que los Autores siguen siendo válidos (force-cache): NO hace las 10 peticiones de usuarios. Recupera los nombres del autor instantáneamente de su memoria local.

Resultado: Te ahorraste 10 llamadas de red costosas y solo refrescaste lo que realmente cambia.

La ventaja "Categoría Elite": On-demand Revalidation

Si un autor cambia su apellido, no tenemos que esperar. Podemos usar una `Server Action` para limpiar solo la caché de ese usuario específico sin afectar la caché global de los posts:

```ts
// Esto limpiaría solo los datos marcados con la etiqueta 'authors'
revalidateTag('authors'); 
```

### Resumen de beneficios:

+ Ahorro de costos: Menos llamadas a APIs externas (especialmente útil si pagas por uso).

+ Resiliencia: Si la API de usuarios se cae temporalmente, tu página sigue funcionando porque los nombres de los autores están en la caché de Next.js.

+ Performance: El tiempo de respuesta (TTFB - Time To First Byte) es bajísimo porque el servidor "arma" el rompecabezas con piezas que ya tiene en mano.
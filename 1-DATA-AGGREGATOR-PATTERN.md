# SOLUCIÓN PARA EL PROBLEMA DE LOS POSTS CON AUTORES

Nuestro enfoque para este caso es la encapsulación por dominio, pero consolidada en una única función orquestadora de alto nivel.

Si dividimos esto en demasiadas funciones pequeñas que se pasan datos unas a otras, dispersamos la lógica de negocio y hacemos el código más difícil de seguir. El patrón ideal aquí es el Data Aggregator Pattern (Patrón de Agregador de Datos).

Utilizamos dos funciones de servicio (bajo nivel) y una función de orquestación (alto nivel). 

### ESTRUCTURA

1. Las Funciones de Servicio (Capa de Datos)
   
Creamos dos funciones puras encargadas exclusivamente de hablar con la API:

`getPosts()`: Trae los posts.

`getUsersByIds(ids)`: Recibe el array de IDs únicos y retorna las promesas de los usuarios.

Nota: No hacemos una función para "un solo usuario", sino una que gestione la lógica de traer N usuarios en paralelo, ya que es el requerimiento de nuestra vista.


2. La Función Orquestadora (Capa de Dominio)
   
`getPostsWithAuthors(). Esta es la función "maestra" que invocarás desde tu componente de Next.js. Su trabajo es:`

- Llamar a `getPosts()`.

- Extraer los IDs únicos (el Set que mencionamos).

- Llamar a `getUsersByIds(ids)`.

- Transformar los datos (el "join" o cruce de información).

- Retornar el objeto final listo para el consumo del componente.


### ¿Por qué este patrón es mejor?

a. Single Source of Truth: El componente  no tiene que saber que los datos vienen de dos lugares distintos. Solo pide "Posts con Autores" y recibe un modelo limpio.

b. Mantenibilidad: Si mañana la API de dummyjson cambia y el autor viene dentro del post, solo modificas la lógica interna de la función orquestadora; el componente de UI no sufre cambios.

c. Eficiencia de Caché: En Next.js se pueden aplicar etiquetas de _revalidate_ de forma independiente a cada fetch dentro de sus funciones de servicio, optimizando el rendimiento de forma granular.
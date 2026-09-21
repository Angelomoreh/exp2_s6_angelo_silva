# NextLevel Games - Semana 6

Proyecto realizado para la actividad sumativa de la semana 6 de Desarrollo Frontend I.

La idea fue continuar con la tienda de videojuegos que había trabajado anteriormente y agregarle las cosas nuevas vistas durante estas semanas, principalmente Bootstrap 5 y JavaScript.

## ¿Qué tiene el proyecto?

La página corresponde a una tienda de videojuegos llamada NextLevel Games.

En esta versión se agregó:

- Diseño responsivo utilizando Bootstrap 5.
- Barra de navegación adaptable a celulares.
- Catálogo de videojuegos.
- Productos cargados desde un archivo JSON.
- Uso de Fetch API para obtener los productos.
- Buscador por nombre o categoría.
- Carrito de compras.
- Actualización automática de cantidades y total.
- Manipulación del DOM con JavaScript.
- Eventos click y submit.
- Manejo de errores en caso de que no se pueda cargar el archivo JSON.

## Estructura del proyecto

El proyecto está organizado de la siguiente manera:

- index.html
- assets/css/styles.css
- assets/js/app.js
- assets/data/productos.json
- assets/img/
- capturas/

En la carpeta de capturas dejé evidencias de las principales funciones del sitio.

## Cómo ejecutar el proyecto

Para probarlo utilicé Visual Studio Code con la extensión Live Server.

Se debe abrir el archivo index.html con Live Server, ya que los productos se cargan desde un archivo JSON utilizando Fetch API.

Si se abre solamente haciendo doble clic en el HTML, dependiendo del navegador puede existir un problema con la carga del archivo JSON.

## Pruebas realizadas

Durante las pruebas revisé lo siguiente:

- Carga de los productos desde productos.json.
- Búsqueda de productos por nombre.
- Búsqueda por categoría.
- Agregar productos al carrito.
- Agregar más de una unidad del mismo producto.
- Cálculo del total del carrito.
- Vaciar el carrito.
- Visualización en tamaño móvil.
- Funcionamiento del menú hamburguesa.
- Manejo de error de Fetch cuando el archivo JSON no existe.

También se probó la página en una resolución móvil de aproximadamente 390 px para revisar la responsividad.

## Tecnologías utilizadas

- HTML
- CSS
- Bootstrap 5
- JavaScript
- JSON
- Fetch API

## Autor

Angelo Silva  
Desarrollo Frontend I - PFY2201
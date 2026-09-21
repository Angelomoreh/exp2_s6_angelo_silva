// Datos principales de la aplicación.
let productos = [];
let carrito = [];

const listaProductos = document.querySelector('#lista-productos');
const mensajeError = document.querySelector('#mensaje-error');
const mensajeVacio = document.querySelector('#mensaje-vacio');
const formularioBusqueda = document.querySelector('#form-busqueda');
const inputBusqueda = document.querySelector('#busqueda');
const estadoFiltro = document.querySelector('#estado-filtro');
const carritoContenido = document.querySelector('#carrito-contenido');
const totalCarrito = document.querySelector('#total-carrito');
const contadorCarrito = document.querySelector('#contador-carrito');
const botonVaciar = document.querySelector('#vaciar-carrito');

// Inicia el sitio y carga el catálogo desde un archivo JSON local mediante Fetch API.
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  configurarEventos();
});

// Obtiene los productos. El bloque catch muestra un mensaje amigable si ocurre un error.
async function cargarProductos() {
  mostrarEstadoCarga();

  try {
    const respuesta = await fetch('assets/data/productos.json');

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    productos = await respuesta.json();
    ocultarError();
    renderizarProductos(productos);
  } catch (error) {
    console.error('No fue posible cargar los productos:', error);
    listaProductos.innerHTML = '';
    mensajeError.textContent = 'No fue posible cargar los productos. Revisa la conexión o intenta nuevamente.';
    mensajeError.classList.remove('d-none');
    estadoFiltro.textContent = 'Error al cargar el catálogo.';
  }
}

// Centraliza los eventos click y submit solicitados en la actividad.
function configurarEventos() {
  // Evento submit: procesa el formulario de búsqueda.
  formularioBusqueda.addEventListener('submit', (evento) => {
    evento.preventDefault();
    filtrarPorBusqueda(inputBusqueda.value);
  });

  // Evento click usando delegación: agrega productos al carrito.
  listaProductos.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-agregar');
    if (!boton) return;

    agregarAlCarrito(Number(boton.dataset.id));
  });

  // Filtros de categorías/plataformas desde la navbar.
  document.querySelectorAll('.filtro-categoria').forEach((boton) => {
    boton.addEventListener('click', () => {
      filtrarPorCategoria(boton.dataset.categoria);
    });
  });

  botonVaciar.addEventListener('click', vaciarCarrito);
}

// Crea las tarjetas Bootstrap dinámicamente mediante manipulación del DOM.
function renderizarProductos(lista) {
  listaProductos.innerHTML = '';
  mensajeVacio.classList.toggle('d-none', lista.length !== 0);

  lista.forEach((producto) => {
    const columna = document.createElement('div');
    columna.className = 'col-12 col-md-6 col-lg-4';

    const tarjeta = document.createElement('article');
    tarjeta.className = 'card producto-card';

    const imagen = document.createElement('img');
    imagen.className = 'card-img-top';
    imagen.src = producto.imagen;
    imagen.alt = `Imagen referencial de ${producto.nombre}`;
    imagen.loading = 'lazy';

    const cuerpo = document.createElement('div');
    cuerpo.className = 'card-body p-4';

    const plataforma = document.createElement('span');
    plataforma.className = 'badge text-bg-primary align-self-start mb-2';
    plataforma.textContent = producto.plataforma;

    const titulo = document.createElement('h3');
    titulo.className = 'h5 card-title fw-bold';
    titulo.textContent = producto.nombre;

    const categoria = document.createElement('p');
    categoria.className = 'small text-uppercase fw-bold text-secondary mb-2';
    categoria.textContent = producto.categoria;

    const descripcion = document.createElement('p');
    descripcion.className = 'descripcion';
    descripcion.textContent = producto.descripcion;

    const pie = document.createElement('div');
    pie.className = 'd-flex justify-content-between align-items-center gap-3 mt-3';

    const precio = document.createElement('strong');
    precio.className = 'precio-producto';
    precio.textContent = formatearPrecio(producto.precio);

    const boton = document.createElement('button');
    boton.className = 'btn btn-primary btn-agregar';
    boton.type = 'button';
    boton.dataset.id = producto.id;
    boton.textContent = 'Agregar al carrito';

    pie.append(precio, boton);
    cuerpo.append(plataforma, titulo, categoria, descripcion, pie);
    tarjeta.append(imagen, cuerpo);
    columna.appendChild(tarjeta);
    listaProductos.appendChild(columna);
  });
}

// Filtra el array de productos según el texto ingresado en el formulario.
function filtrarPorBusqueda(texto) {
  const termino = texto.trim().toLowerCase();

  if (!termino) {
    renderizarProductos(productos);
    estadoFiltro.textContent = 'Mostrando todos los productos.';
    return;
  }

  const resultados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(termino) ||
    producto.categoria.toLowerCase().includes(termino) ||
    producto.plataforma.toLowerCase().includes(termino)
  );

  renderizarProductos(resultados);
  estadoFiltro.textContent = `Resultados para: “${texto.trim()}”.`;
}

// Filtra el catálogo usando las categorías/plataformas simuladas de la barra de navegación.
function filtrarPorCategoria(categoria) {
  const resultados = productos.filter((producto) => producto.plataforma === categoria);
  inputBusqueda.value = '';
  renderizarProductos(resultados);
  estadoFiltro.textContent = `Categoría seleccionada: ${categoria}.`;
  document.querySelector('#productos').scrollIntoView({ behavior: 'smooth' });
}

// Agrega un producto o aumenta su cantidad cuando ya se encuentra en el carrito.
function agregarAlCarrito(idProducto) {
  const producto = productos.find((item) => item.id === idProducto);
  if (!producto) return;

  const existente = carrito.find((item) => item.id === idProducto);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  renderizarCarrito();
  mostrarNotificacion(`${producto.nombre} fue agregado al carrito.`);
}

// Actualiza el resumen, contador y total del carrito modificando el DOM.
function renderizarCarrito() {
  carritoContenido.innerHTML = '';

  if (carrito.length === 0) {
    const cuerpo = document.createElement('div');
    cuerpo.className = 'card-body';
    cuerpo.innerHTML = '<p class="text-secondary mb-0">El carrito está vacío.</p>';
    carritoContenido.appendChild(cuerpo);
    totalCarrito.textContent = '$0';
    contadorCarrito.textContent = '0';
    botonVaciar.disabled = true;
    return;
  }

  const cuerpo = document.createElement('div');
  cuerpo.className = 'card-body p-0';

  carrito.forEach((item) => {
    const fila = document.createElement('div');
    fila.className = 'item-carrito d-flex justify-content-between align-items-center gap-3 p-3';

    const informacion = document.createElement('div');
    const nombre = document.createElement('h3');
    nombre.className = 'h6 fw-bold mb-1';
    nombre.textContent = item.nombre;

    const detalle = document.createElement('p');
    detalle.className = 'small text-secondary mb-0';
    detalle.textContent = `${item.cantidad} x ${formatearPrecio(item.precio)}`;

    const subtotal = document.createElement('strong');
    subtotal.textContent = formatearPrecio(item.precio * item.cantidad);

    informacion.append(nombre, detalle);
    fila.append(informacion, subtotal);
    cuerpo.appendChild(fila);
  });

  carritoContenido.appendChild(cuerpo);

  const cantidadTotal = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  const montoTotal = carrito.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);

  contadorCarrito.textContent = cantidadTotal;
  totalCarrito.textContent = formatearPrecio(montoTotal);
  botonVaciar.disabled = false;
}

// Deja nuevamente el carrito en su estado inicial.
function vaciarCarrito() {
  carrito = [];
  renderizarCarrito();
  mostrarNotificacion('El carrito fue vaciado.');
}

// Utilidad para mostrar valores en pesos chilenos.
function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(valor);
}

// Informa visualmente que la carga de productos está en proceso.
function mostrarEstadoCarga() {
  listaProductos.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando productos...</span>
      </div>
      <p class="text-secondary mt-3 mb-0">Cargando productos desde el archivo JSON...</p>
    </div>`;
}

function ocultarError() {
  mensajeError.classList.add('d-none');
  mensajeError.textContent = '';
}

// Muestra un aviso temporal utilizando el componente Toast de Bootstrap.
function mostrarNotificacion(texto) {
  const idToast = `toast-${Date.now()}`;
  const contenedor = document.querySelector('#notificacion');
  const elemento = document.createElement('div');

  elemento.id = idToast;
  elemento.className = 'toast align-items-center text-bg-dark border-0';
  elemento.setAttribute('role', 'status');
  elemento.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${texto}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>`;

  contenedor.appendChild(elemento);
  const toast = new bootstrap.Toast(elemento, { delay: 2200 });
  toast.show();
  elemento.addEventListener('hidden.bs.toast', () => elemento.remove());
}

// Datos de productos
const productos = [
  {
    id: 1,
    nombre: "Camiseta Oficial Local",
    precio: 55000,
    categoria: "camisetas",
    imagen: '/imagenes/Camiseta_jcs.jpg' ,
    descripcion: "Camiseta oficial del Jockey Club de Salta, diseño local con colores tradicionales rojo y blanco.",
  },
  {
    id: 2,
    nombre: "Short de Entrenamiento",
    precio: 28500,
    categoria: "shorts",
    imagen: "/imagenes/short_jcs.jpg",
    descripcion: "Short de entrenamiento profesional, ideal para prácticas y entrenamientos intensivos.",
  },
  {
    id: 3,
    nombre: "Gorra Oficial",
    precio: 35500,
    categoria: "accesorios",
    imagen: "/imagenes/gorra_jcs.jpg",
    descripcion: "Gorra oficial del club con bordado del escudo y colores institucionales.",
  },
  {
    id: 4,
    nombre: "Campera Rompeviento",
    precio: 115000,
    categoria: "campera",
    imagen: "/imagenes/campera_jcs.jpg",
    descripcion: "Campera original en colores rojo y blanco.",
  },
  {
    id: 5,
    nombre: "Botines de Rugby",
    precio: 235000,
    categoria: "calzado",
    imagen: "/imagenes/botines_jcs.jpg",
    descripcion: "Botines profesionales de rugby con tapones intercambiables y máximo agarre.",
  },
  {
    id: 6,
    nombre: "Medias Oficiales",
    precio: 12500,
    categoria: "accesorios",
    imagen: "/imagenes/medias_jcs.png",
    descripcion: "Medias oficiales del club, cómodas y resistentes para entrenamientos y partidos.",
  },
]

// Carrito de compras
let carrito = []

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Cargar carrito desde localStorage
  const carritoGuardado = localStorage.getItem("carrito")
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado)
  }

  // Configurar navegación móvil
  setupMobileNav()

  // Renderizar productos según la página
  if (document.getElementById("productos-destacados")) {
    renderProductosDestacados()
  }

  if (document.getElementById("all-products")) {
    renderAllProducts()
  }

  // Actualizar contador del carrito
  updateCartCount()
})



function setupMobileNav() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenuBtn && navMenu) {
    // Evento click para el botón hamburguesa
    mobileMenuBtn.addEventListener("click", function() {
      navMenu.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
      
      // Agrega esto para depuración
      console.log("Menú toggle:", navMenu.classList.contains("active"));
    });
    
    // Cerrar menú al hacer click en un enlace
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", function() {
        navMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      });
    });
  }

  // Scroll suave para navegación
  document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      // Si es un enlace interno en la misma página
      if (href.startsWith("#")) {
        e.preventDefault()
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }

        // Cerrar menú móvil si está abierto
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          mobileMenuBtn.classList.remove("active")
        }
      }
    })
  })

  // Formulario de contacto
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }
}

// Renderizar productos destacados en la página principal
function renderProductosDestacados() {
  const container = document.getElementById("productos-destacados")
  if (!container) return

  // Mostrar solo los primeros 3 productos
  const productosDestacados = productos.slice(0, 3)

  container.innerHTML = productosDestacados
    .map(
      (producto) => `
        <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="producto-precio">$${producto.precio.toLocaleString()}</div>
                <div class="producto-actions">
                    <button class="btn-primary" onclick="addToCart(${producto.id})">
                        Agregar al Carrito
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M5.4 5L7 13m0 0l-2.5 5M7 13h10"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Renderizar todos los productos en la página de productos
function renderAllProducts() {
  const container = document.getElementById("all-products")
  if (!container) return

  container.innerHTML = productos
    .map(
      (producto) => `
        <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="producto-precio">$${producto.precio.toLocaleString()}</div>
                <div class="producto-actions">
                    <button class="btn-primary" onclick="addToCart(${producto.id})">
                        Agregar al Carrito
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M5.4 5L7 13m0 0l-2.5 5M7 13h10"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Funciones del carrito
function addToCart(productId) {
  const producto = productos.find((p) => p.id === productId)
  if (!producto) {
    console.error("Producto no encontrado:", productId)
    return
  }

  const existingItem = carrito.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.cantidad += 1
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    })
  }

  // Guardar en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito))

  // Actualizar contador
  updateCartCount()

  // Mostrar notificación
  showNotification(`${producto.nombre} agregado al carrito`)

  console.log("Carrito actualizado:", carrito)
}

function removeFromCart(productId) {
  carrito = carrito.filter((item) => item.id !== productId)
  localStorage.setItem("carrito", JSON.stringify(carrito))
  updateCartCount()
  renderCartItems()
}

function updateCartQuantity(productId, newQuantity) {
  const item = carrito.find((item) => item.id === productId)
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      item.cantidad = newQuantity
      localStorage.setItem("carrito", JSON.stringify(carrito))
      updateCartCount()
      renderCartItems()
    }
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
    cartCount.textContent = totalItems
  }
}

function openCartModal() {
  const modal = document.getElementById("cart-modal")
  if (modal) {
    modal.classList.remove("hidden")
    renderCartItems()

    // Prevenir scroll del body
    document.body.style.overflow = "hidden"
  }
}

function closeCartModal() {
  const modal = document.getElementById("cart-modal")
  if (modal) {
    modal.classList.add("hidden")

    // Restaurar scroll
    document.body.style.overflow = ""
  }
}

function renderCartItems() {
  const container = document.getElementById("cart-items")
  const totalElement = document.getElementById("cart-total")

  if (!container || !totalElement) return

  if (carrito.length === 0) {
    container.innerHTML = `
            <div class="empty-cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="48" height="48">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                <p>Tu carrito está vacío</p>
                <button class="btn-secondary" onclick="closeCartModal()">Seguir Comprando</button>
            </div>
        `
    totalElement.textContent = "0"
    return
  }

  container.innerHTML = carrito
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div>
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toLocaleString()} x ${item.cantidad}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.cantidad - 1})">-</button>
                <span>${item.cantidad}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.cantidad + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        </div>
    `,
    )
    .join("")

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  totalElement.textContent = total.toLocaleString()
}

function checkout() {
  if (carrito.length === 0) {
    showNotification("Tu carrito está vacío")
    return
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  alert(
    `¡Gracias por tu compra!\n\nTotal: $${total.toLocaleString()}\n\nEn breve nos contactaremos contigo para coordinar el pago y la entrega.`,
  )

  // Limpiar carrito
  carrito = []
  localStorage.setItem("carrito", JSON.stringify(carrito))
  updateCartCount()
  closeCartModal()
}

// Funciones de utilidad
function handleContactForm(e) {
  e.preventDefault()

  const nombre = document.getElementById("nombre").value
  const email = document.getElementById("email").value

  // Simular envío del formulario
  alert(
    `¡Gracias ${nombre}!\n\nTu mensaje ha sido enviado exitosamente. Nos contactaremos contigo a ${email} en las próximas 24 horas.`,
  )

  // Limpiar formulario
  e.target.reset()
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

function showNotification(message) {
  // Crear notificación
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.innerHTML = `
        <div class="notification-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>${message}</span>
        </div>
    `

  document.body.appendChild(notification)

  // Animar entrada
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

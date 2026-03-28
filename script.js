document.addEventListener("DOMContentLoaded", () => {

  let carrito = [];

  // 🔹 NAVEGACIÓN
  function mostrarHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("contacto").style.display = "none";
  }

  function mostrarContacto() {
    document.getElementById("home").style.display = "none";
    document.getElementById("contacto").style.display = "block";
  }

  // 🔹 BUSCADOR
  function buscarProducto() {
    let texto = document.getElementById("buscador").value.toLowerCase();
    let productosHTML = document.getElementsByClassName("producto");

    for (let i = 0; i < productosHTML.length; i++) {
      let nombre = productosHTML[i].querySelector("h3").textContent.toLowerCase();
      productosHTML[i].style.display =
        nombre.includes(texto) ? "block" : "none";
    }
  }

  // 🔹 ENVÍO
  function toggleEnvio() {
    let tipo = document.getElementById("envio").value;

    let retiro = document.getElementById("datos-retiro");
    let envio = document.getElementById("datos-envio");

    if (tipo === "domicilio") {
      envio.style.display = "block";
      retiro.style.display = "none";
    } else {
      envio.style.display = "none";
      retiro.style.display = "block";
    }
  }

  // 🔹 PRODUCTOS
  let productos = [
    {id: 1, nombre: "Auri con Cable", imagen: "img/auricular.png", precio: 99990},
    {id: 2, nombre: "Labial", imagen: "img/labial.png", precio: 130000},
    {id: 3, nombre: "Mouse", imagen: "img/mouse.png", precio: 70000},
    {id: 4, nombre: "Teclado", imagen: "img/teclado.png", precio: 120000},
    {id: 5, nombre: "Cargador", imagen: "img/cargador.png", precio: 40000},
    {id: 6, nombre: "Cable USB", imagen: "img/cable.png", precio: 20000},
    {id: 7, nombre: "Parlante", imagen: "img/parlante.png", precio: 150000},
    {id: 8, nombre: "Smartwatch", imagen: "img/reloj.png", precio: 250000},
    {id: 9, nombre: "Powerbank", imagen: "img/powerbank.png", precio: 100000},
    {id: 10, nombre: "Funda", imagen: "img/funda.png", precio: 35000}
  ];

  let talles = ["XS","S","M","L","XL"];
  let colores = ["Rojo","Azul","Negro","Blanco"];

  let contenedor = document.getElementById("productos");

  productos.forEach(p => {

    let opcionesTalle = talles.map(t => `<option>${t}</option>`).join("");
    let opcionesColor = colores.map(c => `<option>${c}</option>`).join("");

    let div = document.createElement("div");
    div.className = "producto";

    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>💰 $${p.precio.toLocaleString()}</p>

      <img id="img-${p.id}" src="${p.imagen}" width="120"><br><br>

      <label>Cantidad:</label>
      <input type="number" id="cantidad-${p.id}" value="1" min="1"><br><br>

      <label>Talle:</label>
      <select id="talle-${p.id}" onchange="cambiarImagen(${p.id})">
        ${opcionesTalle}
      </select><br><br>

      <label>Color:</label>
      <select id="color-${p.id}" onchange="cambiarImagen(${p.id})">
        ${opcionesColor}
      </select><br><br>

      <button onclick="agregar(${p.id})">Agregar</button>
    `;

    contenedor.appendChild(div);
  });

  // 🔹 CAMBIAR IMAGEN SEGÚN TALLE/COLOR
  window.cambiarImagen = function(id) {
    let talle = document.getElementById(`talle-${id}`).value;
    let color = document.getElementById(`color-${id}`).value;

    let img = document.getElementById(`img-${id}`);

    let ruta = `img/${id}-${talle}-${color}.png`;

    img.src = ruta;

    img.onerror = () => {
      img.src = "img/no-disponible.png";
    };
  };

  // 🔹 AGREGAR AL CARRITO
  window.agregar = function(id) {

    let img = document.getElementById(`img-${id}`).src;

    if (img.includes("no-disponible.png")) {
      alert("❌ No disponible en ese talle/color");
      return;
    }

    let producto = productos.find(p => p.id === id);

    let talle = document.getElementById(`talle-${id}`).value;
    let color = document.getElementById(`color-${id}`).value;
    let cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);

    carrito.push({
      producto: producto.nombre,
      talle,
      color,
      cantidad,
      precio: producto.precio
    });

    actualizarCarrito();
  };

  // 🔹 CARRITO
  function actualizarCarrito() {
    let lista = document.getElementById("carrito");
    lista.innerHTML = "";

    let total = 0;

    carrito.forEach((item, index) => {
      let subtotal = item.precio * item.cantidad;
      total += subtotal;

      let li = document.createElement("li");
      li.innerHTML = `
        ${item.producto} | ${item.talle} | ${item.color} | x${item.cantidad} | $${subtotal}
        <button onclick="eliminar(${index})">❌</button>
      `;

      lista.appendChild(li);
    });

    let totalHTML = document.createElement("h3");
    totalHTML.textContent = "Total: $" + total.toLocaleString();
    lista.appendChild(totalHTML);
  }

  // 🔹 ELIMINAR
  window.eliminar = function(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
  };

  // 🔹 COMPRAR
window.comprar = function() {

  let tipo = document.getElementById("envio").value;

  if (carrito.length === 0) {
    alert("Carrito vacío");
    return;
  }

  let mensaje = "🛒 *Nuevo Pedido*%0A%0A";

  // 🏪 RETIRO
  if (tipo === "retiro") {

    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let dni = document.getElementById("dni").value;
    let telefono = document.getElementById("telefono").value;
    let email = document.getElementById("email").value;

    if (!nombre || !apellido || !dni || !telefono || !email) {
      alert("Completá todos los datos");
      return;
    }

    mensaje += "🏪 Retiro en persona%0A%0A";
    mensaje += `👤 ${nombre} ${apellido}%0A`;
    mensaje += `🪪 DNI: ${dni}%0A`;
    mensaje += `📞 ${telefono}%0A`;
    mensaje += `📧 ${email}%0A%0A`;
  }

  // 🚚 ENVÍO
  else {

    let nombre = document.getElementById("nombreEnvio").value;
    let apellido = document.getElementById("apellidoEnvio").value;
    let direccion = document.getElementById("direccion").value;
    let ciudad = document.getElementById("ciudad").value;
    let provincia = document.getElementById("provincia").value;
    let pais = document.getElementById("pais").value;
    let codigoPostal = document.getElementById("codigoPostal").value;
    let telefono = document.getElementById("telefonoEnvio").value;

    if (!nombre || !apellido || !direccion || !ciudad || !provincia || !pais || !codigoPostal || !telefono) {
      alert("Completá todos los datos");
      return;
    }

    mensaje += "🚚 Envío a domicilio%0A%0A";
    mensaje += `👤 ${nombre} ${apellido}%0A`;
    mensaje += `📍 ${direccion}%0A`;
    mensaje += `🏙 ${ciudad}%0A`;
    mensaje += `🌎 ${provincia} - ${pais}%0A`;
    mensaje += `📮 CP: ${codigoPostal}%0A`;
    mensaje += `📞 ${telefono}%0A%0A`;
  }

  // 🛒 PRODUCTOS
  mensaje += "*Productos:*%0A";

  let total = 0;

  carrito.forEach(item => {
    let subtotal = item.precio * item.cantidad;
    total += subtotal;

    mensaje += `- ${item.producto} | ${item.talle} | ${item.color} | x${item.cantidad} | $${subtotal}%0A`;
  });

  mensaje += `%0A💰 Total: $${total}`;

  let numero = "5493492244105";
  let url = `https://wa.me/${numero}?text=${mensaje}`;

  window.open(url, "_blank");

  carrito = [];
  actualizarCarrito();
};

  // 🔹 EXPORTAR
  window.mostrarHome = mostrarHome;
  window.mostrarContacto = mostrarContacto;
  window.buscarProducto = buscarProducto;
  window.toggleEnvio = toggleEnvio;

  toggleEnvio();
});
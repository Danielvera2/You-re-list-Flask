function entrar() {
  const usu = document.getElementById("usuarioPrincipal").value,
    pass = document.getElementById("passPrincipal").value;

  usu === "admin" && pass === "1234"
    ? (window.location.href = "/static/web/html/index.html")
    : alert("Datos erroneos");
}

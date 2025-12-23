/**
 * header-updater.js - Actualiza el header en todas las páginas según el estado de sesión
 */

// 1. Lógica de Logout Centralizada
function performLogout() {
    console.log('Intentando cerrar sesión...');
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Intentar usar la función clearSession si existe, sino hacerlo manualmente
        if (typeof clearSession === 'function') {
            clearSession();
        } else {
            localStorage.removeItem('skylauncher_session');
        }
        console.log('Sesión cerrada, redirigiendo...');
        window.location.href = 'index.html';
    }
}

// 2. Delegación de Eventos Global (Funciona siempre, incluso con elementos dinámicos)
document.addEventListener('click', function (event) {
    // Verificar si el elemento clickeado (o uno de sus padres) tiene la clase 'logout-trigger'
    const logoutBtn = event.target.closest('.logout-trigger');

    if (logoutBtn) {
        event.preventDefault(); // Evitar navegación
        performLogout();
    }
});

// 3. Actualización del Header
function updateHeaderUserBox() {
    const session = getSession();
    const userbox = document.getElementById('userbox');

    if (!userbox) return;

    if (session && session.username) {
        // Usuario está logueado
        // Usamos la clase 'logout-trigger' para que el listener global lo detecte
        userbox.innerHTML = `
            <span class="logged-in" style="display: flex; align-items: center; gap: 10px;">
                <img src="images/cube.png" alt="User" style="width: 24px; height: 24px; vertical-align: middle;">
                <a href="Dashboard.html" style="font-weight: bold; color: #5f9f35;">${session.username}</a>
                <span style="color: #666;">|</span>
                <a href="#" class="logout-trigger" style="color: #aaa; cursor: pointer;">Cerrar Sesión</a>
            </span>
        `;
    } else {
        // Usuario no está logueado
        userbox.innerHTML = `
            <span class="logged-out">
                <a href="Login.html">Iniciar Sesión</a> | 
                <a href="Register.html">Registrarse</a>
            </span>
        `;
    }
}

// Inicializar al cargar
window.addEventListener('load', updateHeaderUserBox);

// Exponer globalmente por si acaso se necesita llamar manualmente
window.performLogout = performLogout;

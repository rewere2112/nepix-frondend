/**
 * login.js - Inicio de Sesión de Usuario
 */

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Validar
    if (!username || !password) {
        showMessage('message', 'Ingresa usuario y contraseña', 'error');
        return;
    }

    // Verificar API
    showMessage('message', 'Conectando...', 'success');
    if (!await checkAPIHealth()) {
        showMessage('message', 'Error: Servidor API no disponible. Verifica tu conexión.', 'error');
        return;
    }

    // Iniciar Sesión
    const result = await loginUserAPI(username, password);

    if (result.success) {
        showMessage('message', '¡Inicio de sesión exitoso! Redirigiendo al dashboard...', 'success');
        saveSession(result.user);
        setTimeout(() => window.location.href = 'Dashboard.html', 1500);
    } else {
        showMessage('message', result.message || 'Error al iniciar sesión', 'error');
    }
});

// Limpiar mensajes al escribir
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        hideMessage('message');
    });
});

// Cargar usuario guardado si existe sesión previa (opcional, para pre-llenar)
window.addEventListener('load', function () {
    const session = getSession();
    if (session && session.username) {
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.value = session.username;
        }
    }
});

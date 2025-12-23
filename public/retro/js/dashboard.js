/**
 * dashboard.js - Lógica del Dashboard de Usuario
 */

// Verificar sesión al cargar
window.addEventListener('load', async function () {
    const session = getSession();

    if (!session) {
        // No hay sesión, redirigir al login
        showError('No has iniciado sesión. Redirigiendo...');
        setTimeout(() => window.location.href = 'Login.html', 2000);
        return;
    }

    // Cargar información del usuario
    await loadUserData(session);
});

async function loadUserData(session) {
    try {
        // Verificar que la API esté disponible
        if (!await checkAPIHealth()) {
            showError('No se pudo conectar con el servidor. Mostrando información de sesión local...');
            loadLocalSessionData(session);
            return;
        }

        // Intentar obtener datos actualizados del usuario desde la API
        // Por ahora, usamos los datos de la sesión local
        loadLocalSessionData(session);

    } catch (error) {
        showError('Error al cargar los datos del usuario: ' + error.message);
        loadLocalSessionData(session);
    }
}

function loadLocalSessionData(session) {
    // Ocultar spinner de carga
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';

    // Mostrar información básica de la sesión
    document.getElementById('displayUsername').textContent = session.username;
    document.getElementById('accountUsername').textContent = session.username;
    document.getElementById('accountId').textContent = session.id || 'N/A';

    // Calcular tiempo de sesión
    const sessionTime = new Date(session.timestamp);
    document.getElementById('accountLastLogin').textContent = formatDate(sessionTime.toISOString());

    // Calcular edad de la cuenta (simplificado)
    const accountAge = calculateAccountAge(sessionTime);
    document.getElementById('statsAccountAge').textContent = accountAge;

    // Placeholder para estadísticas
    document.getElementById('statsLogins').textContent = 'N/A';
}

function calculateAccountAge(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return 'Hoy';
    } else if (days === 1) {
        return '1 día';
    } else if (days < 30) {
        return `${days} días`;
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        return months === 1 ? '1 mes' : `${months} meses`;
    } else {
        const years = Math.floor(days / 365);
        return years === 1 ? '1 año' : `${years} años`;
    }
}

function showError(message) {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
}

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar sesión
        if (typeof clearSession === 'function') {
            clearSession();
        } else {
            localStorage.removeItem('skylauncher_session');
        }
        window.location.href = 'index.html';
    }
}

// Hacer logout global también
window.logout = logout;


function downloadLauncher() {
    // Redirigir a la página de descargas
    window.location.href = 'https://youtu.be/dQw4w9WgXcQ?si=1DLTStpLlrPF8jZA';
}

/**
 * auth-utils.js
 * Utilidades de autenticación
 */

// Configuración de API
// Usamos la API de Render tanto para desarrollo local como producción
const API_URL = 'https://nepix-api.onrender.com/api';

/* 
// Configuración alternativa para desarrollo con backend local:
const API_URL = window.location.hostname === 'localhost' || window.location.protocol === 'file:'
    ? 'http://localhost:5000/api'
    : 'https://nepix-api.onrender.com/api';
*/

// Funciones API
async function registerUserAPI(username, password, email = '') {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
}

async function loginUserAPI(username, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: `Error de conexión: ${error.message}` };
    }
}

async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Ayudantes de UI
function showMessage(elementId, text, type) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
}

function hideMessage(elementId) {
    const messageDiv = document.getElementById(elementId);
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
}

// Validación
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePasswordStrength(password) {
    if (password.length < 8) {
        return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Debe contener una letra mayúscula' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Debe contener una letra minúscula' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Debe contener un número' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`]/.test(password)) {
        return { valid: false, message: 'Debe contener un carácter especial' };
    }
    return { valid: true, message: 'Contraseña válida' };
}

// Utilidades
function formatDate(isoDate) {
    if (!isoDate) return 'Nunca';
    return new Date(isoDate).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Gestión de Sesión
function saveSession(user) {
    localStorage.setItem('skylauncher_session', JSON.stringify({
        id: user.id,
        username: user.username,
        timestamp: Date.now()
    }));
}

function getSession() {
    try {
        const session = localStorage.getItem('skylauncher_session');
        return session ? JSON.parse(session) : null;
    } catch {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem('skylauncher_session');
}

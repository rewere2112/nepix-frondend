// API Configuration
const API_BASE_URL = 'https://nepix-api.onrender.com';

// Utility function to show messages
function showMessage(message, type = 'error') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;

    // Styling
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        max-width: 90%;
        text-align: center;
    `;

    if (type === 'error') {
        messageDiv.style.backgroundColor = '#ef4444';
        messageDiv.style.color = 'white';
    } else if (type === 'success') {
        messageDiv.style.backgroundColor = '#10b981';
        messageDiv.style.color = 'white';
    } else if (type === 'info') {
        messageDiv.style.backgroundColor = '#3b82f6';
        messageDiv.style.color = 'white';
    }

    document.body.appendChild(messageDiv);

    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Register function
async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.querySelector('[name="username"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const password = form.querySelector('[name="password"]').value;
    const submitButton = form.querySelector('button[type="submit"]');

    // Basic validation
    if (!username || !email || !password) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, ingresa un email válido', 'error');
        return;
    }

    // Password validation (at least 8 characters)
    if (password.length < 8) {
        showMessage('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('¡Registro exitoso! Redirigiendo...', 'success');

            // Store user data
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            if (data.user) {
                localStorage.setItem('userData', JSON.stringify(data.user));
            }

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Handle error
            showMessage(data.message || 'Error al registrar. Por favor, intenta de nuevo.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Por favor, verifica tu internet.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Create Account';
    }
}

// Login function
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const emailOrUsername = form.querySelector('[name="email"]').value.trim();
    const password = form.querySelector('[name="password"]').value;
    const submitButton = form.querySelector('button[type="submit"]');

    // Basic validation
    if (!emailOrUsername || !password) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Iniciando sesión...';

    try {
        // Try login with username (the API expects username, not email)
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: emailOrUsername, // API expects username
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('¡Login exitoso! Redirigiendo...', 'success');

            // Store user data
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            if (data.user) {
                localStorage.setItem('userData', JSON.stringify(data.user));
            }

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Handle error
            showMessage(data.message || 'Usuario o contraseña incorrectos', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Log In';
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Por favor, verifica tu internet.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Log In';
    }
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
        // User is logged in
        return JSON.parse(userData);
    }
    return null;
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

// Update dashboard with user info
function updateDashboard() {
    const user = checkAuth();
    if (user) {
        const usernameDisplay = document.getElementById('sidebar-username');
        const welcomeHeader = document.getElementById('welcome-header');

        if (usernameDisplay) {
            usernameDisplay.textContent = user.username;
        }

        if (welcomeHeader) {
            welcomeHeader.textContent = `Welcome back, ${user.username}!`;
        }
    } else {
        // If on dashboard and not logged in, should ideally redirect, but just strictly following UI requests for now.
        // But for safety let's redirect if it's clearly the dashboard
        if (document.getElementById('sidebar-username')) {
            window.location.href = 'login.html';
        }
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on register page
    const registerForm = document.querySelector('form[action="dashboard.html"]');
    if (registerForm && window.location.pathname.includes('register')) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Check if we're on login page
    const loginForm = document.querySelector('form[action="dashboard.html"]');
    if (loginForm && window.location.pathname.includes('login')) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check if we're on dashboard
    if (document.getElementById('sidebar-username')) {
        updateDashboard();
    }
});

/**
 * register.js - Registro de Usuario
 */

// Estado para rastrear si los campos han sido tocados
const fieldTouched = {
    username: false,
    email: false,
    password: false,
    confirm_password: false
};

// Función para validar contraseña en tiempo real y mostrar todos los requisitos
function validatePasswordRealtime() {
    const password = document.getElementById('password').value;
    const passwordInput = document.getElementById('password');

    // Solo validar si el campo ha sido tocado
    if (!fieldTouched.password || password === '') {
        passwordInput.classList.remove('input-error');
        return;
    }

    const errors = [];

    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`]/.test(password)) {
        errors.push('Debe contener al menos un carácter especial (!@#$%^&*...)');
    }

    if (errors.length > 0) {
        passwordInput.classList.add('input-error');
        showMessage('message', 'Requisitos de contraseña:\n• ' + errors.join('\n• '), 'error');
    } else {
        passwordInput.classList.remove('input-error');
        hideMessage('message');
    }
}

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    // Validar usuario
    if (username.length < 3) {
        showMessage('message', 'El usuario debe tener al menos 3 caracteres', 'error');
        return;
    }

    // Validar contraseña con mensajes detallados
    const errors = [];

    if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`]/.test(password)) {
        errors.push('Debe contener al menos un carácter especial (!@#$%^&*...)');
    }

    if (errors.length > 0) {
        showMessage('message', 'Requisitos de contraseña:\n• ' + errors.join('\n• '), 'error');
        return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        showMessage('message', 'Las contraseñas no coinciden', 'error');
        return;
    }

    // Validar email si fue proporcionado
    if (email && !isValidEmail(email)) {
        showMessage('message', 'El email no es válido', 'error');
        return;
    }

    // Verificar conexión con API
    showMessage('message', 'Conectando con el servidor...', 'success');
    if (!await checkAPIHealth()) {
        showMessage('message', 'Error: No se pudo conectar con el servidor. Por favor, verifica que la API esté funcionando.', 'error');
        return;
    }

    // Registrar usuario
    const result = await registerUserAPI(username, password, email);

    if (result.success) {
        showMessage('message', '¡Registro exitoso! Redirigiendo al dashboard...', 'success');
        // Guardar sesión automáticamente después del registro
        saveSession(result.user || { id: result.id, username: username });
        document.getElementById('registerForm').reset();
        // Resetear estado de campos tocados
        Object.keys(fieldTouched).forEach(key => fieldTouched[key] = false);
        setTimeout(() => window.location.href = 'Dashboard.html', 2000);
    } else {
        showMessage('message', result.message || 'Error al registrar. Por favor, intenta nuevamente.', 'error');
    }
});

// Marcar campos como tocados cuando el usuario interactúa con ellos
document.querySelectorAll('input').forEach(input => {
    // Al escribir, marcar como tocado y limpiar mensaje general
    input.addEventListener('input', function () {
        fieldTouched[this.id] = true;

        // Validación en tiempo real para contraseña
        if (this.id === 'password') {
            validatePasswordRealtime();
        } else {
            hideMessage('message');
        }

        // Remover clase de error del input
        this.classList.remove('input-error');
    });

    // Marcar como tocado cuando pierde el foco
    input.addEventListener('blur', function () {
        fieldTouched[this.id] = true;

        // Validar contraseña al perder foco
        if (this.id === 'password') {
            validatePasswordRealtime();
        }
    });
});

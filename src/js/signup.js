import { showNotification } from "./utils.mjs";

class SignupManager {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.avatarInput = document.getElementById('avatar');
        this.avatarPreview = document.getElementById('avatarPreview');
        this.successMessage = document.getElementById('successMessage');
        this.avatarFile = null;

        // Check if we're on a signup page before initializing
        if (!this.form) {
            console.warn('Signup form not found. SignupManager not initialized.');
            return;
        }

        this.init();
    }

    init() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Avatar upload - only add listeners if elements exist
        if (this.uploadBtn && this.avatarInput) {
            this.uploadBtn.addEventListener('click', () => this.avatarInput.click());
            this.avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }

        if (this.avatarPreview && this.avatarInput) {
            this.avatarPreview.addEventListener('click', () => this.avatarInput.click());
        }

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => this.validateField(input));

            // Clear error on focus
            input.addEventListener('focus', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        const errorElement = document.getElementById(`${fieldId}Error`);

        let isValid = true;
        let message = '';

        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                isValid = value.length >= 2;
                message = 'Must be at least 2 characters';
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = 'Please enter a valid email address';
                break;

            case 'phone':
                if (value) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    isValid = phoneRegex.test(value.replace(/[^\d+]/g, ''));
                    message = 'Please enter a valid phone number';
                } else {
                    isValid = true; // Phone is optional
                }
                break;

            case 'password':
                isValid = value.length >= 8;
                message = 'Password must be at least 8 characters';
                break;

            case 'confirmPassword':
                const password = document.getElementById('password').value;
                isValid = value === password;
                message = 'Passwords do not match';
                break;

            case 'address':
            case 'city':
                isValid = value.length >= 2;
                message = 'This field is required';
                break;

            case 'zipCode':
                const zipRegex = /^[A-Za-z0-9\s-]{3,10}$/;
                isValid = zipRegex.test(value);
                message = 'Please enter a valid ZIP/postal code';
                break;

            case 'country':
                isValid = value !== '';
                message = 'Please select your country';
                break;

            case 'terms':
                isValid = field.checked;
                message = 'You must agree to the terms and conditions';
                break;
        }

        this.updateFieldValidation(field, errorElement, isValid, message);
        return isValid;
    }

    updateFieldValidation(field, errorElement, isValid, message) {
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate avatar if uploaded
        if (this.avatarFile && this.avatarFile.size > 2 * 1024 * 1024) {
            const errorElement = document.getElementById('avatarError');
            if (errorElement) {
                errorElement.textContent = 'Image must be less than 2MB';
                errorElement.classList.add('show');
            }
            isValid = false;
        }

        return isValid;
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const userData = this.collectFormData();


            await this.simulateApiCall(userData);

            this.showSuccess();
            showNotification('Account created successfully!', 'success');

            // Clear form
            this.form.reset();
            this.resetAvatarPreview();



        } catch (error) {
            console.error('Signup error:', error);
            showNotification(error.message || 'Failed to create account. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    collectFormData() {
        const formData = new FormData();

        // Basic user info
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const password = document.getElementById('password');
        const address = document.getElementById('address');
        const city = document.getElementById('city');
        const state = document.getElementById('state');
        const zipCode = document.getElementById('zipCode');
        const country = document.getElementById('country');
        const newsletter = document.getElementById('newsletter');

        if (firstName) formData.append('firstName', firstName.value.trim());
        if (lastName) formData.append('lastName', lastName.value.trim());
        if (email) formData.append('email', email.value.trim());
        if (phone) formData.append('phone', phone.value.trim() || '');
        if (password) formData.append('password', password.value);
        if (address) formData.append('address', address.value.trim());
        if (city) formData.append('city', city.value.trim());
        if (state) formData.append('state', state.value.trim() || '');
        if (zipCode) formData.append('zipCode', zipCode.value.trim());
        if (country) formData.append('country', country.value);
        if (newsletter) formData.append('newsletter', newsletter.checked);

        // Avatar
        if (this.avatarFile) {
            formData.append('avatar', this.avatarFile);
        }

        return formData;
    }

    async simulateApiCall(userData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));


        return {
            success: true,
            userId: 'user_' + Date.now(),
            message: 'User created successfully'
        };
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file', 'error');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Image must be less than 2MB', 'error');
            return;
        }

        this.avatarFile = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.avatarPreview) {
                this.avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Avatar preview">`;
            }
        };
        reader.readAsDataURL(file);

        // Clear any error
        const errorElement = document.getElementById('avatarError');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    resetAvatarPreview() {
        this.avatarFile = null;
        if (this.avatarPreview) {
            this.avatarPreview.innerHTML = `
                <div class="avatar-placeholder">
                    👤
                    <span>Click to upload</span>
                </div>
            `;
        }
    }

    setLoading(isLoading) {
        if (!this.submitBtn) return;

        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
            this.submitBtn.textContent = '';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.textContent = 'Create Account';
        }
    }

    showSuccess() {
        if (this.form && this.successMessage) {
            this.form.style.display = 'none';
            this.successMessage.classList.add('show');
        }
    }

    // Utility method to get form data as JSON (alternative to FormData)
    getFormDataAsJson() {
        return {
            user: {
                firstName: document.getElementById('firstName')?.value.trim() || '',
                lastName: document.getElementById('lastName')?.value.trim() || '',
                email: document.getElementById('email')?.value.trim() || '',
                phone: document.getElementById('phone')?.value.trim() || null,
                password: document.getElementById('password')?.value || '',
                address: {
                    street: document.getElementById('address')?.value.trim() || '',
                    city: document.getElementById('city')?.value.trim() || '',
                    state: document.getElementById('state')?.value.trim() || null,
                    zipCode: document.getElementById('zipCode')?.value.trim() || '',
                    country: document.getElementById('country')?.value || ''
                },
                preferences: {
                    newsletter: document.getElementById('newsletter')?.checked || false
                }
            }
        };
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('loginPassword');

            if (!emailInput || !passwordInput) {
                console.error('Login inputs not found');
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('authToken', data.token);
                    alert('Login successful!');
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Could not connect to server.');
            }
        });
    }
});

// Export for use in other modules
// export { SignupManager };

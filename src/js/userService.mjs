// userService.mjs - LocalStorage version (no API needed)
const STORAGE_KEYS = {
    USERS: 'outdoor_gear_users',
    CURRENT_USER: 'outdoor_gear_current_user',
    AUTH_TOKEN: 'outdoor_gear_auth_token'
};

class UserService {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    // User Registration (simulated)
    async register(userData) {
        return new Promise((resolve, reject) => {
            try {
                // Simulate API delay
                setTimeout(() => {
                    // Get existing users
                    const users = this.getUsers();

                    // Check if email already exists
                    if (users.some(user => user.email === userData.email)) {
                        reject(new Error('Email already registered'));
                        return;
                    }

                    // Create new user object
                    const newUser = {
                        id: 'user_' + Date.now(),
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        phone: userData.phone || '',
                        password: userData.password, // In real app, this would be hashed
                        address: userData.address || {},
                        avatar: userData.avatar || '',
                        preferences: {
                            newsletter: userData.newsletter || false
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    // Save user
                    users.push(newUser);
                    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

                    // Automatically log in the user
                    this.setCurrentUser(newUser);
                    this.setAuthToken(this.generateToken(newUser.id));

                    resolve({
                        success: true,
                        user: newUser,
                        token: this.getAuthToken(),
                        message: 'Registration successful'
                    });
                }, 1000); // 1 second delay to simulate network

            } catch (error) {
                reject(new Error('Registration failed: ' + error.message));
            }
        });
    }

    // User Login (simulated)
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = this.getUsers();
                const user = users.find(u =>
                    u.email === email && u.password === password
                );

                if (user) {
                    // Remove password from user object before storing
                    const { password, ...userWithoutPassword } = user;

                    this.setCurrentUser(userWithoutPassword);
                    this.setAuthToken(this.generateToken(user.id));

                    resolve({
                        success: true,
                        user: userWithoutPassword,
                        token: this.getAuthToken(),
                        message: 'Login successful'
                    });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 800);
        });
    }

    // User Logout
    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        this.currentUser = null;
    }

    // Get all users from localStorage
    getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    }

    // Get current user
    getCurrentUser() {
        const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return userJson ? JSON.parse(userJson) : null;
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    // Generate fake token (in real app, this comes from backend)
    generateToken(userId) {
        return btoa(userId + ':' + Date.now()); // Simple base64 encoding
    }

    // Set auth token
    setAuthToken(token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    // Get auth token
    getAuthToken() {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getCurrentUser() && !!this.getAuthToken();
    }

    // Update user profile
    async updateProfile(userId, updates) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const users = this.getUsers();
                    const userIndex = users.findIndex(u => u.id === userId);

                    if (userIndex === -1) {
                        reject(new Error('User not found'));
                        return;
                    }

                    // Update user
                    users[userIndex] = {
                        ...users[userIndex],
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };

                    // Save updated users
                    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

                    // Update current user if it's the same user
                    if (this.currentUser && this.currentUser.id === userId) {
                        this.setCurrentUser(users[userIndex]);
                    }

                    resolve({
                        success: true,
                        user: users[userIndex],
                        message: 'Profile updated successfully'
                    });

                } catch (error) {
                    reject(new Error('Update failed: ' + error.message));
                }
            }, 800);
        });
    }

    // Check if email exists
    async checkEmailExists(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.getUsers();
                const exists = users.some(user => user.email === email);
                resolve(exists);
            }, 300);
        });
    }

    // Upload avatar (stores as base64 in localStorage)
    async uploadAvatar(userId, avatarFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                setTimeout(() => {
                    const avatarData = e.target.result;

                    // Update user's avatar
                    this.updateProfile(userId, { avatar: avatarData })
                        .then(result => resolve(result))
                        .catch(error => reject(error));
                }, 800);
            };

            reader.onerror = () => {
                reject(new Error('Failed to read image file'));
            };

            reader.readAsDataURL(avatarFile);
        });
    }
}

// Create singleton instance
const userService = new UserService();

export default userService;
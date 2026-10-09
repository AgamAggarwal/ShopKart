/**
 * ShopKart - Authentication Module
 * User authentication and authorization
 */

// User database (simulated with LocalStorage)
const UserDatabase = {
    // Get all users
    getUsers() {
        const users = localStorage.getItem('shopkart_users');
        return users ? JSON.parse(users) : [];
    },

    // Save users
    saveUsers(users) {
        localStorage.setItem('shopkart_users', JSON.stringify(users));
    },

    // Find user by email
    findByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    },

    // Add user
    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    },

    // Update user
    updateUser(email, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.saveUsers(users);
            return users[index];
        }
        
        return null;
    }
};

// Authentication class
class Auth {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.init();
    }

    // Initialize authentication
    init() {
        const user = UserStorage.getUser();
        if (user) {
            // Check session timeout
            const sessionAge = Date.now() - new Date(user.lastLogin).getTime();
            if (sessionAge > this.sessionTimeout) {
                this.logout();
            } else {
                this.currentUser = user;
            }
        }
    }

    // Sign up new user
    async signup(userData) {
        try {
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'password'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // Check if user already exists
            const existingUser = UserDatabase.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Validate email format
            if (!isValidEmail(userData.email)) {
                throw new Error('Invalid email format');
            }

            // Validate password strength
            if (!validators.password(userData.password)) {
                throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
            }

            // Confirm password
            if (userData.password !== userData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Create user object
            const user = {
                id: generateId(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email.toLowerCase(),
                password: this.hashPassword(userData.password),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            // Save user to database
            UserDatabase.addUser(user);

            // Log user in
            this.currentUser = user;
            UserStorage.saveUser({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                lastLogin: user.lastLogin
            });

            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password, rememberMe = false) {
        try {
            // Validate input
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Find user
            const user = UserDatabase.findByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            if (!this.verifyPassword(password, user.password)) {
                throw new Error('Invalid email or password');
            }

            // Update last login
            user.lastLogin = new Date().toISOString();
            UserDatabase.updateUser(email, { lastLogin: user.lastLogin });

            // Create session
            this.currentUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                lastLogin: user.lastLogin
            };

            // Save to storage
            UserStorage.saveUser(this.currentUser);

            // Set session timeout if not remembering
            if (!rememberMe) {
                setTimeout(() => {
                    this.logout();
                }, this.sessionTimeout);
            }

            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        UserStorage.removeUser();
        return { success: true };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Alias for isAuthenticated (for compatibility)
    isUserLoggedIn() {
        return this.isAuthenticated();
    }

    // Get user display name
    getUserName() {
        if (this.currentUser) {
            return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }
        return '';
    }

    // Get user email
    getUserEmail() {
        if (this.currentUser) {
            return this.currentUser.email;
        }
        return '';
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('User not authenticated');
            }

            const updatedUser = UserDatabase.updateUser(this.currentUser.email, updates);
            
            if (updatedUser) {
                this.currentUser = {
                    ...this.currentUser,
                    ...updates
                };
                UserStorage.saveUser(this.currentUser);
                return { success: true, user: this.currentUser };
            }

            throw new Error('Failed to update profile');
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: error.message };
        }
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('User not authenticated');
            }

            const user = UserDatabase.findByEmail(this.currentUser.email);
            
            // Verify current password
            if (!this.verifyPassword(currentPassword, user.password)) {
                throw new Error('Current password is incorrect');
            }

            // Validate new password
            if (!validators.password(newPassword)) {
                throw new Error('New password must be at least 8 characters with uppercase, lowercase, and number');
            }

            // Update password
            const hashedPassword = this.hashPassword(newPassword);
            UserDatabase.updateUser(this.currentUser.email, { password: hashedPassword });

            return { success: true };
        } catch (error) {
            console.error('Password change error:', error);
            return { success: false, error: error.message };
        }
    }

    // Simple password hashing (for demo - use proper hashing in production)
    hashPassword(password) {
        // In production, use proper hashing like bcrypt
        return btoa(password + 'shopkart_salt');
    }

    // Verify password
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Reset password (simulated)
    async resetPassword(email) {
        try {
            const user = UserDatabase.findByEmail(email);
            
            if (!user) {
                throw new Error('User not found');
            }

            // In production, send email with reset link
            console.log(`Password reset link sent to ${email}`);
            
            return { success: true, message: 'Password reset link sent to email' };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create auth instance
const auth = new Auth();

// Make auth globally available for browser environment
if (typeof window !== 'undefined') {
    window.auth = auth;
}

// Export auth module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Auth,
        auth,
        UserDatabase
    };
}

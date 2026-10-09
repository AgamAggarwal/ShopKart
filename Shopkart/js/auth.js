import { StorageService, ValidationService } from './storage.js';

export const AuthService = {
    getCurrentUser() {
        return StorageService.get('currentUser');
    },

    login(email, password) {
        if (!ValidationService.isEmail(email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        const users = StorageService.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            StorageService.set('currentUser', user);
            this.updateAuthNav();
            return true;
        }
        alert('Invalid email or password.');
        return false;
    },

    signup(name, email, password) {
        if (!name || !ValidationService.isEmail(email) || !ValidationService.isMinLength(password, 6)) {
            alert('Please fill valid details. Password must be at least 6 characters.');
            return false;
        }
        let users = StorageService.get('users') || [];
        if (users.some(u => u.email === email)) {
            alert('Email already registered.');
            return false;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        StorageService.set('users', users);
        StorageService.set('currentUser', newUser);
        this.updateAuthNav();
        return true;
    },

    logout() {
        localStorage.removeItem('shopkart_currentUser');
        this.updateAuthNav();
        window.router.navigate('home');
    },

    updateAuthNav() {
        const container = document.getElementById('authNavContainer');
        const user = this.getCurrentUser();
        if (user) {
            container.innerHTML = `
                <span style="font-weight:600; color:var(--primary);">Hi, ${user.name.split(' ')[0]}</span>
                <a href="#" class="btn-outline" onclick="window.authModule.logout()">Logout</a>
            `;
        } else {
            container.innerHTML = `<a href="#" class="btn-outline" onclick="window.router.navigate('login')">Login</a>`;
        }
    }
};
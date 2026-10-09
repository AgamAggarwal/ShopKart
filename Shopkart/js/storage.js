// Storage and validation module
export const StorageService = {
    get(key) {
        try {
            const data = localStorage.getItem(`shopkart_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Storage read error", e);
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(`shopkart_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error("Storage write error", e);
        }
    }
};

export const ValidationService = {
    isEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    isMinLength(val, len) {
        return val && val.length >= len;
    }
};
/**
 * ShopKart - Utility Functions
 * Reusable utility functions for the application
 */

// Debounce function to limit the rate of function calls
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function to limit function execution rate
const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Format date
const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
};

// Generate unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Deep clone object
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
const isEmpty = (obj) => {
    if (obj === null || obj === undefined) return true;
    if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
};

// Truncate text
const truncate = (text, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

// Capitalize first letter
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert to title case
const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

// Slugify string
const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Get random item from array
const getRandomItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

// Shuffle array
const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Chunk array into smaller arrays
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

// Remove duplicates from array
const removeDuplicates = (arr) => {
    return [...new Set(arr)];
};

// Sort array by key
const sortByKey = (arr, key, order = 'asc') => {
    return [...arr].sort((a, b) => {
        if (order === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
};

// Filter array by key
const filterByKey = (arr, key, value) => {
    return arr.filter(item => item[key] === value);
};

// Find item by key
const findByKey = (arr, key, value) => {
    return arr.find(item => item[key] === value);
};

// Calculate percentage
const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
};

// Calculate discount
const calculateDiscount = (originalPrice, discountPercent) => {
    return originalPrice - (originalPrice * (discountPercent / 100));
};

// Round to decimal places
const roundTo = (num, decimals = 2) => {
    return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
};

// Clamp number between min and max
const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
};

// Check if number is in range
const isInRange = (num, min, max) => {
    return num >= min && num <= max;
};

// Generate random number in range
const randomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Parse query string
const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
};

// Build query string
const buildQueryString = (params) => {
    return new URLSearchParams(params).toString();
};

// Get query parameter from URL
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Set query parameter in URL
const setQueryParam = (name, value) => {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
};

// Remove query parameter from URL
const removeQueryParam = (name) => {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
};

// Copy text to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
};

// Download file
const downloadFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Read file
const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

// Parse JSON safely
const safeJSONParse = (str, defaultValue = null) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return defaultValue;
    }
};

// Stringify JSON safely
const safeJSONStringify = (obj, defaultValue = '{}') => {
    try {
        return JSON.stringify(obj);
    } catch (e) {
        return defaultValue;
    }
};

// Wait for specified time
const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function with exponential backoff
const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        await wait(delay);
        return retry(fn, retries - 1, delay * 2);
    }
};

// Memoize function results
const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Once function - only execute once
const once = (fn) => {
    let called = false;
    let result;
    return (...args) => {
        if (!called) {
            called = true;
            result = fn(...args);
        }
        return result;
    };
};

// Compose functions
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

// Pipe functions
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// Curry function
const curry = (fn) => {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
};

// Get nested object property safely
const getNestedValue = (obj, path, defaultValue = undefined) => {
    const value = path.split('.').reduce((o, p) => o?.[p], obj);
    return value !== undefined ? value : defaultValue;
};

// Set nested object property
const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
    target[lastKey] = value;
    return obj;
};

// Merge objects
const mergeObjects = (...objs) => {
    return Object.assign({}, ...objs);
};

// Pick specific keys from object
const pick = (obj, keys) => {
    return keys.reduce((acc, key) => {
        if (obj.hasOwnProperty(key)) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
};

// Omit specific keys from object
const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

// Convert object to query string
const objectToQueryString = (obj) => {
    return Object.keys(obj)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
};

// Convert query string to object
const queryStringToObject = (queryString) => {
    const pairs = queryString.split('&');
    const result = {};
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        result[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return result;
};

// Validate email format
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Validate phone number format
const isValidPhone = (phone) => {
    const re = /^\+?[\d\s-()]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Validate URL format
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Check if element is in viewport
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Scroll to element
const scrollToElement = (element, options = {}) => {
    const defaultOptions = {
        behavior: 'smooth',
        block: 'start'
    };
    element.scrollIntoView({ ...defaultOptions, ...options });
};

// Scroll to top
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Get element offset
const getElementOffset = (element) => {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
};

// Add event listener with delegation
const addDelegateListener = (parent, eventType, selector, handler) => {
    parent.addEventListener(eventType, (e) => {
        const target = e.target.closest(selector);
        if (target && parent.contains(target)) {
            handler.call(target, e);
        }
    });
};

// Remove event listener
const removeListener = (element, eventType, handler) => {
    element.removeEventListener(eventType, handler);
};

// Trigger custom event
const triggerEvent = (element, eventName, detail = {}) => {
    const event = new CustomEvent(eventName, { detail });
    element.dispatchEvent(event);
};

// Export all utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        formatCurrency,
        formatDate,
        generateId,
        deepClone,
        isEmpty,
        truncate,
        capitalize,
        toTitleCase,
        slugify,
        getRandomItem,
        shuffleArray,
        chunkArray,
        removeDuplicates,
        sortByKey,
        filterByKey,
        findByKey,
        calculatePercentage,
        calculateDiscount,
        roundTo,
        clamp,
        isInRange,
        randomInRange,
        parseQueryString,
        buildQueryString,
        getQueryParam,
        setQueryParam,
        removeQueryParam,
        copyToClipboard,
        downloadFile,
        readFile,
        safeJSONParse,
        safeJSONStringify,
        wait,
        retry,
        memoize,
        once,
        compose,
        pipe,
        curry,
        getNestedValue,
        setNestedValue,
        mergeObjects,
        pick,
        omit,
        objectToQueryString,
        queryStringToObject,
        isValidEmail,
        isValidPhone,
        isValidURL,
        isInViewport,
        scrollToElement,
        scrollToTop,
        getElementOffset,
        addDelegateListener,
        removeListener,
        triggerEvent
    };
}

// Make utility functions globally available for browser environment
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.throttle = throttle;
    window.formatCurrency = formatCurrency;
    window.formatDate = formatDate;
    window.generateId = generateId;
    window.isValidEmail = isValidEmail;
}

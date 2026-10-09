/**
 * ShopKart - Validation Module
 * Form validation functions and utilities
 */

// Validation error messages
const errorMessages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must not exceed {max} characters',
    pattern: 'Invalid format',
    password: 'Password must contain at least 8 characters, including uppercase, lowercase, and number',
    passwordMatch: 'Passwords do not match',
    phone: 'Please enter a valid phone number',
    zipCode: 'Please enter a valid ZIP code',
    number: 'Please enter a valid number',
    positive: 'Please enter a positive number',
    integer: 'Please enter a whole number',
    url: 'Please enter a valid URL',
    date: 'Please enter a valid date',
    age: 'You must be at least {min} years old'
};

// Validator functions
const validators = {
    // Check if value is not empty
    required: (value) => {
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== null && value !== undefined;
    },

    // Email validation
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },

    // Minimum length validation
    minLength: (value, min) => {
        return value && value.length >= min;
    },

    // Maximum length validation
    maxLength: (value, max) => {
        return value && value.length <= max;
    },

    // Pattern validation
    pattern: (value, pattern) => {
        return pattern.test(value);
    },

    // Password validation (at least 8 chars, uppercase, lowercase, number)
    password: (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(value);
    },

    // Password match validation
    passwordMatch: (value, confirmPassword) => {
        return value === confirmPassword;
    },

    // Phone number validation
    phone: (value) => {
        const phoneRegex = /^\+?[\d\s-()]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    },

    // ZIP code validation
    zipCode: (value) => {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return zipRegex.test(value);
    },

    // Number validation
    number: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    // Positive number validation
    positive: (value) => {
        return validators.number(value) && parseFloat(value) > 0;
    },

    // Integer validation
    integer: (value) => {
        return validators.number(value) && Number.isInteger(parseFloat(value));
    },

    // URL validation
    url: (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },

    // Date validation
    date: (value) => {
        return !isNaN(Date.parse(value));
    },

    // Age validation
    age: (value, minAge = 18) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= minAge;
        }
        return age >= minAge;
    }
};

// Validation class
class Validator {
    constructor() {
        this.errors = {};
        this.rules = {};
    }

    // Add validation rule for a field
    addRule(fieldName, ruleName, options = {}) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push({ rule: ruleName, options });
        return this;
    }

    // Validate a single field
    validateField(fieldName, value) {
        const fieldRules = this.rules[fieldName] || [];
        this.errors[fieldName] = [];

        for (const { rule, options } of fieldRules) {
            const validator = validators[rule];
            if (!validator) {
                console.warn(`Validator "${rule}" not found`);
                continue;
            }

            const isValid = validator(value, options);
            if (!isValid) {
                const message = this.getErrorMessage(rule, options);
                this.errors[fieldName].push(message);
            }
        }

        return this.errors[fieldName].length === 0;
    }

    // Validate all fields
    validateAll(data) {
        this.errors = {};
        let isValid = true;

        for (const fieldName in this.rules) {
            const value = data[fieldName];
            const fieldValid = this.validateField(fieldName, value);
            if (!fieldValid) {
                isValid = false;
            }
        }

        return isValid;
    }

    // Get error message for a rule
    getErrorMessage(rule, options) {
        const template = errorMessages[rule] || 'Invalid value';
        return template.replace(/{(\w+)}/g, (match, key) => options[key] || '');
    }

    // Get all errors
    getErrors() {
        return this.errors;
    }

    // Get errors for a specific field
    getFieldErrors(fieldName) {
        return this.errors[fieldName] || [];
    }

    // Clear all errors
    clearErrors() {
        this.errors = {};
    }

    // Clear errors for a specific field
    clearFieldErrors(fieldName) {
        delete this.errors[fieldName];
    }

    // Reset validator
    reset() {
        this.errors = {};
        this.rules = {};
    }
}

// Form validation helper
const validateForm = (form, rules) => {
    const validator = new Validator();
    const formData = new FormData(form);
    const data = {};

    // Build rules and data
    for (const fieldName in rules) {
        data[fieldName] = formData.get(fieldName);
        const fieldRules = rules[fieldName];
        
        if (Array.isArray(fieldRules)) {
            fieldRules.forEach(rule => {
                if (typeof rule === 'string') {
                    validator.addRule(fieldName, rule);
                } else if (typeof rule === 'object') {
                    const { rule: ruleName, ...options } = rule;
                    validator.addRule(fieldName, ruleName, options);
                }
            });
        }
    }

    const isValid = validator.validateAll(data);
    const errors = validator.getErrors();

    return { isValid, errors, data };
};

// Display validation errors on form
const displayFormErrors = (form, errors) => {
    // Clear all existing error messages
    form.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    form.querySelectorAll('.form-group').forEach(el => {
        el.classList.remove('has-error');
    });

    // Display new errors
    for (const fieldName in errors) {
        const fieldErrors = errors[fieldName];
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorElement = form.querySelector(`#${fieldName}Error`);

        if (field && errorElement && fieldErrors.length > 0) {
            field.classList.add('has-error');
            errorElement.textContent = fieldErrors[0];
        }
    }
};

// Clear form errors
const clearFormErrors = (form) => {
    form.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    form.querySelectorAll('.form-group').forEach(el => {
        el.classList.remove('has-error');
    });
    form.querySelectorAll('.has-error').forEach(el => {
        el.classList.remove('has-error');
    });
};

// Real-time validation
const setupRealTimeValidation = (form, rules) => {
    const validator = new Validator();

    // Build rules
    for (const fieldName in rules) {
        const fieldRules = rules[fieldName];
        
        if (Array.isArray(fieldRules)) {
            fieldRules.forEach(rule => {
                if (typeof rule === 'string') {
                    validator.addRule(fieldName, rule);
                } else if (typeof rule === 'object') {
                    const { rule: ruleName, ...options } = rule;
                    validator.addRule(fieldName, ruleName, options);
                }
            });
        }
    }

    // Add event listeners for real-time validation
    for (const fieldName in rules) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', () => {
                const value = field.value;
                validator.validateField(fieldName, value);
                const errors = validator.getFieldErrors(fieldName);
                const errorElement = form.querySelector(`#${fieldName}Error`);

                if (errorElement) {
                    errorElement.textContent = errors.length > 0 ? errors[0] : '';
                }
            });

            field.addEventListener('input', () => {
                // Clear error on input
                const errorElement = form.querySelector(`#${fieldName}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        }
    }

    return validator;
};

// Common validation rules for ShopKart
const commonRules = {
    // Login form rules
    login: {
        email: ['required', 'email'],
        password: ['required', { rule: 'minLength', options: { min: 6 } }]
    },

    // Signup form rules
    signup: {
        firstName: ['required', { rule: 'minLength', options: { min: 2 } }],
        lastName: ['required', { rule: 'minLength', options: { min: 2 } }],
        email: ['required', 'email'],
        password: ['required', 'password'],
        confirmPassword: ['required']
    },

    // Checkout form rules
    checkout: {
        firstName: ['required', { rule: 'minLength', options: { min: 2 } }],
        lastName: ['required', { rule: 'minLength', options: { min: 2 } }],
        email: ['required', 'email'],
        phone: ['required', 'phone'],
        address: ['required', { rule: 'minLength', options: { min: 10 } }],
        city: ['required'],
        state: ['required'],
        zipCode: ['required', 'zipCode'],
        country: ['required']
    },

    // Product quantity
    quantity: ['required', 'positive', 'integer'],

    // Coupon code
    coupon: ['required', { rule: 'minLength', options: { min: 3 } }]
};

// Validate coupon code format
const validateCoupon = (couponCode) => {
    // Example: Coupon codes should be alphanumeric, 3-20 characters
    const couponRegex = /^[A-Z0-9]{3,20}$/i;
    return couponRegex.test(couponCode);
};

// Validate product quantity
const validateQuantity = (quantity, max = 99) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num > 0 && num <= max;
};

// Validate rating
const validateRating = (rating) => {
    const num = parseFloat(rating);
    return !isNaN(num) && num >= 0 && num <= 5;
};

// Validate price
const validatePrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
};

// Sanitize user input
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// Sanitize form data
const sanitizeFormData = (formData) => {
    const sanitized = {};
    for (const key in formData) {
        sanitized[key] = sanitizeInput(formData[key]);
    }
    return sanitized;
};

// Export validation utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validators,
        Validator,
        validateForm,
        displayFormErrors,
        clearFormErrors,
        setupRealTimeValidation,
        commonRules,
        validateCoupon,
        validateQuantity,
        validateRating,
        validatePrice,
        sanitizeInput,
        sanitizeFormData,
        errorMessages
    };
}

// Make validation utilities globally available for browser environment
if (typeof window !== 'undefined') {
    window.validators = validators;
    window.Validator = Validator;
    window.validateForm = validateForm;
    window.displayFormErrors = displayFormErrors;
    window.clearFormErrors = clearFormErrors;
    window.setupRealTimeValidation = setupRealTimeValidation;
    window.commonRules = commonRules;
    window.validateCoupon = validateCoupon;
    window.validateQuantity = validateQuantity;
    window.validateRating = validateRating;
    window.validatePrice = validatePrice;
    window.sanitizeInput = sanitizeInput;
    window.sanitizeFormData = sanitizeFormData;
    window.errorMessages = errorMessages;
}

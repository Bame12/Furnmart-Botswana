/**
 * Contact Page JavaScript
 * Furnmart Botswana - Form validation and submission
 */

// ============ Contact Form State ============
const ContactState = {
    isSubmitting: false,
    formData: {}
};

// ============ DOM Elements ============
const contactElements = {
    form: document.getElementById('contact-form'),
    nameInput: document.getElementById('name'),
    emailInput: document.getElementById('email'),
    phoneInput: document.getElementById('phone'),
    subjectSelect: document.getElementById('subject'),
    messageTextarea: document.getElementById('message'),
    newsletterCheckbox: document.getElementById('newsletter'),
    submitBtn: document.querySelector('.btn-submit')
};

// ============ Validation Rules ============
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid name (letters only, minimum 2 characters)'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    phone: {
        required: false,
        pattern: /^[\d\s+()-]+$/,
        message: 'Please enter a valid phone number'
    },
    subject: {
        required: true,
        message: 'Please select a subject'
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: 'Message must be between 10 and 1000 characters'
    }
};

// ============ Initialize Contact Form ============
function initContactForm() {
    if (!contactElements.form) return;

    // Add real-time validation
    addRealtimeValidation();

    // Handle form submission
    contactElements.form.addEventListener('submit', handleFormSubmit);

    console.log('Contact form initialized');
}

// ============ Real-time Validation ============
function addRealtimeValidation() {
    const inputs = [
        contactElements.nameInput,
        contactElements.emailInput,
        contactElements.phoneInput,
        contactElements.messageTextarea
    ];

    inputs.forEach(input => {
        if (input) {
            // Validate on blur
            input.addEventListener('blur', () => {
                validateField(input);
            });

            // Clear error on input
            input.addEventListener('input', () => {
                clearFieldError(input);
            });
        }
    });

    // Validate select on change
    if (contactElements.subjectSelect) {
        contactElements.subjectSelect.addEventListener('change', () => {
            validateField(contactElements.subjectSelect);
        });
    }
}

// ============ Field Validation ============
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = validationRules[fieldName];

    if (!rules) return true;

    // Check required
    if (rules.required && !value) {
        showFieldError(field, rules.message || `${fieldName} is required`);
        return false;
    }

    // If not required and empty, it's valid
    if (!rules.required && !value) {
        clearFieldError(field);
        return true;
    }

    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(field, rules.message);
        return false;
    }

    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
        showFieldError(field, rules.message);
        return false;
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(field, rules.message);
        return false;
    }

    // All validations passed
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    const errorSpan = field.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('visible');
    }

    announceToScreenReader(`Error: ${message}`);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');

    const errorSpan = field.parentElement.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
    }
}

// ============ Form Validation ============
function validateForm() {
    let isValid = true;

    // Validate all required fields
    const fieldsToValidate = [
        contactElements.nameInput,
        contactElements.emailInput,
        contactElements.phoneInput,
        contactElements.subjectSelect,
        contactElements.messageTextarea
    ];

    fieldsToValidate.forEach(field => {
        if (field && !validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// ============ Form Submission ============
async function handleFormSubmit(e) {
    e.preventDefault();

    // Prevent double submission
    if (ContactState.isSubmitting) return;

    // Validate form
    if (!validateForm()) {
        announceToScreenReader('Please fix the errors in the form');
        // Focus on first error
        const firstError = contactElements.form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
        return;
    }

    // Collect form data
    ContactState.formData = {
        name: contactElements.nameInput.value.trim(),
        email: contactElements.emailInput.value.trim(),
        phone: contactElements.phoneInput.value.trim(),
        subject: contactElements.subjectSelect.value,
        message: contactElements.messageTextarea.value.trim(),
        newsletter: contactElements.newsletterCheckbox.checked,
        timestamp: new Date().toISOString()
    };

    // Set submitting state
    ContactState.isSubmitting = true;
    contactElements.submitBtn.disabled = true;
    contactElements.submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
        </svg>
        Sending...
    `;

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    try {
        // Simulate API call (in production, send to backend)
        await simulateFormSubmission();

        // Show success message
        showSuccessMessage();

        // Reset form
        contactElements.form.reset();

        // Log data (in production, this would be sent to backend)
        console.log('Form submitted:', ContactState.formData);

        announceToScreenReader('Your message has been sent successfully!');

    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
        announceToScreenReader('Failed to send message. Please try again.');
    } finally {
        // Reset submitting state
        ContactState.isSubmitting = false;
        contactElements.submitBtn.disabled = false;
        contactElements.submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Send Message
        `;
    }
}

// ============ Simulate Form Submission ============
function simulateFormSubmission() {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            resolve({ success: true });
        }, 2000);
    });
}

// ============ Success Message ============
function showSuccessMessage() {
    // Create success message element if it doesn't exist
    let successMessage = document.querySelector('.success-message');

    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.setAttribute('role', 'alert');
        contactElements.form.parentElement.insertBefore(successMessage, contactElements.form);
    }

    successMessage.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <strong>Message Sent Successfully!</strong><br>
        Thank you for contacting us. We'll respond within 24 hours.
    `;

    successMessage.classList.add('visible');

    // Show notification
    showNotification('Message sent successfully!', 'success');

    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('visible');
    }, 5000);

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============ Character Counter for Message ============
function initCharacterCounter() {
    if (!contactElements.messageTextarea) return;

    const maxLength = validationRules.message.maxLength;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        font-size: var(--font-size-sm);
        color: var(--medium-gray);
        text-align: right;
        margin-top: 4px;
    `;

    contactElements.messageTextarea.parentElement.appendChild(counter);

    function updateCounter() {
        const length = contactElements.messageTextarea.value.length;
        counter.textContent = `${length} / ${maxLength} characters`;

        if (length > maxLength) {
            counter.style.color = 'var(--error)';
        } else {
            counter.style.color = 'var(--medium-gray)';
        }
    }

    contactElements.messageTextarea.addEventListener('input', updateCounter);
    updateCounter();
}

// ============ FAQ Accordion ============
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const summary = item.querySelector('summary');

        summary.addEventListener('click', () => {
            announceToScreenReader(
                item.hasAttribute('open')
                    ? 'FAQ collapsed'
                    : `FAQ expanded: ${summary.textContent}`
            );
        });
    });
}

// ============ Utility Functions ============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: type === 'success' ? '#2D7738' : type === 'error' ? '#D32F2F' : '#0051A5',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function announceToScreenReader(message) {
    const liveRegion = document.querySelector('[aria-live="polite"]');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// ============ Initialize on Load ============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initContactForm();
        initCharacterCounter();
        initFAQAccordion();
    });
} else {
    initContactForm();
    initCharacterCounter();
    initFAQAccordion();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContactState,
        validateField,
        validateForm,
        handleFormSubmit
    };
}

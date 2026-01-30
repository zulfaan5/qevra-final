// ============ Page Navigation ============
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        // Avoid automatic hash scroll or jump
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`a[href="#${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ============ Accordion Toggle ============
function toggleAccordion(button) {
    const accordionItem = button.parentElement;
    const content = accordionItem.querySelector('.accordion-content');
    const icon = button.querySelector('.accordion-icon');
    
    // Close other accordion items
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(item => {
        if (item !== accordionItem) {
            item.classList.remove('active');
            item.querySelector('.accordion-content').style.maxHeight = '0';
            item.querySelector('.accordion-icon').textContent = '+';
        }
    });
    
    // Toggle current item
    accordionItem.classList.toggle('active');
    
    if (accordionItem.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '−';
    } else {
        content.style.maxHeight = '0';
        icon.textContent = '+';
    }
}


// ============ Countdown Timer ============
function startCountdownTimer() {
    console.log('⏱️ Timer function started');
    
    const timerDays = document.getElementById('timerDays');
    const timerHours = document.getElementById('timerHours');
    const timerMinutes = document.getElementById('timerMinutes');
    const timerSeconds = document.getElementById('timerSeconds');
    
    console.log('Timer elements found:', {
        days: !!timerDays,
        hours: !!timerHours,
        minutes: !!timerMinutes,
        seconds: !!timerSeconds
    });

    // Target date: February 10, 2026 at 10:00 AM
    const eventDate = new Date('2026-02-10T10:00:00').getTime();
    console.log('Event date:', new Date(eventDate).toLocaleString());
    console.log('Event timestamp:', eventDate);

    function updateTimer() {
        const now = new Date().getTime();
        const distance = eventDate - now;
        
        console.log('Updated - Time remaining:', distance, 'ms');

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            console.log(`⏳ ${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

            if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
            if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
            if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, '0');
            if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, '0');
        } else {
            console.log('✅ Event has started!');
            if (timerDays) timerDays.textContent = '00';
            if (timerHours) timerHours.textContent = '00';
            if (timerMinutes) timerMinutes.textContent = '00';
            if (timerSeconds) timerSeconds.textContent = '00';
        }
    }

    // Update immediately
    updateTimer();
    
    // Then update every second
    setInterval(updateTimer, 1000);
    console.log('✅ Timer started and will update every second');
}

// ============ Scroll to Register ============
function scrollToRegister() {
    const registerSection = document.getElementById('register');
    if (registerSection) {
        registerSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============ Scroll to Details ============
function scrollToDetails() {
    const detailsSection = document.querySelector('.details-section');
    if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============ Form Validation ============
const registrationForm = document.getElementById('registrationForm');
const successMessage = registrationForm ? document.getElementById('successMessage') : null;
const formInputs = registrationForm ? registrationForm.querySelectorAll('input, select') : [];

const patterns = {
    firstName: /^[a-zA-Z\s]{2,}$/,
    lastName: /^[a-zA-Z\s]{2,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-\+\(\)]{10,}$/,
    college: /.{2,}/,
    department: /.{2,}/
};

// Initialize form and nav interception
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');

    // Prevent default anchor behavior for nav links to avoid auto-scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target.startsWith('#')) {
                showPage(target.slice(1));
            }
        });
    });
    
    // Start timer immediately
    startCountdownTimer();
    
    // Only setup form listeners if form exists
    if (registrationForm) {
        setupEventListeners();
    }
});

function setupEventListeners() {
    // Real-time validation on input
    formInputs.forEach(input => {
        if (input.type !== 'checkbox') {
            input.addEventListener('blur', validateField);
            input.addEventListener('change', validateField);
        }
    });

    // Form submission
    registrationForm.addEventListener('submit', handleFormSubmit);
}

function validateField(e) {
    const field = e.target;
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(fieldName + 'Error');

    let isValid = true;
    let errorMessage = '';

    // Skip validation for empty non-required fields
    if (!fieldValue && !field.required) {
        field.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
        return true;
    }

    // Required field check
    if (field.required && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Field-specific validation
        switch(fieldName) {
            case 'firstName':
                if (fieldValue && !patterns.firstName.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'First name must contain only letters (minimum 2 characters)';
                }
                break;

            case 'lastName':
                if (fieldValue && !patterns.lastName.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Last name must contain only letters (minimum 2 characters)';
                }
                break;

            case 'email':
                if (fieldValue && !patterns.email.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (fieldValue && !patterns.phone.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number (minimum 10 digits)';
                }
                break;

            case 'college':
                if (fieldValue && !patterns.college.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'College name must be at least 2 characters';
                }
                break;

            case 'department':
                if (fieldValue && !patterns.department.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Department must be at least 2 characters';
                }
                break;

            case 'year':
            case 'days':
                if (field.required && !fieldValue) {
                    isValid = false;
                    errorMessage = 'Please select an option';
                }
                break;
        }
    }

    // Update field styling and error message
    if (isValid) {
        field.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
    } else {
        field.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage;
    }

    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let allFieldsValid = true;
    const formData = {};

    formInputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else {
            const isFieldValid = validateField({ target: input });
            if (!isFieldValid) {
                allFieldsValid = false;
            }
            formData[input.name] = input.value.trim();
        }
    });

    // Validate terms checkbox
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('termsError');
    if (!termsCheckbox.checked) {
        allFieldsValid = false;
        termsError.textContent = 'You must agree to the terms and conditions';
    } else {
        termsError.textContent = '';
    }

    // If all valid, show success message
    if (allFieldsValid) {
        showSuccessMessage(formData);
    }
}

function showSuccessMessage(formData) {
    // Hide form
    registrationForm.classList.add('hidden');

    // Show success message
    successMessage.classList.add('active');

    // Log form data
    console.log('Registration Data:', formData);

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth' });

    // Optional: Send to server
    // sendToServer(formData);
}

function resetRegistration() {
    // Clear all form inputs
    registrationForm.reset();

    // Remove error states
    formInputs.forEach(input => {
        input.classList.remove('error');
        const errorElement = document.getElementById(input.name + 'Error');
        if (errorElement) errorElement.textContent = '';
    });

    document.getElementById('termsError').textContent = '';

    // Show form
    registrationForm.classList.remove('hidden');

    // Hide success message
    successMessage.classList.remove('active');

    // Scroll to form
    registrationForm.scrollIntoView({ behavior: 'smooth' });
}

// Optional: Function to send data to server
function sendToServer(formData) {
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server Response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration. Please try again.');
    });
}

// Prevent leaving page if form has unsaved data
window.addEventListener('beforeunload', function(e) {
    const hasFormData = Array.from(formInputs).some(input => {
        if (input.type === 'checkbox') return input.checked;
        return input.value.trim() !== '';
    });

    if (hasFormData && !registrationForm.classList.contains('hidden')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Backup timer initialization - start immediately if DOM is ready
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, starting timer immediately');
    startCountdownTimer();
}


// Smooth fade-in animation on load
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const form = document.querySelector('.glass-form');

    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        setTimeout(() => {
            hero.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }

    if (form) {
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        setTimeout(() => {
            form.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Form handling
const form = document.getElementById('enquiry-form');
const submitBtn = form ? form.querySelector('.submit-btn') : null;
const formMessage = form ? form.querySelector('.form-message') : null;
const formFields = form ? form.querySelector('.form-fields') : null;
const successCard = form ? form.querySelector('.success-card') : null;

// Web3Forms endpoint
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

// Form validation
function validateForm(formData) {
    const email = formData.get('email');
    const phone = formData.get('phone');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    // Basic phone validation (allow various formats)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        return { valid: false, message: 'Please enter a valid phone number' };
    }

    return { valid: true };
}

// Show message
function showMessage(type, text) {
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = text;
    formMessage.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Submit form to Web3Forms
async function submitForm(formData) {
    try {
        // Convert FormData to JSON
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const response = await fetch(WEB3FORMS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });

        const result = await response.json();

        if (response.status === 200) {
            return { success: true, message: result.message };
        } else {
            return { success: false, error: result.message || 'Submission failed' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Form submit handler
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);

        // Validate
        const validation = validateForm(formData);
        if (!validation.valid) {
            showMessage('error', validation.message);
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        formMessage.style.display = 'none';

        // Submit form
        const result = await submitForm(formData);

        // Remove loading state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');

        if (result.success) {
            // Fade out form fields
            formFields.classList.add('hidden');

            // After fade completes, hide fields and show success card
            setTimeout(() => {
                formFields.style.display = 'none';
                successCard.classList.add('show');
            }, 300);
        } else {
            showMessage('error', 'Something went wrong. Please try again or email directly at agramontevictoria97@gmail.com');
        }
    });
}

// Add smooth scroll behavior to example links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

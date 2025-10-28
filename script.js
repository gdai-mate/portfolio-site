// Parallax scroll effect for diagonal background
const diagonalBg = document.querySelector('.diagonal-bg');
const glassForm = document.querySelector('.glass-form');

function handleScroll() {
    const scrollY = window.scrollY;
    // Scroll 1.5x faster than normal scroll (negative to move black UP)
    const parallaxSpeed = 1.5;
    const offset = -scrollY * parallaxSpeed;

    if (diagonalBg) {
        diagonalBg.style.transform = `translateY(${offset}px)`;
    }

    // Check if form is on white or black background
    if (glassForm) {
        const formRect = glassForm.getBoundingClientRect();
        const formMiddle = (formRect.top + formRect.bottom) / 2;
        const viewportHeight = window.innerHeight;

        // The diagonal-bg is 300vh tall with gradient transition at 32%
        // That's at 32% of 300vh = 96vh from the element's top
        // The element starts at viewport top and is translated by offset
        // So the diagonal line is at: 96vh + offset (in viewport coordinates)
        const diagonalLinePosition = viewportHeight * 0.96 + offset;

        // If form middle is below the diagonal line, it's on white background
        // If above the diagonal line, it's on black background
        if (formMiddle > diagonalLinePosition) {
            glassForm.classList.add('on-white');
        } else {
            glassForm.classList.remove('on-white');
        }
    }
}

// Throttle scroll for performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Run on load
handleScroll();

// Form handling
const form = document.getElementById('enquiry-form');
const submitBtn = form.querySelector('.submit-btn');
const formMessage = form.querySelector('.form-message');

// Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mblpgzpk';

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

    // Auto-hide after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Submit form to Formspree
async function submitForm(formData) {
    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Formspree error:', errorData);
            return { success: false, error: errorData.error || 'Submission failed' };
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        return { success: false, error: error.message };
    }
}

// Form submit handler
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
        showMessage('success', "Thanks — I'll be in touch within 24 hours");
        form.reset();
    } else {
        showMessage('error', 'Something went wrong. Please try again or email directly at info@gdaimate.com');
    }
});

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

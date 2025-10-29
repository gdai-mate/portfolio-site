// Parallax scroll effect for diagonal background
const diagonalBg = document.querySelector('.diagonal-bg');
const glassForm = document.querySelector('.glass-form');

function handleScroll() {
    const scrollY = window.scrollY;
    const isMobile = window.innerWidth <= 768;
    const parallaxSpeed = isMobile ? 2.0 : 1.5;
    const offset = -scrollY * parallaxSpeed;

    if (diagonalBg) {
        diagonalBg.style.transform = `translateY(${offset}px)`;
    }

    // Check each form field individually as diagonal crosses over it
    if (glassForm) {
        const viewportHeight = window.innerHeight;
        // The diagonal background is 300vh tall, starts at 32% (or 30% on mobile)
        // With parallax at 2.0x speed on mobile (1.5x on desktop), it moves faster
        // The diagonal line is at X% of the background element
        const gradientPercent = isMobile ? 0.30 : 0.32;

        // Background height is 300vh, diagonal is at X% of that
        const bgHeightPx = viewportHeight * 3;
        const diagonalOffsetInBg = bgHeightPx * gradientPercent;

        // With parallax, the diagonal moves down by offset amount
        const diagonalLineY = diagonalOffsetInBg + offset;

        // Check each form group individually
        const formGroups = glassForm.querySelectorAll('.form-group');

        formGroups.forEach((group, index) => {
            const rect = group.getBoundingClientRect();
            const groupMiddle = rect.top + (rect.height / 2);

            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');

            // If group is ABOVE the diagonal line (smaller Y), it's in white section = black text
            // If group is BELOW the diagonal line (bigger Y), it's in black section = white text
            if (groupMiddle < diagonalLineY) {
                // On white background - use black text
                if (input) {
                    input.style.setProperty('color', '#0a0a0a', 'important');
                }
                if (label) {
                    label.style.setProperty('color', 'rgba(0, 0, 0, 0.6)', 'important');
                }
            } else {
                // On black background - use white text
                if (input) {
                    input.style.setProperty('color', '#fafafa', 'important');
                }
                if (label) {
                    label.style.setProperty('color', 'rgba(255, 255, 255, 0.6)', 'important');
                }
            }
        });

        // Check submit button too
        const submitBtn = glassForm.querySelector('.submit-btn');
        if (submitBtn) {
            const btnRect = submitBtn.getBoundingClientRect();
            const btnMiddle = btnRect.top + (btnRect.height / 2);

            if (btnMiddle < diagonalLineY) {
                // On white - black button
                submitBtn.style.color = '#fafafa';
                submitBtn.style.background = '#0a0a0a';
            } else {
                // On black - keep black button with white text
                submitBtn.style.color = '#fafafa';
                submitBtn.style.background = '#0a0a0a';
            }
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
const submitBtn = form ? form.querySelector('.submit-btn') : null;
const formMessage = form ? form.querySelector('.form-message') : null;

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
            showMessage('success', "Thanks — I'll be in touch within 24 hours");
            form.reset();
        } else {
            showMessage('error', 'Something went wrong. Please try again or email directly at info@gdaimate.com');
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

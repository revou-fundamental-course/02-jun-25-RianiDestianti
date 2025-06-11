document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.vm-card, .facility-card, .contact-form, .info-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    const contactForm = document.getElementById('contactForm');
    const modal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        const formGroups = contactForm.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });

        const name = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (!name.value.trim()) {
            showError(name, nameError, 'Name is required');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError(name, nameError, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            showSuccess(name);
        }

        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, emailError, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, emailError, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(email);
        }

        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phone.value.trim()) {
            showError(phone, phoneError, 'Phone number is required');
            isValid = false;
        } else if (!phoneRegex.test(phone.value)) {
            showError(phone, phoneError, 'Please enter a valid phone number');
            isValid = false;
        } else {
            showSuccess(phone);
        }

        const subject = document.getElementById('subject');
        if (!subject.value) {
            showError(subject, null, 'Please select a subject');
            isValid = false;
        } else {
            showSuccess(subject);
        }

        const message = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        if (!message.value.trim()) {
            showError(message, messageError, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, messageError, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            showSuccess(message);
        }

        return isValid;
    }

    function showError(input, errorElement, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function showSuccess(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('success');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function submitForm() {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Sending...';

        setTimeout(() => {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            displaySubmittedData(formData);
            
            contactForm.reset();
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('error', 'success');
            });

            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;

            modal.style.display = 'block';
        }, 1500);
    }

    function displaySubmittedData(data) {
        const submittedDataDiv = document.getElementById('submittedData');
        submittedDataDiv.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <h4 style="margin-bottom: 1rem; color: var(--text-dark);">Your Message Details:</h4>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
                <p><strong>Message:</strong> ${data.message}</p>
                <p style="margin-top: 1.5rem; padding: 1rem; background: #e0f2fe; border-radius: 8px; color: #0ea5e9;">
                    <i class="fas fa-info-circle"></i> 
                    We'll reply faster than a rocket! 🚀
                </p>
            </div>
        `;
    }

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        input.addEventListener('input', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                validateSingleField(this);
            }
        });
    });

    function validateSingleField(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.remove('error', 'success');
        
        switch (input.id) {
            case 'name':
                if (!input.value.trim()) {
                    showError(input, errorElement, 'Name is required');
                } else if (input.value.trim().length < 2) {
                    showError(input, errorElement, 'Name must be at least 2 characters');
                } else {
                    showSuccess(input);
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!input.value.trim()) {
                    showError(input, errorElement, 'Email is required');
                } else if (!emailRegex.test(input.value)) {
                    showError(input, errorElement, 'Please enter a valid email address');
                } else {
                    showSuccess(input);
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
                if (!input.value.trim()) {
                    showError(input, errorElement, 'Phone number is required');
                } else if (!phoneRegex.test(input.value)) {
                    showError(input, errorElement, 'Please enter a valid phone number');
                } else {
                    showSuccess(input);
                }
                break;
                
            case 'subject':
                if (!input.value) {
                    showError(input, null, 'Please select a subject');
                } else {
                    showSuccess(input);
                }
                break;
                
            case 'message':
                if (!input.value.trim()) {
                    showError(input, errorElement, 'Message is required');
                } else if (input.value.trim().length < 10) {
                    showError(input, errorElement, 'Message must be at least 10 characters');
                } else {
                    showSuccess(input);
                }
                break;
        }
    }
});

let userName = '';

function promptName() {
    const name = prompt('What\'s your name, young explorer?');
    if (name && name.trim()) {
        userName = name.trim();
        updateWelcomeMessage();
        document.querySelector('#profile').scrollIntoView({ behavior: 'smooth' });
    }
}

function updateWelcomeMessage() {
    const welcomeText = document.getElementById('welcome-text');
    if (userName) {
        welcomeText.textContent = `Hey ${userName}! Ready for a Learning Adventure?`;
        welcomeText.style.animation = 'slideUp 0.8s ease-out';
    }
}

window.addEventListener('load', function() {
    if (userName) {
        updateWelcomeMessage();
    }
});

let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        document.body.style.animation = 'rainbow 3s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
        
        alert('🎉 You unlocked the Secret Study Code! Enjoy a colorful learning party! 🎒✨');
    }
});
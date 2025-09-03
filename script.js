/**
 * INTELLIGENTSIA SA - Enhanced JavaScript Features
 * All features are modular and well-organized for maintainability
 * Version: 2.0 - Comprehensive Feature Set
 */

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================
const CONFIG = {
    // Animation settings
    animation: {
        duration: 600,
        easing: 'ease-out',
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    
    // Form validation patterns
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]+$/
    },
    
    // Dark mode settings
    darkMode: {
        storageKey: 'intelligentsia-dark-mode',
        className: 'dark-mode'
    },
    
    // Scroll settings
    scroll: {
        offset: 80,
        duration: 800
    }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const Utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    smoothScrollTo: (element, offset = 0) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// =============================================================================
// MOBILE NAVIGATION MODULE
// =============================================================================
const MobileNav = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
    },

    bindEvents() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    },

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = this.hamburger.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transform = this.hamburger.classList.contains('active') 
                ? index === 0 ? 'rotate(45deg) translate(5px, 5px)' 
                : index === 1 ? 'opacity(0)' 
                : 'rotate(-45deg) translate(7px, -6px)'
                : '';
        });
    },

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
};

// =============================================================================
// SMOOTH SCROLLING MODULE
// =============================================================================
const SmoothScroll = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Handle navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleScroll(e));
        });

        // Handle CTA buttons
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleScroll(e));
        });
    },

    handleScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offset = window.innerWidth <= 768 ? 60 : 80;
            Utils.smoothScrollTo(targetElement, offset);
        }
    }
};

// =============================================================================
// FORM VALIDATION & HANDLING MODULE
// =============================================================================
const ContactForm = {
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.form = document.querySelector('.contact-form');
        this.inputs = this.form ? this.form.querySelectorAll('input[required], textarea[required]') : [];
    },

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            this.inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.showConfirmation();
            this.resetForm();
            this.sendFormData();
        }
    },

    validateForm() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        
        // Email validation
        else if (type === 'email' && !CONFIG.patterns.email.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Phone validation (if phone field exists)
        else if (type === 'tel' && !CONFIG.patterns.phone.test(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }

        this.showError(input, errorMessage);
        return isValid;
    },

    showError(input, message) {
        this.clearError(input);
        
        if (message) {
            input.classList.add('error');
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            input.parentNode.appendChild(errorElement);
        }
    },

    clearError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    },

    showConfirmation() {
        // Create custom modal instead of alert
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting INTELLIGENTSIA SA. We will get back to you within 24 hours.</p>
                <button class="modal-close-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
        
        // Auto-close after 5 seconds
        setTimeout(() => modal.remove(), 5000);
    },

    resetForm() {
        this.form.reset();
    },

    sendFormData() {
        // Simulate form submission (replace with actual API call)
        console.log('Form data would be sent to server');
    }
};

// =============================================================================
// SCROLL ANIMATIONS MODULE
// =============================================================================
const ScrollAnimations = {
    init() {
        this.createObserver();
        this.observeElements();
    },

    createObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            CONFIG.animation
        );
    },

    observeElements() {
        const elements = document.querySelectorAll(
            '.department-card, .service-item, .product-card, .team-member, .about-content, .about-image'
        );
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}, transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing}`;
            this.observer.observe(element);
        });
    },

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for cards
                if (entry.target.classList.contains('product-card') || 
                    entry.target.classList.contains('service-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }
};

// =============================================================================
// HOVER EFFECTS MODULE
// =============================================================================
const HoverEffects = {
    init() {
        this.addProductHoverEffects();
        this.addServiceHoverEffects();
    },

    addProductHoverEffects() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleProductHover(card, true));
            card.addEventListener('mouseleave', () => this.handleProductHover(card, false));
        });
    },

    addServiceHoverEffects() {
        const serviceItems = document.querySelectorAll('.service-item');
        
        serviceItems.forEach(item =>  {
            item.addEventListener('mouseenter', () => this.handleServiceHover(item, true));
            item.addEventListener('mouseleave', () => this.handleServiceHover(item, false));
        });
    },

    handleProductHover(card, isHovering) {
        const img = card.querySelector('img');
        const content = card.querySelector('h3, p');
        
        if (isHovering) {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
            if (img) img.style.transform = 'scale(1.1)';
            if (content) content.style.color = '#3498db';
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
            if (img) img.style.transform = 'scale(1)';
            if (content) content.style.color = '';
        }
    },

    handleServiceHover(item, isHovering) {
        const icon = item.querySelector('i');
        
        if (isHovering) {
            item.style.backgroundColor = '#f8f9fa';
            item.style.borderLeft = '4px solid #3498db';
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.color = '#3498db';
            }
        } else {
            item.style.backgroundColor = '';
            item.style.borderLeft = '';
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = '';
            }
        }
    }
};

// =============================================================================
// DYNAMIC CLOCK MODULE
// =============================================================================
const DynamicClock = {
    init() {
        this.createClockElement();
        this.startClock();
    },

    createClockElement() {
        const footer = document.querySelector('.footer-bottom');
        if (footer) {
            this.clockElement = document.createElement('div');
            this.clockElement.className = 'dynamic-clock';
            this.clockElement.style.cssText = `
                margin-top: 10px;
                font-size: 0.9rem;
                color: #666;
            `;
            footer.appendChild(this.clockElement);
        }
    },

    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    },

    updateClock() {
        if (this.clockElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            this.clockElement.innerHTML = `
                <i class="fas fa-clock"></i> ${timeString} | ${dateString}
            `;
        }
    }
};

// =============================================================================
// DARK MODE MODULE
// =============================================================================
const DarkMode = {
    init() {
        this.createToggleButton();
        this.loadPreference();
        this.bindEvents();
    },

    createToggleButton() {
        const nav = document.querySelector('.nav-container');
        if (nav) {
            this.toggleButton = document.createElement('button');
            this.toggleButton.className = 'dark-mode-toggle';
            this.toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
            this.toggleButton.style.cssText = `
                background: none;
                border: none;
                color: #333;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 5px 10px;
                margin-left: 15px;
                transition: color 0.3s;
            `;
            nav.appendChild(this.toggleButton);
        }
    },

    bindEvents() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        document.body.classList.toggle(CONFIG.darkMode.className);
        const isDark = document.body.classList.contains(CONFIG.darkMode.className);
        
        // Update icon
        this.toggleButton.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem(CONFIG.darkMode.storageKey, isDark);
        
        // Update button color
        this.toggleButton.style.color = isDark ? '#f39c12' : '#333';
    },

    loadPreference() {
        const isDark = localStorage.getItem(CONFIG.darkMode.storageKey) === 'true';
        if (isDark) {
            document.body.classList.add(CONFIG.darkMode.className);
            if (this.toggleButton) {
                this.toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
                this.toggleButton.style.color = '#f39c12';
            }
        }
    }
};

// =============================================================================
// INITIALIZATION MODULE
// =============================================================================
const App = {
    init() {
        // Initialize all modules
        MobileNav.init();
        SmoothScroll.init();
        ContactForm.init();
        ScrollAnimations.init();
        HoverEffects.init();
        DynamicClock.init();
        DarkMode.init();
        
        // Additional enhancements
        this.addScrollSpy();
        this.addLoadingAnimation();
        
        console.log('INTELLIGENTSIA SA - All features initialized successfully!');
    },

    addScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        window.addEventListener('scroll', Utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100));
    },

    addLoadingAnimation() {
        document.body.classList.add('loaded');
    }
};

// =============================================================================
// CSS INJECTION FOR DYNAMIC STYLES
// =============================================================================
const DynamicStyles = {
    init() {
        this.injectStyles();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Dark mode styles */
            body.dark-mode {
                background-color: #1a1a1a;
                color: #e0e0e0;
            }
            
            body.dark-mode .navbar {
                background-color: #2c2c2c;
            }
            
            body.dark-mode .nav-menu a {
                color: #e0e0e0;
            }
            
            body.dark-mode .department-card,
            body.dark-mode .service-item,
            body.dark-mode .product-card {
                background-color: #2c2c2c;
                border-color: #444;
            }
            
            /* Form error styles */
            .error {
                border-color: #e74c3c !important;
            }
            
            .error-message {
                color: #e74c3c;
                font-size: 0.8rem;
                margin-top: 5px;
                display: block;
            }
            
            /* Confirmation modal styles */
            .confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
                margin: 1rem;
            }
            
            .modal-content i {
                font-size: 3rem;
                color: #27ae60;
                margin-bottom: 1rem;
            }
            
            .close-modal {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            /* Hover effect transitions */
            .product-card, .service-item {
                transition: all 0.3s ease;
            }
            
            .product-card img {
                transition: transform 0.3s ease;
            }
            
            /* Loading animation */
            body:not(.loaded) {
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            body.loaded {
                opacity: 1;
            }
            
            /* Active navigation link */
            .nav-menu a.active {
                color: #3498db;
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(style);
    }
};

// =============================================================================
// INITIALIZE APPLICATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    DynamicStyles.init();
    App.init();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        DynamicClock.updateClock();
    }
});

// Export for potential module usage
window.IntelligentsiaApp = {
    Utils,
    MobileNav,
    SmoothScroll,
    ContactForm,
    ScrollAnimations,
    HoverEffects,
    DynamicClock,
    DarkMode
};
/**
 * Language Switch Module for INTELLIGENTSIA SA
 * Handles switching between English and French
 */

class LanguageSwitch {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            en: {
                title: "INTELLIGENTSIA SA - Leading Digital Technology Integration in Central Africa",
                heroTitle: "Leading Digital Technology Integration in Central Africa",
                heroSubtitle: "Since 2002, INTELLIGENTSIA SA has been pioneering innovative solutions in electronic banking, IT infrastructure, and digital archiving across Central and West Africa.",
                yearsExperience: "Years Experience",
                expertEmployees: "Expert Employees",
                fcfaCapital: "FCFA Capital",
                exploreSolutions: "Explore Our Solutions",
                aboutTitle: "About INTELLIGENTSIA SA",
                ourStory: "Our Story",
                ourMission: "Our Mission",
                ourVision: "Our Vision",
                ourValues: "Our Values",
                professionalism: "Professionalism",
                responsibility: "Responsibility",
                integrity: "Integrity",
                ingenuity: "Ingenuity",
                departmentsTitle: "Our Departments",
                softwareDept: "Software Solutions Department",
                hardwareDept: "Hardware Solutions Department",
                digitalDept: "Digitalization & Data Conservation",
                servicesTitle: "Our Services",
                productsTitle: "Our Products",
                teamTitle: "Our Leadership Team",
                contactTitle: "Contact Us",
                getInTouch: "Get In Touch",
                address: "Address",
                phone: "Phone",
                email: "Email",
                registration: "Registration",
                sendMessage: "Send us a Message",
                yourName: "Your Name",
                yourEmail: "Your Email",
                subject: "Subject",
                yourMessage: "Your Message",
                sendBtn: "Send Message"
            },
            fr: {
                title: "INTELLIGENTSIA SA - Leader de l'Intégration Technologique en Afrique Centrale",
                heroTitle: "Leader de l'Intégration Technologique en Afrique Centrale",
                heroSubtitle: "Depuis 2002, INTELLIGENTSIA SA est pionnier dans les solutions innovantes de banque électronique, d'infrastructure IT et d'archivage numérique en Afrique Centrale et de l'Ouest.",
                yearsExperience: "Années d'Expérience",
                expertEmployees: "Employés Experts",
                fcfaCapital: "Capital FCFA",
                exploreSolutions: "Explorer Nos Solutions",
                aboutTitle: "À Propos d'INTELLIGENTSIA SA",
                ourStory: "Notre Histoire",
                ourMission: "Notre Mission",
                ourVision: "Notre Vision",
                ourValues: "Nos Valeurs",
                professionalism: "Professionnalisme",
                responsibility: "Responsabilité",
                integrity: "Intégrité",
                ingenuity: "Ingéniosité",
                departmentsTitle: "Nos Départements",
                softwareDept: "Département Solutions Logicielles",
                hardwareDept: "Département Solutions Matérielles",
                digitalDept: "Numérisation & Conservation des Données",
                servicesTitle: "Nos Services",
                productsTitle: "Nos Produits",
                teamTitle: "Notre Équipe de Direction",
                contactTitle: "Contactez-Nous",
                getInTouch: "Contactez-Nous",
                address: "Adresse",
                phone: "Téléphone",
                email: "Email",
                registration: "Enregistrement",
                sendMessage: "Envoyez-nous un Message",
                yourName: "Votre Nom",
                yourEmail: "Votre Email",
                subject: "Sujet",
                yourMessage: "Votre Message",
                sendBtn: "Envoyer le Message"
            }
        };
    }

    init() {
        this.createToggleButton();
        this.bindEvents();
        this.loadPreference();
    }

    createToggleButton() {
        const nav = document.querySelector('.nav-container');
        if (nav) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'language-toggle';
            toggleButton.innerHTML = '<i class="fas fa-globe"></i> <span id="langText">FR</span>';
            toggleButton.style.cssText = `
                background: none;
                border: 2px solid #3498db;
                color: #3498db;
                font-size: 0.9rem;
                cursor: pointer;
                padding: 5px 10px;
                margin-left: 10px;
                border-radius: 15px;
                transition: all 0.3s ease;
            `;
            nav.appendChild(toggleButton);
        }
    }

    bindEvents() {
        const toggleButton = document.querySelector('.language-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleLanguage());
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        this.updateLanguage();
        this.savePreference();
    }

    updateLanguage() {
        const t = this.translations[this.currentLanguage];
        
        // Update document title
        document.title = t.title;
        
        // Update navigation links
        document.querySelectorAll('[data-en][data-fr]').forEach(element => {
            element.textContent = element.getAttribute(`data-${this.currentLanguage}`);
        });
        
        // Update button text
        const langText = document.getElementById('langText');
        if (langText) langText.textContent = this.currentLanguage === 'en' ? 'FR' : 'EN';
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    savePreference() {
        localStorage.setItem('intelligentsia-language', this.currentLanguage);
    }

    loadPreference() {
        const savedLanguage = localStorage.getItem('intelligentsia-language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
            this.updateLanguage();
        }
    }
}

// Initialize the language switch
document.addEventListener('DOMContentLoaded', () => {
    const languageSwitch = new LanguageSwitch();
    languageSwitch.init();
});
/**
 * Complete French Language Translation System for INTELLIGENTSIA SA
 * This file contains all translations for the entire website
 */

const TRANSLATIONS = {
    en: {
        // Meta tags
        title: "INTELLIGENTSIA SA - Leading Digital Technology Integration in Central Africa",
        description: "INTELLIGENTSIA SA - Premier provider of electronic banking, IT, and digital archiving solutions in Central Africa since 2002.",
        
        // Navigation
        home: "Home",
        about: "About Us",
        departments: "Departments",
        services: "Services",
        products: "Products",
        team: "Team",
        contact: "Contact",
        
        // Hero Section
        heroTitle: "Leading Digital Technology Integration in Central Africa",
        heroSubtitle: "Since 2002, INTELLIGENTSIA SA has been pioneering innovative solutions in electronic banking, IT infrastructure, and digital archiving across Central and West Africa.",
        yearsExperience: "Years Experience",
        expertEmployees: "Expert Employees",
        fcfaCapital: "FCFA Capital",
        exploreSolutions: "Explore Our Solutions",
        
        // About Section
        aboutTitle: "About INTELLIGENTSIA SA",
        ourStory: "Our Story",
        ourMission: "Our Mission",
        ourVision: "Our Vision",
        ourValues: "Our Values",
        professionalism: "Professionalism",
        responsibility: "Responsibility",
        integrity: "Integrity",
        ingenuity: "Ingenuity",
        storyText: "Founded in 2002 as an economic interest group with initial capital of 400,000,000 FCFA, INTELLIGENTSIA SA has evolved into a leading public limited company specializing in digital technology integration. Our main shareholder was CENAINVEST (Central Africa Investment).",
        missionText: "To create value for our clients through innovative digital products and services, including comprehensive solutions such as Core Banking, Core Microfinance, Core Insurance, Core Electronic Banking, and digital consulting services.",
        visionText: "To be the leader in distribution and integration of technologies in Central Africa, leading in terms of turnover and market share against competitors.",
        professionalismText: "Mastering standards and delivering quality services on time",
        responsibilityText: "Fully assuming commitments and achieving objectives",
        integrityText: "Acting with honesty and building trust",
        ingenuityText: "Cultivating innovation and creative solutions",
        
        // Departments Section
        departmentsTitle: "Our Departments",
        departmentsCompleted: "Our Departments are now well completed",
        departmentsStatus: "All departments are fully operational and well established",
        softwareDept: "Software Solutions Department",
        hardwareDept: "Hardware Solutions Department",
        digitalDept: "Digitalization & Data Conservation",
        missionLabel: "Mission:",
        softwareMission: "Develop, integrate, and maintain innovative software solutions for electronic banking, banking, insurance, and operations.",
        hardwareMission: "Manage and supervise hardware infrastructures for electronic banking and IT needs.",
        digitalMission: "Manage archiving services, electronic document management, and digitalization solutions.",
        electronicBanking: "Electronic Banking Services",
        coreBanking: "Core Banking Systems",
        coreMicrofinance: "Core Microfinance Solutions",
        coreInsurance: "Core Insurance Platforms",
        researchDev: "Research & Development",
        atmSolutions: "ATM Solutions & Maintenance",
        posTerminal: "POS Terminal Services",
        itInfrastructure: "IT Infrastructure",
        electronicPayment: "Electronic Payment Systems",
        techSecurity: "Technology & Security Watch",
        electronicArchiving: "Electronic Archiving Systems",
        massDigitization: "Mass Digitization",
        saeHosting: "SAE Hosting Services",
        archiveRoom: "Archive Room Equipment",
        consultingTraining: "Consulting & Training",
        permanentStaff: "permanent staff",
        
        // Services Section
        servicesTitle: "Our Services",
        electronicBankingService: "Electronic Banking",
        bankingSolutions: "Banking Solutions",
        insuranceSolutions: "Insurance Solutions",
        digitalArchiving: "Digital Archiving",
        itInfrastructureService: "IT Infrastructure",
        consultingServices: "Consulting Services",
        electronicBankingDesc: "Complete electronic banking solutions including SELECT SYSTEM platform, card personalization, and transaction monitoring.",
        bankingDesc: "Core banking systems (ABS2000), microfinance platforms (GRANITE), and mobile banking solutions (SARA Money).",
        insuranceDesc: "Core insurance systems (ORASS), CRM solutions (BITRIX), and comprehensive auditing services.",
        archivingDesc: "Electronic document management, mass digitization, and secure data conservation services.",
        infrastructureDesc: "Complete IT infrastructure solutions including servers, data centers, networking, and equipment maintenance.",
        consultingDesc: "Strategic consulting, business analysis, and technology implementation guidance.",
        
        // Products Section
        productsTitle: "Our Products",
        digitalBankingSolution: "Digital Banking Solution",
        coreMicrofinanceSystem: "Core Microfinance System",
        electronicPaymentTerminals: "Electronic Payment Terminals",
        digitalArchivingSolutions: "Digital Archiving Solutions",
        hrInformationSystem: "HR Information System",
        itInfrastructureProduct: "IT Infrastructure",
        digitalBankingDesc: "Innovative digital banking platform tailored for Central and West Africa",
        microfinanceDesc: "Robust microfinance software for efficient loan and savings management",
        paymentTerminalsDesc: "Secure and reliable payment terminals for seamless transactions",
        archivingSolutionsDesc: "Secure and efficient digital archiving services",
        hrDesc: "Advanced HRIS to streamline human resource management",
        infrastructureProductDesc: "Comprehensive IT infrastructure solutions for businesses",
        
        // Team Section
        teamTitle: "Our Leadership Team",
        generalManager: "General Manager",
        directorSoftware: "Director of Software Solutions",
        directorHardware: "Director of Hardware Solutions",
        directorDigital: "Director of Digitalization & Data Conservation",
        directorFinance: "Director of Finance & General Affairs",
        salesDirector: "Sales & Marketing Director",
        
        // Contact Section
        contactTitle: "Contact Us",
        getInTouch: "Get In Touch",
        address: "Address",
        addressText: "Avenue Charles de Gaulle – BP 11 543<br>Yaoundé – Cameroon",
        phone: "Phone",
        phoneNumber: "(+237) 243 548 814",
        email: "Email",
        emailAddress: "info@intelligentsia.biz",
        registration: "Registration",
        registrationText: "Commercial Register: YAO01/04/879<br>Taxpayer No: M010200014100S",
        sendMessage: "Send us a Message",
        yourName: "Your Name",
        yourEmail: "Your Email",
        subject: "Subject",
        yourMessage: "Your Message",
        sendBtn: "Send Message",
        
        // Footer
        companyName: "INTELLIGENTSIA SA",
        footerDesc: "Leading digital technology integration in Central Africa since 2002.",
        quickLinks: "Quick Links",
        rights: "All rights reserved"
    },
    
    fr: {
        // Meta tags
        title: "INTELLIGENTSIA SA - Leader de l'Intégration Technologique en Afrique Centrale",
        description: "INTELLIGENTSIA SA - Fournisseur principal de solutions de banque électronique, IT et archivage numérique en Afrique Centrale depuis 2002.",
        
        // Navigation
        home: "Accueil",
        about: "À Propos",
        departments: "Départements",
        services: "Services",
        products: "Produits",
        team: "Équipe",
        contact: "Contact",
        
        // Hero Section
        heroTitle: "Leader de l'Intégration Technologique en Afrique Centrale",
        heroSubtitle: "Depuis 2002, INTELLIGENTSIA SA est pionnier dans les solutions innovantes de banque électronique, d'infrastructure IT et d'archivage numérique en Afrique Centrale et de l'Ouest.",
        yearsExperience: "Années d'Expérience",
        expertEmployees: "Employés Experts",
        fcfaCapital: "Capital FCFA",
        exploreSolutions: "Explorer Nos Solutions",
        
        // About Section
        aboutTitle: "À Propos d'INTELLIGENTSIA SA",
        ourStory: "Notre Histoire",
        ourMission: "Notre Mission",
        ourVision: "Notre Vision",
        ourValues: "Nos Valeurs",
        professionalism: "Professionnalisme",
        responsibility: "Responsabilité",
        integrity: "Intégrité",
        ingenuity: "Ingéniosité",
        storyText: "Fondée en 2002 comme groupement d'intérêt économique avec un capital initial de 400.000.000 FCFA, INTELLIGENTSIA SA a évolué en une société anonyme leader spécialisée dans l'intégration technologique. Notre principal actionnaire était CENAINVEST (Central Africa Investment).",
        missionText: "Créer de la valeur pour nos clients à travers des produits et services numériques innovants, incluant des solutions complètes telles que Core Banking, Core Microfinance, Core Insurance, Core Banque Électronique et services de conseil numérique.",
        visionText: "Être le leader dans la distribution et l'intégration des technologies en Afrique Centrale, en tête en termes de chiffre d'affaires et de part de marché face aux concurrents.",
        professionalismText: "Maîtriser les normes et fournir des services de qualité dans les délais",
        responsibilityText: "Assumer pleinement les engagements et atteindre les objectifs",
        integrityText: "Agir avec honnêteté et construire la confiance",
        ingenuityText: "Cultiver l'innovation et les solutions créatives",
        
        // Departments Section
        departmentsTitle: "Nos Départements",
        departmentsCompleted: "Nos Départements sont maintenant bien complétés",
        departmentsStatus: "Tous les départements sont pleinement opérationnels et bien établis",
        softwareDept: "Département Solutions Logicielles",
        hardwareDept: "Département Solutions Matérielles",
        digitalDept: "Numérisation & Conservation des Données",
        missionLabel: "Mission :",
        softwareMission: "Développer, intégrer et maintenir des solutions logicielles innovantes pour la banque électronique, la banque, l'assurance et les opérations.",
        hardwareMission: "Gérer et superviser les infrastructures matérielles pour les besoins de banque électronique et IT.",
        digitalMission: "Gérer les services d'archivage, la gestion électronique des documents et les solutions de numérisation.",
        electronicBanking: "Services de Banque Électronique",
        coreBanking: "Systèmes Core Banking",
        coreMicrofinance: "Solutions Core Microfinance",
        coreInsurance: "Plateformes Core Assurance",
        researchDev: "Recherche & Développement",
        atmSolutions: "Solutions & Maintenance GAB",
        posTerminal: "Services de Terminaux POS",
        itInfrastructure: "Infrastructure IT",
        electronicPayment: "Systèmes de Paiement Électronique",
        techSecurity: "Veille Technologique & Sécurité",
        electronicArchiving: "Systèmes d'Archivage Électronique",
        massDigitization: "Numérisation de Masse",
        saeHosting: "Services d'Hébergement SAE",
        archiveRoom: "Équipement des Salles d'Archives",
        consultingTraining: "Conseil & Formation",
        permanentStaff: "personnels permanents",
        
        // Services Section
        servicesTitle: "Nos Services",
        electronicBankingService: "Banque Électronique",
        bankingSolutions: "Solutions Bancaires",
        insuranceSolutions: "Solutions d'Assurance",
        digitalArchiving: "Archivage Numérique",
        itInfrastructureService: "Infrastructure IT",
        consultingServices: "Services de Conseil",
        electronicBankingDesc: "Solutions complètes de banque électronique incluant la plateforme SELECT SYSTEM, la personnalisation de cartes et la surveillance des transactions.",
        bankingDesc: "Systèmes core banking (ABS2000), plateformes de microfinance (GRANITE) et solutions de banque mobile (SARA Money).",
        insuranceDesc: "Systèmes core assurance (ORASS), solutions CRM (BITRIX) et services d'audit complets.",
        archivingDesc: "Gestion électronique des documents, numérisation de masse et services de conservation sécurisée des données.",
        infrastructureDesc: "Solutions complètes d'infrastructure IT incluant serveurs, centres de données, réseautage et maintenance d'équipements.",
        consultingDesc: "Conseil stratégique, analyse d'affaires et orientation pour l'implémentation technologique.",
        
        // Products Section
        productsTitle: "Nos Produits",
        digitalBankingSolution: "Solution de Banque Numérique",
        coreMicrofinanceSystem: "Système Core Microfinance",
        electronicPaymentTerminals: "Terminaux de Paiement Électronique",
        digitalArchivingSolutions: "Solutions d'Archivage Numérique",
        hrInformationSystem: "Système d'Information RH",
        itInfrastructureProduct: "Infrastructure IT",
        digitalBankingDesc: "Plateforme de banque numérique innovante adaptée à l'Afrique Centrale et de l'Ouest",
        microfinanceDesc: "Logiciel de microfinance robuste pour la gestion efficace des prêts et épargnes",
        paymentTerminalsDesc: "Terminaux de paiement sécurisés et fiables pour des transactions fluides",
        archivingSolutionsDesc: "Services d'archivage numérique sécurisés et efficaces",
        hrDesc: "HRIS avancé pour rationaliser la gestion des ressources humaines",
        infrastructureProductDesc: "Solutions complètes d'infrastructure IT pour les entreprises",
        
        // Team Section
        teamTitle: "Notre Équipe de Direction",
        generalManager: "Directeur Général",
        directorSoftware: "Directeur des Solutions Logicielles",
        directorHardware: "Directeur des Solutions Matérielles",
        directorDigital: "Directeur de la Numérisation & Conservation des Données",
        directorFinance: "Directeur des Finances & Affaires Générales",
        salesDirector: "Directrice Commerciale & Marketing",
        
        // Contact Section
        contactTitle: "Contactez-Nous",
        getInTouch: "Contactez-Nous",
        address: "Adresse",
        addressText: "Avenue Charles de Gaulle – BP 11 543<br>Yaoundé – Cameroun",
        phone: "Téléphone",
        phoneNumber: "(+237) 243 548 814",
        email: "Email",
        emailAddress: "info@intelligentsia.biz",
        registration: "Enregistrement",
        registrationText: "Registre de Commerce: YAO01/04/879<br>N° Contribuable: M010200014100S",
        sendMessage: "Envoyez-nous un Message",
        yourName: "Votre Nom",
        yourEmail: "Votre Email",
        subject: "Sujet",
        yourMessage: "Votre Message",
        sendBtn: "Envoyer le Message",
        
        // Footer
        companyName: "INTELLIGENTSIA SA",
        footerDesc: "Leader de l'intégration technologique en Afrique Centrale depuis 2002.",
        quickLinks: "Liens Rapides",
        rights: "Tous droits réservés"
    }
};

// Enhanced Language Switch System
class LanguageManager {
    constructor() {
        this.currentLanguage = 'fr'; // Default to French
        this.translations = TRANSLATIONS;
        this.init();
    }

    init() {
        this.loadPreference();
        this.updateLanguage();
        this.bindEvents();
    }

    bindEvents() {
        // Language toggle button
        const langToggle = document.querySelector('.language-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Language dropdown
        const langSelector = document.getElementById('languageSelector');
        if (langSelector) {
            langSelector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        this.setLanguage(this.currentLanguage);
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.updateLanguage();
            this.savePreference();
        }
    }

    updateLanguage() {
        const t = this.translations[this.currentLanguage];
        
        // Update document title and meta
        document.title = t.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', t.description);
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Update navigation
        this.updateNavigation();
        
        // Update hero section
        this.updateHeroSection();
        
        // Update about section
        this.updateAboutSection();
        
        // Update departments
        this.updateDepartments();
        
        // Update services
        this.updateServices();
        
        // Update products
        this.updateProducts();
        
        // Update team
        this.updateTeam();
        
        // Update contact
        this.updateContact();
        
        // Update footer
        this.updateFooter();
        
        // Update form placeholders
        this.updateFormPlaceholders();
        
        // Update button text
        this.updateButtonText();
    }

    updateNavigation() {
        const t = this.translations[this.currentLanguage];
        const navLinks = document.querySelectorAll('.nav-menu a');
        const navTexts = [t.home, t.about, t.departments, t.services, t.products, t.team, t.contact];
        
        navLinks.forEach((link, index) => {
            if (navTexts[index]) {
                link.textContent = navTexts[index];
            }
        });
    }

    updateHeroSection() {
        const t = this.translations[this.currentLanguage];
        const heroTitle = document.querySelector('.hero-content h1');
        const heroSubtitle = document.querySelector('.hero-content p');
        const ctaButton = document.querySelector('.cta-button');
        
        if (heroTitle) heroTitle.textContent = t.heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
        if (ctaButton) ctaButton.textContent = t.exploreSolutions;
        
        // Update stats
        const statLabels = document.querySelectorAll('.stat-label');
        const statTexts = [t.yearsExperience, t.expertEmployees, t.fcfaCapital];
        statLabels.forEach((label, index) => {
            if (statTexts[index]) label.textContent = statTexts[index];
        });
    }

    updateAboutSection() {
        const t = this.translations[this.currentLanguage];
        const aboutTitle = document.querySelector('#about h2');
        const storyTitle = document.querySelector('#about h3');
        const missionTitle = document.querySelectorAll('#about h3')[1];
        const visionTitle = document.querySelectorAll('#about h3')[2];
        const valuesTitle = document.querySelector('.values h3');
        
        if (aboutTitle) aboutTitle.textContent = t.aboutTitle;
        if (storyTitle) storyTitle.textContent = t.ourStory;
        if (missionTitle) missionTitle.textContent = t.ourMission;
        if (visionTitle) visionTitle.textContent = t.ourVision;
        if (valuesTitle) valuesTitle.textContent = t.ourValues;
        
        // Update content
        const storyText = document.querySelector('.about-content p');
        const missionText = document.querySelectorAll('.about-content p')[1];
        const visionText = document.querySelectorAll('.about-content p')[2];
        
        if (storyText) storyText.textContent = t.storyText;
        if (missionText) missionText.textContent = t.missionText;
        if (visionText) visionText.textContent = t.visionText;
        
        // Update value cards
        const valueCards = document.querySelectorAll('.value-card h4');
        const valueTexts = [t.professionalism, t.responsibility, t.integrity, t.ingenuity];
        valueCards.forEach((card, index) => {
            if (valueTexts[index]) card.textContent = valueTexts[index];
        });
        
        const valueDescs = document.querySelectorAll('.value-card p');
        const descTexts = [t.professionalismText, t.responsibilityText, t.integrityText, t.ingenuityText];
        valueDescs.forEach((desc, index) => {
            if (descTexts[index]) desc.textContent = descTexts[index];
        });
    }

    updateDepartments() {
        const t = this.translations[this.currentLanguage];
        const deptTitle = document.querySelector('#departments h2');
        if (deptTitle) deptTitle.textContent = t.departmentsTitle;
        
        // Update department cards
        const deptCards = document.querySelectorAll('.department-card');
        deptCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const missionLabel = card.querySelector('p strong');
            const missionText = card.querySelector('p span');
            const staff = card.querySelector('.team-size');
            
            if (index === 0) {
                if (title) title.textContent = t.softwareDept;
                if (missionLabel) missionLabel.textContent = t.missionLabel;
                if (missionText) missionText.textContent = t.softwareMission;
                if (staff) staff.textContent = `9 ${t.permanentStaff}`;
            } else if (index === 1) {
                if (title) title.textContent = t.hardwareDept;
                if (missionLabel) missionLabel.textContent = t.missionLabel;
                if (missionText) missionText.textContent = t.hardwareMission;
                if (staff) staff.textContent = `16 ${t.permanentStaff}`;
            } else if (index === 2) {
                if (title) title.textContent = t.digitalDept;
                if (missionLabel) missionLabel.textContent = t.missionLabel;
                if (missionText) missionText.textContent = t.digitalMission;
                if (staff) staff.textContent = `3 ${t.permanentStaff}`;
            }
            
            // Update lists
            const listItems = card.querySelectorAll('li');
            const lists = [
                [t.electronicBanking, t.coreBanking, t.coreMicrofinance, t.coreInsurance, t.researchDev],
                [t.atmSolutions, t.posTerminal, t.itInfrastructure, t.electronicPayment, t.techSecurity],
                [t.electronicArchiving, t.massDigitization, t.saeHosting, t.archiveRoom, t.consultingTraining]
            ];
            
            listItems.forEach((item, i) => {
                if (lists[index] && lists[index][i]) {
                    item.textContent = lists[index][i];
                }
            });
        });
    }

    updateServices() {
        const t = this.translations[this.currentLanguage];
        const servicesTitle = document.querySelector('#services h2');
        if (servicesTitle) servicesTitle.textContent = t.servicesTitle;
        
        const serviceItems = document.querySelectorAll('.service-item');
        const serviceData = [
            { title: t.electronicBankingService, desc: t.electronicBankingDesc },
            { title: t.bankingSolutions, desc: t.bankingDesc },
            { title: t.insuranceSolutions, desc: t.insuranceDesc },
            { title: t.digitalArchiving, desc: t.archivingDesc },
            { title: t.itInfrastructureService, desc: t.infrastructureDesc },
            { title: t.consultingServices, desc: t.consultingDesc }
        ];
        
        serviceItems.forEach((item, index) => {
            const title = item.querySelector('h3');
            const desc = item.querySelector('p');
            
            if (serviceData[index]) {
                if (title) title.textContent = serviceData[index].title;
                if (desc) desc.textContent = serviceData[index].desc;
            }
        });
    }

    updateProducts() {
        const t = this.translations[this.currentLanguage];
        const productsTitle = document.querySelector('#products h2');
        if (productsTitle) productsTitle.textContent = t.productsTitle;
        
        const productCards = document.querySelectorAll('.product-card');
        const productData = [
            { title: t.digitalBankingSolution, desc: t.digitalBankingDesc },
            { title: t.coreMicrofinanceSystem, desc: t.microfinanceDesc },
            { title: t.electronicPaymentTerminals, desc: t.paymentTerminalsDesc },
            { title: t.digitalArchivingSolutions, desc: t.archivingSolutionsDesc },
            { title: t.hrInformationSystem, desc: t.hrDesc },
            { title: t.itInfrastructureProduct, desc: t.infrastructureProductDesc }
        ];
        
        productCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            
            if (productData[index]) {
                if (title) title.textContent = productData[index].title;
                if (desc) desc.textContent = productData[index].desc;
            }
        });
    }

    updateTeam() {
        const t = this.translations[this.currentLanguage];
        const teamTitle = document.querySelector('#team h2');
        if (teamTitle) teamTitle.textContent = t.teamTitle;
        
        const teamMembers = document.querySelectorAll('.team-member');
        const teamData = [
            { name: "Jean Paul YAMCHEU", title: t.generalManager },
            { name: "Auxcence MBIA", title: t.directorSoftware },
            { name: "Olivier SIKALI", title: t.directorHardware },
            { name: "Achille FOTSO", title: t.directorDigital },
            { name: "Samuel MIAFFO", title: t.directorFinance },
            { name: "Géraldine SIMO", title: t.salesDirector }
        ];
        
        teamMembers.forEach((member, index) => {
            const title = member.querySelector('p');
            if (teamData[index] && title) {
                title.textContent = teamData[index].title;
            }
        });
    }

    updateContact() {
        const t = this.translations[this.currentLanguage];
        const contactTitle = document.querySelector('#contact h2');
        const getInTouch = document.querySelector('.contact-info h3');
        const sendMessage = document.querySelector('.contact-form h3');
        
        if (contactTitle) contactTitle.textContent = t.contactTitle;
        if (getInTouch) getInTouch.textContent = t.getInTouch;
        if (sendMessage) sendMessage.textContent = t.sendMessage;
        
        // Update contact info
        const contactItems = document.querySelectorAll('.contact-item h4');
        const contactTexts = [t.address, t.phone, t.email, t.registration];
        contactItems.forEach((item, index) => {
            if (contactTexts[index]) item.textContent = contactTexts[index];
        });
        
        // Update contact details
        const addressText = document.querySelector('.contact-item p');
        const registrationText = document.querySelectorAll('.contact-item p')[3];
        
        if (addressText && addressText.innerHTML.includes('Yaoundé')) {
            addressText.innerHTML = t.addressText;
        }
        if (registrationText && registrationText.innerHTML.includes('Commercial')) {
            registrationText.innerHTML = t.registrationText;
        }
    }

    updateFooter() {
        const t = this.translations[this.currentLanguage];
        const companyName = document.querySelector('.footer-section h3');
        const footerDesc = document.querySelector('.footer-section p');
        const quickLinks = document.querySelector('.footer-section h4');
        const rights = document.querySelector('.footer-bottom p');
        
        if (companyName) companyName.textContent = t.companyName;
        if (footerDesc) footerDesc.textContent = t.footerDesc;
        if (quickLinks) quickLinks.textContent = t.quickLinks;
        if (rights) rights.textContent = `© 2025 ${t.companyName}. ${t.rights}.`;
    }

    updateFormPlaceholders() {
        const t = this.translations[this.currentLanguage];
        const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        const placeholders = [t.yourName, t.yourEmail, t.subject, t.yourMessage];
        
        inputs.forEach((input, index) => {
            if (placeholders[index]) {
                input.setAttribute('placeholder', placeholders[index]);
            }
        });
        
        const sendBtn = document.querySelector('.submit-btn');
        if (sendBtn) sendBtn.textContent = t.sendBtn;
    }

    updateButtonText() {
        const t = this.translations[this.currentLanguage];
        const langToggle = document.querySelector('.language-toggle span');
        if (langToggle) {
            langToggle.textContent = this.currentLanguage === 'en' ? 'FR' : 'EN';
        }
    }

    savePreference() {
        localStorage.setItem('intelligentsia-language', this.currentLanguage);
    }

    loadPreference() {
        const saved = localStorage.getItem('intelligentsia-language');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});

// =============================================================================
// ANIMATED COUNTERS MODULE
// =============================================================================
const AnimatedCounters = {
    init() {
        this.cacheElements();
        this.setupCounters();
    },

    cacheElements() {
        this.counters = document.querySelectorAll('.stat-number');
    },

    setupCounters() {
        if (this.counters.length === 0) return;

        // Create intersection observer for counters
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.counters.forEach(counter => {
            // Store original values
            const originalText = counter.textContent;
            counter.dataset.original = originalText;
            
            // Reset to 0 initially for counting effect
            counter.textContent = '0';
            observer.observe(counter);
        });
    },

    animateCounter(element) {
        const originalValue = element.dataset.original;
        
        // Parse target values based on format
        let targetValue, suffix, decimals;
        
        if (originalValue.includes('20+')) {
            targetValue = 20;
            suffix = '+';
            decimals = 0;
        } else if (originalValue.includes('40+')) {
            targetValue = 40;
            suffix = '+';
            decimals = 0;
        } else if (originalValue.includes('3.2B')) {
            targetValue = 3.2;
            suffix = 'B';
            decimals = 1;
        } else {
            // Handle other numeric formats
            const match = originalValue.match(/[\d.]+/);
            targetValue = parseFloat(match[0]);
            suffix = originalValue.replace(/[\d.]/g, '');
            decimals = originalValue.includes('.') ? 1 : 0;
        }

        let current = 0;
        const duration = 70000; // 70 seconds for slow counting
        const steps = 150;
        const increment = targetValue / steps;
        const interval = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
                
                // Format final value
                let finalText = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
                finalText += suffix;
                
                element.textContent = finalText;
                
                // Add completion effect
                element.classList.add('counter-complete');
                setTimeout(() => {
                    element.classList.remove('counter-complete');
                }, 600);
                
                return;
            }
            
            // Format current value during animation
            let displayValue = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
            element.textContent = displayValue;
            
        }, interval);
    }
};

// Add CSS for counter animation
const counterStyles = document.createElement('style');
counterStyles.textContent = `
    .counter-complete {
        animation: pulse 0.6s ease-in-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .stat-number {
        font-size: 2.5rem;
        font-weight: bold;
        color: #3498db;
        transition: all 0.3s ease;
    }
    
    .stat-label {
        font-size: 1rem;
        color: #666;
        margin-top: 0.5rem;
    }
    
    .hero-stats {
        display: flex;
        justify-content: center;
        gap: 3rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }
    
    .stat {
        text-align: center;
        padding: 1rem;
    }
    
    @media (max-width: 768px) {
        .hero-stats {
            gap: 1.5rem;
        }
        
        .stat-number {
            font-size: 2rem;
        }
    }
`;

document.head.appendChild(counterStyles);

// Initialize animated counters
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        AnimatedCounters.init();
    }, 500);
});

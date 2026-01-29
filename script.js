// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle smooth scroll for anchor links
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Active navigation link highlighting
const sections = document.querySelectorAll('.section, .hero');
const navLinksArray = Array.from(navLinks);

function updateActiveNavLink() {
    let current = '';
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Consider section "current" when scroll position is past section top minus offset
        if (scrollPos >= sectionTop - navHeight - 80) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        // Match #sectionId or sectionId.html (for same-page sections)
        if (href === `#${current}` || href === `${current}.html`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
// Run once on load in case a section is already in view (e.g. hash in URL)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateActiveNavLink, 100);
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and contact card only (not legal-content so Privacy/Terms are visible when scrolled to)
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .contact-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Handle form submissions (if any forms are added later)
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Form handling logic can be added here if needed
        });
    });
});

// Prevent default behavior for anchor links that point to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Language Switching Functionality
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
    
    // Language switcher button
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = currentLanguage === 'en' ? 'ar' : 'en';
            setLanguage(newLang);
        });
    }
});

// Function to format legal content with proper HTML structure
function formatLegalContent(text, lang) {
    const lines = text.split('\n').filter(line => line.trim());
    let html = '';
    let inList = false;
    let currentParagraph = '';
    
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Check if it's a numbered section heading (e.g., "1. Who We Are")
        if (/^\d+\.\s/.test(trimmedLine)) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            if (currentParagraph) {
                html += `<p>${currentParagraph}</p>`;
                currentParagraph = '';
            }
            html += `<h3>${trimmedLine}</h3>`;
        }
        // Check if it's a bullet point
        else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
            if (currentParagraph) {
                html += `<p>${currentParagraph}</p>`;
                currentParagraph = '';
            }
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            const listItem = trimmedLine.replace(/^[•-]\s*/, '');
            // Check if it has bold text (format: "Label: text")
            if (listItem.includes(':')) {
                const colonIndex = listItem.indexOf(':');
                const label = listItem.substring(0, colonIndex).trim();
                const text = listItem.substring(colonIndex + 1).trim();
                html += `<li><strong>${label}:</strong> ${text}</li>`;
            } else {
                html += `<li>${listItem}</li>`;
            }
        }
        // Regular paragraph
        else if (trimmedLine.length > 0) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            // Accumulate paragraph text
            if (currentParagraph) {
                currentParagraph += ' ' + trimmedLine;
            } else {
                currentParagraph = trimmedLine;
            }
        } else {
            // Empty line - close current paragraph if exists
            if (currentParagraph) {
                html += `<p>${currentParagraph}</p>`;
                currentParagraph = '';
            }
        }
    });
    
    // Close any open tags
    if (inList) {
        html += '</ul>';
    }
    if (currentParagraph) {
        // Check for email links
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        if (emailRegex.test(currentParagraph)) {
            currentParagraph = currentParagraph.replace(emailRegex, '<a href="mailto:$1">$1</a>');
        }
        html += `<p>${currentParagraph}</p>`;
    }
    
    // Add contact box for privacy and terms at the end
    const contactBoxHtml = `
        <div class="contact-box">
            <p><strong>AliSend Ltd</strong><br>
            ${lang === 'ar' ? 'رقم الشركة:' : 'Company Number:'} 16782887<br>
            167–169 Great Portland Street<br>
            ${lang === 'ar' ? 'الطابق الخامس' : '5th Floor'}<br>
            ${lang === 'ar' ? 'لندن' : 'London'}<br>
            W1W 5PF<br>
            ${lang === 'ar' ? 'المملكة المتحدة' : 'United Kingdom'}</p>
            <p>${lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'} <a href="mailto:info@alisend.co.uk">info@alisend.co.uk</a></p>
        </div>
    `;
    
    html += contactBoxHtml;
    
    return html;
}

// Function to set language
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    const htmlRoot = document.getElementById('htmlRoot');
    const currentLangSpan = document.getElementById('currentLang');
    
    // Update HTML lang and dir attributes
    if (lang === 'ar') {
        htmlRoot.setAttribute('lang', 'ar');
        htmlRoot.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
        if (currentLangSpan) currentLangSpan.textContent = 'AR';
    } else {
        htmlRoot.setAttribute('lang', 'en');
        htmlRoot.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
        if (currentLangSpan) currentLangSpan.textContent = 'EN';
    }
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        
        // Special handling for legal content - we'll update the existing HTML structure
        if (key === 'privacy.content' || key === 'terms.content') {
            // Check if we're on a separate page (privacy.html or terms.html)
            const isSeparatePage = window.location.pathname.includes('privacy.html') || 
                                   window.location.pathname.includes('terms.html');
            
            // Check if element already has substantial HTML content
            const hasExistingContent = element.innerHTML.trim().length > 500;
            
            const content = translations[lang][key];
            
            if (content) {
                // On separate pages, only update if content is missing or very short
                // This preserves the full HTML content that's already there
                if (isSeparatePage && hasExistingContent) {
                    // Keep existing content, don't replace
                    // Content is already in HTML format on separate pages
                    return; // Skip replacement
                } else {
                    // On index page or if content is missing, format and replace
                    const formattedContent = formatLegalContent(content, lang);
                    element.innerHTML = formattedContent;
                }
            }
        } else {
            const translation = translations[lang][key];
            if (translation) {
                // Check if element contains nested elements (like <strong>)
                if (element.children.length > 0) {
                    // For elements with children, update only text nodes
                    Array.from(element.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.textContent = translation;
                        }
                    });
                } else {
                    element.textContent = translation;
                }
            }
        }
    });
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        if (lang === 'ar') {
            metaDescription.setAttribute('content', 'شركة AliSend Ltd - خدمات تحويل الأموال الآمنة. أرسل الأموال عبر الحدود بثقة وسهولة.');
        } else {
            metaDescription.setAttribute('content', 'AliSend Ltd - Secure money remittance services. Send money across borders with confidence and ease.');
        }
    }
    
    // Update page title
    if (lang === 'ar') {
        document.title = 'AliSend Ltd - خدمات تحويل الأموال الآمنة';
    } else {
        document.title = 'AliSend Ltd - Secure Money Remittance Services';
    }
    
    // Close mobile menu if open
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
    }
}


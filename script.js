// ===== THEME MANAGEMENT =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Update theme toggle icon
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        
        // Add smooth transition effect
        document.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    updateThemeIcon() {
        const icon = this.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ===== SCREEN NAVIGATION =====
class ScreenManager {
    constructor() {
        this.screens = document.querySelectorAll('.screen');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.backButtons = document.querySelectorAll('.back-btn');
        this.currentScreen = 'auth';
        this.init();
    }

    init() {
        // Navigation buttons
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = btn.getAttribute('data-screen');
                if (screen) {
                    this.navigateToScreen(screen + 'Screen');
                    this.updateActiveNavButton(btn);
                }
            });
        });

        // Back buttons
        this.backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.navigateToScreen('dashboardScreen');
                this.updateActiveNavButton(document.querySelector('[data-screen="dashboard"]'));
            });
        });

        // Auth form submission (simulate login)
        this.setupAuthForms();
        
        // Quick action buttons
        this.setupQuickActions();
    }

    navigateToScreen(screenId) {
        // Hide all screens
        this.screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Add entrance animation
            targetScreen.style.animation = 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    updateActiveNavButton(activeBtn) {
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn?.classList.add('active');
    }

    setupAuthForms() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        // Tab switching
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Update active tab
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active form
                authForms.forEach(form => form.classList.remove('active'));
                document.getElementById(targetTab + 'Form')?.classList.add('active');
            });
        });

        // Form submissions
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.simulateLogin();
        });

        registerForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.simulateRegistration();
        });
    }

    simulateLogin() {
        const submitBtn = document.querySelector('#loginForm .primary-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.navigateToScreen('dashboardScreen');
            this.updateActiveNavButton(document.querySelector('[data-screen="dashboard"]'));
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show welcome notification
            this.showNotification('Welcome back! Successfully signed in.', 'success');
        }, 2000);
    }

    simulateRegistration() {
        const submitBtn = document.querySelector('#registerForm .primary-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.navigateToScreen('dashboardScreen');
            this.updateActiveNavButton(document.querySelector('[data-screen="dashboard"]'));
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show welcome notification
            this.showNotification('Account created successfully! Welcome to Multi Tool Pro.', 'success');
        }, 2500);
    }

    setupQuickActions() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.getAttribute('data-tool');
                this.openTool(tool);
            });
        });
    }

    openTool(toolName) {
        // Simulate tool opening with loading state
        this.showNotification(`Opening ${toolName}...`, 'info');
        
        // Navigate to tools screen
        setTimeout(() => {
            this.navigateToScreen('toolsScreen');
            this.updateActiveNavButton(document.querySelector('[data-screen="tools"]'));
        }, 1000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass);
            backdrop-filter: var(--blur);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 16px 20px;
            color: var(--text-primary);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// ===== DASHBOARD FEATURES =====
class DashboardManager {
    constructor() {
        this.stats = {
            toolsUsed: 24,
            timeSaved: 2.4,
            successRate: 98
        };
        this.init();
    }

    init() {
        this.startRealTimeUpdates();
        this.setupInteractiveElements();
    }

    startRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateStats();
            this.updateStatusIndicator();
        }, 30000); // Update every 30 seconds
        
        // Animate numbers on page load
        setTimeout(() => {
            this.animateStats();
        }, 1000);
    }

    updateStats() {
        // Simulate random stat changes
        const changes = {
            toolsUsed: Math.floor(Math.random() * 3),
            timeSaved: (Math.random() * 0.2).toFixed(1),
            successRate: Math.random() > 0.8 ? 1 : 0
        };

        Object.keys(changes).forEach(key => {
            this.stats[key] += changes[key];
        });

        // Update UI
        this.renderStats();
    }

    animateStats() {
        const statElements = document.querySelectorAll('.stat-content h3');
        statElements.forEach((element, index) => {
            const target = parseInt(element.textContent) || parseFloat(element.textContent);
            this.animateNumber(element, 0, target, 2000);
        });
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const isFloat = element.textContent.includes('.');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutQuart(progress);
            element.textContent = isFloat ? current.toFixed(1) + 'h' : Math.floor(current) + (element.textContent.includes('%') ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    renderStats() {
        // Update stat displays (would be implemented with actual data)
        console.log('Stats updated:', this.stats);
    }

    updateStatusIndicator() {
        const statusDot = document.querySelector('.status-dot');
        const statusText = statusDot?.parentElement.querySelector('span:last-child');
        
        if (statusDot && statusText) {
            // Simulate different system states
            const states = [
                { class: 'online', text: 'All systems operational' },
                { class: 'warning', text: 'Minor issues detected' },
                { class: 'error', text: 'System maintenance' }
            ];
            
            const randomState = states[Math.floor(Math.random() * states.length)];
            statusDot.className = `status-dot ${randomState.class}`;
            statusText.textContent = randomState.text;
        }
    }

    setupInteractiveElements() {
        // Add hover effects and interactions
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-4px) scale(1)';
            });
        });

        // Activity item interactions
        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            item.addEventListener('click', () => {
                item.style.background = 'var(--primary-gradient)';
                item.style.color = 'white';
                
                setTimeout(() => {
                    item.style.background = '';
                    item.style.color = '';
                }, 200);
            });
        });
    }
}

// ===== TOOLS SCREEN FEATURES =====
class ToolsManager {
    constructor() {
        this.tools = [];
        this.filteredTools = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupSearchFunctionality();
        this.setupFilters();
        this.setupToolInteractions();
        this.loadTools();
    }

    setupSearchFunctionality() {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTools(e.target.value);
            });
        }
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Apply filter
                const filter = btn.textContent.toLowerCase();
                this.applyFilter(filter);
            });
        });
    }

    setupToolInteractions() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', () => {
                this.openTool(card);
            });
            
            // Add ripple effect
            card.addEventListener('mousedown', (e) => {
                this.createRipple(e, card);
            });
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    searchTools(query) {
        const toolCards = document.querySelectorAll('.tool-card');
        const categories = document.querySelectorAll('.category');
        
        if (!query.trim()) {
            // Show all tools
            toolCards.forEach(card => card.style.display = 'block');
            categories.forEach(cat => cat.style.display = 'block');
            return;
        }
        
        const searchTerm = query.toLowerCase();
        let hasVisibleTools = false;
        
        categories.forEach(category => {
            const categoryTools = category.querySelectorAll('.tool-card');
            let categoryHasVisibleTools = false;
            
            categoryTools.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    categoryHasVisibleTools = true;
                    hasVisibleTools = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            category.style.display = categoryHasVisibleTools ? 'block' : 'none';
        });
        
        // Show no results message if needed
        this.toggleNoResults(!hasVisibleTools);
    }

    applyFilter(filter) {
        // Implementation for filtering tools
        console.log('Applying filter:', filter);
    }

    toggleNoResults(show) {
        let noResultsMsg = document.querySelector('.no-results');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.style.cssText = `
                text-align: center;
                padding: 40px 20px;
                color: var(--text-secondary);
                font-size: 16px;
            `;
            noResultsMsg.innerHTML = `
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>No tools found matching your search.</p>
            `;
            
            document.querySelector('.tool-categories').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    openTool(toolCard) {
        const toolName = toolCard.querySelector('h4').textContent;
        
        // Add loading state
        toolCard.style.transform = 'scale(0.95)';
        toolCard.style.opacity = '0.7';
        
        setTimeout(() => {
            toolCard.style.transform = '';
            toolCard.style.opacity = '';
            
            // Show tool opening notification
            const screenManager = window.screenManager;
            screenManager?.showNotification(`Opening ${toolName}...`, 'info');
        }, 200);
    }

    loadTools() {
        // Simulate loading tools data
        console.log('Loading tools...');
    }
}

// ===== SETTINGS MANAGER =====
class SettingsManager {
    constructor() {
        this.settings = {
            theme: 'dark',
            notifications: true,
            privacy: false
        };
        this.init();
    }

    init() {
        this.setupToggleSwitches();
        this.setupProfileActions();
        this.setupAccountActions();
        this.loadSettings();
    }

    setupToggleSwitches() {
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const settingName = e.target.id.replace('Switch', '').toLowerCase();
                this.updateSetting(settingName, e.target.checked);
                
                // Special handling for theme toggle
                if (settingName === 'theme') {
                    window.themeManager?.toggleTheme();
                }
            });
        });
    }

    setupProfileActions() {
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        const editAvatarBtn = document.querySelector('.edit-avatar');
        
        editProfileBtn?.addEventListener('click', () => {
            this.openProfileEditor();
        });
        
        editAvatarBtn?.addEventListener('click', () => {
            this.openAvatarEditor();
        });
    }

    setupAccountActions() {
        const accountButtons = document.querySelectorAll('.account-btn');
        accountButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.querySelector('span').textContent;
                this.handleAccountAction(action);
            });
        });
    }

    updateSetting(name, value) {
        this.settings[name] = value;
        localStorage.setItem('settings', JSON.stringify(this.settings));
        
        // Show confirmation
        window.screenManager?.showNotification(`${name} setting updated`, 'success');
    }

    openProfileEditor() {
        window.screenManager?.showNotification('Profile editor opening...', 'info');
    }

    openAvatarEditor() {
        window.screenManager?.showNotification('Avatar editor opening...', 'info');
    }

    handleAccountAction(action) {
        switch(action) {
            case 'Upgrade to Pro':
                window.screenManager?.showNotification('Redirecting to upgrade page...', 'info');
                break;
            case 'Help & Support':
                window.screenManager?.showNotification('Opening support center...', 'info');
                break;
            case 'Terms & Privacy':
                window.screenManager?.showNotification('Loading terms and privacy...', 'info');
                break;
            case 'Sign Out':
                this.handleSignOut();
                break;
        }
    }

    handleSignOut() {
        const confirmSignOut = confirm('Are you sure you want to sign out?');
        if (confirmSignOut) {
            // Clear user data
            localStorage.removeItem('userToken');
            
            // Navigate back to auth screen
            window.screenManager?.navigateToScreen('authScreen');
            window.screenManager?.showNotification('Successfully signed out', 'success');
        }
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.applySettings();
        }
    }

    applySettings() {
        // Apply saved settings to UI
        Object.keys(this.settings).forEach(key => {
            const toggle = document.getElementById(key + 'Switch');
            if (toggle) {
                toggle.checked = this.settings[key];
            }
        });
    }
}

// ===== INPUT ENHANCEMENTS =====
class InputEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupInputAnimations();
        this.setupFormValidation();
    }

    setupInputAnimations() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        
        inputs.forEach(input => {
            // Focus animations
            input.addEventListener('focus', () => {
                const container = input.closest('.input-container');
                if (container) {
                    container.classList.add('focused');
                }
            });
            
            input.addEventListener('blur', () => {
                const container = input.closest('.input-container');
                if (container) {
                    container.classList.remove('focused');
                }
            });
            
            // Typing animations
            input.addEventListener('input', () => {
                const container = input.closest('.input-container');
                if (container) {
                    if (input.value) {
                        container.classList.add('has-value');
                    } else {
                        container.classList.remove('has-value');
                    }
                }
            });
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateInput(input);
                    }
                });
            });
        });
    }

    validateInput(input) {
        const container = input.closest('.input-container');
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error state
        input.classList.remove('error');
        container?.classList.remove('error');
        
        // Check if empty
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Password validation
        if (input.type === 'password' && input.value) {
            if (input.value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters';
            }
        }
        
        // Apply error state
        if (!isValid) {
            input.classList.add('error');
            container?.classList.add('error');
            this.showInputError(container, errorMessage);
        } else {
            this.hideInputError(container);
        }
        
        return isValid;
    }

    showInputError(container, message) {
        if (!container) return;
        
        let errorElement = container.querySelector('.input-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'input-error';
            errorElement.style.cssText = `
                color: var(--error);
                font-size: 12px;
                margin-top: 4px;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            container.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        requestAnimationFrame(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        });
    }

    hideInputError(container) {
        if (!container) return;
        
        const errorElement = container.querySelector('.input-error');
        if (errorElement) {
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                errorElement.remove();
            }, 300);
        }
    }
}

// ===== PERFORMANCE OPTIMIZER =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    setupIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.stat-card, .tool-card, .activity-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    }

    preloadCriticalResources() {
        // Preload critical fonts and images
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        preloadLink.as = 'style';
        document.head.appendChild(preloadLink);
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        // Tab navigation for custom elements
        const interactiveElements = document.querySelectorAll('.nav-btn, .action-btn, .tool-card');
        
        interactiveElements.forEach((element, index) => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
        
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }

    setupAriaLabels() {
        // Add ARIA labels to interactive elements
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            const label = btn.querySelector('span')?.textContent || 'Navigation';
            btn.setAttribute('aria-label', label);
            btn.setAttribute('role', 'button');
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Toggle theme');
        }
    }

    setupFocusManagement() {
        // Focus trapping for modals (if any)
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        // Skip links for screen readers
        this.addSkipLinks();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-gradient);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    handleEscapeKey() {
        // Close any open modals or return to previous screen
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && activeScreen.id !== 'authScreen' && activeScreen.id !== 'dashboardScreen') {
            window.screenManager?.navigateToScreen('dashboardScreen');
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    window.themeManager = new ThemeManager();
    window.screenManager = new ScreenManager();
    window.dashboardManager = new DashboardManager();
    window.toolsManager = new ToolsManager();
    window.settingsManager = new SettingsManager();
    window.inputEnhancer = new InputEnhancer();
    window.performanceOptimizer = new PerformanceOptimizer();
    window.accessibilityManager = new AccessibilityManager();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .input-container.focused .input-icon {
            color: #6366f1 !important;
            transform: translateY(-50%) scale(1.1);
        }
        
        .input-container.error input {
            border-color: var(--error) !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .input-container.error .input-icon {
            color: var(--error) !important;
        }
        
        .notification {
            animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .status-dot.warning {
            background: var(--warning);
        }
        
        .status-dot.error {
            background: var(--error);
        }
        
        .skip-link:focus {
            clip: auto !important;
            height: auto !important;
            margin: 0;
            overflow: visible !important;
            position: absolute !important;
            width: auto !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Multi Tool Pro initialized successfully! 🚀');
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
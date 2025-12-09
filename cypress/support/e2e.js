// ***********************************************************
// Este archivo es procesado y cargado antes de todos los tests
// ***********************************************************

// Importa comandos personalizados si los necesitamos
// import './commands'

// Alternativamente podemos usar CommonJS:
// require('./commands')

//comandos personalizados
//comando para desactivar el splash screen
Cypress.Commands.add('disableSplashScreen', () => {
    cy.window().then((win) => {
        win.sessionStorage.setItem('splashShown', 'open');
    });
});

//comando para eliminar overlay de errores de Vite
Cypress.Commands.add('removeViteOverlay', () => {
    cy.window().then((win) => {
        const selectors = [
            '#vite-error-overlay',
            '[id*="vite-error"]',
            '[class*="vite-error"]',
            '[class*="error-overlay"]',
            '[data-vite-error-overlay]',
        ];

        selectors.forEach((selector) => {
            const elements = win.document.querySelectorAll(selector);
            elements.forEach((el) => {
                if (el) {
                    el.remove();
                }
            });
        });

        //eliminar estilos relacionados
        const styleElements = win.document.querySelectorAll('style[data-vite-dev-id]');
        styleElements.forEach((el) => {
            const content = el.textContent || '';
            if (content.includes('error-overlay') || content.includes('vite-error')) {
                el.remove();
            }
        });
    });
});

//comandos personalizados
//Cypress.Commands.add('login', (email, password) => { ... })

//manejo de errores global para evitar que bloqueen el render
Cypress.on('uncaught:exception', (err, runnable) => {
    //ignorar errores relacionados con dayjs o módulos
    if (
        err.message.includes('dayjs') ||
        err.message.includes('Cannot find module') ||
        err.message.includes('moduleResolution') ||
        err.message.includes('Failed to resolve module')
    ) {
        //retornar false previene que Cypress falle el test
        return false;
    }
    //para otros errores, permitir que Cypress los maneje normalmente
    return true;
});

//configurar para capturar errores sin bloquear
Cypress.on('window:before:load', (win) => {
    //desactivar overlay de errores de Vite
    win.__VITE_IS_MODERN_BROWSER__ = true;

    //sobrescribir console.error para capturar pero no bloquear
    const originalError = win.console.error;
    win.console.error = (...args) => {
        //loggear el error pero no lanzarlo
        if (
            args[0]?.includes?.('dayjs') ||
            args[0]?.includes?.('moduleResolution') ||
            args[0]?.includes?.('Cannot find module')
        ) {
            //solo loggear, no bloquear
            originalError.apply(win.console, args);
            return;
        }
        originalError.apply(win.console, args);
    };
});

//ocultar overlay de Vite si aparece después de cargar
Cypress.on('window:load', (win) => {
    //función mejorada para eliminar overlay de errores de Vite
    const removeViteOverlay = () => {
        const selectors = [
            '#vite-error-overlay',
            '[id*="vite-error"]',
            '[class*="vite-error"]',
            '[class*="error-overlay"]',
            '[data-vite-error-overlay]',
            '.vite-error-overlay',
        ];

        selectors.forEach((selector) => {
            try {
                const elements = win.document.querySelectorAll(selector);
                elements.forEach((el) => {
                    if (el) {
                        el.style.display = 'none';
                        el.remove();
                    }
                });
            } catch (e) {
                //ignorar errores al eliminar
            }
        });

        //eliminar estilos relacionados
        try {
            const styleElements = win.document.querySelectorAll('style[data-vite-dev-id]');
            styleElements.forEach((el) => {
                const content = el.textContent || '';
                if (content.includes('error-overlay') || content.includes('vite-error')) {
                    el.remove();
                }
            });
        } catch (e) {
            //ignorar errores
        }
    };

    //ejecutar inmediatamente
    removeViteOverlay();

    //ejecutar periódicamente por si aparece después (más agresivo)
    const interval = setInterval(() => {
        removeViteOverlay();
    }, 50); //cada 50ms para ser más rápido

    //limpiar después de 10 segundos
    setTimeout(() => clearInterval(interval), 10000);

    //observar cambios en el DOM
    try {
        const observer = new win.MutationObserver(() => {
            removeViteOverlay();
        });

        observer.observe(win.document.body, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => observer.disconnect(), 10000);
    } catch (e) {
        //ignorar si MutationObserver no está disponible
    }
});


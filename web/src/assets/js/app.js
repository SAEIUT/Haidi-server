window.addEventListener('load', fn, false);

function fn() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            preloader.style.opacity = '0';
        }, 350);
    }
}

/*********************/
/*     Menus         */
/*********************/

function windowScroll() {
    const navbar = document.getElementById("navbar");
    if (navbar) {
        if (
            document.body.scrollTop >= 50 ||
            document.documentElement.scrollTop >= 50
        ) {
            navbar.classList.add("is-sticky");
        } else {
            navbar.classList.remove("is-sticky");
        }
    }
}

window.addEventListener('scroll', (ev) => {
    ev.preventDefault();
    windowScroll();
});

// Navbar Active Class
try {
    var spy = new Gumshoe('#navbar-navlist a', {
        offset: 80
    });
} catch (error) {
    console.error("Erreur avec Gumshoe:", error);
}

// Smooth scroll 
try {
    var scroll = new SmoothScroll('#navbar-navlist a', {
        speed: 800,
        offset: 80
    });
} catch (error) {
    console.error("Erreur avec SmoothScroll:", error);
}

// Menu Collapse
const toggleCollapse = (elementId, show = true) => {
    const collapseEl = document.getElementById(elementId);
    if (collapseEl) {
        if (show) {
            collapseEl.classList.remove('hidden');
        } else {
            collapseEl.classList.add('hidden');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Toggle target elements using [data-collapse]
    document.querySelectorAll('[data-collapse]').forEach(function (collapseToggleEl) {
        var collapseId = collapseToggleEl.getAttribute('data-collapse');

        collapseToggleEl.addEventListener('click', function () {
            const collapseElement = document.getElementById(collapseId);
            if (collapseElement) {
                toggleCollapse(collapseId, collapseElement.classList.contains('hidden'));
            }
        });
    });
});

window.toggleCollapse = toggleCollapse;

/*********************/
/*    Back To TOp    */
/*********************/

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    var mybutton = document.getElementById("back-to-top");
    if (mybutton) {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            mybutton.classList.add("block");
            mybutton.classList.remove("hidden");
        } else {
            mybutton.classList.add("hidden");
            mybutton.classList.remove("block");
        }
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
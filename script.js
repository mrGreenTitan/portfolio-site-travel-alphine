console.log("Файл script.js підключено!");

const menuNavBurger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');

let closeMobileMenu = function() {
    if (!menuNavBurger || !navLinks) return;

    menuNavBurger.classList.remove('open');
    menuNavBurger.classList.add('close');
    navLinks.classList.remove('active');
    navLinks.classList.add('close');
};

if (menuNavBurger && navLinks) {
    menuNavBurger.classList.add('close');
    navLinks.classList.add('close');

    menuNavBurger.addEventListener('click', function() {
        menuNavBurger.classList.toggle('open');
        menuNavBurger.classList.toggle('close');

        navLinks.classList.toggle('active');
        navLinks.classList.toggle('close');
    });
}

if (navLinks) {
    navLinks.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', closeMobileMenu);
    });
}

const searchInp = document.querySelector('.wrap-search-inp input');

if (searchInp) {
    let actualPlaceholder = function() {
        let w = window.innerWidth;

        if (w < 411) {
            searchInp.placeholder = 'Пошук';
        } else if (w < 476) {
            searchInp.placeholder = 'Куди хочете поїхати?';
        } else if (w < 506) {
            searchInp.placeholder = 'Оберіть напрямок подорожі...';
        } else if (w < 540) {
            searchInp.placeholder = 'Знайдіть свій наступний напрямок...';
        } else {
            searchInp.placeholder = 'Знайдіть місце, місто або напрямок...';
        }
    };

    actualPlaceholder();

    window.addEventListener('resize', actualPlaceholder);

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', actualPlaceholder);
    }
}

let getCardsView = function() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 980) return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
};

let setCarouselArrowState = function(arrow, isDisabled) {
    if (!arrow) return;

    arrow.disabled = isDisabled;
    arrow.classList.toggle('is-disabled', isDisabled);
    arrow.setAttribute('aria-disabled', isDisabled);
};

let initCarousel = function(options) {
    const tracks = options.trackSelectors
        .map(function(selector) {
            return document.querySelector(selector);
        })
        .filter(Boolean);

    const arrowLeft = document.querySelector(options.arrowLeftSelector);
    const arrowRight = document.querySelector(options.arrowRightSelector);
    const mainTrack = tracks[0];

    if (!mainTrack || !arrowLeft || !arrowRight) return;

    let indexCard = 0;

    let getGap = function(track) {
        let gap = parseFloat(getComputedStyle(track).gap);
        return gap || 0;
    };

    let getStep = function(track) {
        if (!track.children.length) return 0;
        return track.children[0].offsetWidth + getGap(track);
    };

    let getMaxIndex = function() {
        return Math.max(0, mainTrack.children.length - getCardsView());
    };

    let update = function() {
        let maxIndex = getMaxIndex();
        indexCard = Math.min(Math.max(indexCard, 0), maxIndex);

        tracks.forEach(function(track) {
            track.style.transform = `translateX(-${indexCard * getStep(track)}px)`;
        });

        setCarouselArrowState(arrowLeft, indexCard === 0);
        setCarouselArrowState(arrowRight, indexCard === maxIndex);
    };

    arrowLeft.addEventListener('click', function() {
        indexCard -= 1;
        update();
    });

    arrowRight.addEventListener('click', function() {
        indexCard += 1;
        update();
    });

    window.addEventListener('resize', update);
    update();
};

initCarousel({
    trackSelectors: ['.carousel-content'],
    arrowLeftSelector: '.carousel-navigation--arrleft',
    arrowRightSelector: '.carousel-navigation--arrright',
});

initCarousel({
    trackSelectors: [
        '.blog-latestphoto-carousel-content',
        '.blog-latestph-carou-content-info',
    ],
    arrowLeftSelector: '.blog-latestphoto-carousel--arrleft',
    arrowRightSelector: '.blog-latestphoto-carousel--arrright',
});

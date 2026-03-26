document.addEventListener('DOMContentLoaded', function () {
    const IsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


    const lenis = new Lenis({
        // параметры настройки
        lerp: 0.08, // коэффициент сглаживания (0 - 1)
        smooth: true, // включить плавный скролл
        direction: 'vertical', // направление скролла (vertical or horizontal)
        smoothWheel: true, // плавный скролл колесом мыши
        smoothTouch: false, // плавный скролл при касании (mobile)
        infinite: false // бесконечный скролл
    })

    // запуск анимации скролла
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    requestAnimationFrame(() => {
        let height = document.body.scrollHeight;
        document.body.style.height = height + 'px';
    });

    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href')

            // если это просто #
            if (!href || href === '#') return

            const targetId = href.split('#')[1]
            const target = document.getElementById(targetId)

            if (target) {
                e.preventDefault()

                document.querySelector('.burger-menu').classList.remove('opened');
                document.querySelector('html').classList.remove('overflow_hidden');

                lenis.scrollTo(target, {
                    offset: -70,
                    duration: 1.2,
                    easing: (t) => 1 - Math.pow(1 - t, 3)
                })
            }
        })
    })

    const aboutTabs = document.querySelector('.about-block__tabs');

    if (aboutTabs) {
        const titlesWrapper = aboutTabs.querySelector('.about-block__tabs-titles');

        aboutTabs.querySelectorAll('.about-block__tabs-title a').forEach((item, index) => {
            item.addEventListener('click', () => {
                const itemTop = item.getBoundingClientRect().top;
                const wrapperTop = titlesWrapper.getBoundingClientRect().top;
                const arrowPosition = itemTop - wrapperTop + 12;

                aboutTabs.querySelectorAll('.about-block__tabs-title a').forEach((el) => el.classList.remove('active'));
                item.classList.add('active');

                document.querySelectorAll('.about-block__tabs-body').forEach((el) => el.classList.remove('active'));
                document.querySelectorAll('.about-block__tabs-body')[index].classList.add('active')

                document.documentElement.style.setProperty('--arrow-position', arrowPosition + 'px');
            })
        })
    }

    const albumsTabs = document.querySelector('.albums-block__tabs');

    if (albumsTabs) {
        albumsTabs.querySelectorAll('.albums-block__tabs-image a').forEach((item, index) => {
            item.addEventListener('click', () => {
                albumsTabs.querySelectorAll('.albums-block__tabs-image a').forEach((el) => el.classList.remove('active'));
                item.classList.add('active');

                document.querySelectorAll('.albums-block__item').forEach((el) => el.classList.remove('active'));
                document.querySelectorAll('.albums-block__item')[index].classList.add('active')

            })
        })
    }

    const aboutSlider = document.querySelector('.about-block__slider');
    if (aboutSlider) {
        const SWIPER = new Swiper('.swiper.about-block__slider', {
            slidesPerView: 1,
            loop: true,
            effect: 'slide',
            speed: 1000,
            spaceBetween: 0,
            lazy: {
                loadPrevNext: true, // pre-loads the next image to avoid showing a loading placeholder if possible
                loadPrevNextAmount: 2 //or, if you wish, preload the next 2 images
            },
            autoplay: {
                delay: 999999,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.about-block__slider .swiper-pagination',
                clickable: true,
            }
        });
    }

    const burgerBtn = document.querySelector('.site-header__burger-btn a');
    const burgerCloser = document.querySelector('.burger-menu__closer a');
    const burgerMenu = document.querySelector('.burger-menu');
    const headerMenu = document.querySelector('.site-header__header-menu nav');
    const burgerMenuInner = burgerMenu.querySelector('.burger-menu__inner');

    function isMobileView() {
        return window.innerWidth <= 1260 || (typeof IsMobile !== 'undefined' && IsMobile);
    }

    function updateMenuPosition() {
        if (isMobileView()) {
            if (!burgerMenuInner.contains(headerMenu)) {
                burgerMenuInner.appendChild(headerMenu);
            }
        } else {
            const headerContainer = document.querySelector('.site-header__header-menu');
            if (!headerContainer.contains(headerMenu)) {
                headerContainer.appendChild(headerMenu);
            }
            burgerMenu.classList.remove('opened');
            document.querySelector('html').classList.remove('overflow_hidden');
        }
    }

    updateMenuPosition();

    burgerBtn.addEventListener('click', (e) => {
        burgerMenu.classList.toggle('opened');
        document.querySelector('html').classList.toggle('overflow_hidden');
    });

    burgerCloser.addEventListener('click', (e) => {
        burgerMenu.classList.remove('opened');
        document.querySelector('html').classList.remove('overflow_hidden');
    });

    document.addEventListener('click', (e) => {
        if (burgerMenu.classList.contains('opened') &&
            !burgerMenuInner.contains(e.target) &&
            e.target !== burgerBtn) {
            burgerMenu.classList.remove('opened');
            document.querySelector('html').classList.remove('overflow_hidden');
        }
    });

    window.addEventListener('resize', updateMenuPosition);

    gsap.registerPlugin(ScrollTrigger);

    const blocks = document.querySelectorAll(".tours-block__column-title, .tours-block__music-title, .about-block__tabs-bodies, .press-kit-block__title, .press-kit-block__text, .press-kit-block__btn, .about-us-block__title, .about-us-block__text p, .about-us-block__videos-title, .about-us-block__videos-item, .about-us-block__gallery-item");

    blocks.forEach((block) => {
        gsap.set(block, { opacity: 0, y: 100 });

        ScrollTrigger.create({
            trigger: block,
            start: "top 95%",
            onEnter: () => {
                gsap.to(block, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
            }
        });
    });

    const items = document.querySelectorAll('.our-team-block__item, .about-block__tabs-title, .gallery-block__item');

    // Настраиваем анимацию для каждого элемента
    items.forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                y: 100
            },
            {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                    trigger: item,
                    start: "top 95%", // Настраиваем когда запускать анимацию
                    stagger: 3 // Задержка между анимацией элементов
                },
                duration: 1, // Длительность анимации
                delay: (index % 5) * 0.20 // Задержка между элементами в ряду по 4
            }
        );
    });

    const items2 = document.querySelectorAll('.tours-block__item, .tours-block__music-item, .tours-block__more-btn');

	const groups = new Map();
	
	items2.forEach((item) => {
	    const parent = item.parentElement;
	    if (!groups.has(parent)) {
	        groups.set(parent, []);
	    }
	    groups.get(parent).push(item);
	});
	
	const isMobile = window.innerWidth <= 768;
	
	groups.forEach((groupItems) => {
	    groupItems.forEach((item, index) => {
	        gsap.fromTo(item,
	            {
	                opacity: 0,
	                y: 30
	            },
	            {
	                opacity: 1,
	                y: 0,
	                scrollTrigger: {
	                    trigger: item.parentElement,
	                    start: isMobile ? "top 110%" : "top 95%",
	                },
	                duration: 1,
	                delay: index * 0.20
	            }
	        );
	    });
	});

    let aboutSwiper = null;

    const gallerySlider = () => {
        const aboutUsSlider = document.querySelector('.about-us-block__gallery');

        if (!aboutUsSlider) return;
        if (window.innerWidth <= 1024) {
            if (!aboutSwiper) {
                aboutSwiper = new Swiper('.swiper.about-us-block__gallery', {
                    slidesPerView: 4,
                    loop: true,
                    effect: 'slide',
                    speed: 1000,
                    spaceBetween: 10,
                    lazy: {
                        loadPrevNext: true,
                        loadPrevNextAmount: 2
                    },
                    autoplay: {
                        delay: 999999,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    },
                    pagination: {
                        el: '.about-us-block__gallery-nav .swiper-pagination',
                        clickable: true,
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 2,
                        },
                        640: {
                            slidesPerView: 2,
                        },
                        980: {
                            slidesPerView: 4,
                        }
                    }
                });
            }

        } else {
            if (aboutSwiper) {
                aboutSwiper.destroy(true, true);
                aboutSwiper = null;
            }
        }
    };

    gallerySlider();
    window.addEventListener('resize', gallerySlider);

    Fancybox.bind("[data-fancybox]");


    /*document.querySelectorAll('.tours-block__column').forEach((column) => {
    
        const button = column.querySelector('.tours-block__more-btn a');
        const items = column.querySelectorAll('.tours-block__item');
        
        if (!button) return;

        if(items.length < 7) {
            button.style.display = 'none';
        }


        button.addEventListener('click', (e) => {
            e.preventDefault();
	        button.classList.toggle('active');
	        button.classList.contains('active') ? button.textContent = 'Hide' : button.textContent = 'See All';
            
            items.forEach((item, index) => {
                if (index >= 6) {
                    if (item.style.display === 'none' || getComputedStyle(item).display === 'none') {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
            
            lenis.resize()
        });

    });*/

})
/* ============================================================
	Love Paws Pet Sitting — main.js
	Navigation · Scroll effects · Scroll-reveal · Gallery
============================================================ */

(function () {
	'use strict';

	/* ── Navbar shadow on scroll ──────────────────────────── */
	var navbar = document.getElementById('navbar');
	window.addEventListener('scroll', function () {
		navbar.classList.toggle('scrolled', window.scrollY > 20);
	}, { passive: true });

	/* ── Hamburger / mobile menu ──────────────────────────── */
	var hamburger  = document.getElementById('hamburger');
	var mobileMenu = document.getElementById('mobileMenu');

	hamburger.addEventListener('click', function () {
		var isOpen = mobileMenu.classList.toggle('open');
		hamburger.classList.toggle('open', isOpen);
		hamburger.setAttribute('aria-expanded', String(isOpen));
	});

	mobileMenu.querySelectorAll('a').forEach(function (link) {
		link.addEventListener('click', closeMobileMenu);
	});

	document.addEventListener('click', function (e) {
		if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
			closeMobileMenu();
		}
	});

	function closeMobileMenu() {
		mobileMenu.classList.remove('open');
		hamburger.classList.remove('open');
		hamburger.setAttribute('aria-expanded', 'false');
	}

	/* ── Active nav link on scroll ────────────────────────── */
	var sections   = document.querySelectorAll('section[id]');
	var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

	function setActiveLink() {
		var current = '';
		sections.forEach(function (sec) {
			if (window.scrollY >= sec.offsetTop - 100) {
				current = sec.id;
			}
		});
		navAnchors.forEach(function (a) {
			a.classList.toggle('active', a.getAttribute('href') === '#' + current);
		});
	}

	window.addEventListener('scroll', setActiveLink, { passive: true });
	setActiveLink();

	/* ── Scroll-reveal ────────────────────────────────────── */
	var revealObserver = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	document.querySelectorAll('.reveal').forEach(function (el) {
		revealObserver.observe(el);
	});

	/* ── Gallery: arrows + dots navigation ───────────────── */
	var galleryRow  = document.getElementById('galleryRow');
	var prevBtn     = document.getElementById('galleryPrev');
	var nextBtn     = document.getElementById('galleryNext');
	var dotsWrap    = document.getElementById('galleryDots');

	if (galleryRow && prevBtn && nextBtn) {

		var cells     = galleryRow.querySelectorAll('.gallery-cell');
		var cellCount = cells.length;
		/* How many cells are visible at once (recalculated on resize) */
		var visible   = 1;
		var dots      = [];

		/* Build progress dots */
		function buildDots() {
			dotsWrap.innerHTML = '';
			dots = [];
			var pages = Math.ceil(cellCount / visible);
			for (var i = 0; i < pages; i++) {
				var d = document.createElement('button');
				d.className = 'gallery-dot';
				d.setAttribute('aria-label', 'Page ' + (i + 1));
				(function (page) {
					d.addEventListener('click', function () {
						scrollToPage(page);
					});
				}(i));
				dotsWrap.appendChild(d);
				dots.push(d);
			}
			updateState();
		}

		/* Measure how many cells fit in the viewport */
		function measureVisible() {
			if (!cells[0]) { return; }
			var cellW = cells[0].offsetWidth + 12; /* 12 = gap */
			var rowW  = galleryRow.clientWidth;
			visible = Math.max(1, Math.floor(rowW / cellW));
		}

		/* Scroll to a given page index */
		function scrollToPage(page) {
			if (!cells[0]) { return; }
			var cellW  = cells[0].offsetWidth + 12;
			var target = page * visible * cellW;
			galleryRow.scrollTo({ left: target, behavior: 'smooth' });
		}

		/* Current page based on scroll position */
		function currentPage() {
			if (!cells[0]) { return 0; }
			var cellW = cells[0].offsetWidth + 12;
			return Math.round(galleryRow.scrollLeft / (visible * cellW));
		}

		/* Update arrow disabled state + active dot */
		function updateState() {
			var page  = currentPage();
			var pages = Math.ceil(cellCount / visible);
			prevBtn.disabled = page <= 0;
			nextBtn.disabled = page >= pages - 1;
			dots.forEach(function (d, i) {
				d.classList.toggle('active', i === page);
			});
		}

		prevBtn.addEventListener('click', function () {
			scrollToPage(currentPage() - 1);
		});

		nextBtn.addEventListener('click', function () {
			scrollToPage(currentPage() + 1);
		});

		galleryRow.addEventListener('scroll', updateState, { passive: true });

		/* Touch/mouse drag for natural feel on desktop too */
		var isDragging = false;
		var startX     = 0;
		var startScroll = 0;

		galleryRow.addEventListener('mousedown', function (e) {
			isDragging  = true;
			startX      = e.pageX - galleryRow.offsetLeft;
			startScroll = galleryRow.scrollLeft;
			galleryRow.style.cursor = 'grabbing';
		});
		galleryRow.addEventListener('mouseleave', function () {
			isDragging = false;
			galleryRow.style.cursor = '';
		});
		galleryRow.addEventListener('mouseup', function () {
			isDragging = false;
			galleryRow.style.cursor = '';
		});
		galleryRow.addEventListener('mousemove', function (e) {
			if (!isDragging) { return; }
			e.preventDefault();
			var x    = e.pageX - galleryRow.offsetLeft;
			var walk = (x - startX) * 1.5;
			galleryRow.scrollLeft = startScroll - walk;
		});

		/* Init + rebuild on resize */
		function init() {
			measureVisible();
			buildDots();
		}

		init();

		var resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(init, 150);
		});
	}

}());

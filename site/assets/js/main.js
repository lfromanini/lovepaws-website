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
	var galleryRow = document.getElementById('galleryRow');
	var prevBtn    = document.getElementById('galleryPrev');
	var nextBtn    = document.getElementById('galleryNext');
	var dotsWrap   = document.getElementById('galleryDots');

	if (galleryRow && prevBtn && nextBtn) {

		var cells      = galleryRow.querySelectorAll('.gallery-cell');
		var cellCount  = cells.length;
		var visible    = 1;
		var dots       = [];
		var targetPage = 0;

		function totalPages() {
			return Math.ceil(cellCount / visible);
		}

		function cellW() {
			return cells[0] ? cells[0].offsetWidth + 12 : 232;
		}

		/* Update buttons and dots from targetPage */
		function updateState() {
			prevBtn.disabled = targetPage <= 0;
			nextBtn.disabled = targetPage >= totalPages() - 1;
			dots.forEach(function (d, i) {
				d.classList.toggle('active', i === targetPage);
			});
		}

		/* Scroll to targetPage using scrollBy — avoids absolute calc errors */
		function goToPage(page) {
			var pages = totalPages();
			var next  = Math.max(0, Math.min(page, pages - 1));
			var delta = next - targetPage;
			targetPage = next;
			galleryRow.scrollBy({ left: delta * visible * cellW(), behavior: 'smooth' });
			updateState();
		}

		/* Sync targetPage from actual scroll position (after manual swipe) */
		function syncFromScroll() {
			var cw   = cellW();
			var page = Math.round(galleryRow.scrollLeft / (visible * cw));
			targetPage = Math.max(0, Math.min(page, totalPages() - 1));
			updateState();
		}

		/* Build dots */
		function buildDots() {
			dotsWrap.innerHTML = '';
			dots = [];
			var pages = totalPages();
			for (var i = 0; i < pages; i++) {
				var d = document.createElement('button');
				d.className = 'gallery-dot';
				d.setAttribute('aria-label', 'Page ' + (i + 1));
				(function (page) {
					d.addEventListener('click', function () { goToPage(page); });
				}(i));
				dotsWrap.appendChild(d);
				dots.push(d);
			}
			updateState();
		}

		function measureVisible() {
			if (!cells[0]) { return; }
			visible = Math.max(1, Math.floor(galleryRow.clientWidth / cellW()));
		}

		/* Arrow buttons */
		prevBtn.addEventListener('click', function () { goToPage(targetPage - 1); });
		nextBtn.addEventListener('click', function () { goToPage(targetPage + 1); });

		/* Sync after manual touch/swipe ends */
		galleryRow.addEventListener('touchend', syncFromScroll, { passive: true });

		/* Mouse drag */
		var isDragging  = false;
		var startX      = 0;
		var startScroll = 0;

		galleryRow.addEventListener('mousedown', function (e) {
			isDragging  = true;
			startX      = e.pageX - galleryRow.offsetLeft;
			startScroll = galleryRow.scrollLeft;
			galleryRow.style.cursor = 'grabbing';
		});
		galleryRow.addEventListener('mouseleave', function () {
			if (isDragging) { isDragging = false; galleryRow.style.cursor = ''; syncFromScroll(); }
		});
		galleryRow.addEventListener('mouseup', function () {
			if (isDragging) { isDragging = false; galleryRow.style.cursor = ''; syncFromScroll(); }
		});
		galleryRow.addEventListener('mousemove', function (e) {
			if (!isDragging) { return; }
			e.preventDefault();
			galleryRow.scrollLeft = startScroll - (e.pageX - galleryRow.offsetLeft - startX) * 1.5;
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

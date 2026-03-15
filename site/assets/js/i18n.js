/* ============================================================
	Love Paws Pet Sitting — i18n.js
	Internationalisation: EN · NL · PT-BR

	data-i18n="section.key"          → sets textContent
	data-i18n-html="section.key"     → sets innerHTML (for text with <br>, <em>, etc.)
	data-i18n-placeholder="s.key"    → sets placeholder attribute
	data-i18n-aria="s.key"           → sets aria-label attribute

	Language preference is stored in localStorage and auto-detected
	from the browser when no preference has been saved.
============================================================ */

(function () {
	'use strict';

	var SUPPORTED    = ['en', 'nl', 'pt-BR'];
	var DEFAULT_LANG = 'en';
	var STORAGE_KEY  = 'lovepaws_lang';

	var currentLang  = DEFAULT_LANG;
	var strings      = {};

	/* ── Persistence ──────────────────────────────────────── */
	function getStored() {
		try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
	}

	function store(lang) {
		try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
	}

	/* ── Detect preferred language ────────────────────────── */
	function detectLang() {
		var saved = getStored();
		if (saved && SUPPORTED.indexOf(saved) !== -1) { return saved; }

		var bl = (navigator.language || navigator.userLanguage || '').toLowerCase();
		if (bl.startsWith('nl'))  { return 'nl'; }
		if (bl.startsWith('pt'))  { return 'pt-BR'; }
		return DEFAULT_LANG;
	}

	/* ── Resolve dot-notation key from loaded strings ─────── */
	function resolve(key) {
		return key.split('.').reduce(function (obj, part) {
			return (obj && obj[part] !== undefined) ? obj[part] : undefined;
		}, strings);
	}

	/* ── Apply all translations to the DOM ───────────────── */
	function applyTranslations() {
		/* Plain text */
		document.querySelectorAll('[data-i18n]').forEach(function (el) {
			var val = resolve(el.getAttribute('data-i18n'));
			if (val !== undefined) { el.textContent = val; }
		});

		/* HTML content (headlines with <br>, <em>, <strong>) */
		document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
			var val = resolve(el.getAttribute('data-i18n-html'));
			if (val !== undefined) { el.innerHTML = val; }
		});

		/* placeholder attributes */
		document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
			var val = resolve(el.getAttribute('data-i18n-placeholder'));
			if (val !== undefined) { el.setAttribute('placeholder', val); }
		});

		/* aria-label attributes */
		document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
			var val = resolve(el.getAttribute('data-i18n-aria'));
			if (val !== undefined) { el.setAttribute('aria-label', val); }
		});
	}

	/* ── Update active button in all switchers ────────────── */
	function updateSwitchers(lang) {
		document.querySelectorAll('.lang-btn').forEach(function (btn) {
			btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
		});
	}

	/* ── Load a language file and apply ──────────────────── */
	function loadLang(lang, isRetry) {
		fetch('lang/' + lang + '.json?' + Date.now())
			.then(function (res) {
				if (!res.ok) { throw new Error('HTTP ' + res.status); }
				return res.json();
			})
			.then(function (data) {
				strings     = data;
				currentLang = lang;
				store(lang);
				document.documentElement.setAttribute('lang', lang === 'pt-BR' ? 'pt-BR' : lang);
				applyTranslations();
				updateSwitchers(lang);
			})
			.catch(function (err) {
				console.warn('[i18n] Could not load language "' + lang + '":', err);
				if (!isRetry && lang !== DEFAULT_LANG) {
					loadLang(DEFAULT_LANG, true);
				}
			});
	}

	/* ── Wire up all switcher buttons ─────────────────────── */
	function bindButtons() {
		document.querySelectorAll('.lang-btn').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var lang = btn.getAttribute('data-lang');
				if (lang && lang !== currentLang) {
					loadLang(lang);
				}
			});
		});
	}

	/* ── Public API ───────────────────────────────────────── */
	window.i18n = {
		/**
		 * Resolve a dot-notation key from the currently loaded strings.
		 * Returns the English fallback string if the key is missing.
		 * @param {string} key   e.g. 'form_messages.err_name'
		 * @param {string} [fallback]  returned if key not found
		 */
		get: function (key, fallback) {
			var val = resolve(key);
			return (val !== undefined) ? val : (fallback || key);
		}
	};

	/* ── Init ─────────────────────────────────────────────── */
	function init() {
		bindButtons();
		loadLang(detectLang());
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

}());

/* ============================================================
	Love Paws Pet Sitting — contact.js
	Contact form: validation · hidden metadata · email send

	Email delivery uses FormSubmit (https://formsubmit.co).
	NO setup needed — works out of the box.

	First submission ever will trigger a one-time confirmation
	email to gabi@lovepawspetsitting.com. Click the link in
	that email once and all future submissions arrive directly.

	All user-facing strings are loaded from the active language
	via window.i18n.get() (set by i18n.js). Falls back to
	English if the i18n module is not yet ready.
============================================================ */

var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/gabi@lovepawspetsitting.com';

(function () {
	'use strict';

	var form      = document.getElementById('contactForm');
	var submitBtn = document.getElementById('formSubmit');
	var msgBox    = document.getElementById('formMessage');

	if (!form) { return; }

	/* ── i18n helper with English fallbacks ──────────────── */
	var FALLBACKS = {
		'form_messages.err_name':     'Oops! You forgot to fill in your name.',
		'form_messages.err_email':    'Please fill in with a valid email address.',
		'form_messages.err_whatsapp': 'Oops! You forgot to fill in your WhatsApp number.',
		'form_messages.err_phone':    'Fill in with a valid phone number.',
		'form_messages.err_subject':  'Oops! You forgot to select a subject.',
		'form_messages.err_message':  'Oops! You forgot to fill in your message.',
		'form_messages.sending':      'Sending\u2026',
		'form_messages.submit':       'Send',
		'form_messages.success':      "Message sent successfully! Thank you for contacting us. I\u2019ll get back to you soon.",
		'form_messages.err_network':  'Could not reach the server. Please check your connection or contact me via WhatsApp.',
		'form_messages.err_server':   'Could not send the message. Please try via WhatsApp or email directly.',
		'form_messages.err_detail':   'Technical detail'
	};

	function t(key) {
		if (window.i18n && typeof window.i18n.get === 'function') {
			return window.i18n.get(key, FALLBACKS[key] || key);
		}
		return FALLBACKS[key] || key;
	}

	/* ── Collect sender metadata ──────────────────────────── */
	function collectMetadata() {
		return new Promise(function (resolve) {
			var meta = {
				ip:      'unavailable',
				country: 'unknown',
				city:    'unknown',
				region:  'unknown',
				tz:      Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
				lang:    navigator.language || 'unknown',
				screen:  window.screen.width + 'x' + window.screen.height,
				browser: parseBrowser(navigator.userAgent),
				os:      parseOS(navigator.userAgent),
				sentAt:  new Date().toISOString()
			};

			fetch('https://ipapi.co/json/', { cache: 'no-store' })
				.then(function (res) { return res.ok ? res.json() : {}; })
				.then(function (geo) {
					meta.ip      = geo.ip           || meta.ip;
					meta.country = geo.country_name || meta.country;
					meta.city    = geo.city         || meta.city;
					meta.region  = geo.region       || meta.region;
					resolve(meta);
				})
				.catch(function () { resolve(meta); });
		});
	}

	function parseBrowser(ua) {
		if (/Edg/.test(ua))       { return 'Microsoft Edge'; }
		if (/OPR|Opera/.test(ua)) { return 'Opera'; }
		if (/Chrome/.test(ua))    { return 'Chrome'; }
		if (/Firefox/.test(ua))   { return 'Firefox'; }
		if (/Safari/.test(ua))    { return 'Safari'; }
		return 'Unknown';
	}

	function parseOS(ua) {
		if (/Windows NT 10/.test(ua)) { return 'Windows 10/11'; }
		if (/Windows/.test(ua))       { return 'Windows'; }
		if (/Mac OS X/.test(ua))      { return 'macOS'; }
		if (/iPhone|iPad/.test(ua))   { return 'iOS'; }
		if (/Android/.test(ua))       { return 'Android'; }
		if (/Linux/.test(ua))         { return 'Linux'; }
		return 'Unknown';
	}

	/* ── Validation ───────────────────────────────────────── */
	function validate() {
		var name     = form.elements['name'].value.trim();
		var email    = form.elements['email'].value.trim();
		var whatsapp = form.elements['whatsapp'].value.trim();
		var subject  = form.elements['subject'].value;
		var message  = form.elements['message'].value.trim();

		if (!name)    { return t('form_messages.err_name'); }

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return t('form_messages.err_email');
		}

		if (!whatsapp) { return t('form_messages.err_whatsapp'); }

		if (!/^[+\d\s\-().]{6,30}$/.test(whatsapp)) {
			return t('form_messages.err_phone');
		}

		if (!subject) { return t('form_messages.err_subject'); }

		if (!message) { return t('form_messages.err_message'); }

		return null;
	}

	/* ── Build server error message ───────────────────────── */
	/* Returns translated friendly line, plus a second line with
	   the raw technical reason if it is present and meaningful. */
	var GENERIC_REASONS = ['unknown error', 'unknown', '', 'null', 'undefined'];

	function buildServerError(reason) {
		var friendly = t('form_messages.err_server');

		/* Check whether reason adds any useful information */
		var raw = (reason != null) ? String(reason).trim() : '';
		var isUseful = raw.length > 0 &&
			GENERIC_REASONS.indexOf(raw.toLowerCase()) === -1;

		if (isUseful) {
			return friendly + '\n' + t('form_messages.err_detail') + ': ' + raw;
		}

		return friendly;
	}

	/* ── Status helpers ───────────────────────────────────── */
	function showMessage(text, type) {
		msgBox.textContent = text;
		msgBox.className   = 'form-message ' + type;
	}

	function hideMessage() {
		msgBox.className   = 'form-message';
		msgBox.textContent = '';
	}

	/* ── Submit ───────────────────────────────────────────── */
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		hideMessage();

		var error = validate();
		if (error) {
			showMessage(error, 'error');
			return;
		}

		submitBtn.disabled    = true;
		submitBtn.textContent = t('form_messages.sending');

		collectMetadata().then(function (meta) {

			var payload = {
				name:     form.elements['name'].value.trim(),
				email:    form.elements['email'].value.trim(),
				whatsapp: form.elements['whatsapp'].value.trim(),
				subject:  form.elements['subject'].value,
				message:  form.elements['message'].value.trim(),

				/* Sender metadata (hidden) */
				_sender_ip:      meta.ip,
				_sender_country: meta.country,
				_sender_city:    meta.city + ', ' + meta.region,
				_sender_tz:      meta.tz,
				_sender_lang:    meta.lang,
				_sender_screen:  meta.screen,
				_sender_browser: meta.browser,
				_sender_os:      meta.os,
				_sender_time:    meta.sentAt,

				/* FormSubmit special fields */
				_subject:  '[Love Paws] New message: ' + form.elements['subject'].value,
				_captcha:  'false',
				_template: 'table'
			};

			return fetch(FORMSUBMIT_ENDPOINT, {
				method:  'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept':       'application/json'
				},
				body: JSON.stringify(payload)
			});

		}).then(function (res) {
			return res.json().then(function (data) {
				return { ok: res.ok, data: data };
			});
		}).then(function (result) {
			if (result.ok && result.data.success === 'true') {
				showMessage(t('form_messages.success'), 'success');
				form.reset();
			} else {
				var reason = (result.data && result.data.message)
					? result.data.message
					: null;
				console.warn('FormSubmit error:', result.data);
				showMessage(buildServerError(reason), 'error');
			}
		}).catch(function (err) {
			console.error('Network error:', err);
			showMessage(t('form_messages.err_network'), 'error');
		}).finally(function () {
			submitBtn.disabled    = false;
			submitBtn.textContent = t('form_messages.submit');
		});
	});

}());

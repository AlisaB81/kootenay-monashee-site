// Minimal JS for navigation toggle and form safety checks
// - Keeps behavior local-only
// - Does NOT store or log user-submitted personal data

document.addEventListener('DOMContentLoaded', function () {
	// Year placeholders
	const y = new Date().getFullYear();
	const y1 = document.getElementById('year');
	const y2 = document.getElementById('year-2');
	const y3 = document.getElementById('year-3');
	if (y1) y1.textContent = y;
	if (y2) y2.textContent = y;
	if (y3) y3.textContent = y;

	// Mobile navigation toggle
	const toggle = document.querySelector('.nav-toggle');
	const nav = document.getElementById('site-nav');
	if (toggle && nav) {
		toggle.addEventListener('click', function () {
			const expanded = this.getAttribute('aria-expanded') === 'true';
			this.setAttribute('aria-expanded', String(!expanded));
			if (nav.style.display === 'block') nav.style.display = '';
			else nav.style.display = 'block';
		});
	}

	// Volunteer modal open/close and mailto submission (accessible, focus-managed)
	const openVolunteerBtn = document.getElementById('open-volunteer');
	const volunteerModal = document.getElementById('volunteer-modal');
	const volunteerForm = document.getElementById('volunteer-form');
	let volunteerPreviouslyFocused = null;

	function openVolunteerModal() {
		if (!volunteerModal) return;
		volunteerPreviouslyFocused = document.activeElement;
		volunteerModal.hidden = false;
		volunteerModal.classList.add('is-open');
		document.body.style.overflow = 'hidden';
		const first = volunteerModal.querySelector('[name="name"]');
		if (first) first.focus();
	}

	function closeVolunteerModal() {
		if (!volunteerModal) return;
		volunteerModal.hidden = true;
		volunteerModal.classList.remove('is-open');
		document.body.style.overflow = '';
		if (volunteerPreviouslyFocused) volunteerPreviouslyFocused.focus();
	}

	if (openVolunteerBtn) {
		openVolunteerBtn.addEventListener('click', function (e) {
			e.preventDefault();
			openVolunteerModal();
		});
	}

	if (volunteerModal) {
		volunteerModal.addEventListener('click', function (e) {
			if (e.target === volunteerModal) closeVolunteerModal();
		});
		const closeBtn = volunteerModal.querySelector('.volunteer-modal-close');
		if (closeBtn) closeBtn.addEventListener('click', closeVolunteerModal);
	}

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && volunteerModal && !volunteerModal.hidden) {
			closeVolunteerModal();
		}
	});

	if (volunteerForm) {
		volunteerForm.addEventListener('submit', function (e) {
			const action = (this.getAttribute('action') || '').trim();
			const successEl = document.getElementById('volunteer-success');
			const submitBtn = this.querySelector('[type="submit"]');

			// If the action targets Formspree, do NOT use AJAX here. Allow the browser to submit the form natively
			// so that Formspree's Email Action reliably triggers. We will perform client-side validation
			// but we intentionally avoid e.preventDefault() on valid forms.
			if (action && action.includes('formspree.io')) {
				// If invalid, prevent submission and show native validation UI
				if (!this.checkValidity()) {
					e.preventDefault();
					this.reportValidity();
					return;
				}

				// Map/normalize a few fields so server receives consistent names
				// (e.g., some forms use name="role" while others use "volunteer_role").
				// We do this without preventing the native submit so Formspree Actions run.
				try {
					// Role: prefer existing radio value from either name
					const roleEl =
						this.querySelector('[name="volunteer_role"]:checked') ||
						this.querySelector('[name="role"]:checked');
					const roleValue = roleEl ? roleEl.value : '';
					if (roleValue) {
						let hiddenRole = this.querySelector(
							'input[type="hidden"][name="volunteer_role"]'
						);
						if (!hiddenRole) {
							hiddenRole = document.createElement('input');
							hiddenRole.type = 'hidden';
							hiddenRole.name = 'volunteer_role';
							this.appendChild(hiddenRole);
						}
						hiddenRole.value = roleValue;
					}

					// Address: map note -> address if present
					const noteEl = this.querySelector('[name="note"]');
					const addressEl = this.querySelector('[name="address"]');
					const addressVal =
						addressEl && addressEl.value
							? addressEl.value.trim()
							: noteEl && noteEl.value
							? noteEl.value.trim()
							: '';
					if (addressVal) {
						let hiddenAddress = this.querySelector(
							'input[type="hidden"][name="address"]'
						);
						if (!hiddenAddress) {
							hiddenAddress = document.createElement('input');
							hiddenAddress.type = 'hidden';
							hiddenAddress.name = 'address';
							this.appendChild(hiddenAddress);
						}
						hiddenAddress.value = addressVal;
					}
				} catch (ex) {
					// non-fatal: field normalization should not block native post
				}

				// Allow the browser to POST the form natively to the action URL.
				// NOTE: fetch/ajax submission is intentionally disabled for this provider so that
				// provider-side 'Email' Actions execute as expected.
				return;
			}

			// Fallback: if action is not set or is placeholder, use mailto behavior
			if (
				!action ||
				action === '#' ||
				action.includes('REPLACE_WITH_REAL_ENDPOINT')
			) {
				e.preventDefault();
				if (!this.checkValidity()) {
					this.reportValidity();
					return;
				}

				const name = (this.querySelector('[name="name"]').value || '').trim();
				const email = (this.querySelector('[name="email"]').value || '').trim();
				const phone = (this.querySelector('[name="phone"]').value || '').trim();
				const roleEl =
					this.querySelector('[name="volunteer_role"]:checked') ||
					this.querySelector('[name="role"]:checked');
				const role = roleEl ? roleEl.value : 'Not specified';
				const address = (
					this.querySelector('[name="address"]').value || ''
				).trim();

				const subject = 'Volunteer submission from ' + name;
				let body = '';
				body += 'Name: ' + name + '\r\n';
				body += 'Email: ' + email + '\r\n';
				body += 'Phone: ' + phone + '\r\n';
				body += 'Role: ' + role + '\r\n';
				body += 'Address: ' + address + '\r\n\r\n';

				const mailto =
					'mailto:president@kootenaymonashee.ca?subject=' +
					encodeURIComponent(subject) +
					'&body=' +
					encodeURIComponent(body);

				// open mail client
				window.location.href = mailto;

				if (successEl) {
					successEl.textContent =
						'Your email client should open to send this message to president@kootenaymonashee.ca. If it does not, please send your details to that address manually.';
					successEl.hidden = false;
				}

				setTimeout(closeVolunteerModal, 300);
			}
		});
	}

	// Prevent navigation to external placeholder links (data-external-placeholder)
	document
		.querySelectorAll('a[data-external-placeholder]')
		.forEach(function (a) {
			a.addEventListener('click', function (e) {
				const href = (a.getAttribute('href') || '').trim();
				if (!href || href === '#') {
					e.preventDefault();
					const which = a.getAttribute('data-external-placeholder') || 'link';
					alert(
						'This ' +
							which +
							' link is a placeholder. Replace the href in the HTML with the real external URL before publishing.'
					);
				}
			});
		});
});

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('voting-help-form');
	if (!form) return;

	// Set data-endpoint on the form to a dedicated HTTPS endpoint after review.
	const submitButton = document.getElementById('voting-help-submit');
	const status = document.getElementById('voting-help-status');
	const fields = {
		firstName: {
			input: form.elements.firstName,
			message: 'Enter your first name.',
		},
		lastName: {
			input: form.elements.lastName,
			message: 'Enter your last name.',
		},
		address: {
			input: form.elements.address,
			message: 'Enter your street address.',
		},
		city: {
			input: form.elements.city,
			message: 'Enter your city.',
		},
		postalCode: {
			input: form.elements.postalCode,
			message: 'Enter a valid Canadian postal code, such as V1A 1A1.',
		},
		email: {
			input: form.elements.email,
			message: 'Enter a valid email address.',
		},
		phone: {
			input: form.elements.phone,
			message: 'Enter a valid Canadian phone number.',
		},
	};
	let submitting = false;

	function setFieldError(name, message) {
		const field = fields[name];
		const error = document.getElementById(name + '-error');
		field.input.setAttribute('aria-invalid', message ? 'true' : 'false');
		error.textContent = message;
		error.hidden = !message;
	}

	function validate() {
		let valid = true;
		const postalCode = fields.postalCode.input.value.trim();
		const email = fields.email.input.value.trim();
		const phone = fields.phone.input.value.trim();
		const validPhone =
			phone === '' ||
			/^(?:\+?1[\s.-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[\s.-]?\d{3}[\s.-]?\d{4}(?:\s*(?:x|ext\.?)\s*\d{1,6})?$/i.test(
				phone
			);
		const validPostalCode =
			/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(
				postalCode
			);

		Object.keys(fields).forEach(function (name) {
			const field = fields[name];
			let message = '';
			if (field.input.required && !field.input.value.trim()) {
				message = field.message;
			} else if (
				name === 'email' &&
				email &&
				!field.input.validity.valid
			) {
				message = field.message;
			} else if (name === 'phone' && !validPhone) {
				message = field.message;
			} else if (name === 'postalCode' && postalCode && !validPostalCode) {
				message = field.message;
			}
			setFieldError(name, message);
			if (message) valid = false;
		});

		const noContact = !email && !phone;
		const contactError = document.getElementById('contact-error');
		contactError.hidden = !noContact;
		fields.email.input.setAttribute(
			'aria-invalid',
			String(
				noContact ||
					fields.email.input.getAttribute('aria-invalid') === 'true'
			)
		);
		fields.phone.input.setAttribute(
			'aria-invalid',
			String(
				noContact ||
					fields.phone.input.getAttribute('aria-invalid') === 'true'
			)
		);
		if (noContact) valid = false;
		return valid;
	}

	Object.keys(fields).forEach(function (name) {
		fields[name].input.addEventListener('input', function () {
			if (!status.hidden) {
				status.hidden = true;
			}
			validate();
		});
	});

	form.addEventListener('submit', async function (event) {
		event.preventDefault();
		if (submitting) return;

		status.className = 'form-status';
		status.textContent = '';
		status.hidden = true;

		if (!validate()) {
			const firstInvalid = form.querySelector('[aria-invalid="true"]');
			if (firstInvalid) firstInvalid.focus();
			return;
		}

		const honeypot = form.elements._gotcha;
		if (honeypot.value.trim()) {
			status.classList.add('error');
			status.textContent =
				'Your request could not be submitted. Please leave the hidden field blank and try again.';
			status.hidden = false;
			return;
		}

		const submissionEndpoint = form.dataset.endpoint.trim();
		if (!submissionEndpoint) {
			status.classList.add('error');
			status.textContent =
				'This request form is not connected to a submission service yet. No information has been sent. Please try again later or contact the EDA by email.';
			status.hidden = false;
			return;
		}

		let endpoint;
		try {
			endpoint = new URL(submissionEndpoint);
		} catch {
			status.classList.add('error');
			status.textContent =
				'This request form is not available right now. No information has been sent. Please try again later or contact the EDA by email.';
			status.hidden = false;
			return;
		}
		if (endpoint.protocol !== 'https:') {
			status.classList.add('error');
			status.textContent =
				'This request form is not available right now. No information has been sent. Please try again later or contact the EDA by email.';
			status.hidden = false;
			return;
		}

		submitting = true;
		submitButton.disabled = true;
		submitButton.textContent = 'Sending...';
		form.setAttribute('aria-busy', 'true');
		status.textContent = 'Sending your request...';
		status.hidden = false;

		const data = new FormData(form);
		data.set('submittedAt', new Date().toISOString());
		data.set(
			'campaignUpdatesConsent',
			form.elements.campaignUpdatesConsent.checked ? 'true' : 'false'
		);

		try {
			const response = await fetch(endpoint.href, {
				method: 'POST',
				body: data,
				headers: { Accept: 'application/json' },
			});
			if (!response.ok) {
				throw new Error('The submission service rejected the request.');
			}

			status.classList.add('success');
			status.textContent =
				'Thank you. Your request has been received, and our local team will contact you using the details you provided.';
			form.reset();
		} catch {
			status.classList.add('error');
			status.textContent =
				'We could not send your request right now. Your entries are still here; please try again later or contact the EDA by email.';
		} finally {
			submitting = false;
			submitButton.disabled = false;
			submitButton.textContent = 'Find My Voting Location';
			form.removeAttribute('aria-busy');
		}
	});
});

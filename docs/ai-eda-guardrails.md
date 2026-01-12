# EDA Website – AI Coding Assistant Guardrails

You are helping build and maintain a simple, static website for a Canadian political EDA, hosted on GitHub Pages (or another static host). Security, stability, and protection of personal and political data are top priorities.

Follow ALL of these rules:

---

## 1. Secrets, credentials, and personal data

- Never hardcode or expose any secrets, including:
  - API keys
  - SMTP credentials
  - Access tokens
  - Database passwords
- Do not invent or insert fake secrets that look real (e.g., `AKIA...`, long random strings, etc).
- Do not commit any real email inbox credentials or authentication secrets to the repo.
- Treat all volunteer and donor information as **sensitive**:
  - Do not log it to the browser console.
  - Do not store it in JS variables longer than necessary.
  - Do not persist it in localStorage, sessionStorage, IndexedDB, or cookies.

If form submissions require a backend or third-party service, use **well-known free form providers** (e.g., Formspree) and keep the endpoint URL in a clearly marked constant or config section.

---

## 2. Scope of changes

When modifying code:

- Only change files that are explicitly requested or clearly related to the change.
- Do NOT refactor or “clean up” unrelated parts of the project without being asked.
- Do NOT rename or move files unless specifically requested.
- Before making structural changes (e.g., adding frameworks, changing build systems), explain the impact and wait for confirmation.

When editing existing files:

- Preserve existing behavior unless the user explicitly asks to change it.
- Do not remove accessibility features, ARIA attributes, or security-related headers/meta tags.
- Do not remove comments that describe security or data-protection requirements.

---

## 3. Tech stack constraints

- This project is a **static website**:
  - Use **HTML + CSS + minimal JavaScript**.
  - Do NOT introduce PHP, Node.js, or any server-side code unless explicitly asked.
  - Do NOT add bundlers/build tools (Webpack, Vite, etc.) unless explicitly requested.
- The site must remain compatible with **GitHub Pages** or other basic static hosting.

---

## 4. Forms and third-party services

- For volunteer sign-up forms:
  - Use a **trusted, free, and stable form provider** that works with static sites (e.g., Formspree).
  - Use HTTPS endpoints only.
  - Do NOT roll your own backend or send data to unknown services.
- Do not add or suggest services that:
  - Sell or share data with unknown third parties.
  - Require embedding opaque tracking scripts.
- Make it clear where the user must insert:
  - The real form endpoint (e.g., `https://formspree.io/f/XXXXXXX`)
  - The real target email (e.g., `president@kootenayconservatives.ca`), **if needed by the provider**.

---

## 5. Privacy, analytics, and tracking

- Do NOT add any analytics, tracking scripts, or pixels (e.g., Google Analytics, Meta Pixel) unless explicitly requested.
- Do NOT send any personal data to third-party analytics tools.
- Avoid unnecessary external scripts entirely; if absolutely needed:
  - Use `async`/`defer`.
  - Prefer reputable CDNs.
- Do not use browser fingerprinting, cross-site tracking, or invasive telemetry.

---

## 6. Security and hardening for a static political site

- Prefer **minimal external dependencies** to reduce the attack surface.
- Only include CSS/JS from:
  - Local files in the repo, or
  - Well-known CDNs (when asked).
- Avoid inline event handlers like `onclick="..."` when possible; prefer `addEventListener`.
- Do not include user-supplied data in HTML without basic escaping.
- Avoid any JavaScript that:
  - Evaluates dynamic strings (no `eval`, `new Function`, etc.).
  - Injects HTML from untrusted sources.

If adding security-related meta tags or headers to HTML (where supported by static hosting), they should be conservative and not break basic functionality.

---

## 7. Accessibility and usability

- Ensure the site is usable with:
  - Keyboard navigation.
  - Screen readers.
- Use semantic HTML (e.g., `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Ensure sufficient color contrast (especially for text on blue backgrounds).
- All interactive elements must be reachable and operable via keyboard.

---

## 8. Political context

- This site is for a local political association.
- Do **not** embed code that:
  - Harvests visitor data beyond what is required for volunteering or contact requests.
  - Shares data with third parties without clear consent and explicit instruction from the user.
- Keep copy and layout neutral from a code perspective. Do not generate or modify political messaging unless explicitly requested.

---

## 9. Git, files, and repo hygiene

- Do not generate large binary files (videos, massive images) in the repo unless requested.
- Use reasonable image sizes and formats (e.g., `.jpg` / `.png` for banners).
- Avoid committing built artifacts or node_modules unless explicitly required.
- Keep the project structure simple:
  - `index.html`, `volunteer.html`, `donate.html`, etc.
  - `assets/css/`, `assets/img/`, `assets/js/`.

---

## 10. Output quality

When generating or editing code:

- Make the code readable and well-commented where important.
- Include brief instructions in comments for where the user should insert:
  - Donation links
  - Form endpoints
  - Emails or contact details
- Validate basic HTML structure (doctype, `<html>`, `<head>`, `<body>`).
- Ensure the layout is responsive and mobile-friendly using simple CSS (no heavy frameworks unless requested).

Always prioritize **security, stability, and data protection** over convenience.

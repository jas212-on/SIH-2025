# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in the Jalmitra frontend, please **do not** open a public GitHub issue.

Instead, email **vionix37@gmail.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce (proof-of-concept code or requests, if applicable)
- Any suggested remediation

We aim to acknowledge reports within **72 hours** and to provide a resolution timeline once the issue is confirmed.

## Scope

This policy covers the `Jalmitra_Frontend` frontend application, including:

- Client-side vulnerabilities (XSS, insecure data handling, dependency vulnerabilities)
- Exposure of secrets or sensitive configuration in the built bundle
- Authentication/authorization issues in frontend-to-backend communication

Vulnerabilities in the backend (`Jalmitra_Backend`) should be reported per that repository's `SECURITY.md`.

## Supported Versions

Only the `main` branch is actively maintained and receives security fixes.

## Disclosure

We follow coordinated disclosure — please give us a reasonable window to address the issue before any public disclosure.

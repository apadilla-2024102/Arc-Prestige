Security recommendations for Arc-Prestige

This document lists practical steps to improve authentication and login security across the workspace.

Immediate (apply now)
- Avoid storing JWTs in localStorage. Prefer HttpOnly, Secure cookies for access/refresh tokens, or store tokens in memory only.
- Use `sessionStorage` instead of `localStorage` for client-side tokens if you cannot use cookies (reduces persistence across browser sessions).
- Ensure all services use HTTPS/TLS in production and disallow insecure transport for auth-related endpoints.
- Store secrets (JWT secret, DB passwords, API keys) in environment variables or a secret manager (Azure Key Vault, AWS Secrets Manager). Do NOT commit secrets to the repo.
- Enable rate-limiting on auth endpoints (already present in `auth-service`).
- Enforce strong password hashing (Argon2/Bcrypt) — `auth-service` already includes Argon2.

Short-term improvements (next steps)
- Implement HttpOnly Secure cookies for authentication in `auth-service` and update frontend to consume cookie-authenticated sessions instead of storing tokens in storage.
- Add refresh-token rotation with short-lived access tokens and a revocation list for refresh tokens.
- Add account lockout after repeated failed login attempts to mitigate brute force.
- Add logging and alerting for suspicious login patterns (repeated failures, unusual IPs).

Long-term / Optional
- Add Multi-Factor Authentication (MFA) via TOTP or SMS for privileged roles (admin) or optionally for all users.
- Use a dedicated identity provider (Auth0, Azure AD B2C, or similar) if you want a managed solution.
- Harden CORS and CSP policies for frontend and API.
- Regular dependency scanning and secret-scanning in CI to prevent accidental commits of secrets.

How I already helped in this workspace
- Switched `archery-frontend` storage from `localStorage` to `sessionStorage` to reduce token persistence.
- Reviewed `auth-service` and verified it uses Argon2 and JWTs with validation and rate limiting.

If you want, I can:
- Implement HttpOnly cookie + refresh token support in `auth-service` and update `archery-frontend` to use it.
- Add account lockout and failed-login counters in `auth-service`.
- Add a small script to rotate secrets and validate `appsettings`/`.env` usage.

Tell me which of the above you'd like me to implement next and I will start the task.
# Security policy

## Supported versions

This repository is pre-release. Until a tagged release exists, only `main` receives security fixes.

| Version | Supported |
|---------|-----------|
| `main`  | ✓         |

## Reporting a vulnerability

Report security issues **privately** via GitHub Security Advisories: open [a new advisory](https://github.com/simiancraft/google-mcp-suite/security/advisories/new) on this repository. If that route is not available to you, email **info@simiancraft.com**.

Please do **not** open a public GitHub issue for security reports.

You should receive an acknowledgement within **3 business days**. We aim to ship a patch (or publish a mitigation plan) within **14 days** of a confirmed report.

## Scope

Unlike a pure-function library, these servers hold real credential, filesystem, and network surface: they authenticate to Google as a user, store OAuth tokens on disk, and act on a user's mail, files, and calendar across multiple accounts. Realistic in-scope issues:

- **Credential storage.** OAuth tokens or the shared client secret written with overly permissive file modes, to an unexpected location, or into a path an attacker can read.
- **Credential leakage in logs.** Access tokens, refresh tokens, authorization codes, or message contents emitted to stdout/stderr, error messages, or tool responses.
- **Scope over-grant.** A service requesting or using broader OAuth scopes than its operations require, widening blast radius if a token leaks.
- **Account confusion.** A path by which an operation runs against a different account than the one the running instance was configured for (`GOOGLE_MCP_ACCOUNT`), causing cross-account reads or writes.
- **Path traversal / unsafe file writes.** Download, attachment, or export operations that write outside an intended directory based on attacker-influenced filenames.
- **SSRF / request forgery.** Any path where untrusted input controls an outbound request target beyond the intended Google API surface.
- **Supply chain.** Compromised dev dependency, tampered build artifact, or typosquatting of a package or server name.

### Out of scope

- **Incorrect API results or missing operations.** These are bugs; file a regular [GitHub issue](https://github.com/simiancraft/google-mcp-suite/issues).
- **Vulnerabilities in Google's APIs or the `googleapis` / `google-auth-library` packages.** Report upstream; we will track and bump.
- **Misconfiguration of your own Google Cloud OAuth app, scopes, or credentials** outside what this repo's code controls.

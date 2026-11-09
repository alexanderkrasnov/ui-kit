# Plexo UI Kit

React UI kit for Plexo, configured for publication to GitHub Packages as `@alexanderkrasnov/plexo-ui-kit`.

Source: [alexanderkrasnov/ui-kit](https://github.com/alexanderkrasnov/ui-kit).

> **Visibility:** new GitHub Packages packages are private by default. Package visibility and access are configured separately from this public repository. See [GitHub's npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Installing in another project

GitHub Packages requires authentication even for read access. Each consuming project (and each developer machine / CI runner) needs the registry configured for the `@alexanderkrasnov` scope.

### 1. Add an `.npmrc` to the consuming repo

```
@alexanderkrasnov:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Commit this file. The `${GITHUB_TOKEN}` placeholder is resolved from the environment at install time, so no secret is committed.

### 2. Provide a token

- **Local dev:** create a GitHub Personal Access Token (classic) with the `read:packages` scope and export it as `GITHUB_TOKEN` (e.g. in your shell rc file).
- **CI (GitHub Actions):** grant the consuming repository read access in the package's settings, then pass the built-in `secrets.GITHUB_TOKEN` through as `env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}` on the install step, and grant `permissions: packages: read` on the job.

### 3. Install

```bash
npm install @alexanderkrasnov/plexo-ui-kit
```

This package name becomes available after its first release. Existing consuming projects must update their dependency names and imports to `@alexanderkrasnov/plexo-ui-kit` when switching to it.

## Releasing a new version

Releases are tag-driven. The `.github/workflows/publish.yml` workflow publishes to GitHub Packages whenever a tag matching `v*` is pushed.

```bash
# bump version (creates a commit and a v<version> tag)
npm version patch   # or minor / major

git push
git push --tags
```

The workflow verifies the tag matches `package.json` `version`, runs the build, and publishes.

## Where to read security reports in GitHub

Each CI run produces inline reports rendered directly in the GitHub UI — no GHAS or external service required.

- **Step Summary** — visit any workflow run (Actions tab → click a run, or the PR's "Checks" tab → click a run). The top of the run page renders a Markdown summary for each scan job: `npm audit`, `npm audit signatures`, `lockfile-lint`, Semgrep, and OSV-Scanner.
- **Artifacts** — the same run page has a "Artifacts" section at the bottom with downloadable files: `npm-audit` (text + JSON), `lockfile-lint` (text), `semgrep` (text + SARIF), `osv-scanner` (markdown + JSON), and on releases also `sbom-vX.Y.Z` (CycloneDX). Retention is 90 days for scans, 1 year for SBOMs.
- **Job annotations** — failing rules and lint warnings appear inline in the run log and on the PR's "Files Changed" tab where applicable.
- **GitHub Releases** — every published version has the CycloneDX SBOM attached as `sbom.cdx.json`.

The SARIF file from Semgrep is portable: if GHAS is ever enabled, dropping it into a `github/codeql-action/upload-sarif` step pushes findings directly into the Security tab — no rewrite needed.

## Security controls

Pipeline-level (already wired in `.github/`):

| Control | Where | What it does |
|---|---|---|
| Least-privilege workflow tokens | All workflows | Top-level `permissions: {}`, per-job grants only |
| Pinned actions | All workflows | Third-party actions pinned to commit SHA (Dependabot keeps them current) |
| Pinned runner | All workflows | `ubuntu-24.04`, not `ubuntu-latest` |
| Deterministic install | All workflows | `npm ci` against committed lockfile |
| Dependency vulnerability scan (npm advisories) | `ci.yml` audit job, `publish.yml` | `npm audit --audit-level=high --omit=dev` |
| Dependency vulnerability scan (OSV.dev) | `ci.yml` vuln-scan job | OSV-Scanner against `package-lock.json` — broader source than npm advisories |
| Package-signature verification | `ci.yml` audit job, `publish.yml` | `npm audit signatures` (Sigstore-backed) |
| SAST | `ci.yml` sast job | Semgrep with `p/javascript`, `p/typescript`, `p/react`, `p/security-audit` rulesets |
| Automated dep updates | `dependabot.yml` | Weekly grouped PRs for npm + GitHub Actions |
| Tag–version match check | `publish.yml` | Refuses to publish if `vX.Y.Z` tag doesn't match `package.json` |
| `production` environment gate | `publish.yml` | Lets org admins require manual approval before a release runs |
| `persist-credentials: false` | All checkouts | Prevents Git creds from leaking into later steps |

Repo-admin controls (configure once in GitHub UI — not code):

- **Branch protection on `master`:** require PR + passing `CI / build`, `CI / audit`, `CI / lockfile-lint`, `CI / sast`, `CI / vuln-scan`; block force-push and direct pushes; require signed commits.
- **Tag protection rule** for `v*`: only maintainers can push release tags.
- **Environment `production`:** add required reviewers so the publish job pauses for approval.
- **Repo settings → Actions → General:** restrict to "Allow actions and reusable workflows" matching the pinned set; deny `GITHUB_TOKEN` write by default.
- **Code security (free, no GHAS needed):** enable Dependabot alerts in repo settings — works on private repos at no cost.

### Registry-attack defenses

Specific to the package-supply-chain class (dependency confusion, lockfile poisoning, malicious post-install scripts, compromised maintainers):

| Attack | Control | Where |
|---|---|---|
| Dependency confusion (public-npm squat of `@alexanderkrasnov/*`) | Scope→registry pin in `.npmrc` (committed) | `.npmrc` |
| Dependency confusion (defense in depth) | **Pre-register the `@alexanderkrasnov` scope on public npmjs.org** so no outsider can publish under it | Account-owner task |
| Lockfile poisoning via PR | `lockfile-lint` job rejects non-allowlisted hosts, non-https URLs, missing integrity hashes | `ci.yml` `lockfile-lint` job |
| Compromised maintainer / tampered tarball | `npm audit signatures` validates Sigstore attestations on every dep | `ci.yml` `audit` job + `publish.yml` |
| Malicious transitive postinstall during a security-only install | `npm ci --ignore-scripts` for the signature-verify step | `ci.yml` `audit` job |
| Manifest confusion | Same as above (signatures verify the published artifact, not just the manifest) | `ci.yml` + `publish.yml` |
| Unauthorized typo-domain registry | `strict-ssl=true`, `allowed-schemes: https:`, explicit `registry=` and scope pin | `.npmrc` + `lockfile-lint` |

### Standards & frameworks this pipeline maps to

| Framework | Status here |
|---|---|
| **NIST SSDF (SP 800-218)** — PS.2, PS.3, PW.4, PW.7, RV.1 | Fully covered (provenance via tags, secure tools, code review via PRs, vuln response via Dependabot/audit) |
| **SLSA** (Supply-chain Levels for Software Artifacts) | ~Level 2 (versioned source, hosted scripted build, isolated runner). Level 3 requires signed build provenance — npm `--provenance` is not available on GitHub Packages, but `slsa-framework/slsa-github-generator` can attach SLSA attestations to releases as a future hardening step. |
| **OWASP CI/CD Top 10** | Addressed: insufficient flow control (env gate), inadequate identity (least-priv tokens, OIDC-style `GITHUB_TOKEN`), poisoned pipeline execution (PR jobs cannot write to packages), insecure system config (pinned actions, default-deny perms) |
| **OpenSSF Scorecard** | Pinned-deps, branch-protection, signed-commits, dependency-update-tool, SAST (Semgrep), token-permissions, vulnerabilities — all green-able |
| **CycloneDX SBOM** (NTIA minimum elements / EO 14028) | Generated and attached to every GitHub Release as `sbom.cdx.json` |
| **Sigstore** | Used transitively via `npm audit signatures` — every published version of every dep is verified against the registry's Sigstore log |
| **CIS Software Supply Chain Security Guide v1.1** | Aligned on source, build pipeline, dependency, and artifact controls |

## Local development

```bash
npm install
npm run storybook   # component playground
npm run build       # produces dist/ (library bundle + types)
npm run typecheck
npm run lint
```

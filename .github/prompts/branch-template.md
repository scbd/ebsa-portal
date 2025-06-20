# Branch Naming Template

## Format

```text
<type>/<issue-reference>-<short-description>
```

## Alternative Format (for JIRA integration)

```text
<issue-reference>-<username>-<short-description>
```

## Branch Types

### Feature Branches

```text
feature/<issue-ref>-<description>
feat/<issue-ref>-<description>
```

Examples:

- `feature/DEV-123-user-authentication`
- `feat/PROJ-456-payment-integration`
- `feature/DEV-789-dashboard-redesign`

### Bug Fix Branches

```text
bugfix/<issue-ref>-<description>
fix/<issue-ref>-<description>
hotfix/<issue-ref>-<description>
```

Examples:

- `bugfix/DEV-321-login-validation-error`
- `fix/BUG-654-memory-leak-issue`
- `hotfix/CRIT-987-payment-gateway-failure`

### Maintenance Branches

```text
chore/<issue-ref>-<description>
maintenance/<issue-ref>-<description>
```

Examples:

- `chore/DEV-111-update-dependencies`
- `maintenance/MAINT-222-code-cleanup`
- `chore/DEV-333-remove-deprecated-api`

### Documentation Branches

```text
docs/<issue-ref>-<description>
documentation/<issue-ref>-<description>
```

Examples:

- `docs/DOC-444-api-documentation`
- `documentation/DEV-555-readme-updates`
- `docs/DOC-666-setup-instructions`

### Release Branches

```text
release/<version>
release/<version>-<description>
```

Examples:

- `release/v1.2.0`
- `release/v2.0.0-major-refactor`
- `release/v1.1.5-security-patches`

## Naming Conventions

### Issue Reference Patterns

**JIRA Integration:**

- `DEV-123` - Development tasks
- `BUG-456` - Bug reports
- `FEAT-789` - Feature requests
- `MAINT-101` - Maintenance tasks
- `DOC-202` - Documentation tasks

**GitHub Issues:**

- `issue-123` - Generic issue reference
- `gh-456` - GitHub issue reference
- `#789` - Direct issue number

### Description Guidelines

1. **Use kebab-case** (lowercase with hyphens)
2. **Be descriptive but concise** (2-4 words typically)
3. **Avoid special characters** except hyphens
4. **Use present tense** when describing actions
5. **Maximum 50 characters total** for readability

### Valid Characters

- Lowercase letters (a-z)
- Numbers (0-9)
- Hyphens (-) as separators
- Forward slashes (/) for type separation
- Underscores (_) sparingly, prefer hyphens

### Invalid Characters

- Spaces (use hyphens instead)
- Special characters: !@#$%^&*()+={}[]|;':"<>?
- Uppercase letters (use lowercase)
- Periods (.) except in version numbers

## Examples by Category

### API Development

```text
feature/DEV-123-user-registration-api
feature/DEV-124-oauth2-integration
bugfix/DEV-125-api-rate-limiting-issue
```

### Frontend Features

```text
feature/UI-201-dashboard-widgets
feature/UI-202-responsive-navigation
bugfix/UI-203-mobile-layout-fix
```

### Database Changes

```text
feature/DB-301-user-preferences-table
maintenance/DB-302-index-optimization
bugfix/DB-303-migration-rollback-fix
```

### Security Updates

```text
hotfix/SEC-401-csrf-vulnerability
feature/SEC-402-two-factor-authentication
chore/SEC-403-dependency-security-updates
```

### Performance Improvements

```text
feature/PERF-501-query-optimization
feature/PERF-502-image-lazy-loading
bugfix/PERF-503-memory-leak-fix
```

## Team Collaboration Patterns

### Personal Development Branches

```text
<username>/<type>/<issue-ref>-<description>
```

Examples:

- `john-doe/feature/DEV-123-user-auth`
- `jane-smith/bugfix/BUG-456-login-error`
- `dev-team/refactor/TECH-789-api-cleanup`

### Experimental Branches

```text
experiment/<description>
spike/<issue-ref>-<research-topic>
prototype/<concept-name>
```

Examples:

- `experiment/new-ui-framework`
- `spike/DEV-999-database-alternatives`
- `prototype/voice-interface`

### Integration Branches

```text
integration/<feature-set>
merge/<sprint-number>
staging/<release-candidate>
```

Examples:

- `integration/user-management-features`
- `merge/sprint-23`
- `staging/v2.1.0-rc1`

## Git Flow Integration

### Main Branches

- `main` or `master` - Production ready code
- `develop` - Integration branch for features
- `staging` - Pre-production testing

### Supporting Branches

- `feature/*` - New features (branch from develop)
- `release/*` - Release preparation (branch from develop)
- `hotfix/*` - Critical production fixes (branch from main)

## Automated Tools Integration

### Branch Protection Rules

```yaml
# Example GitHub branch protection
protected_branches:
  - name: "main"
    required_reviews: 2
    dismiss_stale_reviews: true
  - name: "develop"
    required_reviews: 1
    required_status_checks: ["ci/tests", "ci/lint"]
```

### Branch Naming Validation

```bash
# Git hook example for branch naming validation
#!/bin/bash
branch=$(git rev-parse --abbrev-ref HEAD)
valid_pattern="^(feature|bugfix|hotfix|chore|docs|release)\/[A-Z]+-[0-9]+-[a-z0-9-]+$"

if [[ ! $branch =~ $valid_pattern ]]; then
  echo "Branch name '$branch' does not follow naming convention"
  echo "Format: <type>/<ISSUE-REF>-<description>"
  exit 1
fi
```

## Best Practices

1. **Start with issue reference** - Links code changes to requirements
2. **Use descriptive names** - Future developers should understand the purpose
3. **Keep it short** - Long branch names are hard to work with
4. **Be consistent** - Follow team conventions religiously
5. **Clean up branches** - Delete merged branches to keep repository tidy
6. **Use prefixes** - Group related branches together
7. **Avoid personal prefixes** - Unless working on experimental features
8. **Include context** - Issue reference provides traceability
9. **Use automation** - Set up hooks to validate branch names
10. **Document exceptions** - When standard patterns don't fit, document why

## Common Anti-Patterns

❌ **Avoid these patterns:**

- `fix` (too generic)
- `my-feature` (no issue reference)
- `Fix Login Bug` (uppercase, spaces)
- `feature-123` (missing type separator)
- `DEV-123_user_auth` (underscores instead of hyphens)
- `temp-branch` (not descriptive)
- `john-working-on-stuff` (too vague)

✅ **Use these instead:**

- `bugfix/DEV-123-login-validation-error`
- `feature/DEV-124-user-authentication`
- `hotfix/CRIT-125-payment-gateway-fix`
- `chore/DEV-126-dependency-updates`
- `docs/DEV-127-api-documentation`

## Integration with JIRA

When using JIRA integration, branches can automatically:

- Update issue status when created
- Link commits to issues
- Transition issues through workflow states
- Generate release notes from branch names

Example JIRA-integrated branch:

```text
DEV-123-randy-houlahan-usefetch-returning-error
```

This format includes:

- Issue reference: `DEV-123`
- Developer name: `randy-houlahan`
- Issue description: `usefetch-returning-error`

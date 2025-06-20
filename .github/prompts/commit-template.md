# Commit Message Template

## Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

## Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

Examples:

- **api**: Changes to API endpoints
- **auth**: Authentication related changes
- **ui**: User interface changes
- **db**: Database changes
- **config**: Configuration changes
- **middleware**: Middleware changes
- **utils**: Utility functions
- **components**: Vue/React components
- **pages**: Page-level changes
- **assets**: Static assets (images, fonts, etc.)

## Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end
- Maximum 50 characters

## Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

## Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference JIRA issues, GitHub issues, or other PRs that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## Examples

### Feature with JIRA reference

```text
feat(auth): add OAuth2 integration for user authentication

Implement OAuth2 flow using industry standard libraries:
- Add OAuth2 provider configuration
- Create authentication middleware
- Update user session management
- Add token refresh mechanism

This enables users to login using their existing corporate accounts
and improves security by removing password management burden.

Closes DEV-123
```

### Bug fix with breaking change

```text
fix(api): correct user profile endpoint response format

The user profile endpoint now returns consistent field names
across all API responses. This aligns with our API specification
and improves client integration reliability.

BREAKING CHANGE: The 'userName' field has been renamed to 'username'
to maintain consistency with other API endpoints.

Fixes DEV-456
```

### Documentation update

```text
docs(readme): update installation instructions

Add missing steps for local development setup:
- Database configuration requirements
- Environment variable examples
- Troubleshooting common issues

This resolves confusion reported by new team members during onboarding.
```

### Refactoring

```text
refactor(components): extract reusable navigation component

Move navigation logic from individual pages into a shared component:
- Create BaseNavigation component
- Update all pages to use shared component
- Reduce code duplication by 200+ lines
- Improve consistency across page layouts

No functional changes to user interface.
```

### Performance improvement

```text
perf(db): optimize user query performance

Improve database query efficiency for user search:
- Add composite index on (email, status) columns
- Implement query result caching (5 minute TTL)
- Reduce average query time from 150ms to 12ms

Load testing shows 75% improvement in response times
under normal user load conditions.

Resolves DEV-789
```

## JIRA Integration

When working with JIRA issues, include the issue reference in the footer:

- `Closes DEV-123` - Closes the issue
- `Fixes DEV-123` - Fixes a bug reported in the issue
- `Resolves DEV-123` - Resolves the issue
- `Relates to DEV-123` - Related but doesn't close the issue
- `Ref DEV-123` - References the issue

## Best Practices

1. **Keep commits atomic** - One logical change per commit
2. **Write descriptive subjects** - Someone should understand the change without reading the code
3. **Use the body to explain why** - Not what (code shows what), but why the change was needed
4. **Reference relevant issues** - Always link to JIRA tickets, GitHub issues, or PRs
5. **Follow the format consistently** - This enables automated tooling and better changelog generation
6. **Proofread before committing** - Commit messages become part of project history
7. **Use present tense** - "Add feature" not "Added feature"
8. **Be specific about scope** - Help reviewers understand impact area
9. **Mention breaking changes** - Always highlight backwards incompatible changes
10. **Keep lines under 72 characters** - Ensures readability in various Git tools

## Tools Integration

This template works well with:

- **Conventional Commits** specification
- **Semantic Release** for automated versioning
- **Commitizen** for interactive commit creation
- **Husky** for pre-commit validation
- **JIRA** for issue tracking integration
- **GitHub/GitLab** for PR/MR linking

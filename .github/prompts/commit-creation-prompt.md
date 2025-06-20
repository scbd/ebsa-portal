# Commit Creation Prompt Template

## Instructions for AI Assistant

Create a structured Git commit message that follows best practices and includes JIRA issue reference.

## Required Information

Please provide:

1. **JIRA Issue Number**: (e.g., DEV-123, PROJ-456)
2. **Commit Summary**: Brief description of what was changed
3. **Detailed Description**: Bullet points of specific changes made

## Commit Message Format

```text
${JIRA-ISSUE}: ${Brief summary of changes}

- ${Specific change 1}
- ${Specific change 2}
- ${Specific change 3}
- ${Additional context or benefits}
```

## Example Commit Message

```text
DEV-678: Fix useFetch warnings for system asset requests

- Add redirect middleware for unwanted paths (favicon, .well-known, fonts)
- Simplify menu composables by removing complex skip logic
- Use proper HTTP 301 redirects instead of fake responses
- Eliminate console warnings for legitimate system requests
```

## Pre-Commit Checklist

Before committing, ensure:

- [ ] Only relevant files are staged (`git status`)
- [ ] Remove any unrelated changes from staging
- [ ] Email configuration is set correctly (use GitHub no-reply if needed)
- [ ] Commit message follows the format above

## Commands to Execute

```bash
# Stage only relevant files
git add ${specific-files}

# OR stage all changes
git add .

# Remove unrelated files from staging if needed
git restore --staged ${unrelated-file}

# Commit with structured message
git commit -m "${commit-message}"

# Verify commit details
git log --pretty=format:"%H %an <%ae> %s" -1
```

## Email Configuration Notes

If push fails due to email privacy settings:

```bash
# Set to GitHub no-reply email
git config user.email "${username}@users.noreply.github.com"

# Amend commit with new email
git commit --amend --reset-author --no-edit
```

## Best Practices

1. Keep the first line under 50 characters
2. Use bullet points for detailed changes
3. Start with action verbs (Add, Fix, Update, Remove)
4. Reference the JIRA issue number at the beginning
5. Focus on what and why, not how

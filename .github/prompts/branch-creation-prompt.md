# Branch Creation Prompt Template

## Instructions for AI Assistant

Create a new Git branch following this naming convention:

```text
${jiraIssueNumber}-${gitUser}-${jiraSummary-in-slug-case}
```

## Required Information

Please provide the following information:

1. **JIRA Issue Number**: (e.g., DEV-123, PROJ-456)
2. **JIRA Issue Summary/Title**: (e.g., "Fix navigation menu bug")

## Process

1. Convert the JIRA summary to slug case (lowercase, hyphens instead of spaces)
2. Get the current git username from `git config user.name`
3. Create branch name using the format above
4. Create and checkout the new branch

## Example

**Input:**
- JIRA Issue: DEV-678
- Summary: "UseFetch returning error"
- Git User: Randy Houlahan

**Output Branch Name:**

```text
DEV-678-randy-houlahan-usefetch-returning-error
```

## Commands to Execute

```bash
# Create and checkout new branch
git checkout -b ${branchName}

# Verify branch creation
git branch --show-current
```

## Notes

- Ensure the branch name is URL-safe and follows kebab-case convention
- Remove special characters and convert spaces to hyphens
- Keep the summary portion concise but descriptive

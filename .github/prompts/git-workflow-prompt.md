# Complete Git Workflow Prompt Template

## Instructions for AI Assistant

Execute a complete Git workflow from branch creation to push, following standardized naming conventions and commit practices.

## Required Information

Request the following from the user:

1. **JIRA Issue Number**: (e.g., DEV-123, PROJ-456)  
2. **JIRA Issue Summary**: Brief title of the issue
3. **Change Description**: What was modified/fixed/added

## Complete Workflow Steps

### 1. Branch Creation

Create branch using naming convention:

```text
${jiraIssueNumber}-${gitUser}-${jiraSummary-in-slug-case}
```

### 2. Stage Relevant Changes

- Review current changes with `git status`
- Stage only files related to the JIRA issue
- Exclude unrelated modifications

### 3. Create Structured Commit

Use this commit message format:

```text
${JIRA-ISSUE}: ${Brief summary}

- ${Specific change 1}
- ${Specific change 2}  
- ${Specific change 3}
- ${Benefits/context}
```

### 4. Handle Email Configuration

- Check for email privacy settings
- Use GitHub no-reply email if needed: `${username}@users.noreply.github.com`

### 5. Push to Remote

- Push branch to origin
- Set upstream tracking
- Provide pull request URL

## Complete Command Sequence

```bash
# 1. Create and checkout branch
git checkout -b ${branchName}

# 2. Review changes
git status

# 3. Stage relevant files only
git add ${relevantFiles}
# OR remove unrelated files from staging
git restore --staged ${unrelatedFile}

# 4. Check email configuration
git config user.email

# 5. Set GitHub no-reply email if needed
git config user.email "${username}@users.noreply.github.com"

# 6. Commit with structured message
git commit -m "${structuredMessage}"

# 7. Amend commit if email was changed
git commit --amend --reset-author --no-edit

# 8. Push to remote
git push -u origin ${branchName}
```

## Example Workflow

**Input:**
- JIRA: DEV-678
- Summary: "UseFetch returning error" 
- User: Randy Houlahan

**Generated Branch:** `DEV-678-randy-houlahan-usefetch-returning-error`

**Generated Commit:**

```text
DEV-678: Fix useFetch warnings for system asset requests

- Add redirect middleware for unwanted paths (favicon, .well-known, fonts)
- Simplify menu composables by removing complex skip logic
- Use proper HTTP 301 redirects instead of fake responses
- Eliminate console warnings for legitimate system requests
```

## Troubleshooting

### Push Failures

- **Email Privacy**: Configure no-reply email and amend commit
- **Authentication**: Ensure proper Git credentials
- **Branch Conflicts**: Check if branch name already exists

### Commit Issues

- **Large Commits**: Split into smaller, focused commits
- **Unrelated Changes**: Use selective staging to exclude files
- **Message Format**: Follow the structured template exactly

## Success Criteria

A successful workflow completion includes:

- ✅ Branch created with proper naming convention
- ✅ Only relevant files committed
- ✅ Structured commit message with JIRA reference
- ✅ Successful push to remote repository
- ✅ Pull request URL provided for next steps

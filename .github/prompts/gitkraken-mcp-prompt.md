# GitKraken MCP Integration Prompt Template

## Instructions for AI Assistant

Use GitKraken MCP (Model Context Protocol) tools to perform Git operations and integrate with external services like JIRA.

## Available MCP Tools

### Git Operations

- `mcp_gitkraken_git_actions`: Perform local Git operations
- `mcp_gitkraken_list_workspace_repositories`: List workspace repositories

### External Integrations

- `mcp_gitkraken_jira_tools`: Interact with JIRA (requires setup)
- `mcp_gitkraken_github_tools`: Manage GitHub repositories and PRs
- `mcp_gitkraken_gitlab_tools`: GitLab operations
- `mcp_gitkraken_bitbucket_tools`: Bitbucket operations
- `mcp_gitkraken_azure_tools`: Azure DevOps integration

### File Operations

- `mcp_gitkraken_read_content`: Read file or folder contents
- `mcp_gitkraken_write_file`: Create or overwrite files

## JIRA Integration Setup

If JIRA tools are not configured, user needs to run:

```bash
# Option 1: With GitKraken account
gk provider add jira

# Option 2: Manual setup
gk provider add jira -t <API_TOKEN> --jira-email <EMAIL> --jira-organization <ORG>
```

## Example MCP Workflow

### 1. Check Repository Status

```javascript
// Use mcp_gitkraken_git_actions
{
  "arguments": ["status"],
  "directory": "/path/to/repository"
}
```

### 2. Create Branch via MCP

```javascript
// Use mcp_gitkraken_git_actions  
{
  "arguments": ["checkout", "-b", "DEV-123-username-feature-branch"],
  "directory": "/path/to/repository"
}
```

### 3. Access JIRA Information

```javascript
// Use mcp_gitkraken_jira_tools (if configured)
// This would return JIRA issue details for better commit messages
```

## Fallback Strategy

If MCP tools are unavailable or not configured:

1. **Use standard terminal commands** via `run_in_terminal`
2. **Request manual input** for JIRA details
3. **Proceed with standard Git workflow**

## MCP Tool Error Handling

Common issues and solutions:

### JIRA Tools Not Configured

- **Error**: "To use your Jira account, we need access..."
- **Solution**: Guide user through OAuth2 setup with `gk provider add jira`

### Authentication Issues

- **Error**: MCP session not recognizing authentication
- **Solution**: May require restarting MCP session or using fallback commands

### Tool Unavailability

- **Error**: Tools disabled or not available
- **Solution**: Use standard Git commands as fallback

## Best Practices

1. **Always check tool availability** before relying on MCP integration
2. **Have fallback commands ready** for when MCP tools fail
3. **Combine MCP and standard tools** as needed for complete workflows
4. **Verify authentication status** before attempting external service integration

## Integration Workflow Template

```text
1. Try MCP tool for operation
2. If MCP fails or unavailable:
   - Use standard terminal commands
   - Request manual input for missing data
   - Continue with workflow
3. Verify results using appropriate tools
4. Provide user with next steps or URLs
```

## Example: Complete Workflow with MCP

```javascript
// 1. Check status via MCP
mcp_gitkraken_git_actions(["status"], "/repo/path")

// 2. If JIRA configured, get issue details
mcp_gitkraken_jira_tools() 

// 3. Create branch via MCP or fallback
if (mcp_available) {
  mcp_gitkraken_git_actions(["checkout", "-b", branchName], "/repo/path")
} else {
  run_in_terminal("git checkout -b " + branchName)
}

// 4. Continue with commit and push operations
```

This approach provides both modern MCP integration and reliable fallback options for consistent Git workflow automation.

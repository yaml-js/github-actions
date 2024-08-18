# Clear Cache GitHub Action

This GitHub clears workflow cached entries.

## Features

- Clear all repository cache entries
- Clear all repository cache entries whose key starts with the given prefix

## Usage

### Example Workflow

Here's an example of how to use this action in your workflow:

```yaml
name: Update package.json Version

on:
  push:

jobs:
  clear-cache:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Clear cache items for the commit
        uses: yaml-js/build/github-actions/clear-cache@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          prefix: ${{ github.sha }}
```

### Inputs

| Name        | Description                                           | Required | Default          |
|-------------|-------------------------------------------------------|----------|------------------|
| `token`     | The GitHub token. Please note the token must have repo scope, for more details check [here](https://docs.github.com/en/rest/actions/cache?apiVersion=2022-11-28#delete-a-github-actions-cache-for-a-repository-using-a-cache-id')         | yes      |                  |
| `prefix`    | The prefix to use when matching cathc entries         | No       | ``               |
| `log-level` | Defines the level of details for the execution output | No       | `INFO`           |


### Outputs

None

### License

This project is licensed under the MIT License - see the [LICENSE](./../../LICENSE) file for details.

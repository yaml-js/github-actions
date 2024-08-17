# Clear Cache GitHub Action

This GitHub clears workflow cached entries.

## Features

- Clear all repository cache entries
- Clear all repository cache entries whose key starts by the given prefix

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
          prefix: ${{ github.sha }}
```

### Inputs

| Name        | Description                                           | Required | Default          |
|-------------|-------------------------------------------------------|----------|------------------|
| `prefix`    | The prefix to use when matching cathc entries         | No       | ``               |
| `log-level` | Defines the level of details for the execution output | No       | `INFO`           |


### Outputs

None

### License

This project is licensed under the MIT License - see the [LICENSE](./../../LICENSE) file for details.

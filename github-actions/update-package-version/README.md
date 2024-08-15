# Update package.json Version GitHub Action

This GitHub Action updates the version in the `package.json` file with the version specified by the Git tag.

## Features

- Replaces the `version` field in `package.json` with the version specified by the Git tag.
- Monorepo support by using glob patterns to find the `package.json`files
- Suports prefix stripping from the tag name (for instance tag `v0.1.0` can be used as version `0.1.0`)
- Package version is only changed if the existing version is set to ${FROM TAG}

## Usage

### Example Workflow

Here's an example of how to use this action in your workflow:

```yaml
name: Update package.json Version

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  update-version:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Update package.json version
        uses: yaml-js/build/github-actions/update-package-version@v1
        with:
          path: './**/package.json'
          tag: ${{ github.ref_name }}

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add package.json
          git commit -m "Update version to ${{ github.ref_name }}"
          git push
```

### Inputs

| Name        | Description                                           | Required | Default          |
|-------------|-------------------------------------------------------|----------|------------------|
| `path`      | The path to the `package.json` file to update.        | Yes      | `./package.json` |
| `tag`       | The Git tag that specifies the new version.           | Yes      | N/A              |
| `prefix`    | The prefix to be stripped from the tag name           | No       | `v`              |
| `log-level` | Defines the level of details for the execution output | No       | `INFO`           |


### Outputs

| Name              | Description                                                                   |
|-------------------|-------------------------------------------------------------------------------|
| `package-version` | The version used to update `package.json` files                               |

### Example

To trigger this action, create a new Git tag that follows semantic versioning, such as v1.2.3. When the tag is pushed to the repository, this action will automatically update the package.json version to 1.2.3.

#### Notes
- Ensure your repository is set up to use Git tags for versioning.
- Make sure to check that the version in package.json matches the Git tag to maintain consistency.

### Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes.

### License

This project is licensed under the MIT License - see the [LICENSE](./../../LICENSE) file for details.

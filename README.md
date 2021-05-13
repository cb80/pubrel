![CI/CD](https://github.com/cb80/pubrel/workflows/CI/CD/badge.svg)

# Description

This action can publish releases and upload assets. Existing releases can be
replaced if you wish (delete & recreate). It supports GitHub Enterprise.

# Examples
```
uses: cb80/pubrel@v0.2.0
with:
  files: |
    app.exe
    app
```

Use a different token:
```
uses: cb80/pubrel@v0.2.0
with:
  token: ${{ secrets.MY_TOKEN }}
  files: |
    app.exe
    app
```

Replace the `latest` release but not for other tags:
```
uses: cb80/pubrel@v0.2.0
with:
  replace: latest
  files: |
    app.exe
    app
```

Replace all releases:
```
uses: cb80/pubrel@v0.2.0
with:
  replace: true
  files: |
    app.exe
    app
```

# Inputs

All options are ... well ... optional.
| Option    | Default                | Description |
|-----------|------------------------|-------------|
| `ref`     | `github.ref`           | The GitHub ref related to this release. |
| `token`   | `secrets.GITHUB_TOKEN` | The token for authentication and authorization. |
| `replace` | `false`                | Shall we delete an existing release?<br>You can also set this to a specific tag name if you don't want to replace any release. |
| `files`   | no files               | The list of files to be uploaded to the release. |

# Credits

This action is inspired by the official [typescript action template][tstpl].

[tstpl]: https://github.com/actions/typescript-action

# Contributing to Render Awake

Thank you for helping improve Render Awake. Bug fixes, clearer documentation, accessibility improvements, and focused tests are useful contributions.

## Before you start

- Search existing [issues](https://github.com/Automate-Workflow/render-awake/issues) and [pull requests](https://github.com/Automate-Workflow/render-awake/pulls) to avoid duplicate work.
- Open an issue to discuss substantial changes before implementing them.
- Keep proposals aligned with a small, dependency-free browser workflow generator.
- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Local setup

Fork the repository first if you need your own writable copy. Clone the upstream project below, or substitute your fork URL:

```sh
git clone https://github.com/Automate-Workflow/render-awake.git
cd render-awake
python -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://localhost:8000). Python 3 serves the files; no installation or build step is needed for the app. Use a separate terminal for tests with Node.js 22.7+:

```sh
node --test tests/*.test.mjs
```

## Development principles

- Use vanilla HTML, CSS, and JavaScript; avoid unnecessary dependencies.
- Keep the UI accessible by keyboard, responsive, and consistent with the existing restrained dark interface.
- Preserve safe URL validation, YAML escaping, quoted shell references, and GitHub URL construction. Treat user input as untrusted.
- Keep changes small and focused on one concern. Add meaningful regression tests when changing behavior.
- Use safe DOM text insertion instead of inserting user input as HTML.
- Do not add emojis to the UI or project assets.
- Discuss backend infrastructure with the maintainer before proposing it.
- Describe GitHub handoff accurately: users paste, commit, and create their own pull requests.

## Pull requests

1. Fork if necessary and create a descriptive branch, such as `fix/repository-validation`.
2. Make focused changes and update documentation when behavior changes.
3. Run the existing tests. For UI changes, also check keyboard use and narrow/desktop layouts in a browser.
4. Run `git diff --check` and inspect the diff for unintended changes or sensitive data.
5. Submit a pull request targeting the upstream default branch with the problem, resulting behavior, and checks performed. Note any checks you could not run.

A useful title is `fix: handle invalid GitHub repository URLs`. This style is encouraged, not a mandatory commit format. The [pull request template](./.github/pull_request_template.md) provides a short checklist.

The tests use Node’s built-in runner and a small browser-handler harness; they do not replace real-browser checks for UI changes. Documentation-only changes should be checked for accurate instructions, working relative links, and valid Markdown. Issue forms should follow [GitHub’s issue-form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) and [form schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema).

## Bugs and feature requests

Use the [bug report form](https://github.com/Automate-Workflow/render-awake/issues/new?template=bug_report.yml) for reproduction steps, expected and actual behavior, and browser/OS details. Remove tokens, credentials, private URLs, and personal data from logs and screenshots.

Use the [feature request form](https://github.com/Automate-Workflow/render-awake/issues/new?template=feature_request.yml) to explain a problem and a focused improvement. Forms become available after their files are merged into the default branch.

## Security and licensing

Report vulnerabilities privately using [SECURITY.md](./SECURITY.md), not public issues or pull requests containing exploit details.

Contributions are covered by the project’s [Apache-2.0 license](./LICENSE). Preserve existing attribution in [NOTICE](./NOTICE), and identify any third-party material and its license when proposing its inclusion.

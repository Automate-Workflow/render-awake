![Render Awake](./assets/banner.svg)

Generate a GitHub Actions workflow that sends scheduled HTTPS requests to a Render web service. Everything runs in your browser: no backend, accounts, dependencies, tracking, or stored configuration.

**Application URL:** [automate-workflow.github.io/render-awake](https://automate-workflow.github.io/render-awake/) (requires GitHub Pages to be enabled).

### Use it

1. Enter `owner/repo` or a full GitHub repository URL and select the target branch.
2. Enter your public HTTPS service URL, optionally including a health-check path. Do not enter secrets or tokens; the URL will be visible in your workflow file.
3. Choose a ping interval and optional active window. Review the live YAML.
4. Select **Open on GitHub**. The app copies YAML and opens GitHub’s new-file editor with `.github/workflows/render-awake.yml` in the `filename` query parameter.
5. Paste the YAML, choose a new branch, and create a pull request. Suggested commit message: `chore(ci): add Render keep-alive workflow`.
6. Merge into the repository’s actual default branch. Check the **Actions** tab; use **Run workflow** for a manual check.

GitHub authentication and repository access are handled by GitHub. No pull request is created automatically. The app does not depend on undocumented content, commit-message, or PR-description query parameters. If GitHub does not populate the filename, enter the path above manually. If the file already exists, edit it instead. See [GitHub’s file-creation guide](https://docs.github.com/en/repositories/working-with-files/managing-files/creating-new-files).

**Copy YAML** copies the exact generated workflow; **Download YAML** saves a UTF-8 `render-awake.yml` file. Move downloads into `.github/workflows/`. If clipboard access fails, a selectable text area appears. If a pop-up is blocked, use **Continue to GitHub**. Export actions stay disabled until all required inputs are valid.

### Scheduling and behavior

- Choose 10 (recommended), 12, or 14 minute cron steps. Steps restart every hour: `*/14` runs at minutes 0, 14, 28, 42, and 56, so the hour boundary has a four-minute gap.
- Run all day, for 16 hours, or for 12 hours every day. Limited windows use a whole-hour start and an exclusive end; for example, 08:00–20:00 includes 08:00 through 19:59.
- UTC and IST (`Asia/Kolkata`) use GitHub’s IANA `timezone` schedule field. Midnight-spanning windows generate two schedule entries. All-day schedules use UTC.
- Normal service traffic can wake the service outside the window. A manually dispatched workflow can also run outside it. Delayed scheduled jobs can execute after the nominal window ends.
- Requests follow HTTPS redirects, have a 15-second connection timeout and 60-second total timeout, and fail on network errors or any final HTTP status other than 200. The job has a two-minute limit. URLs pass through an environment variable and a quoted shell reference; GitHub expression syntax is rejected.
- **Test Endpoint** makes a browser request with a 15-second timeout and no credentials. CORS can block the test even when GitHub Actions can reach the service; an inconclusive browser test does not prove downtime.

GitHub schedules are best-effort: runs can be delayed or dropped under load. Scheduled workflows must exist on the default branch and run from that branch, even if the file was created on another branch. Public-repository schedules may be disabled after 60 days without repository activity. Actions must be enabled and applicable usage limits still apply. See [schedule events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) and [workflow syntax and timezones](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule).

### Render free services

Render’s [current free-service documentation](https://render.com/docs/free) describes idle spin-down after 15 minutes and a 750 free-instance-hour allowance per workspace per calendar month, shared across applicable free web services. Running services consume those hours; keep-alive pings can increase consumption. Exhausted allowances can suspend services. Verify the latest official terms and eligibility before use.

This tool does not bypass platform restrictions or guarantee 24/7 uptime. Deployments, outages, scheduling delays, and exhausted allowances can all affect availability. Use an appropriate paid service when availability requirements demand it.

### Disable

In GitHub, open **Actions → Keep Render Service Awake → … → Disable workflow**, or remove the YAML from the default branch. See [disabling workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows).

### Develop locally

No installation or build is required. Serve the repository over HTTP so browser ES modules load:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000`. Run pure generator and interaction tests with Node.js 22.7+:

```sh
node --test tests/*.test.mjs
```

Node is a testing convenience only. Optional independent YAML parsing can use Python’s PyYAML, which is not a project dependency.

```text
index.html                 Accessible application
css/styles.css             Responsive dark interface
js/cron-math.js             Validation, schedules, YAML, GitHub URLs
js/app.js                   Browser interactions
assets/logo.svg             Original workflow/heartbeat mark
assets/banner.svg           README banner
tests/generator.test.mjs    Node built-in tests
LICENSE / NOTICE           Apache-2.0 and attribution
```

### Publish to GitHub Pages

Use **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root)**. All application assets use relative paths compatible with `/render-awake/`. No build workflow is necessary. Publication is complete only after GitHub reports a successful deployment and the application URL responds.

### License and maintainers

Copyright 2026 Ayush Raj and Automate-Workflow. Licensed under [Apache-2.0](./LICENSE); see [NOTICE](./NOTICE).

Maintained by **Ayush Raj**: [GitHub](https://github.com/ayushcmd) · [LinkedIn](https://www.linkedin.com/in/ayushcmd) · [Email](mailto:ayush_24a12res897@iitp.ac.in). Organization: [Automate-Workflow](https://github.com/Automate-Workflow).

An independent project, not affiliated with or endorsed by Render or GitHub.

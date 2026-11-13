# Security policy

## Supported versions

Security fixes target the latest released/default-branch version of Render Awake. Older snapshots are not maintained separately; use the current default-branch code and review updates to generated workflows when relevant.

## Report a vulnerability privately

Email **[ayush_24a12res897@iitp.ac.in](mailto:ayush_24a12res897@iitp.ac.in)**, maintained by Ayush Raj (@ayushcmd), with a subject such as `Render Awake security report`.

GitHub private vulnerability reporting is not currently enabled for this repository. Use the email route rather than a public issue. Please avoid publicly disclosing exploitable vulnerabilities before coordinating with the maintainer.

Include the affected file or feature, the version or commit if known, reproduction steps using non-sensitive example inputs, expected impact, and any proposed mitigation. Do not send live credentials or other people’s private data. The maintainer will review reports and coordinate fixes and disclosure where appropriate; no response deadline or service-level agreement is promised.

## Scope

Relevant reports include:

- Cross-site scripting and unsafe user-input handling.
- YAML injection or shell-command injection in generated workflows.
- Malicious or unsafe GitHub URL construction.
- Disclosure of sensitive input.
- Security problems with clipboard access or browser handling.

Render and GitHub operate their own platforms. Report vulnerabilities in those platforms through their respective security channels. Ordinary scheduling delays, endpoint failures, and CORS restrictions are not by themselves evidence of a vulnerability in this generator.

## Security considerations

Render Awake is a static browser application with no authentication backend. GitHub handles authentication and repository access. A static architecture does not eliminate security risks in input handling or generated code.

Users review and commit generated workflow files themselves. Endpoint URLs can become visible in repository contents and history. **Do not enter API keys, access tokens, passwords, or other secrets**, including in URL query parameters. Target public HTTPS endpoints intended for health checks.

Review the YAML before committing. The generator validates URLs, rejects GitHub expression syntax, and passes the URL through an environment variable and a quoted shell reference. These measures do not establish ownership of an endpoint or guarantee that it is safe to request.

Test Endpoint contacts the supplied endpoint from your browser, omitting browser credentials and the referrer. Copy actions write YAML to your clipboard; downloads save it locally; the GitHub handoff sends the selected repository, branch, and filename to GitHub. The generator does not automatically upload the YAML content to GitHub. Treat copied, downloaded, and committed content with the same care as other repository files.

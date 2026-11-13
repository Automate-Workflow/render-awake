import { parseRepository, validateBranch, validateServiceUrl, generateWorkflow, githubFileUrl } from './cron-math.js';

const $ = id => document.getElementById(id);
const controls = ['repository', 'branch', 'url', 'interval', 'hours', 'start', 'timezone'];
const touched = new Set();
let workflow = '';
let config;
let endpointRequest;
for (let hour = 0; hour < 24; hour++) {
  const option = document.createElement('option');
  option.value = hour;
  option.textContent = `${String(hour).padStart(2, '0')}:00`;
  option.selected = hour === 8;
  $('start').append(option);
}

function renderPreview(text) {
  const fragment = document.createDocumentFragment();
  for (const line of text.split('\n')) {
    const span = document.createElement('span');
    span.textContent = `${line}\n`;
    if (line.startsWith('#')) span.className = 'code-comment';
    else if (/^\s*[\w-]+:/.test(line)) span.className = 'code-key';
    fragment.append(span);
  }
  $('yaml').replaceChildren(fragment);
}

function update() {
  config = { repository: $('repository').value, branch: $('branch').value, url: $('url').value, interval: Number($('interval').value), hours: Number($('hours').value), start: Number($('start').value), timezone: $('hours').value === '24' ? 'UTC' : $('timezone').value };
  let valid = true;
  let urlValid = false;
  for (const [name, validator] of [['repository', parseRepository], ['branch', validateBranch], ['url', validateServiceUrl]]) {
    let error = '';
    try { config[name] = validator(config[name]); if (name === 'url') urlValid = true; } catch (e) { valid = false; error = e.message; }
    const visible = touched.has(name) && error;
    $(name).setAttribute('aria-invalid', visible ? 'true' : 'false');
    $(`${name}-error`).textContent = visible || '';
  }
  $('window-options').hidden = config.hours === 24;
  $('test').disabled = !urlValid || Boolean(endpointRequest);
  workflow = valid ? generateWorkflow(config) : '';
  renderPreview(workflow || '# Your workflow starts here.\n# Enter a valid repository and service URL\n# to generate a ready-to-use workflow.');
  $('ready').textContent = valid ? 'Ready' : 'Awaiting valid inputs';
  $('ready').classList.toggle('ready', valid);
  for (const id of ['github', 'copy', 'download']) $(id).disabled = !valid;
  const end = String((config.start + config.hours) % 24).padStart(2, '0');
  $('schedule-summary').textContent = config.hours === 24 ? `Every ${config.interval} minutes · All day · UTC` : `Every ${config.interval} minutes · ${String(config.start).padStart(2, '0')}:00–${end}:00 (end exclusive) · ${config.timezone}`;
  $('manual-copy').hidden = true;
  $('github-fallback').hidden = true;
  $('copy').textContent = 'Copy YAML';
  $('action-status').textContent = 'Generate, review, then add to your repository.';
}

for (const name of controls) {
  $(name).addEventListener('input', () => {
    touched.add(name);
    if (name === 'url') { endpointRequest?.abort(); endpointRequest = undefined; $('endpoint-status').textContent = ''; }
    update();
  });
  $(name).addEventListener('blur', () => {
    touched.add(name);
    if (name === 'repository') { try { $(name).value = parseRepository($(name).value); } catch {} }
    update();
  });
}
$('configuration').addEventListener('submit', event => event.preventDefault());

async function copyYaml(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    $('manual-copy').hidden = false;
    $('manual-yaml').value = text;
    $('manual-yaml').focus();
    $('manual-yaml').select();
    return false;
  }
}
$('copy').addEventListener('click', async () => {
  if (!workflow) return;
  const copied = await copyYaml(workflow);
  $('copy').textContent = copied ? 'Copied' : 'Copy YAML';
  $('action-status').textContent = copied ? 'Copied the exact workflow YAML.' : 'Clipboard unavailable. Copy the selected YAML with Ctrl+C or Command+C.';
});
$('download').addEventListener('click', () => {
  if (!workflow) return;
  const url = URL.createObjectURL(new Blob([workflow], { type: 'application/yaml;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'render-awake.yml';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('action-status').textContent = 'Download requested: render-awake.yml';
});
$('github').addEventListener('click', async () => {
  if (!workflow) return;
  const target = githubFileUrl(config.repository, config.branch);
  const text = workflow;
  // Open during the click gesture, before waiting for clipboard permission.
  const tab = window.open('about:blank', '_blank');
  if (tab) tab.opener = null;
  const copied = await copyYaml(text);
  if (tab) tab.location.replace(target);
  $('github-fallback').href = target;
  $('github-fallback').hidden = false;
  $('action-status').textContent = `${copied ? 'YAML copied.' : 'Copy the selected YAML manually.'} ${tab ? 'In GitHub,' : 'Pop-up blocked. Use Continue to GitHub, then'} paste the YAML, choose a new branch, and create a pull request. If the file exists, edit it instead.`;
});
$('test').addEventListener('click', async () => {
  let url;
  try { url = validateServiceUrl($('url').value); } catch { return; }
  const controller = new AbortController();
  endpointRequest = controller;
  $('test').disabled = true;
  $('endpoint-status').textContent = 'Testing endpoint (up to 15 seconds)…';
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' });
    if (endpointRequest !== controller) return;
    $('endpoint-status').textContent = response.status === 200 ? 'HTTP 200 — endpoint responded successfully.' : `HTTP ${response.status} — the workflow requires HTTP 200.`;
    response.body?.cancel().catch(() => {});
  } catch {
    if (endpointRequest !== controller) return;
    $('endpoint-status').textContent = 'Browser test could not confirm a response. CORS, a timeout, or a network error may prevent testing; this does not prove the service is offline. GitHub Actions is not subject to browser CORS.';
  } finally {
    clearTimeout(timer);
    if (endpointRequest === controller) { endpointRequest = undefined; $('test').disabled = false; }
  }
});
update();

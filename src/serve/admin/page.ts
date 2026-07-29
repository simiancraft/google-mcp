/**
 * The admin credential UI, inlined as one self-contained HTML document (styles +
 * script embedded). The suite builds with plain `tsc`, which copies no static
 * assets, so shipping the page as a string constant is what keeps it in `dist/`
 * without a copy-assets build step. The script talks to the `/admin/api/*`
 * endpoints wired in `routes.ts`.
 */
export const ADMIN_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>google-mcp-suite — credentials</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: system-ui, sans-serif; max-width: 48rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
    h1 { font-size: 1.4rem; }
    h2 { font-size: 1.1rem; margin-top: 2rem; }
    section { border: 1px solid #8884; border-radius: .6rem; padding: 1rem 1.2rem; margin: 1rem 0; }
    input, textarea, button { font: inherit; padding: .4rem .6rem; border-radius: .4rem; border: 1px solid #8886; }
    button { cursor: pointer; background: #2563eb; color: #fff; border: none; }
    button.danger { background: #b91c1c; padding: .2rem .5rem; }
    table { width: 100%; border-collapse: collapse; margin-top: .5rem; }
    td, th { text-align: left; padding: .35rem .4rem; border-bottom: 1px solid #8883; }
    .muted { color: #6b7280; font-size: .85rem; }
    code { background: #8881; padding: .1rem .3rem; border-radius: .3rem; }
    .ok { color: #15803d; }
    .bad { color: #b91c1c; }
    .row { display: flex; gap: .5rem; flex-wrap: wrap; align-items: center; }
    textarea { width: 100%; min-height: 5rem; box-sizing: border-box; }
    #msg { position: sticky; top: 0; padding: .5rem; border-radius: .4rem; }
  </style>
</head>
<body>
  <h1>google-mcp-suite — credentials</h1>
  <p class="muted">Writes to <code id="dir">…</code>, exactly where the MCP servers read it.</p>
  <div id="msg"></div>

  <section>
    <h2>1 · Shared OAuth client</h2>
    <p class="muted">The Desktop-app <code>client_secret.json</code> from Google Cloud (<code>installed</code> or <code>web</code> shape). Shared by every account.</p>
    <p>Status: <span id="cs-status">…</span></p>
    <div class="row">
      <input type="file" id="cs-file" accept="application/json,.json">
      <button id="cs-save">Save client secret</button>
    </div>
  </section>

  <section>
    <h2>2 · Authorized accounts</h2>
    <table id="accounts"><thead><tr><th>Account</th><th>Scopes</th><th>Refresh</th><th>Access expires</th><th></th></tr></thead><tbody></tbody></table>
    <p class="muted" id="no-accounts" hidden>No accounts authorized yet.</p>
  </section>

  <section>
    <h2>3 · Authorize an account</h2>
    <p class="muted">The label becomes the token filename and the account segment clients address, e.g. <code>/&lt;account&gt;/gmail</code>. Use the account's email to prefill Google's chooser.</p>
    <div class="row">
      <input id="acct" placeholder="you@example.com" size="28">
      <button id="auth-start">Start authorization →</button>
    </div>
    <div id="step2" hidden style="margin-top:1rem">
      <p>1. <a id="auth-link" href="#" target="_blank" rel="noopener">Open the Google consent screen</a> and approve.</p>
      <p>2. If this page is running on another machine, the browser will land on a <em>localhost</em> page that won't load — copy that full URL from the address bar and paste it here:</p>
      <textarea id="redir" placeholder="http://localhost:3000/admin/oauth/callback?state=…&code=…"></textarea>
      <div class="row" style="margin-top:.5rem">
        <button id="auth-finish">Finish authorization</button>
        <span class="muted">(If you're on the same machine, it completes automatically — just refresh.)</span>
      </div>
    </div>
  </section>

  <script type="module">
    // Thin wrappers over the /admin JSON API; each returns { ok, data }.
    async function call(path, options) {
      const res = await fetch(path, options);
      let data = {};
      try { data = await res.json(); } catch { /* some endpoints return no body */ }
      return { ok: res.ok, data };
    }
    function postJson(path, body) {
      return call(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    }
    const api = {
      getState: () => call("/admin/api/state"),
      saveClientSecret: (content) => postJson("/admin/api/client-secret", { content }),
      startAuth: (account) => postJson("/admin/api/auth/start", { account }),
      completeAuth: (url) => postJson("/admin/api/auth/complete", { url }),
      deleteAccount: (account) => call("/admin/api/accounts/" + encodeURIComponent(account), { method: "DELETE" }),
    };

    const msg = document.getElementById("msg");
    function flash(text, ok) {
      msg.textContent = text;
      msg.style.background = ok ? "#16a34a22" : "#dc262622";
      setTimeout(() => { msg.textContent = ""; msg.style.background = ""; }, 6000);
    }
    function fmt(ts) {
      if (!ts) return "—";
      const d = new Date(ts);
      return d < new Date() ? "expired" : d.toLocaleString();
    }
    function renderState(state, onDelete) {
      document.getElementById("dir").textContent = state.dir;
      const cs = document.getElementById("cs-status");
      cs.innerHTML = state.clientSecret ? '<span class="ok">✓ present</span>' : '<span class="bad">✗ not uploaded</span>';
      const tbody = document.querySelector("#accounts tbody");
      tbody.innerHTML = "";
      document.getElementById("no-accounts").hidden = state.accounts.length > 0;
      for (const a of state.accounts) {
        const tr = document.createElement("tr");
        const refresh = a.hasRefresh ? '<span class="ok">yes</span>' : '<span class="bad">no</span>';
        tr.innerHTML = "<td><code></code></td><td></td><td>" + refresh + "</td><td></td><td></td>";
        tr.children[0].firstChild.textContent = a.account;
        tr.children[1].textContent = a.scopes;
        tr.children[3].textContent = fmt(a.expiry);
        const btn = document.createElement("button");
        btn.className = "danger";
        btn.textContent = "Delete";
        btn.onclick = () => onDelete(a.account);
        tr.children[4].appendChild(btn);
        tbody.appendChild(tr);
      }
    }

    async function load() {
      const { ok, data } = await api.getState();
      if (!ok) return flash("Could not load state.", false);
      renderState(data, del);
    }
    async function uploadSecret() {
      const file = document.getElementById("cs-file").files[0];
      if (!file) return flash("Choose the client_secret.json file first.", false);
      const { ok, data } = await api.saveClientSecret(await file.text());
      flash(ok ? "Client secret saved." : data.error, ok);
      load();
    }
    async function startAuth() {
      const account = document.getElementById("acct").value.trim();
      const { ok, data } = await api.startAuth(account);
      if (!ok) return flash(data.error, false);
      document.getElementById("auth-link").href = data.authUrl;
      document.getElementById("step2").hidden = false;
      window.open(data.authUrl, "_blank", "noopener");
    }
    async function complete() {
      const url = document.getElementById("redir").value.trim();
      const { ok, data } = await api.completeAuth(url);
      flash(ok ? "Authorized " + data.account + "." : data.error, ok);
      if (ok) {
        document.getElementById("redir").value = "";
        document.getElementById("step2").hidden = true;
        load();
      }
    }
    async function del(account) {
      if (!confirm("Delete token for " + account + "?")) return;
      const { ok, data } = await api.deleteAccount(account);
      flash(ok ? "Deleted " + account + "." : data.error, ok);
      load();
    }

    document.getElementById("cs-save").addEventListener("click", uploadSecret);
    document.getElementById("auth-start").addEventListener("click", startAuth);
    document.getElementById("auth-finish").addEventListener("click", complete);
    load();
  </script>
</body>
</html>`;

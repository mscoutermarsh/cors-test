addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const CORS_HEADERS_REGEX = /(Access-Control-Allow-Methods)|(Access-Control-Allow-Headers)|(Access-Control-Allow-Origin)|(Access-Control-Max-Age)|(Access-Control-Allow-Credentials)/i

function html(url, method, headers, request) {
  return `<!DOCTYPE html>
  <head>
    <title>CORS Tester - Test a URL for valid CORS headers</title>
    <meta name="title" content="CORS Tester - Test a URL for valid CORS headers">
    <meta name="description" content="Use this little tool to test a URLs CORS headers. Test CORS by HTTP method. Shows header information and gives tips on fixing CORS issues.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="keywords" content="cors, test, http">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="language" content="English">
    <meta name="twitter:image" content="https://hcti.io/v1/image/6f4d48fa-3e79-4232-9373-be950cdc7d75">
    <meta name="og:image" content="https://hcti.io/v1/image/6f4d48fa-3e79-4232-9373-be950cdc7d75">
    <link rel="icon" href="https://mikecoutermarsh.com/favicon.ico">
  </head>
<body class="bg-gray">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Primer/15.2.0/primer.css" integrity="sha512-xTz2ys4coGAOz8vuV1NcQBkgVmKhsSEtjbqyMJbBHRplFuvKIUo6xhLHpAyPt9mfR6twHJgn9OgVLuqOvjeBhg==" crossorigin="anonymous" />

  <div class="col-lg-6 col-sm-12 mx-auto p-4 bg-white">
  <h1><a href="/">CORS Tester</a></h1>
  <p>Use this little website to test if a URL is setup correctly to work with CORS.</p>

  <form>
    <div class="form-group">
      <div class="form-group-header">
        <label for="example-text">URL</label>
      </div>
      <div class="form-group-body mb-2">
        <input class="form-control input-monospace mt-1" name="url" type="url" required value="${url}" autofocus placeholder="https://codehappy.dev" id="example-text" />
        <select class="form-select mt-1 input-monospace" name="method" aria-label="HTTP method">
          <option value="get" ${ isSelected(method,"get") }>
          GET
          </option>
          <option value="post" ${ isSelected(method,"post") }>
          POST
          </option>
          <option value="put" ${ isSelected(method,"put") }>
          PUT
          </option>
          <option value="patch" ${ isSelected(method,"patch") }>
          PATCH
          </option>
          <option value="head" ${ isSelected(method,"head") }>
          HEAD
          </option>
          <option value="options" ${ isSelected(method,"options") }>
          OPTIONS
          </option>
        </select>
      </div>
      <button class="btn btn-primary btn-large">
        Test!
      </button>
    </div>
  </form>
  ${renderShareLink(request, url)}
  <hr>

  <div class="text-left">
  ${renderResult(headers)}
  </div>

  <hr class="mt-4">
  <p class="text-small mt-4">CORS tester was built by <a href="https://twitter.com/mscccc">@mscccc</a>. The code is <a href="https://github.com/mscoutermarsh/cors-test">available on GitHub</a>. Sponsored by <a href="https://htmlcsstoimage.com">HTML/CSS to Image</a>.</p>
  </div>
</body>`
}

function isSelected(method, current) {
  if (method === current) {
    return "selected"
  } else {
    return ""
  }
}

function renderShareLink(request, url) {
  if (isValidHttpUrl(url)) {
    link = new URL(request.url)
    return `Shareable link: <a href="${link}" class="css-truncate css-truncate-target expandable d-block" style="max-width: 90%">${link}</a>`
  } else {
    return ``
  }
}

function renderResult(headers) {
  if (!headers) {
    return `
    <h3>What is CORS?</h3>
    <p>
    For security, browsers stop scripts from accessing URLs on different domains. This is done via CORS or <b>Cross-Origin Resource Sharing</b>. It is implemented by looking at the HTTP headers returned by a url.
    So if you are on <code>google.com</code> and try to access <code>example.com/font.ttf</code>, it will only be allowed if example.com returns a header allowing it. <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">Learn more</a>.
    </p>

    <h3>What does this site do?</h3>
    <p>This site will make a test request to the URL and check if it has valid CORS headers. If it does, you should be good to go when using it in a browser. This website is <a href="https://github.com/mscoutermarsh/cors-test">open source and available here.</a></p>

    <h3>Which HTTP method should I use?</h3>
    <p>If you're loading a script or font, you'll want <code>GET</code>. If you're sending an AJAX request to a URL, you probably want <code>OPTIONS</code> for checking the preflight request. The other options are there just incase you need them.</p>`
  }

  return `<h3>Results</h3>

  <p>${renderCors(headers)}</p>

  <h3>Headers</h3>
  <p>These are the response headers received when making the request.</p>
  <code class="text-mono text-left">
  <pre style="overflow-x: scroll" class="bg-gray-dark p-2 border text-white">
${renderHeaders(headers)}
  </pre>
  </code>`
}

async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  let url = searchParams.get('url')
  let method = searchParams.get('method') || "get"
  let headers = null

  if (isValidHttpUrl(url)) {
    headers = await getHeaders(url, method)
  } else {
    url = ''
  }

  return new Response(html(url, method, headers, request), {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "Content-Security-Policy": "script-src none",
      "Access-Control-Allow-Origin": "https://htmlcsstoimage.com"
    },
  })
}

function renderCors(headers) {
  const allowOrigin = headers.get("access-control-allow-origin")

  if (allowOrigin === "*") {
    return `
  <div class="Toast Toast--success">
    <span class="Toast-icon">
      <svg width="12" height="16" viewBox="0 0 12 16" class="octicon octicon-check" aria-hidden="true">
        <path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z" />
      </svg>
    </span>
    <span class="Toast-content">This URL will work correctly with CORS.</span>
  </div>
`
  } else if (allowOrigin !== null) {
    return `
  <div class="Toast Toast--warning mb-4">
    <span class="Toast-icon">
    <svg width="14" height="16" viewBox="0 0 14 16" class="octicon octicon-stop" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M10 1H4L0 5v6l4 4h6l4-4V5l-4-4zm3 9.5L9.5 14h-5L1 10.5v-5L4.5 2h5L13 5.5v5zM6 4h2v5H6V4zm0 6h2v2H6v-2z"
        />
      </svg>
    </span>
    <span class="Toast-content">This URL will only work for specific domains.</span>
</div>
<h3>What's that mean?</h3>
<p>
This url can only be loaded by pages that match <code>${ encodeHTML(allowOrigin) }</code>. If you're trying to load it from a different origin and it's not working, you'll need to change it so the <code>access-control-allow-origin</code> header is set to <code>*</code>.
</p>
`
  } else {
    return `
  <div class="Toast Toast--error mb-4">
    <span class="Toast-icon">
    <svg width="14" height="16" viewBox="0 0 14 16" class="octicon octicon-stop" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M10 1H4L0 5v6l4 4h6l4-4V5l-4-4zm3 9.5L9.5 14h-5L1 10.5v-5L4.5 2h5L13 5.5v5zM6 4h2v5H6V4zm0 6h2v2H6v-2z"
        />
      </svg>
    </span>
    <span class="Toast-content">This URL will not work correctly with CORS.</span>
</div>
<h3>What's wrong?</h3>
<p>
It does not have the <code>access-control-allow-origin</code> header set to <code>*</code>. Without this header, requests from other domains cannot be made to it via a users browser.
</p>
<h3>How to fix it?</h3>
<p>
If you have access to the server for the URL, you'll need to modify it to add the <code>access-control-allow-origin</code> header. If you do not have access, you'll need to upload the file somewhere else.
</p>
`
  }
}

function renderHeaders(headers) {
  let headersArr = []

  for (var pair of headers.entries()) {
    let line = pair[0]+ ': '+ pair[1]

    if (pair[0].match(CORS_HEADERS_REGEX)) {
      line = `<span class="bg-yellow-dark text-bold p-1">${line}</span>`
    }

    headersArr.push(line)
  }

  return headersArr.join("\r\n")
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})

async function getHeaders(url, method) {
  try {
    const response = await fetch(url, { method: method })
    return response.headers
  } catch {
    return new Headers
  }
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function encodeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

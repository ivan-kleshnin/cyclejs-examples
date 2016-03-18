function renderHtml(globals) {
  return `
    <html>
      <head>
        <title>Lesson 10.0: Routing Custom</title>
      </head>
      <body>
        <div id="app">Loading...</div>
        <script>
          window.globals = ${JSON.stringify(globals)};
        </script>
        <script src="http://localhost:2992/10.0-routing-custom/public/app.js"></script>
      </body>
    </html>`;
}

function render404(url) {
  return `
    <html>
      <head>
        <title>404 Not Found</title>
      </head>
      <body>
        <h1>404 Not Found</h1>
      </body>
    </html>`;
}

function render500({message, error}) {
  return `
    <html>
      <head>
        <title>500 Server Error</title>
      </head>
      <body>
        <h1>500 Server Error</h1>
      </body>
    </html>`;
}

export default {
  renderHtml, render404, render500,
};

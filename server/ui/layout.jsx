/** @jsx jsx */
/** @jsxFrag Fragment */
import { html } from "hono/helper.ts";
import { Fragment, jsx } from "hono/middleware.ts";

export const Layout = ({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://unpkg.com/htmx.org"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="//unpkg.com/alpinejs" defer></script>
        <title>My Links</title>
      </head>
      <body>
        <div class="p-4 w-full flex justify-center">
          <div id="root" class="w-8/12">
            <h1 class="text-4xl font-bold mb-4">ispec Links</h1>
            ${children}
          </div>
        </div>
      </body>
    </html>
  `;
};

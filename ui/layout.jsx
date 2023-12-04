/** @jsx jsx */
/** @jsxFrag Fragment */
import { html } from "hono/helper.ts";
import { Fragment, jsx } from "hono/middleware.ts";

export const Layout = ({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="p-4">
          <h1 class="text-4xl font-bold mb-4"><a href="/">Links</a></h1>
          ${children}
        </div>
      </body>
    </html>
  `;
};

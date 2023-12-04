/** @jsx jsx */
/** @jsxFrag Fragment */
import { Hono } from "hono";
import { Fragment, jsx, basicAuth } from "hono/middleware.ts";
import { tailwindStyleTagInjector } from "./ui/twind.js";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";
import { withForms } from "https://esm.sh/@twind/forms@0.1.4";

import {
  getSignedCookie,
  setSignedCookie,
} from "hono/helper.ts"

import { Admin, Item } from "./ui/admin.jsx";

const secret = "abc123"

const kv = await Deno.openKv();
const app = new Hono();
app.use(
  "*",
  tailwindStyleTagInjector({
    presets: [
      presetTailwind(),
      { theme: { preflight: withForms() } },
    ],
  }),
);

app.get("/:key", async (c) => {
  const { key } = c.req.param();
  const { value:url } = await kv.get([key]);

  if (url) {
    return c.redirect(url);
  } else {
    return c.text("404 Not Found~", 404);
  }
});

app.post("/api/new", async (c) => {
  const cookie = await getSignedCookie(c, secret, "session")
  if (!cookie) {
    return c.text("401 Unauthorized", 401);
  }
  const { key, url } = await c.req.parseBody();

  if (!url || !key) {
    return c.text("400 Bad Request", 400);
  }
  await kv.set([key], url);

  return c.html(<Item key={key} url={url} />);
});

app.delete("/api/:key", async (c) => {
  const cookie = await getSignedCookie(c, secret, "session")
  if (cookie !== "hello") {
    return c.text("401 Unauthorized", 401);
  }

  const { key } = c.req.param();
  await kv.delete([key]);

  return c.text("ok", 200);
});

app.get("/",  basicAuth({
    username: 'me',
    password: 'hello',
  }),async (c) => {
  const token = "hello"
  await setSignedCookie(c, 'session', token, secret)

  return c.render(<Admin />);
});

Deno.serve(app.fetch);

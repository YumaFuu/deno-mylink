/** @jsx jsx */
/** @jsxFrag Fragment */
import { Hono } from "hono";
import { basicAuth, Fragment, jsx } from "hono/middleware.ts";
import { getSignedCookie, setSignedCookie } from "hono/helper.ts";

import { Admin, Item } from "./ui/admin.jsx";

const secret = Deno.env.get("COOKIE_SECRET") || "mysecret"

const kv = await Deno.openKv();
const app = new Hono();

app.get("/:key", async (c) => {
  const { key } = c.req.param();
  const { value: url } = await kv.get([key]);

  if (url) {
    return c.redirect(url);
  } else {
    return c.redirect(`https://google.com/search?q=${key}`);
  }
});

app.post("/api/new", async (c) => {
  const cookie = await getSignedCookie(c, secret, "session");
  if (!cookie) {
    return c.text("401 Unauthorized", 401);
  }
  const { key, url } = await c.req.parseBody();

  if (!url || !key) {
    return c.text("ERROR: Key and URL are required.", 400);
  }

  const alreadyExists = !!(await kv.get([key])).value
  if (alreadyExists) {
    return c.text("ERROR: key already exists.", 400);
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return c.text(`ERROR: Invalid URL '${url}'.`, 400);
  }
  await kv.set([key], url);

  return c.html(<Item key={key} url={url} />);
});

app.delete("/api/:key", async (c) => {
  const cookie = await getSignedCookie(c, secret, "session");
  if (cookie !== "hello") {
    return c.text("401 Unauthorized", 401);
  }

  const { key } = c.req.param();
  await kv.delete([key]);

  return c.text("ok", 200);
});

app.get(
  "/",
  basicAuth({
    username: Deno.env.get("USERNAME") || "me",
    password: Deno.env.get("PASSWORD") || "123",
  }),
  async (c) => {
    const token = "hello";
    await setSignedCookie(c, "session", token, secret);

    return c.render(<Admin />);
  },
);

Deno.serve(app.fetch);

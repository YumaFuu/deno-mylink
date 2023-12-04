import { createMiddleware } from "https://deno.land/x/hono@v3.9.2/helper.ts";
import { inline, install } from "https://esm.sh/@twind/core@1.1.3";

export const tailwindStyleTagInjector = (config) => {
  install(config);

  return createMiddleware(async (c, next) => {
    await next();

    if (!c.res.body) {
      return;
    }

    const stream = c.res.body.pipeThrough(new TextDecoderStream());
    const buffer = [];

    for await (const chunk of stream) {
      buffer.push(chunk);
    }

    const html = buffer.join();
    const inserted_html = inline(html);

    c.res = new Response(inserted_html, c.res);
  });
};

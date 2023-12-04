/** @jsx jsx */
/** @jsxFrag Fragment */
import { html } from "hono/helper.ts";
import { Fragment, jsx, jsxRenderer } from "hono/middleware.ts";
import { Layout } from "./layout.jsx";

const kv = await Deno.openKv();

export const Admin = async () => {
  const entries = await kv.list({ prefix: "" });

  const list = [];
  for await (const entry of entries) {
    list.push({ key: entry.key[0], url: entry.value });
  }
  return (
    <Layout>
      <div>
        <AddItem />
        {list.map((item) => {
          return <Item key={item.key} url={item.url} />;
        })}
      </div>
    </Layout>
  );
};

const AddItem = () => (
  <form
    hx-post="/api/new"
    hx-swap="beforeend"
    class="mb-4"
  >
    <div class="mb-2">
        <div class="flex row mb-2">
          <label class="mb-1 w-20" for="key"> Key </label>
          <input name="key" type="text" class="border"/>
        </div>
        <div class="flex row">
          <label class="mb-1 w-20" for="url"> URL </label>
          <input name="url" type="text" class="border"/>
        </div>
    </div>
    <button type="submit" class="border py-1 px-2 rounded">
      作成
    </button>
  </form>
);

export const Item = ({ key, url }) => {
  return (
    <p
      hx-delete={`/api/${key}`}
      hx-swap="delete"
      class="flex row items-center justify-between py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mb-2"
    >
      {key} : {url}
      <button class="font-medium">Delete</button>
    </p>
  );
};

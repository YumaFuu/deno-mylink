/** @jsx jsx */
/** @jsxFrag Fragment */
import { Fragment, jsx } from "hono/middleware.ts";
import { Layout } from "./layout.jsx";

const kv = await Deno.openKv();

export const Admin = async () => {
  const entries = await kv.list({ prefix: "" });

  const list = [];
  for await (const entry of entries) {
    list.push({ key: entry.key[0], url: entry.value?.url, desc: entry.value?.desc });
  }
  return (
    <Layout>
      <div hx-ext="response-targets">
        <AddItem />
        <div id="items">
          {list.map((item) => <Item key={item.key} url={item.url} desc={item.desc} />)}
        </div>
      </div>
    </Layout>
  );
};

const AddItem = () => (
  <form
    hx-post="/api/new"
    hx-swap="beforeend"
    hx-target="#items"
    hx-target-error="#error"
    hx-on="htmx:beforeRequest: document.getElementById('error').innerHTML = ''"
    class="mb-7 flex flex-col h-32 justify-between"
  >
    <div class="mb-3">
      <div class="flex mb-2">
        <label class="mb-1 w-20 text-gray-100" for="key">Key</label>
        <input name="key" type="text" class="border w-7/12" />
      </div>
      <div class="flex mb-2">
        <label class="mb-1 w-20 text-gray-100" for="desc">Desc</label>
        <input name="desc" type="text" class="border w-7/12" />
      </div>
      <div class="flex ">
        <label class="mb-1 w-20 text-gray-100" for="url">URL</label>
        <input name="url" type="text" class="border w-7/12" />
      </div>
    </div>
    <button
      type="submit"
      class="border py-1 px-2 rounded w-20 hover:bg-gray-200 mb-3 bg-gray-100"
    >
      作成
    </button>
    <span id="error" class="text-red-500 h-6 mb-3"></span>
  </form>
);

export const Item = ({ key, url, desc }) => {
  return (
    <div
      id={ 'id-' + key }
      class="
        flex row items-center justify-between
        py-1 px-2 my-1 rounded-lg text-lg
        border bg-gray-200
      "
    >
      <div class="flex flex-col">
        <div class="flex items-center mb-1">
          <span class="font-medium text-slate-800 mr-3">
            {key}
          </span>
          <span class="text-sm text-slate-800">
            {desc}
          </span>
        </div>
        <a href={url} class="text-left text-sm" target="_blank">
          {url}
        </a>
      </div>
      <button
        class="text-sm text-red-600 "
        hx-delete={`/api/${key}`}
        hx-swap="delete"
        hx-target={"#id-"+key}
      >
        Delete
      </button>
    </div>
  );
};

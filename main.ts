import pug from "npm:pug";
import { getResultsByUsername } from "./src/hevy.ts";

const renderHevyWidget = pug.compileFile("templates/hevy.pug");

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("", { status: 405 });
  }

  const url = new URL(req.url);

  if (!url.searchParams.has("username")) {
    return new Response("Missing username query param", { status: 400 });
  }

  const results = await getResultsByUsername(url.searchParams.get("username")!);

  return new Response(renderHevyWidget(results), {
    headers: { "content-type": "image/svg+xml" },
  });
});

import pug from "npm:pug";
import { getResultsByUsername } from "./src/hevy/api.ts";
import { getStatsById } from "./src/duolingo/api.ts";
import { eTag } from "@std/http/etag";

const HEVY_PATH = new URLPattern({ pathname: "/hevy" });
const DUOLINGO_PATH = new URLPattern({ pathname: "/duolingo" });

const renderHevyWidget = pug.compileFile("templates/hevy.pug");
const renderDuolingoWidget = pug.compileFile("templates/duolingo.pug");

const NO_CACHE_HEADERS: Record<string, string> = {
  "cache-control": "no-cache, no-store",
};

const svgResponse = async (content: string) =>
  new Response(content, {
    headers: {
      "content-type": "image/svg+xml",
      "etag": await eTag(content),
      ...NO_CACHE_HEADERS,
    },
  });

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("", { status: 405 });
  }

  const url = new URL(req.url);
  if (HEVY_PATH.exec(url)) {
    const username = url.searchParams.get("username");
    if (!username) {
      return new Response("Missing username query param", { status: 400 });
    }

    const results = await getResultsByUsername(
      url.searchParams.get("username")!,
    );
    return await svgResponse(renderHevyWidget(results));
  } else if (DUOLINGO_PATH.exec(url)) {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response("Missing id query param", { status: 400 });
    }

    const stats = await getStatsById(id);

    if (Object.keys(stats).length === 0) {
      return new Response("User not found", { status: 404 });
    }

    return await svgResponse(renderDuolingoWidget(stats));
  } else {
    return new Response(null, { status: 404 });
  }
});

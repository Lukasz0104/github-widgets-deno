import pug from "npm:pug";
import { getResultsByUsername } from "./src/hevy/api.ts";
import { getStatsById } from "./src/duolingo/api.ts";

const HEVY_PATH = new URLPattern({ pathname: "/hevy" });
const DUOLINGO_PATH = new URLPattern({ pathname: "/duolingo" });

const renderHevyWidget = pug.compileFile("templates/hevy.pug");
const renderDuolingoWidget = pug.compileFile("templates/duolingo.pug");

const svgResponse = (content: string) =>
  new Response(content, { headers: { "content-type": "image/svg+xml" } });

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
    return new Response(renderHevyWidget(results), {
      headers: { "content-type": "image/svg+xml" },
    });
  } else if (DUOLINGO_PATH.exec(url)) {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response("Missing id query param", { status: 400 });
    }

    const stats = await getStatsById(id);

    if (Object.keys(stats).length === 0) {
      return new Response("User not found", { status: 404 });
    }

    return svgResponse(renderDuolingoWidget(stats));
  } else {
    return new Response(null, { status: 404 });
  }
});

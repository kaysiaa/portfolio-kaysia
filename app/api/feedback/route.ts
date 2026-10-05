import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { snapshot, update, view } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_NAME = 40;
const MAX_MESSAGE = 500;
const COOLDOWN_MS = 10_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const lastComment = new Map<string, number>();

function visitorId(req: NextRequest) {
  const existing = req.cookies.get("vid")?.value;
  if (existing && UUID_RE.test(existing)) return { id: existing, isNew: false };
  return { id: randomUUID(), isNew: true };
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function cleanName(value: unknown) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, MAX_NAME)
    : "";
}

function cleanMessage(value: unknown) {
  return typeof value === "string"
    ? value
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, MAX_MESSAGE)
    : "";
}

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function GET(req: NextRequest) {
  try {
    const { id } = visitorId(req);
    return NextResponse.json(await snapshot(id), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return fail("Could not load feedback.", 500);
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const { id, isNew } = visitorId(req);

  try {
    let state;

    if (body.action === "vote") {
      const vote = body.vote;
      if (vote !== "like" && vote !== "dislike" && vote !== null) {
        return fail("Invalid vote.", 400);
      }
      state = await update((data) => {
        if (vote === null) delete data.votes[id];
        else data.votes[id] = vote;
        return view(data, id);
      });
    } else if (body.action === "comment") {
      const name = cleanName(body.name) || "Anonymous";
      const message = cleanMessage(body.message);
      if (!message) return fail("Please write a comment first.", 400);

      const now = Date.now();
      const keys = [`v:${id}`, `ip:${clientIp(req)}`];
      if (keys.some((k) => now - (lastComment.get(k) ?? 0) < COOLDOWN_MS)) {
        return fail("Slow down a little. Try again in a few seconds.", 429);
      }
      keys.forEach((k) => lastComment.set(k, now));

      state = await update((data) => {
        data.comments.push({
          id: randomUUID(),
          name,
          message,
          createdAt: new Date().toISOString(),
        });
        if (data.comments.length > 1000) data.comments = data.comments.slice(-1000);
        return view(data, id);
      });
    } else {
      return fail("Unknown action.", 400);
    }

    const res = NextResponse.json(state);
    if (isNew) {
      res.cookies.set("vid", id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }
    return res;
  } catch {
    return fail("Could not save. Please try again.", 500);
  }
}

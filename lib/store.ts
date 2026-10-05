import { promises as fs } from "fs";
import path from "path";

export type VoteValue = "like" | "dislike";

export type CommentItem = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type Data = {
  votes: Record<string, VoteValue>; // visitor id -> vote
  comments: CommentItem[];
};

export type FeedbackState = {
  likes: number;
  dislikes: number;
  myVote: VoteValue | null;
  comments: CommentItem[];
};

// Data is saved to ./data/feedback.json (created automatically).
const FILE = path.join(process.cwd(), "data", "feedback.json");

let queue: Promise<unknown> = Promise.resolve();

async function read(): Promise<Data> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      votes: parsed.votes && typeof parsed.votes === "object" ? parsed.votes : {},
      comments: Array.isArray(parsed.comments) ? parsed.comments : [],
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { votes: {}, comments: [] };
    }
    throw err; // corrupt file: fail instead of overwriting existing data
  }
}

async function write(data: Data) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

export function view(data: Data, visitorId?: string): FeedbackState {
  let likes = 0;
  let dislikes = 0;
  for (const v of Object.values(data.votes)) {
    if (v === "like") likes++;
    else if (v === "dislike") dislikes++;
  }
  return {
    likes,
    dislikes,
    myVote: (visitorId && data.votes[visitorId]) || null,
    comments: [...data.comments].reverse().slice(0, 200), // newest first
  };
}

export async function snapshot(visitorId?: string): Promise<FeedbackState> {
  return view(await read(), visitorId);
}

// Runs one change at a time so simultaneous requests don't overwrite each other.
export function update<T>(fn: (data: Data) => T): Promise<T> {
  const run = queue.then(async () => {
    const data = await read();
    const result = fn(data);
    await write(data);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

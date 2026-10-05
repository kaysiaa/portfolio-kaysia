"use client";

import { FormEvent, useEffect, useState } from "react";

type Vote = "like" | "dislike" | null;
type CommentItem = { id: string; name: string; message: string; createdAt: string };
type State = { likes: number; dislikes: number; myVote: Vote; comments: CommentItem[] };

const MAX_NAME = 40;
const MAX_MESSAGE = 500;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Feedback() {
  const [data, setData] = useState<State | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [voting, setVoting] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/feedback", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json: State) => active && setData(json))
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, []);

  async function post(payload: object): Promise<State> {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Something went wrong.");
    return json as State;
  }

  async function vote(choice: "like" | "dislike") {
    if (!data || voting) return;
    const previous = data;
    const next: Vote = data.myVote === choice ? null : choice; // tap again to undo
    setData({
      ...data,
      myVote: next,
      likes: data.likes - (data.myVote === "like" ? 1 : 0) + (next === "like" ? 1 : 0),
      dislikes:
        data.dislikes - (data.myVote === "dislike" ? 1 : 0) + (next === "dislike" ? 1 : 0),
    });
    setVoting(true);
    setNotice(null);
    try {
      setData(await post({ action: "vote", vote: next }));
    } catch (err) {
      setData(previous);
      setNotice({ type: "err", text: (err as Error).message });
    } finally {
      setVoting(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (!message.trim()) {
      setNotice({ type: "err", text: "Please write a comment first." });
      return;
    }
    setSending(true);
    setNotice(null);
    try {
      setData(await post({ action: "comment", name, message }));
      setMessage("");
      setNotice({ type: "ok", text: "Your comment is posted. Thank you!" });
    } catch (err) {
      setNotice({ type: "err", text: (err as Error).message });
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <p className="fb-lead">Enjoyed looking around? Tap a button and leave a note.</p>

      <div className="votes" role="group" aria-label="Rate this portfolio">
        <button
          type="button"
          className="vote like"
          aria-pressed={data?.myVote === "like"}
          disabled={!data || voting}
          onClick={() => vote("like")}
        >
          <span aria-hidden="true">👍</span> Like
          <span className="n">{data ? data.likes : "–"}</span>
        </button>
        <button
          type="button"
          className="vote dislike"
          aria-pressed={data?.myVote === "dislike"}
          disabled={!data || voting}
          onClick={() => vote("dislike")}
        >
          <span aria-hidden="true">👎</span> Dislike
          <span className="n">{data ? data.dislikes : "–"}</span>
        </button>
      </div>

      <form className="cform" onSubmit={submit}>
        <label>
          Name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME}
            placeholder="Anonymous"
            autoComplete="nickname"
          />
        </label>
        <label>
          Comment
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MAX_MESSAGE}
            rows={4}
            placeholder="Write something kind or helpful..."
            required
          />
        </label>
        <div className="row">
          <span className="count">
            {message.length}/{MAX_MESSAGE}
          </span>
          <button className="btn" type="submit" disabled={sending}>
            {sending ? "Posting..." : "Post comment"}
          </button>
        </div>
        <p className={`msg ${notice?.type ?? ""}`} role="status" aria-live="polite">
          {notice?.text}
        </p>
      </form>

      {loadError && (
        <p className="msg err">Could not load likes and comments. Please refresh the page.</p>
      )}

      {data && (
        <div className="clist">
          {data.comments.length === 0 ? (
            <p className="empty">No comments yet. Be the first to leave one.</p>
          ) : (
            data.comments.map((c, i) => (
              <article
                key={c.id}
                className="note"
                style={{ ["--r" as string]: `${i % 2 ? 1.2 : -1.2}deg` }}
              >
                <b>{c.name}</b>
                <p>{c.message}</p>
                <small>{formatDate(c.createdAt)}</small>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}

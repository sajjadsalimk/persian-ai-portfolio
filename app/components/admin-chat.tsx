"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "../lib/supabase-client";
import EmojiPicker from "./emoji-picker";

type Conversation = { id: string; user_id: string; user_email: string; updated_at: string };
type Message = { id: string; conversation_id: string; sender_id: string; sender_role: "user" | "admin"; body: string; created_at: string };
type ApiError = { message?: string | string[] };

function apiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  if (typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname)) return "http://localhost:4000/api/v1";
  return "";
}
function time(value: string) { return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }

export default function AdminChat() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, value) => { setSession(value); setAuthorized(false); setConversations([]); setActive(null); setMessages([]); setError(""); });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const request = useCallback(async <T,>(path: string, token: string, init?: RequestInit): Promise<T> => {
    const base = apiBase();
    if (!base) throw new Error("آدرس عمومی بک‌اند تنظیم نشده است. پس از استقرار API، متغیر NEXT_PUBLIC_API_URL را در تنظیمات GitHub Actions وارد کنید.");
    const response = await fetch(`${base}${path}`, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init?.headers } });
    const result = await response.json().catch(() => ({})) as T & ApiError;
    if (!response.ok) { const message = Array.isArray(result.message) ? result.message[0] : result.message; throw new Error(message || "ارتباط با سرور برقرار نشد."); }
    return result;
  }, []);

  const loadMessages = useCallback(async (conversation: Conversation, token: string) => {
    const result = await request<{ messages: Message[] }>(`/chat/conversations/${conversation.id}/messages`, token);
    setMessages(result.messages);
  }, [request]);

  const refresh = useCallback(async (token: string) => {
    const profile = await request<{ isAdmin: boolean }>("/chat/me", token);
    if (!profile.isAdmin) { setAuthorized(false); throw new Error("این حساب دسترسی مدیر ندارد."); }
    setAuthorized(true);
    const result = await request<{ conversations: Conversation[] }>("/chat/conversations", token);
    setConversations(result.conversations);
    const selected = result.conversations.find((item) => item.id === active?.id) ?? result.conversations[0] ?? null;
    setActive((current) => current?.id === selected?.id ? current : selected);
    if (selected) await loadMessages(selected, token); else setMessages([]);
  }, [active?.id, loadMessages, request]);

  useEffect(() => {
    if (!session?.access_token) return;
    void refresh(session.access_token).catch((cause) => setError(cause instanceof Error ? cause.message : "بارگذاری انجام نشد."));
  }, [session?.access_token, refresh]);
  useEffect(() => {
    if (!authorized || !session?.access_token) return;
    const timer = window.setInterval(() => void refresh(session.access_token).catch(() => undefined), 5000);
    return () => window.clearInterval(timer);
  }, [authorized, refresh, session?.access_token]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase) return;
    setBusy(true); setError("");
    try { const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password }); if (authError) throw authError; setPassword(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "ورود انجام نشد."); }
    finally { setBusy(false); }
  }
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!active || !session?.access_token || !draft.trim()) return;
    setBusy(true); setError("");
    try { await request(`/chat/conversations/${active.id}/messages`, session.access_token, { method: "POST", body: JSON.stringify({ body: draft.trim() }) }); setDraft(""); await loadMessages(active, session.access_token); await refresh(session.access_token); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "ارسال پاسخ انجام نشد."); }
    finally { setBusy(false); }
  }
  async function logout() { await supabase?.auth.signOut(); }

  return <main className="admin-page" dir="rtl">
    <header className="admin-topbar"><Link href="/" className="admin-brand"><span>س</span><span>پنل مدیریت<small>گفت‌وگوهای خصوصی</small></span></Link><Link href="/" className="admin-back">بازگشت به سایت ↗</Link></header>
    {!ready ? <div className="admin-loading">در حال آماده‌سازی…</div> : !session ? <section className="admin-login">
      <div className="admin-login-icon">✳</div><span className="admin-eyebrow">S A J J A D / A D M I N</span><h1>ورود به صندوق پیام‌ها</h1><p>برای دیدن و پاسخ‌دادن به پیام‌های کاربران وارد حساب مدیر شو.</p>
      {!supabase && <div className="admin-error">تنظیمات عمومی Supabase هنگام ساخت سایت در دسترس نیست.</div>}
      <form onSubmit={login} className="chat-form"><label>ایمیل<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label><label>رمز عبور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <div className="admin-error" role="alert">{error}</div>}<button className="chat-submit" disabled={busy || !supabase}>{busy ? "در حال ورود…" : "ورود به پنل"}<span>←</span></button></form>
      <small className="admin-login-hint">دسترسی مدیر با ایمیل تنظیم‌شده در بک‌اند بررسی می‌شود.</small>
    </section> : <section className="admin-workspace">
      <div className="admin-heading"><div><span className="admin-eyebrow">PRIVATE MESSAGES</span><h1>صندوق گفت‌وگوها</h1><p>پیام‌های کاربران را ببین و پاسخ بده.</p></div><button className="admin-logout" type="button" onClick={() => void logout()}>خروج از حساب</button></div>
      {error && <div className="admin-error" role="alert">{error}</div>}
      <div className="admin-layout"><aside className="admin-conversations"><div className="admin-list-title"><strong>گفت‌وگوها</strong><span>{conversations.length}</span></div>{conversations.length === 0 ? <div className="admin-empty-list">هنوز گفت‌وگویی ثبت نشده.</div> : conversations.map((item) => <button type="button" key={item.id} className={`admin-conversation ${active?.id === item.id ? "selected" : ""}`} onClick={() => { setActive(item); if (session) void loadMessages(item, session.access_token).catch((cause) => setError(cause.message)); }}><span className="admin-user-avatar">{item.user_email.slice(0, 1).toUpperCase()}</span><span className="admin-user-info"><strong>{item.user_email}</strong><small>{time(item.updated_at)}</small></span><b>←</b></button>)}</aside>
        <section className="admin-thread"><div className="admin-thread-head">{active ? <><span className="admin-user-avatar">{active.user_email.slice(0, 1).toUpperCase()}</span><div><strong>{active.user_email}</strong><small>گفت‌وگوی خصوصی کاربر</small></div></> : <strong>یک گفت‌وگو را انتخاب کن</strong>}</div><div className="admin-thread-messages">{!active ? <div className="admin-empty-thread">از فهرست، یک گفت‌وگو را باز کن.</div> : messages.length === 0 ? <div className="admin-empty-thread">هنوز پیامی فرستاده نشده است.</div> : messages.map((message) => <article key={message.id} className={`chat-message ${message.sender_role === "admin" ? "mine" : "theirs"}`}><p>{message.body}</p><time>{time(message.created_at)}</time></article>)}</div><form className="admin-reply" onSubmit={send}><EmojiPicker onSelect={(emoji) => setDraft((value) => `${value}${emoji}`)} /><textarea aria-label="پاسخ مدیر" placeholder="پاسخت را بنویس…" rows={2} maxLength={3000} value={draft} onChange={(event) => setDraft(event.target.value)} disabled={!active} /><button disabled={busy || !active || !draft.trim()} aria-label="ارسال پاسخ">ارسال <span>↑</span></button></form></section>
      </div>
    </section>}
  </main>;
}

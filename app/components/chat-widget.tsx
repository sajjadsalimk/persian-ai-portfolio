"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "../lib/supabase-client";
import EmojiPicker from "./emoji-picker";

type Conversation = {
  id: string;
  user_id: string;
  user_email: string;
  updated_at: string;
};

type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "user" | "admin";
  body: string;
  created_at: string;
};

type ApiError = { message?: string | string[] };

function apiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:4000/api/v1";
  }
  return "";
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function ChatWidget() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setError("");
      setNotice("");
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const request = useCallback(async <T,>(path: string, accessToken: string, init?: RequestInit): Promise<T> => {
    const base = apiBase();
    if (!base) throw new Error("آدرس عمومی بک‌اند هنوز تنظیم نشده است.");
    const response = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...init?.headers,
      },
    });
    const result = await response.json().catch(() => ({})) as T & ApiError;
    if (!response.ok) {
      const message = Array.isArray(result.message) ? result.message[0] : result.message;
      throw new Error(message || "ارتباط با سرور برقرار نشد.");
    }
    return result;
  }, []);

  const loadMessages = useCallback(async (conversation: Conversation, accessToken: string) => {
    const result = await request<{ messages: ChatMessage[] }>(`/chat/conversations/${conversation.id}/messages`, accessToken);
    setMessages(result.messages);
  }, [request]);

  const loadChat = useCallback(async (accessToken: string) => {
    setError("");
    try {
      const profile = await request<{ isAdmin: boolean }>("/chat/me", accessToken);
      setIsAdmin(profile.isAdmin);
      const result = await request<{ conversations: Conversation[] }>("/chat/conversations", accessToken);
      let available = result.conversations;

      if (!profile.isAdmin && available.length === 0) {
        const created = await request<{ conversation: Conversation }>("/chat/conversations", accessToken, { method: "POST" });
        available = [created.conversation];
      }

      setConversations(available);
      if (available.length > 0) {
        const selected = available[0];
        setActiveConversation(selected);
        await loadMessages(selected, accessToken);
      } else {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "بارگذاری گفت‌وگو انجام نشد.");
    }
  }, [loadMessages, request]);

  useEffect(() => {
    if (!open || !session?.access_token) return;
    void loadChat(session.access_token);
  }, [open, session?.access_token, loadChat]);

  useEffect(() => {
    if (!open || !session?.access_token || !activeConversation) return;
    const timer = window.setInterval(() => {
      void loadMessages(activeConversation, session.access_token).catch(() => undefined);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [activeConversation, loadMessages, open, session?.access_token]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: window.location.href,
          },
        });
        if (authError) throw authError;
        if (!data.session) setNotice("حساب ساخته شد. ایمیلت را برای تأیید حساب بررسی کن.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ورود یا ثبت‌نام انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.access_token || !activeConversation || !draft.trim()) return;
    setBusy(true);
    setError("");
    try {
      await request(`/chat/conversations/${activeConversation.id}/messages`, session.access_token, {
        method: "POST",
        body: JSON.stringify({ body: draft.trim() }),
      });
      setDraft("");
      await loadMessages(activeConversation, session.access_token);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "پیام ارسال نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setIsAdmin(false);
  }

  return (
    <div className="chat-widget" dir="rtl">
      {open && <section className="chat-panel" aria-label="گفت‌وگو با سجاد">
        <header className="chat-panel-header">
          <div className="chat-avatar">س</div>
          <div className="chat-heading"><strong>{isAdmin ? "صندوق گفت‌وگوها" : "صحبت با سجاد"}</strong><span><i /> گفت‌وگوی خصوصی</span></div>
          {session && <button className="chat-logout" onClick={() => void signOut()} type="button">خروج</button>}
          <button className="chat-close" onClick={() => setOpen(false)} type="button" aria-label="بستن">×</button>
        </header>

        {!authReady ? <div className="chat-state">در حال آماده‌سازی…</div> : !session ? (
          <div className="chat-auth">
            <div className="chat-welcome-mark">✳</div>
            <h2>{mode === "login" ? "خوش برگشتی" : "به گفت‌وگو خوش آمدی"}</h2>
            <p>{mode === "login" ? "وارد حساب شو تا پیام خصوصی بفرستی." : "یک حساب بساز تا گفت‌وگو را شروع کنیم."}</p>
            {!supabase && <div className="chat-alert">تنظیمات عمومی Supabase هنگام build سایت اضافه نشده است.</div>}
            <form onSubmit={submitAuth} className="chat-form">
              {mode === "signup" && <label>نام نمایشی<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} maxLength={80} required /></label>}
              <label>ایمیل<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
              <label>رمز عبور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required /></label>
              {error && <div className="chat-alert" role="alert">{error}</div>}
              {notice && <div className="chat-notice" role="status">{notice}</div>}
              <button className="chat-submit" disabled={busy || !supabase} type="submit">{busy ? "کمی صبر کن…" : mode === "login" ? "ورود به حساب" : "ساخت حساب"}<span>←</span></button>
            </form>
            <button className="chat-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setNotice(""); }} type="button">
              {mode === "login" ? "حساب نداری؟ ثبت‌نام کن" : "قبلاً حساب ساختی؟ وارد شو"}
            </button>
          </div>
        ) : (
          <div className="chat-body">
            {isAdmin && <div className="chat-inbox">
              <span>گفت‌وگوها</span>
              {conversations.length === 0 ? <small>هنوز پیامی دریافت نشده</small> : conversations.map((conversation) => (
                <button key={conversation.id} className={activeConversation?.id === conversation.id ? "selected" : ""} onClick={() => { setActiveConversation(conversation); if (session) void loadMessages(conversation, session.access_token); }} type="button">
                  <span className="inbox-avatar">{conversation.user_email.slice(0, 1).toUpperCase()}</span><span className="inbox-details"><strong>{conversation.user_email}</strong><small>آخرین فعالیت {formatTime(conversation.updated_at)}</small></span><b>←</b>
                </button>
              ))}
            </div>}
            <div className="chat-messages" aria-live="polite">
              {!activeConversation ? <div className="chat-state">برای شروع گفت‌وگو پیامت را بنویس.</div> : messages.length === 0 ? <div className="chat-empty"><span>✳</span><strong>گفت‌وگو را شروع کن</strong><small>پیامت فقط برای سجاد قابل مشاهده است.</small></div> : messages.map((message) => {
                const mine = message.sender_role === (isAdmin ? "admin" : "user");
                return <article key={message.id} className={`chat-message ${mine ? "mine" : "theirs"}`}><p>{message.body}</p><time>{formatTime(message.created_at)}</time></article>;
              })}
            </div>
            {error && <div className="chat-inline-error" role="alert">{error}</div>}
            <form onSubmit={sendMessage} className="chat-compose"><EmojiPicker onSelect={(emoji) => setDraft((value) => `${value}${emoji}`)} /><textarea aria-label="متن پیام" placeholder="پیامت را اینجا بنویس…" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={3000} rows={2} /><button disabled={busy || !draft.trim() || !activeConversation} type="submit" aria-label="ارسال پیام">↑</button></form>
            <div className="chat-footnote">پیام‌ها به‌صورت خصوصی ذخیره می‌شوند</div>
          </div>
        )}
      </section>}
      <button className={`chat-launcher ${open ? "is-open" : ""}`} onClick={() => setOpen((value) => !value)} type="button" aria-expanded={open} aria-label={open ? "بستن گفت‌وگو" : "صحبت با من یا ادمین"}>
        <span className="chat-launcher-icon">{open ? "×" : "✳"}</span><span>{open ? "بستن" : "صحبت با من"}</span><i className="chat-launcher-dot" />
      </button>
    </div>
  );
}

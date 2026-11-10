"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

const emojis = ["😀", "😃", "😊", "😍", "🥰", "😎", "🤔", "😂", "🤣", "🥹", "😭", "🙏", "👏", "👍", "❤️", "💜", "✨", "🔥", "🎉", "🤖", "🚀", "💡", "🌱", "☕"];

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ right: number; bottom: number } | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  function toggle() {
    if (open) { setOpen(false); return; }
    const rect = toggleRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      right: Math.max(12, window.innerWidth - rect.right),
      bottom: Math.max(12, window.innerHeight - rect.top + 8),
    });
    setOpen(true);
  }
  return <div className="emoji-picker">
    <button ref={toggleRef} type="button" className="emoji-toggle" aria-label="انتخاب ایموجی" aria-expanded={open} onClick={toggle}>☺</button>
    {open && position && typeof document !== "undefined" && createPortal(<div className="emoji-popover" style={{ position: "fixed", right: position.right, bottom: position.bottom }} role="group" aria-label="ایموجی‌ها">
      {emojis.map((emoji) => <button type="button" key={emoji} aria-label={emoji} onClick={() => { onSelect(emoji); setOpen(false); }}>{emoji}</button>)}
    </div>, document.body)}
  </div>;
}

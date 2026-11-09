"use client";

import { useState } from "react";

const emojis = ["😀", "😃", "😊", "😍", "🥰", "😎", "🤔", "😂", "🤣", "🥹", "😭", "🙏", "👏", "👍", "❤️", "💜", "✨", "🔥", "🎉", "🤖", "🚀", "💡", "🌱", "☕"];

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  return <div className="emoji-picker">
    <button type="button" className="emoji-toggle" aria-label="انتخاب ایموجی" aria-expanded={open} onClick={() => setOpen((value) => !value)}>☺</button>
    {open && <div className="emoji-popover" role="group" aria-label="ایموجی‌ها">
      {emojis.map((emoji) => <button type="button" key={emoji} aria-label={emoji} onClick={() => { onSelect(emoji); setOpen(false); }}>{emoji}</button>)}
    </div>}
  </div>;
}

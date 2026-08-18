"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrders, useUI } from "@/lib/store";
import { stylistReply, CHAT_SUGGESTIONS, type ChatAction } from "@/lib/stylist";
import type { Product } from "@/lib/products";
import { formatPrice, cx } from "@/lib/format";
import { IconChat, IconClose, IconSend, IconSpark } from "./icons";

interface Msg {
  id: number;
  from: "bot" | "user";
  text?: string;
  products?: Product[];
  actions?: ChatAction[];
}

const WELCOME: Msg = {
  id: 0,
  from: "bot",
  text: "¡Hola! I'm Lina, your Algodón styling assistant. 🤍 Tell me the occasion, a colour, or a budget — or ask me anything about sizing, shipping and returns.",
  actions: [
    { label: "Style me for a wedding", kind: "browse" },
    { label: "Shipping times", kind: "shipping" },
  ],
};

export function ChatWidget() {
  const ui = useUI();
  const { orders } = useOrders();
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const idRef = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const open = ui.chat.open;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      const pre = ui.chat.prefill;
      if (pre) {
        ui.clearChatPrefill();
        send(pre);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput("");
    const userMsg: Msg = { id: ++idRef.current, from: "user", text };
    setMsgs((m) => [...m, userMsg]);
    setTyping(true);
    const reply = stylistReply(text, orders);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: ++idRef.current, from: "bot", ...reply }]);
    }, 700 + Math.random() * 600);
  };

  const runAction = (a: ChatAction) => {
    if (a.kind === "size-guide") {
      ui.setSizeGuideOpen(true);
    } else if (a.kind === "shipping") {
      send("What are your shipping times?");
    } else if (a.kind === "returns") {
      send("What is your returns policy?");
    } else if (a.kind === "track") {
      send("Where is my order?");
    } else if (a.kind === "browse") {
      const prompt = a.label === "Style me" || a.label === "Style me for an event" ? "Help me find a dress for a special occasion" : "Show me your favourite dresses";
      send(prompt);
    } else if (a.kind === "sale") {
      ui.closeChat();
      window.location.href = "/shop?sort=price-asc";
    }
  };

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => (open ? ui.closeChat() : ui.openChat())}
        aria-label={open ? "Close styling chat" : "Chat with Lina, our styling assistant"}
        aria-expanded={open}
        className={cx(
          "fixed bottom-4 right-4 z-[80] flex items-center gap-2.5 rounded-full border border-clay/30 bg-ink py-3 pl-4 pr-5 text-cotton shadow-[var(--shadow-lift)] transition-all hover:bg-clay-deep",
          open && "opacity-0 pointer-events-none translate-y-2",
        )}
      >
        <span className="relative">
          <IconChat className="w-5 h-5" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-sage border-2 border-ink" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium tracking-wide">Ask Lina</span>
      </button>

      {/* panel */}
      <div
        className={cx(
          "fixed bottom-4 right-4 z-[85] flex h-[min(72vh,560px)] w-[min(calc(100vw-2rem),380px)] flex-col overflow-hidden rounded-lg border border-line bg-cotton shadow-[var(--shadow-lift)] transition-all duration-300 origin-bottom-right",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
        role="dialog"
        aria-label="Algodón styling chat"
        aria-hidden={!open}
      >
        <div className="flex items-center gap-3 border-b border-line bg-sage-deep px-4 py-3 text-cotton">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-cotton/15 font-display text-lg" aria-hidden="true">
            L
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">Lina · Styling Studio</p>
            <p className="text-[11px] text-cotton/75 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8e8c8]" aria-hidden="true" />
              Online — typically replies instantly
            </p>
          </div>
          <button onClick={ui.closeChat} className="rounded-full p-1.5 hover:bg-cotton/15" aria-label="Close chat">
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div ref={logRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label="Chat messages">
          {msgs.map((m) => (
            <div key={m.id} className={cx("flex flex-col", m.from === "user" ? "items-end" : "items-start")}>
              {m.text && (
                <div
                  className={cx(
                    "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.from === "user" ? "rounded-br-sm bg-ink text-cotton" : "rounded-bl-sm border border-line bg-surface",
                  )}
                >
                  {m.text}
                </div>
              )}
              {m.products && m.products.length > 0 && (
                <div className="mt-2 flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {m.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      onClick={ui.closeChat}
                      className="group w-36 shrink-0 rounded-md border border-line bg-surface p-2 transition-shadow hover:shadow-[var(--shadow-soft)]"
                    >
                      <span className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-parchment">
                        <Image src={p.image} alt={p.name} fill sizes="144px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </span>
                      <span className="mt-2 block text-xs font-medium leading-snug">{p.name}</span>
                      <span className="block text-[11px] text-ink-soft">{formatPrice(p.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.actions.map((a) => (
                    <button key={a.label} onClick={() => runAction(a)} className="chip !py-1.5 !text-xs hover:border-clay hover:text-clay-deep">
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex items-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3" aria-label="Lina is typing">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-taupe" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-line bg-parchment/50 px-3 pb-3 pt-2">
          <div className="mb-2 flex gap-1.5 overflow-x-auto no-scrollbar" aria-label="Suggested questions">
            {CHAT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="chip !py-1 !text-[11px] shrink-0"
                onClick={() => send(s)}
              >
                <IconSpark className="w-3 h-3 text-clay" />
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Message Lina
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              className="field !rounded-full flex-1"
              placeholder="Try: sage dress for a wedding…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn btn-accent !rounded-full !px-3.5 !py-2.5" aria-label="Send message" disabled={!input.trim()}>
              <IconSend />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

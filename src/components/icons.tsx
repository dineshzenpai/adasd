import React from "react";

type P = { className?: string };
const base = "shrink-0";

export const IconSearch = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
  </svg>
);

export const IconUser = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.5 3.6-5.4 7-5.4s6.2 1.9 7 5.4" />
  </svg>
);

export const IconHeart = ({ className = "w-5 h-5", filled = false }: P & { filled?: boolean }) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M12 20.5S3.5 15.4 3.5 9.6C3.5 6.8 5.7 4.7 8.3 4.7c1.6 0 3 .8 3.7 2.1C12.7 5.5 14.1 4.7 15.7 4.7c2.6 0 4.8 2.1 4.8 4.9 0 5.8-8.5 10.9-8.5 10.9Z" />
  </svg>
);

export const IconBag = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M5.5 8.5h13l-.9 11a1.6 1.6 0 0 1-1.6 1.5H8a1.6 1.6 0 0 1-1.6-1.5l-.9-11Z" />
    <path d="M9 10.5V6.8a3 3 0 0 1 6 0v3.7" />
  </svg>
);

export const IconMenu = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconClose = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconArrow = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h15m0 0-6-6m6 6-6 6" />
  </svg>
);

export const IconChevron = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconStar = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
  </svg>
);

export const IconPlus = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);

export const IconChat = ({ className = "w-6 h-6" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.2A8 8 0 1 1 20 12Z" />
    <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" strokeWidth="2.4" />
  </svg>
);

export const IconSend = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12 20 4l-4.5 16-4-6.5L4 12Z" />
  </svg>
);

export const IconCheck = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconTruck = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7z" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </svg>
);

export const IconShield = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 2.8v5.4c0 4.6-3 7.9-7 9.8-4-1.9-7-5.2-7-9.8V5.8L12 3Z" />
    <path d="m9 11.5 2.2 2.2L15.5 9" />
  </svg>
);

export const IconLeaf = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 19C5 9 10 4 20 4c0 10-5 15-15 15Z" />
    <path d="M5 19c3-6 7-9 11-11" />
  </svg>
);

export const IconReturn = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9h11a5 5 0 0 1 0 10H9" />
    <path d="m8 5-4 4 4 4" />
  </svg>
);

export const IconTrash = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l.8 12.5h9.4L17.5 7M10 10.5v6M14 10.5v6" />
  </svg>
);

export const IconSliders = ({ className = "w-5 h-5" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M5 7h14M5 12h14M5 17h14" />
    <circle cx="9" cy="7" r="2" fill="var(--color-cotton)" />
    <circle cx="15" cy="12" r="2" fill="var(--color-cotton)" />
    <circle cx="11" cy="17" r="2" fill="var(--color-cotton)" />
  </svg>
);

export const IconSpark = ({ className = "w-4 h-4" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5 13.8 8 19.5 9.8 13.8 11.6 12 17.1l-1.8-5.5L4.5 9.8 10.2 8 12 2.5ZM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15Z" />
  </svg>
);

/* --- brand marks --- */

export const Logo = ({ className = "w-8 h-8" }: P) => (
  <svg className={`${base} ${className}`} viewBox="0 0 64 64" aria-hidden="true">
    <g fill="none" stroke="var(--color-clay)" strokeWidth="3" strokeLinecap="round">
      <path d="M32 54 C 32 44, 30 37, 26 31" />
      <path d="M32 54 C 32 44, 34 37, 38 31" />
    </g>
    <g fill="var(--color-cotton)" stroke="var(--color-sage-deep)" strokeWidth="2.6">
      <circle cx="19" cy="24" r="8" />
      <circle cx="32" cy="16" r="8" />
      <circle cx="45" cy="24" r="8" />
    </g>
    <g fill="var(--color-sage-deep)">
      <circle cx="19" cy="24" r="1.8" />
      <circle cx="32" cy="16" r="1.8" />
      <circle cx="45" cy="24" r="1.8" />
    </g>
  </svg>
);

export const IconGoogle = ({ className = "w-4 h-4" }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6Z" />
    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5.1L1.3 17.2C3.3 21.2 7.3 24 12 24Z" />
    <path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.3 6.8C.5 8.4 0 10.1 0 12s.5 3.6 1.3 5.2l3.9-2.9Z" />
    <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.8 1.3 6.8l3.9 2.9c.9-3 3.6-5 6.8-5Z" />
  </svg>
);

export const IconApple = ({ className = "w-4 h-4" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.7c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.1.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.8ZM14.3 4.6c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1 0 2.1-.6 2.8-1.4Z" />
  </svg>
);

export const IconInstagram = ({ className = "w-5 h-5" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPinterest = ({ className = "w-5 h-5" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.5 2 3.5 5.9 3.5 9.4c0 1.9 1 4.2 2.7 4.9.3.1.4 0 .5-.2l.5-1.9c.1-.3 0-.5-.2-.7-.5-.7-.8-1.6-.8-2.4 0-2.7 2-5.3 5.6-5.3 3 0 5.1 1.9 5.1 4.7 0 3.1-1.6 5.3-3.7 5.3-1 0-1.8-.9-1.5-2 .3-1.4 1-2.9 1-3.9 0-.9-.5-1.7-1.5-1.7-1.2 0-2.2 1.3-2.2 3 0 1 .3 1.7.3 1.7l-1.4 5.9c-.4 1.6-.1 4.2 0 4.4.1.2.3.2.4.1.2-.2 2.3-2.8 2.8-4.8.2-.7.9-3.4.9-3.4.5.9 1.8 1.6 3.2 1.6 3.8 0 6.4-3.5 6.4-8.1C20.5 5 16.8 2 12 2Z" />
  </svg>
);

export const IconTikTok = ({ className = "w-5 h-5" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.8 3c.4 1.9 1.6 3.2 3.7 3.4v2.8c-1.4 0-2.7-.4-3.8-1.2v5.9c0 3.6-2.5 6.1-5.8 6.1A5.7 5.7 0 0 1 5 14.3c0-3.2 2.6-5.7 6.1-5.4v2.9c-1.7-.4-3.2.8-3.2 2.5 0 1.6 1.2 2.8 2.8 2.8 1.7 0 3-1.3 3-3.2V3h3.1Z" />
  </svg>
);

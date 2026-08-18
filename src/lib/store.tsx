"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ================= types ================= */

export interface CartItem {
  key: string; // slug|color|size
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  qty: number;
}

export interface Promo {
  code: string;
  label: string;
  percentOff?: number;
  freeShipping?: boolean;
}

export const PROMOS: Record<string, Promo> = {
  ALGODON10: { code: "ALGODON10", label: "10% off — welcome to Algodón", percentOff: 10 },
  WELCOME15: { code: "WELCOME15", label: "15% off your first order", percentOff: 15 },
  FREESHIP: { code: "FREESHIP", label: "Complimentary shipping", freeShipping: true },
};

export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_FLAT = 8;

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface SavedCard {
  id: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  exp: string;
  name: string;
  isDefault?: boolean;
}

export interface OrderItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  qty: number;
}

export type OrderStatus = "confirmed" | "in_transit" | "delivered";

export interface Order {
  id: string;
  number: string;
  date: string;
  email: string;
  name: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shipping: number;
  total: number;
  paymentLabel: string;
  address: Address;
  status: OrderStatus;
  eta: string;
}

export interface User {
  name: string;
  email: string;
  provider: "email" | "google" | "apple";
}

/* ================= persistence ================= */

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function usePersistentState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(fallback);
  const loaded = useRef(false);
  useEffect(() => {
    setState(readLS(key, fallback));
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (loaded.current) writeLS(key, state);
  }, [key, state]);
  return [state, setState] as const;
}

/* ================= toasts + UI ================= */

export interface Toast {
  id: number;
  msg: string;
  href?: string;
  hrefLabel?: string;
}

interface UIContextValue {
  toasts: Toast[];
  toast: (msg: string, href?: string, hrefLabel?: string) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (v: boolean) => void;
  chat: { open: boolean; prefill?: string };
  openChat: (prefill?: string) => void;
  closeChat: () => void;
  clearChatPrefill: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

/* ================= cart ================= */

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promo: Promo | null;
  promoError: string | null;
  add: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ================= wishlist ================= */

interface WishlistContextValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/* ================= auth ================= */

interface DemoUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  oauth: (provider: "google" | "apple") => void;
  logout: () => void;
  requestReset: (email: string) => { ok: boolean; error?: string; code?: string };
  confirmReset: (email: string, code: string, password: string) => { ok: boolean; error?: string };
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* ================= addresses / cards / orders ================= */

interface AddressesContextValue {
  addresses: Address[];
  saveAddress: (a: Omit<Address, "id"> & { id?: string }) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

interface CardsContextValue {
  cards: SavedCard[];
  addCard: (c: Omit<SavedCard, "id">) => void;
  removeCard: (id: string) => void;
  setDefaultCard: (id: string) => void;
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (o: Order) => void;
  lastOrder: Order | null;
}

const AddressesContext = createContext<AddressesContextValue | null>(null);
const CardsContext = createContext<CardsContextValue | null>(null);
const OrdersContext = createContext<OrdersContextValue | null>(null);

/* ================= provider ================= */

export function AppProvider({ children }: { children: React.ReactNode }) {
  // --- UI ---
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [chat, setChat] = useState<{ open: boolean; prefill?: string }>({ open: false });
  const toastId = useRef(0);
  const toast = useCallback((msg: string, href?: string, hrefLabel?: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, href, hrefLabel }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);
  const openChat = useCallback((prefill?: string) => setChat({ open: true, prefill }), []);
  const closeChat = useCallback(() => setChat({ open: false }), []);
  const clearChatPrefill = useCallback(() => setChat((c) => ({ ...c, prefill: undefined })), []);

  // --- cart ---
  const [items, setItems] = usePersistentState<CartItem[]>("algodon:cart", []);
  const [promo, setPromo] = usePersistentState<Promo | null>("algodon:promo", null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const add = useCallback(
    (item: Omit<CartItem, "key" | "qty">, qty = 1) => {
      const key = `${item.slug}|${item.color}|${item.size}`;
      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { ...item, key, qty }];
      });
    },
    [setItems],
  );

  const setQty = useCallback(
    (key: string, qty: number) =>
      setItems((prev) =>
        qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
      ),
    [setItems],
  );

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), [setItems]);
  const clear = useCallback(() => {
    setItems([]);
    setPromo(null);
  }, [setItems, setPromo]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promo?.percentOff ? Math.round(subtotal * promo.percentOff) / 100 : 0;
  const shipping =
    items.length === 0 || subtotal - discount >= FREE_SHIPPING_THRESHOLD || promo?.freeShipping ? 0 : SHIPPING_FLAT;
  const total = Math.max(0, subtotal - discount) + shipping;
  const count = items.reduce((s, i) => s + i.qty, 0);

  const applyPromo = useCallback(
    (code: string) => {
      const c = code.trim().toUpperCase();
      if (!c) return false;
      if (PROMOS[c]) {
        setPromo(PROMOS[c]);
        setPromoError(null);
        return true;
      }
      setPromoError("That code isn't valid — try ALGODON10.");
      return false;
    },
    [setPromo],
  );
  const clearPromo = useCallback(() => {
    setPromo(null);
    setPromoError(null);
  }, [setPromo]);

  const cartValue = useMemo<CartContextValue>(
    () => ({
      items, count, subtotal, discount, shipping, total, promo, promoError,
      add, setQty, remove, clear, applyPromo, clearPromo,
    }),
    [items, count, subtotal, discount, shipping, total, promo, promoError, add, setQty, remove, clear, applyPromo, clearPromo],
  );

  // --- wishlist ---
  const [ids, setIds] = usePersistentState<string[]>("algodon:wishlist", []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setIds],
  );
  const wishlistValue = useMemo(() => ({ ids, has, toggle }), [ids, has, toggle]);

  // --- auth ---
  const [users, setUsers] = usePersistentState<Record<string, DemoUser>>("algodon:users", {});
  const [user, setUser] = usePersistentState<User | null>("algodon:session", null);

  const login = useCallback(
    (email: string, password: string) => {
      const key = email.trim().toLowerCase();
      const u = users[key];
      if (!u) return { ok: false, error: "We couldn't find an account with that email." };
      if (u.password !== password) return { ok: false, error: "That password doesn't match our records." };
      setUser({ name: u.name, email: u.email, provider: u.provider });
      return { ok: true };
    },
    [users, setUser],
  );

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      const key = email.trim().toLowerCase();
      if (users[key]) return { ok: false, error: "You already have an account — try signing in." };
      const demo: DemoUser = { name: name.trim(), email: key, password, provider: "email" };
      setUsers((prev) => ({ ...prev, [key]: demo }));
      setUser({ name: demo.name, email: demo.email, provider: "email" });
      return { ok: true };
    },
    [users, setUsers, setUser],
  );

  const oauth = useCallback(
    (provider: "google" | "apple") => {
      const first = provider === "google" ? "Sofía" : "Ana";
      const email = `${first.toLowerCase()}.${provider}@example.com`;
      setUsers((prev) => ({
        ...prev,
        [email]: { name: `${first} ${provider === "google" ? "M." : "L."}`, email, password: "·oauth·", provider },
      }));
      setUser({ name: first, email, provider });
    },
    [setUsers, setUser],
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const requestReset = useCallback(
    (email: string) => {
      const key = email.trim().toLowerCase();
      // demo store: always issue a code so the flow can be explored
      const code = String(Math.floor(100000 + Math.random() * 900000));
      writeLS("algodon:reset", { email: key, code });
      return { ok: true, code };
    },
    [],
  );

  const confirmReset = useCallback(
    (email: string, code: string, password: string) => {
      const stored = readLS<{ email: string; code: string } | null>("algodon:reset", null);
      if (!stored || stored.email !== email.trim().toLowerCase() || stored.code !== code.trim()) {
        return { ok: false, error: "That code doesn't match. Check the 6 digits we showed you." };
      }
      const key = email.trim().toLowerCase();
      setUsers((prev) => {
        const u = prev[key];
        return u ? { ...prev, [key]: { ...u, password } } : prev;
      });
      return { ok: true };
    },
    [setUsers],
  );

  const authValue = useMemo(
    () => ({ user, login, signup, oauth, logout, requestReset, confirmReset }),
    [user, login, signup, oauth, logout, requestReset, confirmReset],
  );

  // --- addresses ---
  const [addresses, setAddresses] = usePersistentState<Address[]>("algodon:addresses", [
    {
      id: "seed-1",
      label: "Home",
      name: "Ana Rivera",
      line1: "1408 Willow Lane",
      city: "Austin",
      state: "TX",
      zip: "78702",
      country: "United States",
      phone: "+1 (512) 555-0134",
      isDefault: true,
    },
  ]);
  const saveAddress = useCallback(
    (a: Omit<Address, "id"> & { id?: string }) => {
      setAddresses((prev) => {
        if (a.id && prev.some((x) => x.id === a.id)) {
          return prev.map((x) => (x.id === a.id ? ({ ...x, ...a } as Address) : x));
        }
        const next: Address = { ...a, id: `addr-${Date.now()}` } as Address;
        return prev.length === 0 ? [{ ...next, isDefault: true }] : [...prev, next];
      });
    },
    [setAddresses],
  );
  const removeAddress = useCallback(
    (id: string) => setAddresses((prev) => prev.filter((x) => x.id !== id)),
    [setAddresses],
  );
  const setDefaultAddress = useCallback(
    (id: string) => setAddresses((prev) => prev.map((x) => ({ ...x, isDefault: x.id === id }))),
    [setAddresses],
  );
  const addressesValue = useMemo(
    () => ({ addresses, saveAddress, removeAddress, setDefaultAddress }),
    [addresses, saveAddress, removeAddress, setDefaultAddress],
  );

  // --- cards ---
  const [cards, setCards] = usePersistentState<SavedCard[]>("algodon:cards", [
    { id: "seed-c1", brand: "visa", last4: "4242", exp: "08/28", name: "Ana Rivera", isDefault: true },
  ]);
  const addCard = useCallback(
    (c: Omit<SavedCard, "id">) => {
      setCards((prev) => [...prev.map((x) => ({ ...x, isDefault: false })), { ...c, id: `card-${Date.now()}`, isDefault: true }]);
    },
    [setCards],
  );
  const removeCard = useCallback((id: string) => setCards((prev) => prev.filter((x) => x.id !== id)), [setCards]);
  const setDefaultCard = useCallback(
    (id: string) => setCards((prev) => prev.map((x) => ({ ...x, isDefault: x.id === id }))),
    [setCards],
  );
  const cardsValue = useMemo(() => ({ cards, addCard, removeCard, setDefaultCard }), [cards, addCard, removeCard, setDefaultCard]);

  // --- orders ---
  const [orders, setOrders] = usePersistentState<Order[]>("algodon:orders", []);
  const addOrder = useCallback((o: Order) => setOrders((prev) => [o, ...prev]), [setOrders]);
  const lastOrder = orders.length > 0 ? orders[0] : null;
  const ordersValue = useMemo(() => ({ orders, addOrder, lastOrder }), [orders, addOrder, lastOrder]);

  const uiValue = useMemo(
    () => ({ toasts, toast, sizeGuideOpen, setSizeGuideOpen, chat, openChat, closeChat, clearChatPrefill }),
    [toasts, toast, sizeGuideOpen, chat, openChat, closeChat, clearChatPrefill],
  );

  return (
    <UIContext.Provider value={uiValue}>
      <CartContext.Provider value={cartValue}>
        <WishlistContext.Provider value={wishlistValue}>
          <AuthContext.Provider value={authValue}>
            <AddressesContext.Provider value={addressesValue}>
              <CardsContext.Provider value={cardsValue}>
                <OrdersContext.Provider value={ordersValue}>{children}</OrdersContext.Provider>
              </CardsContext.Provider>
            </AddressesContext.Provider>
          </AuthContext.Provider>
        </WishlistContext.Provider>
      </CartContext.Provider>
    </UIContext.Provider>
  );
}

/* ================= hooks ================= */

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within AppProvider");
  return ctx;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within AppProvider");
  return ctx;
}
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within AppProvider");
  return ctx;
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AppProvider");
  return ctx;
}
export function useAddresses() {
  const ctx = useContext(AddressesContext);
  if (!ctx) throw new Error("useAddresses must be used within AppProvider");
  return ctx;
}
export function useCards() {
  const ctx = useContext(CardsContext);
  if (!ctx) throw new Error("useCards must be used within AppProvider");
  return ctx;
}
export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within AppProvider");
  return ctx;
}

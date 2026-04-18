import qs from "query-string";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import mongoose from "mongoose";

/* -----------------------------
   CLASSNAME MERGE
------------------------------*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -----------------------------
   NUMBER FORMAT
------------------------------*/
export const formateNumberWithDecimal = (num: number): string => {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
};

/* -----------------------------
   SLUG
------------------------------*/
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

/* -----------------------------
   CURRENCY
------------------------------*/
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-PK", {
  currency: "PKR",
  style: "currency",
  minimumFractionDigits: 2,
});

export function currency_formate(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-PK");

export function number_formate(num: number) {
  return NUMBER_FORMATTER.format(num);
}

/* -----------------------------
   GENERATE ID (FIXED)
------------------------------*/
export const generateId = () => {
  return Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 10)
  ).join(""); // ✅ FIX (no commas)
};

/* -----------------------------
   ROUND
------------------------------*/
export const round2 = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/* -----------------------------
   ERROR HANDLING
------------------------------*/
interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const formatError = (err: unknown): string => {
  if (err instanceof ZodError) {
    return err.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(". ");
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }

  const mongoError = err as MongoError;
  if (mongoError.code === 11000 && mongoError.keyValue) {
    const field = Object.keys(mongoError.keyValue)[0];
    return field ? `${field} already exists` : "Duplicate key error";
  }

  if (err instanceof mongoose.Error) return err.message;
  if (err instanceof Error) return err.message;

  return typeof err === "string" ? err : JSON.stringify(err);
};

/* -----------------------------
   DATE
------------------------------*/
export const calculateFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const formatDateTime = (date: Date) => {
  const d = new Date(date);

  return {
    dateTime: d.toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    dateOnly: d.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
      day: "numeric",
    }),
    timeOnly: d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };
};

/* -----------------------------
   FORMAT ID (FIXED 🔥)
------------------------------*/
export function formateId(id: string | { toString(): string }) {
  const str = id.toString();
  return `...${str.slice(-6)}`; // ✅ last 6 chars
}

/* -----------------------------
   URL HELPERS
------------------------------*/
export function fromUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string;
}) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const getFilterUrl = ({
  params,
  category,
  tag,
  sort,
  price,
  rating,
  page,
}: {
  params: {
    q?: string;
    category?: string;
    tag?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
  tag?: string;
  category?: string;
  sort?: string;
  price?: string;
  rating?: string;
  page?: string;
}) => {
  const newParams = { ...params };

  if (category) newParams.category = category;
  if (tag) newParams.tag = toSlug(tag);
  if (price) newParams.price = price;
  if (rating) newParams.rating = rating;
  if (page) newParams.page = page;
  if (sort) newParams.sort = sort;

  return `/search?${new URLSearchParams(newParams).toString()}`;
};



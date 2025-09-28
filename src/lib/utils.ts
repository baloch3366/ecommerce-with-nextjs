import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 export const formateNumberWithDecimal = (num:number):string => {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : int;
}

export const toSlug = (text: string): string => 
  text
  .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-PK',{
  currency: 'PKR',
  style:'currency',
  minimumFractionDigits: 2,
});

export  function currency_formate(amount:number) {
return CURRENCY_FORMATTER.format(amount)
}
const NUMBER_FORMATTER = new Intl.NumberFormat('en-PK')
export function number_formate(num:number) {
  return NUMBER_FORMATTER.format(num)
} 
export const generateId = ()=> {
  return Array.from({length:24}, ()=> Math.floor(Math.random()*10)).join()
}

export const round2 = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) /100
} 
//  errors handling
import { ZodError } from "zod";
import mongoose from "mongoose";

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const formatError = (err: unknown): string => {
  // 1. Handle ZodError (validation schema)
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => {
      const path = e.path.join(".");
      return `${path}: ${e.message}`;
    });
    return fieldErrors.join(". ");
  }

  // 2. Handle Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.values(err.errors).map((error) => {
      return error.message;
    });
    return fieldErrors.join(". ");
  }

  // 3. Handle MongoDB Duplicate Key Error (code 11000)
  const mongoError = err as MongoError;
  if (mongoError.code === 11000 && mongoError.keyValue) {
    const duplicateField = Object.keys(mongoError.keyValue)[0];
    return duplicateField 
      ? `${duplicateField} already exists`
      : "Duplicate key error";
  }

  // 4. Handle other Mongoose errors
  if (err instanceof mongoose.Error) {
    return err.message;
  }

  // 5. Handle standard Error objects
  if (err instanceof Error) {
    return err.message;
  }

  // 6. If unknown type, stringify it
  return typeof err === "string" ? err : JSON.stringify(err);
};


export const calculateFutureDate = (days: number) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate
}


export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    // weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-IN',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-IN',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-IN',
    timeOptions
  )
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

export function formateId(id: string){
  return `...${id.substring(id.length, 6)}`
}



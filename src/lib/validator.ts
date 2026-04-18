import { z } from "zod";
import { Types } from "mongoose";

/* -----------------------------
   BASIC FIELDS
------------------------------*/

const UserName = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(48, { message: "Username must be at most 48 characters" });

const UserEmail = z
  .string()
  .min(1, { message: "Email is required" })
  .email("Email is invalid");

const UserPassword = z
  .string()
  .min(3, { message: "Password must be at least 3 characters" });

const UserRole = z.string().min(1, "Role is required");

/* -----------------------------
   SAFE MONGO ID
------------------------------*/

const MongoId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid MongoDB ID",
});

/* -----------------------------
   PRICE VALIDATION
------------------------------*/

const Price = (label: string) =>
  z.coerce
    .number()
    .nonnegative(`${label} must be a positive number`)
    .refine(
      (value) => Number(value.toFixed(2)) === value,
      `${label} must have max 2 decimal places`
    );

/* -----------------------------
   REVIEW SCHEMA
------------------------------*/

export const ReviewFieldSchema = z.object({
  product: MongoId,
  user: MongoId,
  isVerifiedPurchase: z.boolean(),
  title: z.string().min(1, "Title is required"),
  comment: z.string().min(1, "Comment is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

/* -----------------------------
   PRODUCT SCHEMA
------------------------------*/

export const ProductFieldSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),

  isPublished: z.boolean(),

  price: Price("Price"),
  listPrice: Price("List price"),

  countInStock: z.coerce
    .number()
    .int()
    .nonnegative("Count in stock must be non-negative"),

  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),

  avgRating: z.coerce.number().min(0).max(5),
  numReviews: z.coerce.number().int().nonnegative(),

  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5),

  reviews: z.array(ReviewFieldSchema).default([]),

  numSales: z.coerce.number().int().nonnegative(),
});

/* -----------------------------
   ORDER ITEM SCHEMA
------------------------------*/

export const OrderFieldSchema = z.object({
  clientId: z.string().min(1, "clientId is required"),
  product: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),

  quantity: z.coerce.number().int().nonnegative(),
  countInStock: z.coerce.number().int().nonnegative(),

  image: z.string().min(1, "Image is required"),
  price: Price("Price"),

  size: z.string().optional(),
  color: z.string().optional(),
});

/* -----------------------------
   USER SCHEMAS
------------------------------*/

export const UserFieldSchema = z.object({
  name: UserName,
  email: UserEmail,
  image: z.string().optional(),
  emailVerified: z.boolean(),
  role: UserRole,
  password: UserPassword,
  paymentMethod: z.string().optional(),

  address: z.object({
    fullName: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
  }),
});

/* -----------------------------
   AUTH SCHEMAS
------------------------------*/

export const UserSignInSchema = z.object({
  email: UserEmail,
  password: UserPassword,
});

export const UserSignUpSchema = UserSignInSchema.extend({
  name: UserName,
  confirmPassword: UserPassword,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/* -----------------------------
   SHIPPING
------------------------------*/

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  phone: z.string().min(1),
  country: z.string().min(1),
});

/* -----------------------------
   CART
------------------------------*/

export const CartSchema = z.object({
  items: z.array(OrderFieldSchema).min(1),
  itemsPrice: z.number(),

  taxPrice: z.number().optional(),
  shippingPrice: z.number().optional(),

  shippingAddress: ShippingAddressSchema.optional(),

  totalPrice: z.number(),

  paymentMethod: z.string().optional(),
  deliveryDateIndex: z.number().optional(),

  expectedDeliveryDate: z.coerce.date().optional(),
});

/* -----------------------------
   ORDER INPUT
------------------------------*/

export const OrderInputSchema = z.object({
  user: MongoId,

  items: z.array(OrderFieldSchema).min(1),

  shippingAddress: ShippingAddressSchema,

  paymentMethod: z.string().min(1),

  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),

  itemsPrice: Price("Items price"),
  shippingPrice: Price("Shipping price"),
  taxPrice: Price("Tax price"),
  totalPrice: Price("Total price"),

  expectedDeliveryDate: z.coerce
    .date()
    .refine((value) => value > new Date(), {
      message: "Expected delivery date must be in the future",
    }),

  isDelivered: z.boolean().default(false),
  deliveredAt: z.date().optional(),

  isPaid: z.boolean().default(false),
  paidAt: z.date().optional(),
});

/* -----------------------------
   EXTRA
------------------------------*/

export const UserNameSchema = z.object({
  name: UserName,
});
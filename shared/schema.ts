import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with role and location.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  role: varchar("role", { length: 20 }).$type<"buyer" | "seller" | "wholesaler">(),
  city: varchar("city"),
  state: varchar("state"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  buyerActions: many(buyerActions),
}));

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  retailPrice: decimal("retail_price", { precision: 12, scale: 2 }).notNull(),
  wholesalePrice: decimal("wholesale_price", { precision: 12, scale: 2 }),
  imageUrl: varchar("image_url"),
  quantity: integer("quantity").default(0),
  city: varchar("city"),
  state: varchar("state"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  wholesaleTiers: many(wholesaleTiers),
  buyerActions: many(buyerActions),
}));

// Wholesale tiers for tier pricing
export const wholesaleTiers = pgTable("wholesale_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  minQuantity: integer("min_quantity").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wholesaleTiersRelations = relations(wholesaleTiers, ({ one }) => ({
  product: one(products, {
    fields: [wholesaleTiers.productId],
    references: [products.id],
  }),
}));

// Buyer actions for tracking
export const buyerActions = pgTable("buyer_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  saved: boolean("saved").default(false),
  viewed: boolean("viewed").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const buyerActionsRelations = relations(buyerActions, ({ one }) => ({
  buyer: one(users, {
    fields: [buyerActions.buyerId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [buyerActions.productId],
    references: [products.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWholesaleTierSchema = createInsertSchema(wholesaleTiers).omit({
  id: true,
  createdAt: true,
});

export const insertBuyerActionSchema = createInsertSchema(buyerActions).omit({
  id: true,
  timestamp: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type WholesaleTier = typeof wholesaleTiers.$inferSelect;
export type InsertWholesaleTier = z.infer<typeof insertWholesaleTierSchema>;

export type BuyerAction = typeof buyerActions.$inferSelect;
export type InsertBuyerAction = z.infer<typeof insertBuyerActionSchema>;

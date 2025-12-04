import {
  users,
  products,
  wholesaleTiers,
  buyerActions,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type WholesaleTier,
  type InsertWholesaleTier,
  type BuyerAction,
  type InsertBuyerAction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: "buyer" | "seller" | "wholesaler", location?: { city?: string; state?: string; lat?: string; lng?: string }): Promise<User | undefined>;
  
  // Product operations
  createProduct(product: InsertProduct): Promise<Product>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;
  getRetailProducts(lat?: number, lng?: number, radius?: number): Promise<(Product & { seller: User; distance?: number })[]>;
  getWholesaleProducts(): Promise<(Product & { seller: User; tiers: WholesaleTier[] })[]>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Wholesale tier operations
  createWholesaleTier(tier: InsertWholesaleTier): Promise<WholesaleTier>;
  getTiersByProduct(productId: string): Promise<WholesaleTier[]>;
  deleteTiersByProduct(productId: string): Promise<void>;
  
  // Buyer action operations
  saveBuyerAction(action: InsertBuyerAction): Promise<BuyerAction>;
  getSavedProducts(buyerId: string): Promise<Product[]>;
  getProductViews(productId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(
    id: string, 
    role: "buyer" | "seller" | "wholesaler",
    location?: { city?: string; state?: string; lat?: string; lng?: string }
  ): Promise<User | undefined> {
    const updateData: any = { role, updatedAt: new Date() };
    if (location) {
      if (location.city) updateData.city = location.city;
      if (location.state) updateData.state = location.state;
      if (location.lat) updateData.lat = location.lat;
      if (location.lng) updateData.lng = location.lng;
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Product operations
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .orderBy(desc(products.createdAt));
  }

  async getRetailProducts(lat?: number, lng?: number, radius?: number): Promise<(Product & { seller: User; distance?: number })[]> {
    // Get all active products with seller info
    const result = await db
      .select({
        product: products,
        seller: users,
      })
      .from(products)
      .innerJoin(users, eq(products.sellerId, users.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));

    // Calculate distance if lat/lng provided
    if (lat && lng) {
      return result.map(({ product, seller }) => {
        let distance: number | undefined;
        if (product.lat && product.lng) {
          // Haversine formula for distance calculation
          const R = 6371; // Earth's radius in km
          const dLat = (Number(product.lat) - lat) * Math.PI / 180;
          const dLng = (Number(product.lng) - lng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat * Math.PI / 180) * Math.cos(Number(product.lat) * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distance = R * c;
        }
        return { ...product, seller, distance };
      }).sort((a, b) => {
        // Sort by distance if available
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      });
    }

    return result.map(({ product, seller }) => ({ ...product, seller }));
  }

  async getWholesaleProducts(): Promise<(Product & { seller: User; tiers: WholesaleTier[] })[]> {
    // Get products that have wholesale prices or are from wholesalers
    const result = await db
      .select({
        product: products,
        seller: users,
      })
      .from(products)
      .innerJoin(users, eq(products.sellerId, users.id))
      .where(and(
        eq(products.isActive, true),
        eq(users.role, "wholesaler")
      ))
      .orderBy(desc(products.createdAt));

    // Get tiers for each product
    const productsWithTiers = await Promise.all(
      result.map(async ({ product, seller }) => {
        const tiers = await this.getTiersByProduct(product.id);
        return { ...product, seller, tiers };
      })
    );

    return productsWithTiers;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }

  // Wholesale tier operations
  async createWholesaleTier(tier: InsertWholesaleTier): Promise<WholesaleTier> {
    const [newTier] = await db
      .insert(wholesaleTiers)
      .values(tier)
      .returning();
    return newTier;
  }

  async getTiersByProduct(productId: string): Promise<WholesaleTier[]> {
    return await db
      .select()
      .from(wholesaleTiers)
      .where(eq(wholesaleTiers.productId, productId))
      .orderBy(asc(wholesaleTiers.minQuantity));
  }

  async deleteTiersByProduct(productId: string): Promise<void> {
    await db.delete(wholesaleTiers).where(eq(wholesaleTiers.productId, productId));
  }

  // Buyer action operations
  async saveBuyerAction(action: InsertBuyerAction): Promise<BuyerAction> {
    const [newAction] = await db
      .insert(buyerActions)
      .values(action)
      .onConflictDoUpdate({
        target: [buyerActions.buyerId, buyerActions.productId],
        set: {
          saved: action.saved,
          viewed: action.viewed,
          timestamp: new Date(),
        },
      })
      .returning();
    return newAction;
  }

  async getSavedProducts(buyerId: string): Promise<Product[]> {
    const result = await db
      .select({ product: products })
      .from(buyerActions)
      .innerJoin(products, eq(buyerActions.productId, products.id))
      .where(and(
        eq(buyerActions.buyerId, buyerId),
        eq(buyerActions.saved, true)
      ));
    return result.map(r => r.product);
  }

  async getProductViews(productId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(buyerActions)
      .where(and(
        eq(buyerActions.productId, productId),
        eq(buyerActions.viewed, true)
      ));
    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();

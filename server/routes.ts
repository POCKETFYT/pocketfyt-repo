import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertWholesaleTierSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user role and location
  app.post('/api/auth/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role, city, state, lat, lng } = req.body;
      
      if (!["buyer", "seller", "wholesaler"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.updateUserRole(userId, role, { city, state, lat, lng });
      res.json(user);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  // Product routes
  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.role || user.role === "buyer") {
        return res.status(403).json({ message: "Only sellers and wholesalers can create products" });
      }

      const productData = insertProductSchema.parse({
        ...req.body,
        sellerId: userId,
        city: req.body.city || user.city,
        state: req.body.state || user.state,
        lat: req.body.lat || user.lat,
        lng: req.body.lng || user.lng,
      });

      const product = await storage.createProduct(productData);

      // Create wholesale tiers if provided
      if (req.body.tierPrices && Array.isArray(req.body.tierPrices)) {
        for (const tier of req.body.tierPrices) {
          if (tier.minQuantity && tier.pricePerUnit) {
            await storage.createWholesaleTier({
              productId: product.id,
              minQuantity: Number(tier.minQuantity),
              pricePerUnit: String(tier.pricePerUnit),
            });
          }
        }
      }

      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.get('/api/products/retail', async (req, res) => {
    try {
      const lat = req.query.lat ? Number(req.query.lat) : undefined;
      const lng = req.query.lng ? Number(req.query.lng) : undefined;
      const radius = req.query.radius ? Number(req.query.radius) : undefined;

      const products = await storage.getRetailProducts(lat, lng, radius);
      res.json(products);
    } catch (error) {
      console.error("Error fetching retail products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/wholesale', async (req, res) => {
    try {
      const products = await storage.getWholesaleProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching wholesale products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/seller', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const products = await storage.getProductsBySeller(userId);
      
      // Get tiers for each product
      const productsWithTiers = await Promise.all(
        products.map(async (product) => {
          const tiers = await storage.getTiersByProduct(product.id);
          const views = await storage.getProductViews(product.id);
          return { ...product, tiers, views };
        })
      );
      
      res.json(productsWithTiers);
    } catch (error) {
      console.error("Error fetching seller products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const tiers = await storage.getTiersByProduct(product.id);
      res.json({ ...product, tiers });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.patch('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.sellerId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this product" });
      }

      const updated = await storage.updateProduct(req.params.id, req.body);

      // Update tiers if provided
      if (req.body.tierPrices && Array.isArray(req.body.tierPrices)) {
        await storage.deleteTiersByProduct(req.params.id);
        for (const tier of req.body.tierPrices) {
          if (tier.minQuantity && tier.pricePerUnit) {
            await storage.createWholesaleTier({
              productId: req.params.id,
              minQuantity: Number(tier.minQuantity),
              pricePerUnit: String(tier.pricePerUnit),
            });
          }
        }
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.sellerId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this product" });
      }

      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Price comparison - get same product from different sellers
  app.get('/api/compare/:productId', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const lat = req.query.lat ? Number(req.query.lat) : undefined;
      const lng = req.query.lng ? Number(req.query.lng) : undefined;

      // Find similar products by name/category
      const allProducts = await storage.getRetailProducts(lat, lng);
      const similarProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(product.name.toLowerCase()) ||
        (p.category && product.category && p.category === product.category)
      );

      res.json(similarProducts);
    } catch (error) {
      console.error("Error comparing prices:", error);
      res.status(500).json({ message: "Failed to compare prices" });
    }
  });

  // Buyer actions
  app.post('/api/buyer/save/:productId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const action = await storage.saveBuyerAction({
        buyerId: userId,
        productId: req.params.productId,
        saved: true,
        viewed: true,
      });
      res.json(action);
    } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ message: "Failed to save product" });
    }
  });

  app.delete('/api/buyer/save/:productId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.saveBuyerAction({
        buyerId: userId,
        productId: req.params.productId,
        saved: false,
        viewed: true,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error unsaving product:", error);
      res.status(500).json({ message: "Failed to unsave product" });
    }
  });

  app.get('/api/buyer/saved', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const products = await storage.getSavedProducts(userId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching saved products:", error);
      res.status(500).json({ message: "Failed to fetch saved products" });
    }
  });

  app.post('/api/buyer/view/:productId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.saveBuyerAction({
        buyerId: userId,
        productId: req.params.productId,
        viewed: true,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording view:", error);
      res.status(500).json({ message: "Failed to record view" });
    }
  });

  return httpServer;
}

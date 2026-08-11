export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: string;
          loyalty_tier: string;
          loyalty_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
          loyalty_tier?: string;
          loyalty_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
          loyalty_tier?: string;
          loyalty_points?: number;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          image_url: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          subtitle: string | null;
          description: string;
          how_to_use: string | null;
          process_type: string;
          category_id: string;
          base_price: number;
          compare_at_price: number | null;
          currency: string;
          fragrance_family: string;
          skin_types: string[];
          certifications: string[];
          is_featured: boolean;
          is_new: boolean;
          is_active: boolean;
          average_rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          subtitle?: string | null;
          description: string;
          how_to_use?: string | null;
          process_type?: string;
          category_id: string;
          base_price: number;
          compare_at_price?: number | null;
          currency?: string;
          fragrance_family?: string;
          skin_types?: string[];
          certifications?: string[];
          is_featured?: boolean;
          is_new?: boolean;
          is_active?: boolean;
          average_rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          subtitle?: string | null;
          description?: string;
          how_to_use?: string | null;
          process_type?: string;
          category_id?: string;
          base_price?: number;
          compare_at_price?: number | null;
          currency?: string;
          fragrance_family?: string;
          skin_types?: string[];
          certifications?: string[];
          is_featured?: boolean;
          is_new?: boolean;
          is_active?: boolean;
          average_rating?: number;
          review_count?: number;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          title: string;
          weight_grams: number | null;
          volume_ml: number | null;
          price: number;
          compare_at_price: number | null;
          inventory_quantity: number;
          low_stock_threshold: number;
          is_available: boolean;
          options: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          title: string;
          weight_grams?: number | null;
          volume_ml?: number | null;
          price: number;
          compare_at_price?: number | null;
          inventory_quantity?: number;
          low_stock_threshold?: number;
          is_available?: boolean;
          options?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          title?: string;
          weight_grams?: number | null;
          volume_ml?: number | null;
          price?: number;
          compare_at_price?: number | null;
          inventory_quantity?: number;
          low_stock_threshold?: number;
          is_available?: boolean;
          options?: Json;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          status: string;
          payment_status: string;
          payment_method: string;
          payment_intent_id: string | null;
          subtotal: number;
          discount_total: number;
          tax_total: number;
          shipping_total: number;
          grand_total: number;
          currency: string;
          shipping_address: Json;
          billing_address: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          guest_email?: string | null;
          status?: string;
          payment_status?: string;
          payment_method?: string;
          payment_intent_id?: string | null;
          subtotal: number;
          discount_total?: number;
          tax_total?: number;
          shipping_total?: number;
          grand_total: number;
          currency?: string;
          shipping_address: Json;
          billing_address: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          guest_email?: string | null;
          status?: string;
          payment_status?: string;
          payment_method?: string;
          payment_intent_id?: string | null;
          subtotal?: number;
          discount_total?: number;
          tax_total?: number;
          shipping_total?: number;
          grand_total?: number;
          currency?: string;
          shipping_address?: Json;
          billing_address?: Json;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string;
          product_title: string;
          variant_title: string;
          sku: string;
          unit_price: number;
          quantity: number;
          total_price: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id: string;
          product_title: string;
          variant_title: string;
          sku: string;
          unit_price: number;
          quantity: number;
          total_price: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string;
          product_title?: string;
          variant_title?: string;
          sku?: string;
          unit_price?: number;
          quantity?: number;
          total_price?: number;
          image_url?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          author_name: string;
          rating: number;
          title: string;
          content: string;
          scent_rating: number | null;
          lather_rating: number | null;
          moisture_rating: number | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          author_name: string;
          rating: number;
          title: string;
          content: string;
          scent_rating?: number | null;
          lather_rating?: number | null;
          moisture_rating?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          author_name?: string;
          rating?: number;
          title?: string;
          content?: string;
          scent_rating?: number | null;
          lather_rating?: number | null;
          moisture_rating?: number | null;
          is_verified?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrement_stock: {
        Args: {
          variant_id: string;
          qty: number;
        };
        Returns: void;
      };
    };
  };
}

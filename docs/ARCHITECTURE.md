# CINMAX Monorepo Architecture & Technical Specification

## Overview

The **CINMAX Global Products** platform is structured as a production-grade monorepo applying **Clean Architecture** and **Domain-Driven Design (DDD)** principles across web, administrative, and mobile targets.

---

## Workspace Structure

```
.
├── apps/
│   ├── website/         # Next.js Storefront (Cloudflare Pages Target)
│   ├── admin/           # Next.js Executive Management Dashboard
│   └── mobile/          # React Native Expo Mobile Application (iOS & Android)
└── packages/
    ├── types/           # Shared TypeScript Domain Entities, Contracts & Interfaces
    ├── utils/           # Shared Security, Currency, Date, & Helper Utilities
    ├── constants/       # Workspace Constants, System Routes, & Configuration
    ├── theme/           # Design System Design Tokens & Tailwind Presets
    ├── ui/              # Reusable Cross-Platform Component Library
    ├── api/             # Central Domain Repositories, Rule Engines, & Service Layer
    └── hooks/           # Persistent Zustand Stores & React Query Domain Hooks
```

---

## Core Architectural Layers

1. **Domain Entities Layer (`packages/types`)**:
   - Holds pure domain entity definitions (`Product`, `Cart`, `Order`, `CustomerProfile`, `Review`, `Coupon`).
2. **Business Rule Engines (`packages/api/src/engines/`)**:
   - High-performance, side-effect-free pure calculation engines (`PricingEngine`, `CouponEngine`, `TaxEngine`, `ShippingEngine`, `OrderStateMachine`, `InvoiceEngine`, `CheckoutEngine`, `AdminAnalyticsEngine`).
3. **Repository Abstraction (`packages/api/src/modules/`)**:
   - Repository pattern (`IProductRepository`, `IOrderRepository`, `ICartRepository`, `ICustomerRepository`, `IReviewRepository`) separating database access from business logic. Supports dual implementations: `SupabaseRepository` (production) and `MockRepository` (offline/testing).
4. **Service & DI Layer (`packages/api/src/services/` & `di/`)**:
   - Centralized application services (`ProductService`, `OrderService`, `CartService`, `AdminService`, `OperationsService`) registered via `Container` and injected using React context (`RepositoryProvider`, `useContainer()`).
5. **Reactive Query Hooks (`packages/hooks/src/domain/`)**:
   - TanStack React Query domain hooks providing optimistic UI updates, background caching, and automatic invalidation.

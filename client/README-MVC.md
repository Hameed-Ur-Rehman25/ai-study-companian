# MVC Architecture Documentation

This project follows the **Model-View-Controller (MVC)** architecture pattern for better code organization, maintainability, and separation of concerns.

## Project Structure

```
client/
├── models/           # Data models, interfaces, and types
├── views/           # React components (presentation layer)
├── controllers/      # Business logic and page controllers
├── services/         # API services and data services
├── utils/            # Helper functions and utilities
├── config/           # Configuration files
├── pages/            # Next.js pages (thin layer, delegates to controllers)
└── components/       # Reusable UI components (legacy, being migrated to views)
```

## Architecture Layers

### 1. Models (`/models`)
Contains TypeScript interfaces, types, and data structures.

**Files:**
- `Tool.ts` - Tool-related interfaces
- `SEO.ts` - SEO data interfaces
- `SiteConfig.ts` - Site configuration types

**Example:**
```typescript
export interface Tool {
  name: string
  icon: LucideIcon
  color: string
  description: string
  featured?: boolean
  href?: string
}
```

### 2. Services (`/services`)
Contains business logic, data fetching, and API interactions.

**Files:**
- `ToolService.ts` - Tool data management
- `SEOService.ts` - SEO data generation
- `PDFToVideoService.ts` - PDF to Video feature data

**Example:**
```typescript
export class ToolService {
  static getAllTools(): Tool[] {
    // Business logic here
  }
}
```

### 3. Controllers (`/controllers`)
Handles page-specific logic, coordinates between services and views.

**Files:**
- `HomeController.ts` - Homepage controller
- `PDFToVideoController.ts` - PDF to Video page controller

**Example:**
```typescript
export class HomeController {
  static getHomePageData() {
    const seoData = SEOService.getHomePageSEO()
    const tools = ToolService.getAllTools()
    return { seoData, tools }
  }
}
```

### 4. Views/Components (`/components`)
React components for presentation. Should be pure and receive data via props.

**Files:**
- `Header.tsx`
- `Footer.tsx`
- `HeroSection.tsx`
- `PopularTools.tsx`
- etc.

### 5. Pages (`/pages`)
Next.js pages that act as thin controllers, delegating to controllers.

**Example:**
```typescript
const Home: NextPage = () => {
  const { seoData, tools } = HomeController.getHomePageData()
  return (
    <>
      <Head>...</Head>
      <PopularTools tools={tools} />
    </>
  )
}
```

## MVC Flow

1. **Page** receives request
2. **Controller** is called to get page data
3. **Controller** uses **Services** to fetch/process data
4. **Services** may use **Models** for type safety
5. **Controller** returns data to **Page**
6. **Page** passes data to **Views/Components** for rendering

## Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easy to locate and modify code
3. **Testability**: Services and controllers can be unit tested
4. **Reusability**: Services can be reused across different pages
5. **Type Safety**: Models provide TypeScript type checking

## Best Practices

1. **Models**: Keep pure data structures, no business logic
2. **Services**: Keep stateless, use static methods
3. **Controllers**: Keep thin, delegate to services
4. **Views**: Keep pure, receive data via props
5. **Pages**: Keep minimal, just orchestrate controllers and views

## Migration Guide

When adding new features:

1. Create models in `/models` for data structures
2. Create services in `/services` for business logic
3. Create controllers in `/controllers` for page logic
4. Create/update views in `/components` for UI
5. Update pages to use controllers

## Example: Adding a New Feature

```typescript
// 1. Define model
// models/Chat.ts
export interface ChatMessage {
  id: string
  content: string
  timestamp: Date
}

// 2. Create service
// services/ChatService.ts
export class ChatService {
  static getMessages(): ChatMessage[] {
    // Business logic
  }
}

// 3. Create controller
// controllers/ChatController.ts
export class ChatController {
  static getChatPageData() {
    return {
      messages: ChatService.getMessages()
    }
  }
}

// 4. Use in page
// pages/chat.tsx
const Chat: NextPage = () => {
  const { messages } = ChatController.getChatPageData()
  return <ChatView messages={messages} />
}
```


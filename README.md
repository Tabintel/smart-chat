# Chat app with AI-Powered Smart Replies

A production-ready live streaming chat application that integrates [Stream's React Chat SDK](https://getstream.io/chat/sdk/react/) with [Synthetic's inference API](https://dev.synthetic.new/docs/api/overview) to provide context-aware smart reply suggestions.

## Features

- **Real-time Chat**: Built on [Stream's](https://getstream.io/chat/sdk/) powerful Chat API with React SDK
- **AI Smart Replies**: Context-aware reply suggestions powered by [Synthetic AI](https://synthetic.new)
- **Streaming Platform UI**: Sleek, dark theme inspired by Twitch and StreamLabs
- **Secure Authentication**: Backend token generation for Stream users
- **Fully Responsive**: Works seamlessly across all devices

## Prerequisites

- Node.js 18+ and npm installed
- [Stream](https://getstream.io/chat/sdk/) account with API key and secret
- [Synthetic](https://synthetic.new) API key
- Basic knowledge of React and Next.js

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
SYNTHETIC_API_KEY=your_synthetic_api_key
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How It Works

### Backend Token Server

The `/api/token` endpoint generates secure [Stream](https://getstream.io/chat/sdk/) user tokens:

- Accepts userId and userName
- Creates or updates user in Stream
- Returns authentication token

### Stream Chat Integration

- Initializes [Stream](https://getstream.io/chat/sdk/) client with user token
- Creates or joins a messaging channel
- Renders chat UI with Stream's React components

### Smart Reply Generation

1. Captures recent conversation messages
2. Sends context to [Synthetic](https://dev.synthetic.new/docs/api/overview) AI inference API
3. Generates 3 contextually relevant reply suggestions
4. Displays suggestions as clickable buttons
5. Sends selected reply instantly to chat

## Architecture

```bash
┌─────────────┐
│   Frontend  │
│  (Next.js)  │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐ ┌─────────────┐
│   Stream    │ │  Synthetic  │
│  Chat API   │ │   AI API    │
└─────────────┘ └─────────────┘
```

## Deployment

Deploy to Vercel with one click:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Chat**: [Stream Chat React SDK](https://getstream.io/chat/sdk/react/)
- **AI**: [Synthetic Inference API](https://dev.synthetic.new/docs/api/overview)
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel



```
stream-synthetic
├─ app
│  ├─ api
│  │  ├─ smart-replies
│  │  │  └─ route.ts
│  │  └─ token
│  │     └─ route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ discord-chat-layout.tsx
│  ├─ smart-reply-bar.tsx
│  ├─ stream-chat-container.tsx
│  ├─ theme-provider.tsx
│  └─ ui
│     ├─ accordion.tsx
│     ├─ alert-dialog.tsx
│     ├─ alert.tsx
│     ├─ aspect-ratio.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button-group.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ carousel.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ collapsible.tsx
│     ├─ command.tsx
│     ├─ context-menu.tsx
│     ├─ dialog.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ empty.tsx
│     ├─ field.tsx
│     ├─ form.tsx
│     ├─ hover-card.tsx
│     ├─ input-group.tsx
│     ├─ input-otp.tsx
│     ├─ input.tsx
│     ├─ item.tsx
│     ├─ kbd.tsx
│     ├─ label.tsx
│     ├─ menubar.tsx
│     ├─ navigation-menu.tsx
│     ├─ pagination.tsx
│     ├─ popover.tsx
│     ├─ progress.tsx
│     ├─ radio-group.tsx
│     ├─ resizable.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ slider.tsx
│     ├─ sonner.tsx
│     ├─ spinner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     ├─ toast.tsx
│     ├─ toaster.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     ├─ tooltip.tsx
│     ├─ use-mobile.tsx
│     └─ use-toast.ts
├─ components.json
├─ hooks
│  ├─ use-dialog-manager.ts
│  ├─ use-mobile.ts
│  └─ use-toast.ts
├─ lib
│  ├─ synthetic-ai.ts
│  └─ utils.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ public
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  └─ placeholder.svg
├─ README.md
├─ src
│  ├─ components
│  │  └─ chat
│  ├─ hooks
│  ├─ services
│  └─ types
├─ styles
│  └─ globals.css
└─ tsconfig.json

```
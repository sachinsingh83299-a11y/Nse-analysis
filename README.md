# Nova AI — solid starter

This is a mobile-friendly AI chat app with:
- Dark premium UI
- Poppins + Inter typography
- Responsive chat interface
- New Chat button
- Typing indicator
- Node/Express backend
- Server-side AI API key (never put the key in React code)
- GitHub Actions build

## 1. Install

```bash
npm install
```

## 2. Configure the AI key

Copy `.env.example` to `.env` and put your API key in:

```env
OPENAI_API_KEY=YOUR_KEY
OPENAI_MODEL=gpt-5.6-luna
PORT=8787
```

Keep `.env` private. Never commit it to GitHub.

## 3. Run

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## Important

The GitHub workflow builds the web app. It does NOT turn a React/Vite project into an Android APK by itself. For APK output, the project should be wrapped with Capacitor or another Android build layer, and the Android/Gradle project must be included in the repository.
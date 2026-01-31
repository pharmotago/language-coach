# Language Immersion Coach

An AI-powered language learning application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Start the development server
npm run dev

# Navigate to:
http://localhost:3000/language
```

## ✨ Features

- **8 Languages**: Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese
- **3 Skill Levels**: Beginner, Intermediate, Advanced
- **Structured Feedback**: Correction, Polish, Word of the Day
- **Voice Input**: Speech-to-text using Web Speech API
- **8 Scenarios**: Contextual practice (café, job interview, shopping, etc.)
- **Premium UI**: Dark mode with glassmorphism effects

## 📖 Usage

1. Select your target language
2. Choose your skill level
3. Start chatting in your target language
4. Get immediate feedback after each message
5. Use voice input or type manually
6. Try different scenarios for context-based practice

## 🔌 API Integration

**Currently**: Uses mock AI responses for demo purposes

**To integrate real AI:**
1. Open `src/components/LanguageCoach.tsx`
2. Replace `generateMockGreeting()` and `generateMockResponse()` functions
3. Add your AI API (OpenAI, Anthropic, etc.)
4. See [walkthrough.md](file:///C:/Users/kimsj/.gemini/antigravity/brain/1fd02cbd-a211-4bb3-8d13-f489572ea0f8/walkthrough.md) for detailed integration guide

## 📁 Project Structure

```
src/
├── app/language/page.tsx         # Main route
├── components/
│   ├── LanguageCoach.tsx         # Main orchestrator
│   ├── SetupModal.tsx            # Language/level selection
│   ├── ChatMessage.tsx           # Message display
│   ├── CoachFeedback.tsx         # Feedback sections
│   ├── VoiceInput.tsx            # Speech-to-text
│   └── ScenarioSelector.tsx      # Scenario modal
├── store/
│   └── useLanguageStore.ts       # Zustand state management
├── lib/
│   ├── languageData.ts           # Languages & scenarios
│   └── languageCoachPrompts.ts   # AI prompt engineering
└── types/
    └── languageTypes.ts          # TypeScript interfaces
```

## 🎯 Key Components

- **SetupModal**: Language and skill level selection
- **LanguageCoach**: Main container with chat interface
- **ChatMessage**: Individual message bubbles with collapsible translations
- **CoachFeedback**: Color-coded feedback sections
- **VoiceInput**: Microphone button with real-time transcription
- **ScenarioSelector**: Contextual practice scenarios

## 🎨 Design

- **Colors**: Slate 950 background, Amber 500 accents
- **Style**: Glassmorphism with smooth animations
- **Responsive**: Mobile-first design
- **Accessibility**: Keyboard navigation, focus states

## 📝 Documentation

- [Implementation Plan](file:///C:/Users/kimsj/.gemini/antigravity/brain/1fd02cbd-a211-4bb3-8d13-f489572ea0f8/implementation_plan.md)
- [Walkthrough Guide](file:///C:/Users/kimsj/.gemini/antigravity/brain/1fd02cbd-a211-4bb3-8d13-f489572ea0f8/walkthrough.md)
- [Task Breakdown](file:///C:/Users/kimsj/.gemini/antigravity/brain/1fd02cbd-a211-4bb3-8d13-f489572ea0f8/task.md)

## 🔧 Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Web Speech API
- Lucide Icons

---

**Ready to make language learning immersive! 🌍**

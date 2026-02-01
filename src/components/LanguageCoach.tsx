/**
 * Language Immersion Coach - ENHANCED Main Container Component
 * Phase 2: Gamification, Analytics, Persistence, & Advanced Learning
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, RotateCcw, Sparkles, Download, Keyboard, AlertCircle, Trophy, BarChart3, Book, Flame, X, ShoppingBag, Crown, Globe, History, Coins } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { model, chatModel } from '@/lib/gemini';
import { Message } from '@/types/languageTypes';
import { SetupModal } from './SetupModal';
import { ChatMessage } from './ChatMessage';
import { VoiceInput } from './VoiceInput';
import { ConversationStarters } from './ConversationStarters';
import { QuickReplies } from './QuickReplies';
import { ProgressPanel } from './ProgressPanel';
import { MessageSkeleton } from './LoadingSkeletons';
import { useLanguageCoachShortcuts, KeyboardShortcutsHelp } from '@/hooks/useLanguageCoachShortcuts';
import { exportConversation } from '@/lib/conversationExport';
import { shareReferral } from '@/lib/referral';

// Phase 2 Integrations
import { AchievementsList, AchievementUnlockNotification, DEFAULT_ACHIEVEMENTS, Achievement } from './AchievementSystem';
import { XPBar, LevelUpNotification, XPGainToast, calculateLevel } from './XPSystem';
import { StreakDisplay, calculateStreak, CalendarHeatmap } from './StreakTracker';

import { useConversationHistory } from '@/lib/conversationHistory';
import { useSound } from '@/contexts/SoundContext';
import { triggerHaptic, HapticPatterns } from '@/lib/haptics';
import { generateCultureNote } from '@/lib/aiCulture';
import { analytics } from '@/lib/analytics';
import dynamic from 'next/dynamic';

// Performance: Dynamic Imports for heavy dashboards and secondary views
const AnalyticsDashboard = dynamic(() => import('./AnalyticsDashboard').then(mod => mod.AnalyticsDashboard), { ssr: false });
const VocabularyDashboard = dynamic(() => import('./VocabularyFlashcards').then(mod => mod.VocabularyDashboard), { ssr: false });
const LessonGenerator = dynamic(() => import('./LessonGenerator').then(mod => mod.LessonGenerator), { ssr: false });
const Shop = dynamic(() => import('./Shop').then(mod => mod.Shop), { ssr: false });
const Leaderboard = dynamic(() => import('./Leaderboard').then(mod => mod.Leaderboard), { ssr: false });
const AvatarCustomizer = dynamic(() => import('./AvatarCustomizer').then(mod => mod.AvatarCustomizer), { ssr: false });
const ScenarioSelector = dynamic(() => import('./ScenarioSelector').then(mod => mod.ScenarioSelector), { ssr: false });
const ScenarioBuilder = dynamic(() => import('./ScenarioBuilder').then(mod => mod.ScenarioBuilder), { ssr: false });
import { AICoachFeedback } from './AICoachFeedback';
import { MistakeVault } from './MistakeVault';

export function LanguageCoach() {
    const {
        targetLanguage,
        skillLevel,
        messages,
        isInitialized,
        setLanguage,
        setSkillLevel,
        addMessage,
        resetConversation,
        coins,
        avatarConfig,
        currentScenario, // Ensure this is present
        setScenario,
        initialize
    } = useLanguageStore();

    // Sensory Hooks
    const { playSound } = useSound();

    // UI State
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [showScenarios, setShowScenarios] = useState(false);
    const [showScenarioBuilder, setShowScenarioBuilder] = useState(false);
    const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showMistakeVault, setShowMistakeVault] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'chat' | 'achievements' | 'analytics' | 'vocabulary' | 'lessons' | 'shop' | 'leaderboard'>('chat');

    // Gamification State
    const [xp, setXp] = useState(1250); // Demo start XP
    const [level, setLevel] = useState(calculateLevel(1250));
    const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
    const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [xpGain, setXpGain] = useState<{ amount: number; reason: string } | null>(null);

    // Streak State
    const [streakHistory, setStreakHistory] = useState<Date[]>([
        new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    ]);
    // Scroll Animation Hooks
    const { scrollY } = useScroll();
    const headerBg = useTransform(scrollY, [0, 50], ["rgba(15, 23, 42, 0.4)", "rgba(15, 23, 42, 0.9)"]);
    const headerBlur = useTransform(scrollY, [0, 50], ["blur(8px)", "blur(16px)"]);
    const headerPadding = useTransform(scrollY, [0, 50], ["1.5rem", "1rem"]);

    // Persistence Hook
    const { saveConversation } = useConversationHistory();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (activeView === 'chat') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeView]);

    // Send initial greeting when setup is complete
    useEffect(() => {
        if (isInitialized && targetLanguage && skillLevel && messages.length === 0) {
            handleInitialGreeting();
        }
    }, [isInitialized, targetLanguage, skillLevel]);

    const handleReset = () => {
        if (confirm('Are you sure you want to start over? This will reset your language and conversation history.')) {
            resetConversation();
            setError(null);
            setXp(0);
            setLevel(calculateLevel(0));
            setActiveView('chat');
        }
    };

    // Keyboard shortcuts
    const shortcuts = useLanguageCoachShortcuts({
        onSend: () => handleSendMessage(),
        onReset: handleReset,
        onScenarios: () => setShowScenarios(true),
        onFocusInput: () => inputRef.current?.focus(),
        onToggleVoice: () => { /* Implemented in VoiceInput */ }
    });

    const triggerXPGain = (amount: number, reason: string) => {
        setXp(prev => {
            const newTotal = prev + amount;
            const newLevelData = calculateLevel(newTotal);
            if (newLevelData.level > level.level) {
                setShowLevelUp(true);
            }
            setLevel(newLevelData);
            return newTotal;
        });
        setXpGain({ amount, reason });
    };

    const checkAchievements = (msgCount: number) => {
        const newAchievements = [...achievements];
        let unlocked = false;

        newAchievements.forEach(a => {
            if (!a.unlocked) {
                if (a.id === 'first_message' && msgCount >= 1) {
                    a.unlocked = true;
                    a.unlockedAt = new Date();
                    setUnlockedAchievement(a);
                    triggerXPGain(a.xpReward, `Achievement: ${a.title}`);
                    playSound('unlock');
                    triggerHaptic(HapticPatterns.unlock);
                    unlocked = true;
                }
                if (a.id === 'conversationalist' && msgCount >= 50) {
                    a.unlocked = true;
                    a.unlockedAt = new Date();
                    setUnlockedAchievement(a);
                    triggerXPGain(a.xpReward, `Achievement: ${a.title}`);
                    playSound('unlock');
                    triggerHaptic(HapticPatterns.unlock);
                    unlocked = true;
                }
            }
        });

        if (unlocked) {
            setAchievements(newAchievements);
        }
    };

    const streakCalc = calculateStreak(streakHistory);
    const streakData = {
        currentStreak: streakCalc.current,
        longestStreak: streakCalc.longest,
        practiceHistory: streakHistory,
        lastPracticeDate: streakHistory[0],
        streakFreezes: 2
    };

    const handleInitialGreeting = async () => {
        if (!targetLanguage || !skillLevel) return;

        setIsLoading(true);
        setError(null);

        try {
            // Real AI Greeting
            const prompt = `
            Act as a native ${targetLanguage.name} language tutor. 
            User Skill Level: ${skillLevel}.
            
            Task: Generate a warm, welcoming initial greeting for a new student.
            
            Instructions:
            1. Speak ONLY in ${targetLanguage.name} (with English translation in parentheses).
            2. Match the difficulty to the user's skill level.
            3. Ask a simple open-ended question to start the conversation.
            
            Output JSON format ONLY:
            {
                "response": "Greeting in ${targetLanguage.name}",
                "translation": "English translation",
                "feedback": null
            }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const cleanJson = responseText.replace(/```json|```/g, '').trim();
            const aiData = JSON.parse(cleanJson);

            const coachMessage: Message = {
                id: Date.now().toString(),
                role: 'coach',
                content: aiData.response,
                timestamp: new Date(),
                translation: aiData.translation,
                feedback: undefined
            };

            addMessage(coachMessage);
        } catch (err: any) {
            console.error("AI Greeting Error:", err);
            if (err.message) console.error("Error Details:", err.message);
            // Silent fail or default fallback
            const fallbackGreetings: Record<string, string> = {
                'Spanish': '¡Hola! ¿Cómo estás?',
                'French': 'Bonjour! Comment allez-vous?',
                'German': 'Hallo! Wie geht es dir?',
                'Italian': 'Ciao! Come stai?',
                'Portuguese': 'Olá! Como vai?',
                'Japanese': 'こんにちは！お元気ですか？',
                'Korean': '안녕하세요! 잘 지내셨나요?',
                'Chinese': '你好！你好吗？'
            };

            addMessage({
                id: Date.now().toString(),
                role: 'coach',
                content: fallbackGreetings[targetLanguage.name] || `Hello! Ready to practice ${targetLanguage.name}?`,
                timestamp: new Date()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim() || !targetLanguage || !skillLevel || isLoading) return;

        // Cancel any pending request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        addMessage(userMessage);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        // Sensory feedback
        playSound('send');
        triggerHaptic(HapticPatterns.light);
        triggerXPGain(10, 'Message Sent');

        // Streak: Update if first time today
        const today = new Date();
        const lastPractice = streakHistory[0];
        if (!lastPractice || lastPractice.toDateString() !== today.toDateString()) {
            setStreakHistory(prev => [today, ...prev]);
            triggerXPGain(50, 'Daily Practice');
        }

        abortControllerRef.current = new AbortController();

        try {
            // Real AI Generation
            const prompt = `
            Act as a native ${targetLanguage.name} language tutor. 
            User Skill Level: ${skillLevel}.
            Current Context: ${currentScenario ? currentScenario.context : 'Casual conversation'}.
            
            User Message: "${userMessage.content}"
            
            Instructions:
            1. Respond naturally in ${targetLanguage.name}.
            2. Match the user's skill level.
            3. Provide a brief English translation of your response in parentheses at the end if the user is a beginner.
            4. If the user makes a mistake, correct it gently in a separate "feedback" section.
            
            Output JSON format ONLY:
            {
                "response": "Your response in ${targetLanguage.name}",
                "translation": "English translation (optional)",
                "feedback": "Correction if needed (optional)"
            }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Clean up code blocks if present
            const cleanJson = responseText.replace(/```json|```/g, '').trim();
            const aiData = JSON.parse(cleanJson);

            const coachMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'coach',
                content: aiData.response,
                timestamp: new Date(),
                translation: aiData.translation,
                feedback: aiData.feedback || undefined,
                // Culture note can be generated separately or added to the prompt later if needed
            };

            addMessage(coachMessage);
            playSound('receive');
            triggerHaptic(HapticPatterns.medium);
            checkAchievements(messages.length + 1);

            // Persistence
            saveConversation({
                id: Date.now().toString(),
                language: targetLanguage.name,
                skillLevel,
                messages: [...messages, userMessage, coachMessage],
                createdAt: new Date(),
                updatedAt: new Date(),
                title: `Conversation - ${new Date().toLocaleDateString()}`
            });

        } catch (err: any) {
            console.error("AI Error Details:", err);
            if (err.message) console.error("Error Message:", err.message);

            if (err.name !== 'AbortError') {
                setError('Failed to connect to AI Tutor. Please check your API Key.');
                console.error(err);

                // Fallback for demo purposes if API fails
                addMessage({
                    id: Date.now().toString(),
                    role: 'coach',
                    content: "I'm having trouble connecting to the cloud. Please check your internet or API key.",
                    timestamp: new Date()
                });
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [inputValue, targetLanguage, skillLevel, isLoading, messages, currentScenario, streakHistory, addMessage, playSound, triggerHaptic, triggerXPGain, checkAchievements, saveConversation]);

    const handleVoiceTranscript = (text: string) => {
        setInputValue(text);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleQuickReply = (text: string) => {
        setInputValue(text);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };



    const handleExport = () => {
        if (messages.length === 0) {
            alert('No conversation to export yet!');
            return;
        }
        exportConversation(
            messages,
            targetLanguage?.name || 'Unknown',
            skillLevel || 'Unknown',
            { format: 'md', includeFeedback: true, includeTranslations: true }
        );
    };

    const handleRegenerateLastResponse = () => {
        console.log('Regenerating last response...');
    };

    // Show setup modal if not initialized
    if (!isInitialized || !targetLanguage || !skillLevel) {
        return (
            <SetupModal
                onComplete={(lang, level) => {
                    setLanguage(lang);
                    setSkillLevel(level);
                    initialize();
                }}
            />
        );
    }

    const hasMessages = messages.length > 0;
    const userMessageCount = messages.filter(m => m.role === 'user').length;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            {/* Notifications */}
            {unlockedAchievement && (
                <AchievementUnlockNotification
                    achievement={unlockedAchievement}
                    onClose={() => setUnlockedAchievement(null)}
                />
            )}
            {showLevelUp && (
                <LevelUpNotification
                    level={level.level}
                    onClose={() => setShowLevelUp(false)}
                />
            )}
            {xpGain && (
                <XPGainToast
                    amount={xpGain.amount}
                    reason={xpGain.reason}
                    onClose={() => setXpGain(null)}
                />
            )}

            {/* Dynamic Imperial Header */}
            <motion.header
                style={{
                    backgroundColor: headerBg,
                    backdropFilter: headerBlur,
                    paddingTop: headerPadding,
                    paddingBottom: headerPadding
                }}
                className="border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40 transition-all duration-300"
            >
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAvatarCustomizer(true)}
                            className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 hover:border-amber-500 transition-all flex items-center justify-center text-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                            title="Customize Avatar"
                            aria-label="Customize Avatar"
                        >
                            {/* Simple avatar preview */}
                            <div className="w-full h-full bg-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                                ME
                            </div>
                        </button>
                        <div className="text-3xl animate-bounce-subtle">{targetLanguage.flag}</div>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                {targetLanguage.name} Coach
                                <span className={`
                                    text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold
                                    ${skillLevel === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400' :
                                        skillLevel === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-purple-500/20 text-purple-400'}
                                `}>
                                    {skillLevel}
                                </span>
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Flame className="w-3 h-3 text-orange-500" />
                                {streakData.currentStreak} Day Streak
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block w-48">
                        <XPBar
                            currentXP={level.xpProgress}
                            currentLevel={level.level}
                            xpForNextLevel={level.xpForNext}
                            compact
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Toggles */}
                    <nav className="flex bg-slate-900/50 rounded-lg p-1 mr-2 border border-slate-800" aria-label="Main Navigation">
                        <button
                            onClick={() => setActiveView('chat')}
                            className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${activeView === 'chat' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Chat"
                            aria-label="View Chat"
                            aria-pressed={activeView === 'chat'}
                        >
                            <Send className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setActiveView('lessons')}
                            className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${activeView === 'lessons' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Lessons"
                            aria-label="View Lessons"
                            aria-pressed={activeView === 'lessons'}
                        >
                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setActiveView('vocabulary')}
                            className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${activeView === 'vocabulary' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Vocabulary"
                            aria-label="View Vocabulary"
                            aria-pressed={activeView === 'vocabulary'}
                        >
                            <Book className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setActiveView('achievements')}
                            className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${activeView === 'achievements' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Achievements"
                            aria-label="View Achievements"
                            aria-pressed={activeView === 'achievements'}
                        >
                            <Trophy className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setActiveView('leaderboard')}
                            className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${activeView === 'leaderboard' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Leaderboard"
                            aria-label="View Leaderboard"
                            aria-pressed={activeView === 'leaderboard'}
                        >
                            <Crown className="w-4 h-4 text-amber-500" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setActiveView('analytics')}
                            className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${activeView === 'analytics' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Analytics"
                            aria-label="View Analytics"
                            aria-pressed={activeView === 'analytics'}
                        >
                            <BarChart3 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setActiveView('shop')}
                            className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${activeView === 'shop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Item Shop"
                            aria-label="View Item Shop"
                            aria-pressed={activeView === 'shop'}
                        >
                            <ShoppingBag className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                        </button>
                    </nav>

                    <button
                        onClick={() => setShowMistakeVault(true)}
                        className="btn-ghost text-sm px-3 py-2 text-rose-400 hover:text-rose-300 relative group"
                        title="Mistake Vault"
                    >
                        <History className="w-4 h-4" />
                        <span className="sr-only">Mistakes</span>
                    </button>

                    <button
                        onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                        className="btn-ghost text-sm px-3 py-2"
                        title="Shortcuts"
                    >
                        <Keyboard className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={messages.length === 0}
                        className="btn-ghost text-sm px-3 py-2 disabled:opacity-50"
                        title="Export"
                    >
                        <Download className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setShowScenarios(true)}
                        className="btn-ghost text-sm px-3 py-2 flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="hidden sm:inline">Scenarios</span>
                    </button>

                    <button
                        onClick={async () => {
                            const result = await shareReferral('user123'); // Demo ID
                            if (result.success) {
                                playSound('success');
                                triggerHaptic(HapticPatterns.success);
                                analytics.track('referral_shared', { method: result.method });
                                setXp(prev => prev + 500);
                                setXpGain({ amount: 500, reason: 'Referral Shared' });
                            }
                        }}
                        className="btn-ghost text-sm px-3 py-2 flex items-center gap-2 text-amber-500 font-bold"
                        title="Invite Friend"
                        aria-label="Invite Friend for 500 XP"
                    >
                        <Globe className="w-4 h-4" />
                        <span className="hidden lg:inline">Invite Friend (+500 XP)</span>
                    </button>

                    <button
                        onClick={handleReset}
                        className="btn-ghost text-sm px-3 py-2"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </motion.header>

            {/* Keyboard Shortcuts Help */}
            {showKeyboardHelp && (
                <div className="mx-6 mt-4 glass-card rounded-xl p-4 border border-amber-500/30 animate-in slide-in-from-top px-6 relative z-30">
                    <button onClick={() => setShowKeyboardHelp(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                    <KeyboardShortcutsHelp shortcuts={shortcuts} />
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-6 py-8 relative">
                <div className="max-w-4xl mx-auto h-full">

                    {/* VIEW: CHAT */}
                    {activeView === 'chat' && (
                        <>
                            {hasMessages && userMessageCount >= 3 && (
                                <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <ProgressPanel messages={messages} />
                                </div>
                            )}

                            {!hasMessages && (
                                <ConversationStarters
                                    language={targetLanguage.name}
                                    level={skillLevel}
                                    onSelect={(text) => {
                                        setInputValue(text);
                                        setTimeout(() => inputRef.current?.focus(), 100);
                                    }}
                                />
                            )}

                            <div className="space-y-6">
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message}
                                        targetLanguageName={targetLanguage.name}
                                        languageCode={`${targetLanguage.code}-${targetLanguage.code.toUpperCase()}`}
                                        onRegenerate={handleRegenerateLastResponse}
                                    />
                                ))}
                            </div>

                            {isLoading && <MessageSkeleton />}
                            <div ref={messagesEndRef} />
                        </>
                    )}

                    {/* VIEW: ACHIEVEMENTS */}
                    {activeView === 'achievements' && (
                        <div className="animate-in fade-in duration-300 space-y-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Trophy className="w-8 h-8 text-amber-400" />
                                Your Achievements
                            </h2>
                            <XPBar currentXP={level.xpProgress} currentLevel={level.level} xpForNextLevel={level.xpForNext} />
                            <AchievementsList achievements={achievements} />
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-4">Practice Streak</h3>
                                <StreakDisplay streakData={streakData} />
                            </div>
                        </div>
                    )}

                    {/* VIEW: ANALYTICS */}
                    {activeView === 'analytics' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-blue-400" />
                                Learning Analytics
                            </h2>
                            <AnalyticsDashboard data={{
                                messages: messages,
                                totalWords: 142, // Mock data for demo
                                totalCorrections: messages.filter(m => m.feedback?.correction).length,
                                totalPracticeTime: 450, // Mock minutes
                                startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
                            }} />
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-4">Activity Heatmap</h3>
                                <CalendarHeatmap practiceHistory={streakData.practiceHistory} />
                            </div>
                        </div>
                    )}

                    {/* VIEW: VOCABULARY */}
                    {activeView === 'vocabulary' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Book className="w-8 h-8 text-emerald-400" />
                                Vocabulary Deck
                            </h2>
                            <VocabularyDashboard cards={[
                                // Mock cards for demo
                                {
                                    id: '1', term: 'Hola', translation: 'Hello', language: 'Spanish', example: 'Hola, ¿cómo estás?',
                                    category: 'Greetings', dateAdded: new Date(), easinessFactor: 2.5, interval: 1, repetitions: 0,
                                    nextReviewDate: new Date(), masteryLevel: 'new', reviewCount: 0
                                },
                                {
                                    id: '2', term: 'Biblioteca', translation: 'Library', language: 'Spanish', example: 'Voy a la biblioteca.',
                                    category: 'Places', dateAdded: new Date(), easinessFactor: 2.5, interval: 1, repetitions: 2,
                                    nextReviewDate: new Date(), masteryLevel: 'learning', reviewCount: 2
                                },
                                {
                                    id: '3', term: 'Gracias', translation: 'Thank you', language: 'Spanish', example: 'Muchas gracias por todo.',
                                    category: 'Essentials', dateAdded: new Date(), easinessFactor: 2.6, interval: 5, repetitions: 5,
                                    nextReviewDate: new Date(Date.now() + 86400000), masteryLevel: 'mastered', reviewCount: 10
                                }
                            ]} />
                        </div>
                    )}

                    {/* VIEW: LESSONS */}
                    {activeView === 'lessons' && (
                        <LessonGenerator />
                    )}

                    {/* VIEW: SHOP */}
                    {activeView === 'shop' && (
                        <Shop />
                    )}

                    {/* VIEW: LEADERBOARD */}
                    {activeView === 'leaderboard' && (
                        <Leaderboard currentUserXp={xp} currentUserStreak={streakData.currentStreak} />
                    )}

                </div>
            </main>

            {/* Input Footer (Only visible in Chat View) */}
            {activeView === 'chat' && (
                <footer className="glass-card border-t border-slate-800 px-6 py-4 sticky bottom-0 z-40">
                    <div className="max-w-4xl mx-auto">
                        {hasMessages && (
                            <QuickReplies
                                language={targetLanguage.name}
                                level={skillLevel}
                                onSelect={handleQuickReply}
                            />
                        )}

                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        playSound('typing');
                                    }}
                                    onKeyDown={handleKeyPress}
                                    placeholder={`Type your message in ${targetLanguage.name}...`}
                                    aria-label={`Message in ${targetLanguage.name}`}
                                    disabled={isLoading}
                                    rows={1}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50 min-h-[50px] max-h-[120px]"
                                    maxLength={500}
                                />
                            </div>

                            <VoiceInput
                                language={`${targetLanguage.code}-${targetLanguage.code.toUpperCase()}`}
                                onTranscript={handleVoiceTranscript}
                                disabled={isLoading}
                            />

                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-[50px]"
                            >
                                <Send className="w-5 h-5" />
                                <span className="hidden sm:inline">Send</span>
                            </button>
                        </div>
                    </div>
                </footer>
            )}

            {/* Scenario Selector Modal */}
            {showScenarios && skillLevel && (
                <ScenarioSelector
                    currentLevel={skillLevel}
                    onSelect={setScenario}
                    onClose={() => setShowScenarios(false)}
                />
            )}

            {/* Custom Scenario Builder Modal */}
            {showScenarioBuilder && skillLevel && (
                <ScenarioBuilder
                    skillLevel={skillLevel}
                    onScenarioCreated={(scenario) => {
                        setScenario(scenario);
                        setShowScenarioBuilder(false);
                    }}
                    onClose={() => setShowScenarioBuilder(false)}
                />
            )}
            {/* Avatar Customizer Modal */}
            {showAvatarCustomizer && (
                <AvatarCustomizer onClose={() => setShowAvatarCustomizer(false)} />
            )}

            {/* Mistake Vault Modal */}
            {showMistakeVault && (
                <MistakeVault onClose={() => setShowMistakeVault(false)} />
            )}

            {/* AI Real-time Feedback */}
            {targetLanguage && <AICoachFeedback messages={messages} targetLanguage={targetLanguage.name} />}
        </div>
    );
}

// Utility function for delays
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// MOCK GENERATORS (Keeping for verification demo)
function generateMockGreeting(language: string, level: string) {
    return {
        response: `¡Hola! Bienvenido a tu clase de ${language}. Soy tu entrenador personal. ¿En qué puedo ayudarte hoy?`,
        translation: `Hello! Welcome to your ${language} class. I am your personal coach. How can I help you today?`,
        feedback: {
            polish: "Start by saying 'Hola' or asking '¿Cómo estás?'",
            wordOfTheDay: { term: "Bienvenido", translation: "Welcome", usage: "Bienvenido a casa." },
            correction: null
        }
    };
}

function generateMockResponse(language: string, level: string, input: string, count: number) {
    return {
        response: `Eso es interesante. Me gusta cómo usaste "${input.substring(0, 10)}...". ¿Puedes contarme más sobre eso?`,
        translation: `That is interesting. I like how you used "${input.substring(0, 10)}...". Can you tell me more about that?`,
        feedback: {
            polish: "Try using the subjunctive mood here for more politeness.",
            wordOfTheDay: { term: "Interesante", translation: "Interesting", usage: "Es muy interesante." },
            correction: null
        }
    };
}

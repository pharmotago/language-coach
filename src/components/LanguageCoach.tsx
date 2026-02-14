/**
 * Language Immersion Coach - ENHANCED Main Container Component
 * Phase 2: Gamification, Analytics, Persistence, & Advanced Learning
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, RotateCcw, Sparkles, Download, Keyboard, Trophy, BarChart3, Book, X, ShoppingBag, Crown, Globe, History } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { aiService } from '@/lib/aiCore';
import { Message } from '@/types/languageTypes';
import { SetupModal } from './SetupModal';
import { ChatMessage } from './ChatMessage';
import { VoiceInput } from './VoiceInput';
import { ConversationStarters } from './ConversationStarters';
import { QuickReplies } from './QuickReplies';
import { ProgressPanel } from './ProgressPanel';
import { CouncilFeedback } from './CouncilFeedback';
import { MessageSkeleton } from './LoadingSkeletons';
import { useLanguageCoachShortcuts, KeyboardShortcutsHelp } from '@/hooks/useLanguageCoachShortcuts';
import { exportConversation } from '@/lib/conversationExport';
import { shareReferral } from '@/lib/referral';
import { SynapseHeader } from './SynapseHeader';

// Phase 2 Integrations
import { AchievementsList, AchievementUnlockNotification, DEFAULT_ACHIEVEMENTS, Achievement } from './AchievementSystem';
import { XPBar, LevelUpNotification, XPGainToast, calculateLevel } from './XPSystem';
import { StreakDisplay, calculateStreak, CalendarHeatmap } from './StreakTracker';
import { PremiumModal } from './PremiumModal';
import { AdSense, useLicensing, ExitIntentModal, CrossPromo } from '@ecosystem/shared-ui';
import { Wind } from 'lucide-react';

import { useConversationHistory } from '@/lib/conversationHistory';
import { useSound } from '@/contexts/SoundContext';
import { triggerHaptic, HapticPatterns } from '@/lib/haptics';
import { generateCultureNote } from '@/lib/aiCulture';
import { analytics } from '@/lib/analytics';
import dynamic from 'next/dynamic';

// Performance: Dynamic Imports for heavy dashboards and secondary views
const AnalyticsDashboard = dynamic(() => import('./AnalyticsDashboard').then(mod => mod.AnalyticsDashboard), { ssr: false });
const VocabularyDashboard = dynamic(() => import('./VocabularyFlashcards').then(mod => mod.VocabularyDashboard), { ssr: false });
const FlashcardReview = dynamic(() => import('./VocabularyFlashcards').then(mod => mod.FlashcardReview), { ssr: false });
const LessonGenerator = dynamic(() => import('./LessonGenerator').then(mod => mod.LessonGenerator), { ssr: false });
const Shop = dynamic(() => import('./Shop').then(mod => mod.Shop), { ssr: false });
const Leaderboard = dynamic(() => import('./Leaderboard').then(mod => mod.Leaderboard), { ssr: false });

const AvatarCustomizer = dynamic(() => import('./AvatarCustomizer').then(mod => mod.AvatarCustomizer), { ssr: false });
const ScenarioSelector = dynamic(() => import('./ScenarioSelector').then(mod => mod.ScenarioSelector), { ssr: false });
const ScenarioBuilder = dynamic(() => import('./ScenarioBuilder').then(mod => mod.ScenarioBuilder), { ssr: false });
import { AICoachFeedback } from './AICoachFeedback';
import { MistakeVault } from './MistakeVault';
import { AmbientManager } from './AmbientManager';

export function LanguageCoach() {
    const {
        targetLanguage,
        skillLevels,
        messages: allMessages,
        isInitialized,
        setLanguage,
        setSkillLevel,
        addMessage,
        resetAll,
        coins,
        avatarConfig,
        currentScenarios,
        setScenario,
        initialize,
        vocabulary: allVocabulary,
        addVocabularyCard,
        updateVocabularyCard,
        isPremium,
        energy,
        useEnergy,
        setPremium
    } = useLanguageStore();

    const { isPremium: isSharedPremium, unlockPremium } = useLicensing();

    const [showWorryPromo, setShowWorryPromo] = useState(false);

    useEffect(() => {
        if (energy === 0 && !isPremium) {
            setShowWorryPromo(true);
        }
    }, [energy, isPremium]);

    // Sync shared premium to local store if needed
    useEffect(() => {
        if (isSharedPremium && !isPremium) {
            setPremium(true);
        }
    }, [isSharedPremium, isPremium, setPremium]);

    const langCode = targetLanguage?.code || 'global';
    const messages = allMessages[langCode] || [];
    const skillLevel = skillLevels[langCode];
    const currentScenario = currentScenarios[langCode];
    const vocabulary = allVocabulary[langCode] || [];

    // Sensory Hooks
    const { playSound } = useSound();

    // UI State
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [showScenarios, setShowScenarios] = useState(false);
    const [showScenarioBuilder, setShowScenarioBuilder] = useState(false);
    const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [showMistakeVault, setShowMistakeVault] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'chat' | 'achievements' | 'analytics' | 'vocabulary' | 'lessons' | 'shop' | 'leaderboard'>('chat');
    const [isStudying, setIsStudying] = useState(false);
    const [studyCardIndex, setStudyCardIndex] = useState(0);

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
        if (confirm('Are you sure you want to reset EVERYTHING? This will clear all languages and history.')) {
            resetAll();
            setError(null);
            setXp(0);
            setLevel(calculateLevel(0));
            setActiveView('chat');
        }
    };

    const checkPremium = (action: () => void) => {
        if (isPremium) {
            action();
        } else {
            setShowPremiumModal(true);
        }
    };

    // Keyboard shortcuts
    const shortcuts = useLanguageCoachShortcuts({
        onSend: () => handleSendMessage(),
        onReset: handleReset,
        onScenarios: () => checkPremium(() => setShowScenarios(true)),
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

            const aiResponse = await aiService.generateResponse({
                messages: [],
                systemPrompt: prompt,
                targetLanguage: targetLanguage.name,
                skillLevel: skillLevel
            });

            const aiData = {
                response: aiResponse.response,
                translation: aiResponse.translation,
                feedback: aiResponse.feedback
            };

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
                content: `Greeting Error: ${err.message || 'Unknown error'}`,
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

        if (!useEnergy()) {
            setShowPremiumModal(true);
            return;
        }

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
                "feedback": "Correction if needed (optional)",
                "cultureNote": { "title": "Cultural Insight", "content": "Fact regarding this context", "icon": "Globe" } (Optional: Include only if a relevant cultural fact arises)
            }
            `;

            const aiResponse = await aiService.generateResponse({
                messages: messages,
                systemPrompt: prompt,
                targetLanguage: targetLanguage.name,
                skillLevel: skillLevel
            });

            const coachMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'coach',
                content: aiResponse.response,
                timestamp: new Date(),
                translation: aiResponse.translation,
                feedback: aiResponse.feedback || undefined,
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
        // console.log('Regenerating last response...');
    };

    // Show setup modal if not initialized or manually requested
    if ((!isInitialized || !targetLanguage || !skillLevel) || showSetup) {
        return (
            <SetupModal
                onComplete={(lang, level) => {
                    setLanguage(lang);
                    setSkillLevel(level);
                    initialize();
                    setShowSetup(false);
                }}
                onClose={isInitialized ? () => setShowSetup(false) : undefined}
                initialLanguage={targetLanguage}
            />
        );
    }

    const hasMessages = messages.length > 0;
    const userMessageCount = messages.filter(m => m.role === 'user').length;

    return (
        <div className="min-h-[100dvh] bg-[#020617] flex flex-col relative overflow-hidden synapse-hud">
            {/* Background Texture & Pulse */}
            <div className="synapse-scanline animate-scanline" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />

            {/* Notifications */}
            <AmbientManager />
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

            {/* Synapse Terminal Header */}
            <SynapseHeader
                headerBg={headerBg}
                headerBlur={headerBlur}
                headerPadding={headerPadding}
                targetLanguage={targetLanguage}
                skillLevel={skillLevel}
                streakData={streakData}
                level={level}
                activeView={activeView}
                setActiveView={(view) => {
                    if (['analytics', 'lessons', 'leaderboard', 'shop'].includes(view)) {
                        checkPremium(() => setActiveView(view));
                    } else {
                        setActiveView(view);
                    }
                }}
                onAvatarClick={() => setShowAvatarCustomizer(true)}
                onSetupClick={() => setShowSetup(true)}
                onExportClick={handleExport}
                onScenariosClick={() => checkPremium(() => setShowScenarios(true))}
                onReferralClick={async () => {
                    const result = await shareReferral('user123');
                    if (result.success) {
                        playSound('success');
                        triggerHaptic(HapticPatterns.success);
                        analytics.track('referral_shared', { method: result.method });
                        triggerXPGain(500, 'Referral Shared');
                    }
                }}
                onResetClick={handleReset}
                messagesLength={messages.length}
            />

            {/* Keyboard Shortcuts Help */}
            {showKeyboardHelp && (
                <div className="mx-6 mt-4 glass-card rounded-xl p-4 border border-amber-500/30 animate-in slide-in-from-top px-6 relative z-30">
                    <button onClick={() => setShowKeyboardHelp(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                    <KeyboardShortcutsHelp shortcuts={shortcuts} />
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">

                <div className="max-w-4xl mx-auto h-full overflow-y-auto px-6 py-8">
                    {/* Ad Placement: Top of Chat Content */}
                    <AdSense adSlot="chat-top-banner" adFormat="horizontal" />

                    {/* VIEW: CHAT */}
                    {activeView === 'chat' && (
                        <>
                            {hasMessages && userMessageCount >= 3 && (
                                <div className="mb-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <CouncilFeedback level={level.level} streak={streakData.currentStreak} />
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

                            <div className="space-y-8 relative">
                                {/* Vertical Connection Line */}
                                <div className="absolute left-6 top-0 bottom-0 w-px bg-emerald-500/10 hidden md:block" />

                                {messages.map((message, idx) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, x: message.role === 'coach' ? -20 : 20, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                        transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                                    >
                                        <ChatMessage
                                            message={message}
                                            targetLanguageName={targetLanguage.name}
                                            languageCode={`${targetLanguage.code}-${targetLanguage.code.toUpperCase()}`}
                                            onRegenerate={handleRegenerateLastResponse}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {isLoading && (
                                <div className="mt-8">
                                    <MessageSkeleton />
                                    <div className="flex items-center gap-2 mt-4 px-6 text-[10px] font-black text-emerald-500/40 uppercase tracking-widest animate-pulse">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Streaming Neural Feedback...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                            {/* Ad Placement: Bottom of Chat Content */}
                            <AdSense adSlot="chat-bottom" adFormat="auto" />
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
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Book className="w-8 h-8 text-emerald-400" />
                                    {targetLanguage?.name} Vocabulary Deck
                                </div>
                                {isStudying && (
                                    <button
                                        onClick={() => setIsStudying(false)}
                                        className="btn-ghost text-sm px-4 py-2"
                                    >
                                        Exit Study
                                    </button>
                                )}
                            </h2>

                            {isStudying ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-sm text-slate-500 mb-4 px-2">
                                        <span>Progress: {studyCardIndex + 1} / {vocabulary.filter(c => new Date(c.nextReviewDate) <= new Date()).length}</span>
                                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-300"
                                                style={{ width: `${((studyCardIndex + 1) / vocabulary.filter(c => new Date(c.nextReviewDate) <= new Date()).length) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {vocabulary.filter(c => new Date(c.nextReviewDate) <= new Date())[studyCardIndex] && (
                                        <FlashcardReview
                                            card={vocabulary.filter(c => new Date(c.nextReviewDate) <= new Date())[studyCardIndex]}
                                            onReview={(quality: number) => {
                                                const currentCard = vocabulary.filter(c => new Date(c.nextReviewDate) <= new Date())[studyCardIndex];
                                                updateVocabularyCard(currentCard.id, quality);
                                                playSound('success');

                                                if (studyCardIndex < vocabulary.filter(c => new Date(c.nextReviewDate) <= new Date()).length - 1) {
                                                    setStudyCardIndex(prev => prev + 1);
                                                } else {
                                                    setIsStudying(false);
                                                    setStudyCardIndex(0);
                                                    triggerXPGain(100, 'Vocabulary Session Complete');
                                                }
                                            }}
                                            onSpeak={(text: string, lang: string) => {
                                                // Simple speech synthesis for demo
                                                const utterance = new SpeechSynthesisUtterance(text);
                                                utterance.lang = lang === 'Spanish' ? 'es-ES' :
                                                    lang === 'French' ? 'fr-FR' :
                                                        lang === 'Japanese' ? 'ja-JP' : 'en-US';
                                                window.speechSynthesis.speak(utterance);
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <VocabularyDashboard
                                    cards={vocabulary}
                                    onStudy={() => {
                                        setIsStudying(true);
                                        setStudyCardIndex(0);
                                    }}
                                />
                            )}
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

            {/* Synapse Input Console */}
            {activeView === 'chat' && (
                <footer className="bg-slate-950/80 backdrop-blur-3xl border-t border-emerald-500/10 px-6 py-6 sticky bottom-0 z-40">
                    <div className="max-w-4xl mx-auto">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                        {hasMessages && (
                            <div className="mb-4">
                                <QuickReplies
                                    language={targetLanguage.name}
                                    level={skillLevel}
                                    onSelect={handleQuickReply}
                                />
                            </div>
                        )}

                        {/* Banner Ad: Chat Footer */}
                        {!isPremium && (
                            <AdSense
                                adSlot="chat-footer"
                                adFormat="horizontal"
                                className="my-2 opacity-50 grayscale hover:grayscale-0 transition-all rounded-lg"
                            />
                        )}

                        {/* Energy Display */}
                        {!isPremium && (
                            <div className="mb-4 flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Neural Energy</div>
                                    <div className="w-48 h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-500"
                                            style={{ width: `${(energy / 20) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-500">{energy}/20</div>
                                </div>
                                {energy < 5 && (
                                    <button
                                        onClick={() => setShowPremiumModal(true)}
                                        className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors"
                                    >
                                        Refill Energy
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex items-end gap-4 relative">
                            <div className="flex-1 relative group">
                                <div className="absolute -inset-0.5 bg-emerald-500/10 rounded-none blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        playSound('typing');
                                    }}
                                    onKeyDown={handleKeyPress}
                                    placeholder={`INTEGRATE SIGNAL [${targetLanguage.name}]...`}
                                    aria-label={`Message in ${targetLanguage.name}`}
                                    disabled={isLoading}
                                    rows={1}
                                    className="w-full bg-slate-900/50 border border-emerald-500/20 rounded-none px-6 py-4 text-emerald-50 placeholder-emerald-900 selection:bg-emerald-500/30 resize-none focus:outline-none focus:border-emerald-500/50 transition-all disabled:opacity-50 min-h-[60px] max-h-[150px] font-mono text-sm tracking-tight"
                                    maxLength={500}
                                />
                                <div className="absolute bottom-2 right-4 text-[8px] font-black text-emerald-500/20 uppercase tracking-widest">
                                    Terminal Input // v2.0
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <VoiceInput
                                    language={`${targetLanguage.code}-${targetLanguage.code.toUpperCase()}`}
                                    onTranscript={handleVoiceTranscript}
                                    disabled={isLoading}
                                />

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="px-8 py-4 bg-emerald-500 text-slate-950 font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale h-[60px] shadow-[0_0_20px_rgba(16,185,129,0.4)] relative group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                                    Transmit
                                </button>
                            </div>
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

            {/* Premium Modal */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onUnlock={() => setPremium(true)}
            />

            {!isPremium && (
                <ExitIntentModal
                    onClose={() => { }}
                    onClaim={() => { }}
                    title="WAIT! Language Mastery Awaits"
                    description="Don't lose your progress. Unlock Lifetime Access now for $29 and skip the energy limits forever."
                />
            )}

            {/* Cross-App Promotion */}
            <CrossPromo
                id="lc-to-ws"
                targetAppName="Worry Sorter"
                hook="Learning fatigue? Decrypt your mental noise and find clarity."
                cta="Sort My Worry"
                url="https://frontend-ruddy-five-18.vercel.app"
                icon={Wind}
                color="purple"
                isVisible={showWorryPromo}
                onClose={() => setShowWorryPromo(false)}
            />

            {/* AI Real-time Feedback */}
            {targetLanguage && <AICoachFeedback messages={messages} targetLanguage={targetLanguage.name} />}

            <footer className="mt-20 py-12 border-t border-slate-800 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                    <p>© 2026 MCJP Ecosystem | Precise. Powerful. Productive.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-blue-400 cursor-pointer transition-colors">Immersion Logs</span>
                        <span className="hover:text-blue-400 cursor-pointer transition-colors">Neural Sovereignty</span>
                        <span className="hover:text-blue-400 cursor-pointer transition-colors">API Health</span>
                    </div>
                </div>
            </footer>
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

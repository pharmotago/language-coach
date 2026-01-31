import { useState } from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { Module } from "@/types";
import Markdown from "react-markdown";
import confetti from "canvas-confetti";
import { useCourseStore } from "@/store/useCourseStore";

interface LessonExamProps {
    module: Module;
    onComplete: () => void;
}

export function LessonExam({ module, onComplete }: LessonExamProps) {
    const { saveJournalEntry, markDateComplete } = useCourseStore();

    // Exam Logic State
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [examCompleted, setExamCompleted] = useState(false);
    const [selectedScenarioOption, setSelectedScenarioOption] = useState<number | null>(null);
    const [scenarioFeedback, setScenarioFeedback] = useState<string | null>(null);
    const [auditChecks, setAuditChecks] = useState<boolean[]>([]);

    const handleScenarioSubmit = () => {
        if (selectedScenarioOption === null || !module.content.questions) return;

        const currentQuestion = module.content.questions[currentScenarioIndex];
        const isCorrect = selectedScenarioOption === currentQuestion.correctAnswer;

        if (isCorrect) {
            setScenarioFeedback(currentQuestion.explanation);
        } else {
            setScenarioFeedback("Incorrect. That is not the Stoic Dad way. Reflect and try again.");
        }
    };

    const handleNextScenario = () => {
        if (!module.content.questions) return;
        if (currentScenarioIndex < module.content.questions.length - 1) {
            setCurrentScenarioIndex(prev => prev + 1);
            setSelectedScenarioOption(null);
            setScenarioFeedback(null);
        } else {
            setExamCompleted(true);
            setAuditChecks(new Array(module.content.audit?.length || 0).fill(false));
        }
    };

    const handleAuditCheck = (index: number) => {
        const newChecks = [...auditChecks];
        newChecks[index] = !newChecks[index];
        setAuditChecks(newChecks);
    };

    const allAuditChecked = auditChecks.length > 0 && auditChecks.every(Boolean);

    const handleSecureLegacy = () => {
        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#fbbf24', '#ffffff'],
        });
        saveJournalEntry(module.id, "Legacy Secured: " + new Date().toLocaleDateString());
        markDateComplete();
        setTimeout(onComplete, 2000);
    };

    return (
        <div className="space-y-8">
            {!examCompleted ? (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-100">Simulated Scenario {currentScenarioIndex + 1} / {module.content.questions?.length}</h3>
                        <div className="text-xs font-mono text-slate-500">RESILIENCE TEST</div>
                    </div>

                    <div className="prose prose-invert mb-8 text-slate-300">
                        <Markdown>{module.content.questions![currentScenarioIndex].question}</Markdown>
                    </div>

                    <div className="space-y-3">
                        {module.content.questions![currentScenarioIndex].options.map((option, idx) => {
                            const isCorrectAnswer = idx === module.content.questions![currentScenarioIndex].correctAnswer;
                            let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";

                            if (scenarioFeedback) {
                                if (idx === selectedScenarioOption) {
                                    btnClass += isCorrectAnswer
                                        ? "border-green-500/50 bg-green-500/10 text-green-200"
                                        : "border-red-500/50 bg-red-500/10 text-red-200";
                                } else {
                                    btnClass += "border-slate-800 opacity-50 bg-slate-900";
                                }
                            } else {
                                btnClass += selectedScenarioOption === idx
                                    ? "border-amber-500 bg-amber-500/10 text-amber-100"
                                    : "border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300";
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={!!scenarioFeedback}
                                    onClick={() => setSelectedScenarioOption(idx)}
                                    className={btnClass}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {scenarioFeedback && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className={`p-4 rounded-lg mb-4 ${scenarioFeedback.startsWith("Correct") ? "bg-green-950/30 text-green-300 border border-green-900" : "bg-red-950/30 text-red-300 border border-red-900"}`}>
                                {scenarioFeedback}
                            </div>
                            {scenarioFeedback.startsWith("Correct") ? (
                                <button
                                    onClick={handleNextScenario}
                                    className="w-full bg-slate-100 text-slate-900 font-bold py-3 rounded-xl hover:bg-white"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setSelectedScenarioOption(null); setScenarioFeedback(null); }}
                                    className="w-full bg-slate-800 text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-700"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    )}

                    {!scenarioFeedback && (
                        <button
                            onClick={handleScenarioSubmit}
                            disabled={selectedScenarioOption === null}
                            className="mt-8 w-full bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all"
                        >
                            Confirm Action
                        </button>
                    )}
                </div>
            ) : (
                // AUDIT / COMPLETION
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="text-center mb-8">
                        <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-slate-100">Legacy Check</h2>
                        <p className="text-slate-400 mt-2">Make the pact. Seal your training.</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {module.content.audit?.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleAuditCheck(idx)}
                                className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${auditChecks[idx] ? "bg-amber-950/20 border-amber-500/50 text-amber-100" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"}`}
                            >
                                <div className={`mt-0.5 mr-4 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${auditChecks[idx] ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600"}`}>
                                    {auditChecks[idx] && <CheckCircle className="w-3.5 h-3.5" />}
                                </div>
                                <span className="text-sm font-medium leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSecureLegacy}
                        disabled={!allAuditChecked}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        SECURE MY LEGACY
                    </button>
                </div>
            )}
        </div>
    );
}

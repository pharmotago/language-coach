import { AlertCircle } from "lucide-react";
import { useCourseStore } from "@/store/useCourseStore";

export function PanicButton() {
    const { setPanicMode } = useCourseStore();

    return (
        <button
            onClick={() => setPanicMode(true)}
            className="fixed bottom-6 right-6 z-40 bg-red-500/90 hover:bg-red-600 text-white p-4 rounded-full shadow-lg shadow-red-500/30 transition-all hover:scale-110 active:scale-95 group"
            aria-label="Panic Button: Emergency De-escalation"
        >
            <AlertCircle className="w-6 h-6 animate-pulse group-hover:animate-none" />
        </button>
    );
}

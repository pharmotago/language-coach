import { Module } from "@/lib/schemas";

export const module10: Module = {
    id: 10,
    title: "The Final Exam",
    summary: "Operational Readiness Assessment.",
    isLocked: true,
    readTime: 10,
    badge: "trophy",
    content: {
        full_lesson_content: "🏁 The Last Step\n\nYou have walked the path of the Stoic Dad from the Dichotomy of Control to the Legacy of Wisdom. Now, we test your readiness. 🥋\n\nThis assessment covers all four cardinal virtues: Courage, Temperance, Justice, and Wisdom. It will test your ability to apply these ancient principles to the modern chaos of fatherhood.\n\nAnswer not with what is easy, but with what is necessary. 🛡️",
        questions: [
            {
                question: "1️⃣ Scenario 1: The Public Meltdown (Courage/Control)\n\nYou are in a crowded supermarket. 🛒 Your 3-year-old demands candy. 🍭 You say no. They scream, kick, and knock over a display. Strangers stare. 👀 \n\n🤔 What is your immediate next move?",
                options: [
                    "Immediately pick the child up and sternly tell them to stop embarrassing the family.",
                    "Feel the anger, identify the Amygdala hijack, pause, and drop to one knee to connect before ignoring the crowd.",
                    "Negotiate: 'If you stop crying, you can have the candy, but this is the last time.'",
                    "Ignore the child completely and continue paying to show them their behavior has no power."
                ],
                correctAnswer: 1,
                explanation: "Correct. A is reactive (Ego). C is rewarding terrorism. D is passive. B utilizes the Tactical Pause and engages the Prefrontal Cortex. ✅"
            },
            {
                question: "2️⃣ Scenario 2: The Wet Socks (Wisdom/Perspective)\n\nFamily camping trip. Rain. 🌧️ 7-year-old steps in a puddle, soaks sneakers, and whines: 'I'm freezing! Take me home!'\n\n🤔 What is the Stoic Dad response?",
                options: [
                    "Oh no, I'm so sorry buddy. Let me carry you back to the tent.",
                    "Stop complaining. It's just water. Back in my day we walked uphill both ways.",
                    "Internal: 'This is training.' External: 'I know it is uncomfortable. You are tough enough to handle it. Keep moving.'",
                    "Get angry at them for ruining the vibe of the trip."
                ],
                correctAnswer: 2,
                explanation: "Correct. A is Lawnmower parenting. B is dismissive. D is fragile. C validates without fixing and reframes it as resilience training. 💪"
            },
            {
                question: "3️⃣ Scenario 3: The Broken Vase (Justice/Fairness)\n\nYou come home to find your favorite vase shattered. 🏺 Your two children are blaming each other. You are exhausted.\n\n🤔 What does the Just Patriarch do?",
                options: [
                    "Punish both of them to ensure the guilty party is caught.",
                    "Yell 'I don't care who did it, just clean it up!' and go to your room.",
                    "Calmly investigate without anger, giving both a fair hearing, and focus on the solution (cleaning up) rather than the blame.",
                    "Assume the older one did it because they should know better."
                ],
                correctAnswer: 2,
                explanation: "Justice requires fairness and a focus on restoration rather than retribution. Reacting in anger violates the virtue. ⚖️"
            },
            {
                question: "4️⃣ Scenario 4: The Buffet (Temperance)\n\nYou assume the role of 'vacation dad'. There is an all-you-can-eat buffet and open bar. 🍺 You are tempted to overindulge because 'you earned it'.\n\n🤔 How do you exercise Temperance?",
                options: [
                    "Eat and drink everything; Stoicism is for work days.",
                    "Enjoy the food and drink but stop before you are full or drunk, maintaining your faculties to lead your family.",
                    "Eat only bread and water to show your dominance over pleasure.",
                    "Complain about the gluttony of modern society."
                ],
                correctAnswer: 1,
                explanation: "Temperance is not self-flagellation; it is the golden mean. Enjoying without being enslaved is the mark of a Master. 🍷"
            },
            {
                question: "5️⃣ Scenario 5: The Chaos (Synthesis)\n\n10-hour workday. Exhausted. House is a disaster. Kids fighting. Instinct is to roar 'QUIET!' 🦁\n\n🤔 Before you speak, what mental protocol do you execute?",
                options: [
                    "The Dichotomy of Control",
                    "The View From Above",
                    "Memento Mori",
                    "All of the above"
                ],
                correctAnswer: 3,
                explanation: "Correct. The advanced Stoic Dad layers these protocols simultaneously to achieve instant calm. 🧘‍♂️"
            }
        ],
        audit: [
            "I understand that my children’s behavior is outside of my control; my reaction to their behavior is fully within my control. 🎮",
            "I accept that anger is a temporary madness and a sign of weakness, not strength. I commit to using the 'Tactical Pause' before reacting. ⏸️",
            "I will not be a 'Lawnmower Parent.' I will allow my children to experience voluntary discomfort to build their antifragility. 🚜",
            "I acknowledge that my time with my children is finite. I will use the awareness of death (Memento Mori) to fuel presence in life. ⏳",
            "I am no longer a victim of my moods. I am the master of my mind. I am a Stoic Dad. 🗿"
        ],

        challenge: "Congratulations. You have completed the curriculum. Your final challenge is life itself. Go be the rock your family needs. 🏔️"
    }
};

"use client";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const parts = [
  {
    id: 1,
    title: "Construct a Definition of Artificial Intelligence",
    lessons: [
      { id: 1, title: "Identify Common Applications of Artificial Intelligence", completed: false, quiz: false },
      { id: 2, title: "Familiarize Yourself With Key Concepts Associated with AI", completed: false, quiz: false },
      { id: 3, title: "See Beyond the Myths: Discover the True Power of AI", completed: false, quiz: false },
      { id: 4, title: "Quiz : Construct a Definition of Artificial Intelligence", completed: true, quiz: true },
    ],
  },
  {
    id: 2,
    title: "Discover the Societal Impact of Artificial Intelligence",
    lessons: [
      { id: 1, title: "Discover the Opportunities Offered by Artificial Intelligence", completed: false, quiz: false },
      { id: 2, title: "Identify Artificial Intelligence Safety Concerns", completed: false, quiz: false },
      { id: 3, title: "Explore AI's Impact on the Job Market", completed: false, quiz: false },
      { id: 4, title: "Quiz : Societal Impact of AI", completed: false, quiz: true },
    ],
  },
  {
    id: 3,
    title: "Go Behind the Scenes of an AI Project",
    lessons: [
      { id: 1, title: "Understand the Stages of an AI Project", completed: false, quiz: false },
      { id: 2, title: "Identify the Key Players in an AI Project", completed: false, quiz: false },
      { id: 3, title: "Quiz : AI Project Management", completed: false, quiz: true },
    ],
  },
];

export default function CourseTableOfContents() {
  return (
    <div className="bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300 py-10">
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">Table des matières</h2>
        <Separator className="bg-zinc-200 dark:bg-zinc-800 mb-8" />
        <div className="space-y-8">
          {parts.map((part) => (
            <div key={part.id}>
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 mb-0">
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-emerald-600 dark:text-emerald-400 mb-1">Partie {part.id}</p>
                <p className="text-sm font-bold text-black dark:text-white">{part.title}</p>
              </div>
              <div className="ml-6 relative">
                <div className="absolute left-[26px] top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
                {part.lessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-4 pl-0 relative">
                    <div className="relative z-10 flex-shrink-0">
                      {lesson.completed ? (
                        <div className="w-[52px] h-[52px] flex items-center justify-center">
                          <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                        </div>
                      ) : (
                        <div className="w-[52px] h-[52px] flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 bg-white dark:bg-black">
                            {lesson.id}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={`text-sm leading-snug ${lesson.completed ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer transition-colors"}`}>
                      {lesson.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Plus, Send, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type TResponse = {
    proposition: string,
    isCorrect: boolean
}
interface IQuestion {
    question: string,
    responses: TResponse[]
}
type IQuiz = IQuestion[]

const mock: IQuestion[] = [
    {
        question: "Who is Felix Warano ?",
        responses: [
            {
                proposition: "An software ingenieer",
                isCorrect: false
            }
        ]
    }
]

function Quiz() {
    const [loading, setLoading] = useState(false)
    const [quizs, setQuiz] = useState<IQuiz>(mock)
    const handleSubmit = async () => {
        setLoading(true)
    }
    const addProposition = (id: number) => {
        const lastOne = quizs[id].responses[Math.min(quizs[id].responses.length - 1, 0)].proposition
        if (!lastOne.length) return toast.error("Please provide the previous proposition first")
        setQuiz(q => q.map((e, idx) => idx == id ? { ...e, responses: [...e.responses, { proposition: "", isCorrect: false }] } : e))
    }
    const addQuestion = () => {
        const lastQuestion = quizs[quizs.length - 1]
        if (!lastQuestion.question.length) return toast.error("Please topic for  the previous question", { position: "top-center" })
        const hasCorrect = lastQuestion.responses.some(e => e.isCorrect)
        if (hasCorrect) return toast.error("Chosse the correct answer in the previous question ", { position: "top-center" })
        setQuiz(q => [...q, { question: "", responses: [{ proposition: "", isCorrect: false }] }])
    }
    return (
        <div className="flex flex-col h-full">
            <div className="border-b px-2 py-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-base font-semibold mb-4">Create quiz</h1>
                    <p>Create new quiz to ensure students have been understand previous lesson</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto px-2 space-y-4 py-8">
                    {
                        quizs.map((quiz, idx) => (
                            <section key={idx} className="space-y-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor={`question-${idx}`}>Question {idx + 1}<span className="text-destructive">*</span></Label>
                                    <Input id={`question-${idx}`} onChange={(el) => setQuiz(q => q.map((e, o) => o != idx ? e : ({ ...e, question: el.target.value })))} value={quiz.question} placeholder="e.g. Who is Felix Warano ? " />
                                </div>

                                <div className="pl-4 space-y-2">
                                    {
                                        quiz.responses.map((response, id) => (
                                            <div key={id} className="space-y-2">
                                                <Label htmlFor={`proposition-${id + 1}`} >Proposition {id + 1}<span className="text-destructive">*</span></Label>
                                                <div key={id} className="flex justify-between gap-2">
                                                    <Input id={`proposition-${id + 1}`} value={response.proposition} onChange={(el) => setQuiz(q => q.map((e, ids) => ids == id ? { ...e, responses: e.responses.map((r, t) => t == id ? { ...r, proposition: el.target.value } : r) } : e))} placeholder="e.g. An Software ingenieur " />
                                                    <div className="flex gap-1">
                                                        <Button onClick={() => setQuiz(q => q.map((e, ids) => ids == id ? { ...e, responses: e.responses.map((r, t) => t == id ? { ...r, isCorrect: !r.isCorrect } : r) } : e))} variant={response.isCorrect ? "default" : "outline"}><Check /> </Button>
                                                        {
                                                            quiz.responses.length > 1 && <Button onClick={() => setQuiz(q => q.map((e, ids) => ids == id ? { ...e, responses: e.responses.filter((_, t) => t != id) } : e))} variant={"ghost"}><X /> </Button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <Button variant="outline" size="sm" onClick={() => addProposition(idx)} className="gap-1.5">
                                        <Plus className="size-3.5" />
                                        Add Proposition
                                    </Button>
                                </div>
                                {
                                    idx == quizs.length - 1 && <Button variant="outline" size="sm" onClick={() => addQuestion()} className="gap-1.5">
                                        <Plus className="size-3.5" />
                                        Add Question
                                    </Button>
                                }
                            </section>
                        ))
                    }
                </div>
            </div>

            <div className="border-t px-6 py-3">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Button size="sm" onClick={handleSubmit} disabled={loading} className="gap-1.5">
                        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default Quiz
"use client";
import { ArrowLeft, BarChart2, Clock, BookOpen, Users, Star, Play, CheckCircle ,Lightbulb} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CourseTableOfContents from "./TableOfContents";

const instructors = [
  { name: "Sarah Mitchell", role: "AI Research Lead" },
  { name: "James Okoro", role: "ML Engineer" },
];

const objectives = [
  "Comprendre les bases de l'IA",
  "Distinguer ML et Deep Learning",
  "Évaluer les risques et opportunités",
  "Mener un projet IA de bout en bout",
];


export default function CourseOverview() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-10">
          <ArrowLeft size={16} />
          Tous les cours
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">Data</span>
              <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-black dark:text-white">
                Destination AI: Introduction to Artificial Intelligence
              </h1>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xl">
                In this course, you will discover what artificial intelligence really is — beyond the myths. You will understand its potential, its risks, and its impact on the workplace. You will go behind the scenes of an AI project and explore two of its sub-disciplines: machine learning and deep learning.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <BarChart2 size={15} className="text-emerald-500" />
                <span>Facile</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Clock size={15} className="text-emerald-500" />
                <span>6 heures</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <BookOpen size={15} className="text-emerald-500" />
                <span>25 leçons</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Users size={15} className="text-emerald-500" />
                <span>12 430 apprenants</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-black dark:text-white font-semibold">4.8</span>
                <span>(2.1k avis)</span>
              </div>
            </div>
            <Separator className="bg-zinc-100 dark:bg-zinc-800" />
            <div>
              <h2 className="text-base font-semibold mb-4 text-black dark:text-white">Instructeurs</h2>
              <div className="flex gap-5">
                {instructors.map((i) => (
                  <div key={i.name} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{i.name}</p>
                      <p className="text-xs text-zinc-400">{i.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
              <div className="relative w-full aspect-video bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur flex items-center justify-center border border-white/30 dark:border-white/10">
                  <Play size={22} className="text-white ml-1" />
                </div>
              </div>
              <div className="p-5 bg-white dark:bg-zinc-900 space-y-4">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Progression</p>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[12%] bg-emerald-500 rounded-full" />
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">12% complété</p>
                </div>
                <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl font-semibold text-sm h-11 transition-colors">
                  Continuer le cours
                </Button>
                <p className="text-xs text-center text-zinc-400">Accès libre · Aucun prérequis</p>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 space-y-3">
              <h3 className="text-sm font-semibold text-black dark:text-white">Ce que vous apprendrez</h3>
              {objectives.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300 py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Objectifs pédagogiques</h2>
          <Separator className="bg-zinc-200 dark:bg-zinc-800 mb-8" />
          <div className="flex items-start justify-between gap-8">
            <div className="space-y-5 flex-1">
              {objectives.map((obj) => (
                <div key={obj} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full border border-emerald-600 dark:border-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={15} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{obj}</p>
                </div>
              ))}
            </div>
            <div className="w-44 h-44 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse flex-shrink-0" />
          </div>
        </div>
        <div className="flex items-start gap-8">
          <div className="w-36 h-36 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Prérequis</h2>
            <Separator className="bg-zinc-200 dark:bg-zinc-800 mb-5" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This course is for anyone who wants to know what artificial intelligence is, understand how it works, and learn more about it. There are no prerequisites. 😊
            </p>
          </div>
        </div>
      </div>
    </div>

      <CourseTableOfContents />

      <div className=" left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          <div className="w-24 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-emerald-600 dark:text-emerald-400 mb-0.5">Data</p>
            <p className="text-sm font-bold text-black dark:text-white truncate">Destination AI: Introduction to Artificial Intelligence</p>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <BarChart2 size={13} className="text-emerald-500" />
                <span>Facile</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Clock size={13} className="text-emerald-500" />
                <span>6 heures</span>
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" />
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Cours en libre accès</p>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-sm px-6 h-9 transition-colors">
              Commencer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useMemo, useEffect } from 'react';
import { ExamClient } from '@/components/exam/ExamClient';
import { SubjectSelection } from '@/components/exam/SubjectSelection';
import { ExamCustomization, type ExamConfig } from '@/components/exam/ExamCustomization';
import type { Question } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import allQuestions from '@/lib/questions.json';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('subjectSelection');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);

  useEffect(() => {
    // In a real app, you might fetch this data. For now, we'll use the imported JSON.
    setQuestions(allQuestions.questions as Question[]);
    setLoading(false);
  }, []);

  const subjects = useMemo(() => [...new Set(questions.map(q => q.subject))], [questions]);

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentScreen('examCustomization');
  };

  const handleStartExam = (config: ExamConfig) => {
    let filteredQuestions = questions.filter(q => q.subject === selectedSubject);

    // Filter by difficulty
    if (config.difficulties.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => config.difficulties.includes(q.difficulty));
    }

    // Filter by chapter
    if (config.chapters.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => {
        return q.chapter && config.chapters.includes(q.chapter);
      });
    }
    
    // Sort questions
    if (config.questionOrder === 'easy-first') {
      filteredQuestions.sort((a, b) => {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });
    } else if (config.questionOrder === 'hard-first') {
      filteredQuestions.sort((a, b) => {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      });
    } else { // mixed
      // Create a copy of the array before sorting to avoid modifying the original
      let tempQuestions = [...filteredQuestions];
      tempQuestions.sort(() => Math.random() - 0.5);
      filteredQuestions = tempQuestions;
    }
    
    // Limit number of questions
    const finalQuestions = filteredQuestions.slice(0, config.numQuestions);

    setExamQuestions(finalQuestions);
    setExamConfig(config);
    setCurrentScreen('exam');
  };

  const handleRestart = () => {
    setCurrentScreen('subjectSelection');
    setSelectedSubject(null);
    setExamQuestions([]);
    setExamConfig(null);
  }
  
  const handleBackToSubject = () => {
    setCurrentScreen('subjectSelection');
    setSelectedSubject(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading questions...</p>
      </div>
    );
  }

  if (currentScreen === 'subjectSelection') {
    return <SubjectSelection subjects={subjects} onSubjectSelect={handleSubjectSelect} />;
  }

  if (currentScreen === 'examCustomization' && selectedSubject) {
    return <ExamCustomization 
              subject={selectedSubject} 
              questions={questions}
              onStartExam={handleStartExam} 
              onBack={handleBackToSubject} 
           />;
  }
  
  if (currentScreen === 'exam' && examConfig) {
    return <ExamClient questions={examQuestions} totalTime={examConfig.totalTime * 60} onRestart={handleRestart} />;
  }

  return null;
}

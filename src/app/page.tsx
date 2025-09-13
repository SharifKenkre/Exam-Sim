"use client";

import { useState } from 'react';
import { ExamClient } from '@/components/exam/ExamClient';
import { SubjectSelection } from '@/components/exam/SubjectSelection';
import { ExamCustomization, type ExamConfig } from '@/components/exam/ExamCustomization';
import { questions as allQuestions } from '@/lib/questions';
import type { Question } from '@/lib/types';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('subjectSelection');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);

  const subjects = [...new Set(allQuestions.map(q => q.subject))];

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentScreen('examCustomization');
  };

  const handleStartExam = (config: ExamConfig) => {
    let filteredQuestions = allQuestions.filter(q => q.subject === selectedSubject);

    // Filter by difficulty
    if (config.difficulties.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => config.difficulties.includes(q.difficulty));
    }

    // Filter by chapter
    if (config.chapters.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => config.chapters.includes(q.chapter));
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
      filteredQuestions.sort(() => Math.random() - 0.5);
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

  if (currentScreen === 'subjectSelection') {
    return <SubjectSelection subjects={subjects} onSubjectSelect={handleSubjectSelect} />;
  }

  if (currentScreen === 'examCustomization' && selectedSubject) {
    const availableChapters = [...new Set(allQuestions.filter(q => q.subject === selectedSubject).map(q => q.chapter))];
    const maxQuestions = allQuestions.filter(q => q.subject === selectedSubject).length;
    return <ExamCustomization subject={selectedSubject} chapters={availableChapters} maxQuestions={maxQuestions} onStartExam={handleStartExam} onBack={handleBackToSubject} />;
  }
  
  if (currentScreen === 'exam' && examConfig) {
    return <ExamClient questions={examQuestions} totalTime={examConfig.totalTime * 60} onRestart={handleRestart} />;
  }

  return null;
}

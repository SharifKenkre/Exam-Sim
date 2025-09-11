"use client";

import { useState } from 'react';
import { ExamClient } from '@/components/exam/ExamClient';
import { SubjectSelection } from '@/components/exam/SubjectSelection';
import { questions as allQuestions } from '@/lib/questions';
import type { Question } from '@/lib/types';

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);

  const subjects = [...new Set(allQuestions.map(q => q.subject))];

  const handleSubjectSelect = (subject: string) => {
    const filteredQuestions = allQuestions.filter(q => q.subject === subject);
    setExamQuestions(filteredQuestions);
    setSelectedSubject(subject);
  };

  const handleRestart = () => {
    setSelectedSubject(null);
    setExamQuestions([]);
  }

  if (!selectedSubject) {
    return <SubjectSelection subjects={subjects} onSubjectSelect={handleSubjectSelect} />;
  }

  return <ExamClient questions={examQuestions} totalTime={3600} onRestart={handleRestart} />;
}

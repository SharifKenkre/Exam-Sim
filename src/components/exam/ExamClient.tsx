"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Question, AnswerStatus } from '@/lib/types';
import ExamHeader from '@/components/exam/ExamHeader';
import QuestionPanel from '@/components/exam/QuestionPanel';
import NavigationPanel from '@/components/exam/NavigationPanel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

interface ExamClientProps {
  questions: Question[];
  totalTime: number; // in seconds
}

export function ExamClient({ questions, totalTime }: ExamClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerStatus>>(() => {
    const initialAnswers = new Map<number, AnswerStatus>();
    questions.forEach(q => {
      initialAnswers.set(q.id, {
        answer: null,
        isMarkedForReview: false,
        isVisited: false,
      });
    });
    // Mark first question as visited
    const firstQuestionStatus = initialAnswers.get(questions[0].id);
    if(firstQuestionStatus) {
      initialAnswers.set(questions[0].id, { ...firstQuestionStatus, isVisited: true });
    }
    return initialAnswers;
  });
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isExamFinished, setIsExamFinished] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || isExamFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isExamFinished]);

  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      const questionStatus = newAnswers.get(questions[index].id);
      if (questionStatus) {
        newAnswers.set(questions[index].id, { ...questionStatus, isVisited: true });
      }
      return newAnswers;
    });
  }, [questions]);
  
  const updateAnswer = (questionId: number, answer: string | null, isMarkedForReview: boolean) => {
    setAnswers(prev => {
        const newAnswers = new Map(prev);
        const currentStatus = newAnswers.get(questionId) || { answer: null, isMarkedForReview: false, isVisited: false };
        newAnswers.set(questionId, { ...currentStatus, answer, isMarkedForReview, isVisited: true });
        return newAnswers;
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      handleQuestionSelect(currentQuestionIndex + 1);
    }
  };

  const handleFinishExam = () => {
    setIsExamFinished(true);
  };
  
  if (isExamFinished) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-3xl font-bold mb-4">Exam Submitted</h1>
            <p className="text-muted-foreground">Thank you for completing the exam.</p>
            {/* Here you could show a summary of results */}
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerStatus = answers.get(currentQuestion.id) || { answer: null, isMarkedForReview: false, isVisited: false };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <ExamHeader />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <QuestionPanel
            question={currentQuestion}
            answerStatus={currentAnswerStatus}
            onAnswerUpdate={updateAnswer}
            onNext={goToNextQuestion}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </main>
        <aside className="w-full md:w-[350px] lg:w-[400px] border-t md:border-t-0 md:border-l border-border p-4 md:p-6 flex flex-col gap-6 overflow-y-auto">
          <NavigationPanel
            questions={questions}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={handleQuestionSelect}
            timeLeft={timeLeft}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="accent" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Submit Exam</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to submit the exam?</AlertDialogTitle>
                <AlertDialogDescription>
                    You will not be able to change your answers after submitting. Please review your answers before proceeding.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFinishExam}>Submit</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </aside>
      </div>
    </div>
  );
}

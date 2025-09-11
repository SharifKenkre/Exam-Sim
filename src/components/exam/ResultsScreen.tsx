"use client";

import React, { useMemo } from 'react';
import type { Question, AnswerStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Minus } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsScreenProps {
  questions: Question[];
  answers: Map<number, AnswerStatus>;
  onRestart: () => void;
}

const COLORS = {
  correct: 'hsl(var(--success))',
  incorrect: 'hsl(var(--destructive))',
  skipped: 'hsl(var(--muted-foreground))',
};

export default function ResultsScreen({ questions, answers, onRestart }: ResultsScreenProps) {
  const { score, correct, incorrect, skipped } = useMemo(() => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    questions.forEach(q => {
      const answerStatus = answers.get(q.id);
      const userAnswer = answerStatus?.answer;

      if (userAnswer === null || userAnswer === undefined || userAnswer.trim() === '') {
        skipped++;
        // score is unchanged (0)
      } else if (userAnswer === q.correctAnswer) {
        score += 4;
        correct++;
      } else {
        score -= 1;
        incorrect++;
      }
    });

    return { score, correct, incorrect, skipped };
  }, [questions, answers]);

  const totalQuestions = questions.length;
  const maxScore = totalQuestions * 4;
  
  const chartData = [
    { name: 'Correct', value: correct },
    { name: 'Incorrect', value: incorrect },
    { name: 'Skipped', value: skipped },
  ];

  const chartColors = [COLORS.correct, COLORS.incorrect, COLORS.skipped];


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-4xl shadow-2xl animate-in fade-in-50 zoom-in-95">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold">Exam Results</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center">
                <p className="text-muted-foreground text-lg">Your Score</p>
                <p className="text-6xl font-bold text-primary">{score}</p>
                <p className="text-muted-foreground">out of {maxScore}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center w-full max-w-sm">
                <div>
                    <p className="text-sm text-muted-foreground">Correct</p>
                    <p className="text-2xl font-semibold text-success flex items-center justify-center gap-1"><Check className="w-5 h-5"/>{correct}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Incorrect</p>
                    <p className="text-2xl font-semibold text-destructive flex items-center justify-center gap-1"><X className="w-5 h-5"/>{incorrect}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Skipped</p>
                    <p className="text-2xl font-semibold text-muted-foreground flex items-center justify-center gap-1"><Minus className="w-5 h-5"/>{skipped}</p>
                </div>
            </div>
          </div>
          <div className="relative h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <Button onClick={onRestart} size="lg">Take Another Exam</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

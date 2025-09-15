"use client";

import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { intelligentAnswerCheck, IntelligentAnswerCheckOutput } from '@/ai/flows/intelligent-answer-checking';
import type { Question, AnswerStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QuestionPanelProps {
  question: Question;
  questionNumber: number;
  answerStatus: AnswerStatus;
  onAnswerUpdate: (questionId: number, answer: string | null, isMarkedForReview: boolean) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const AIPoweredCheck = ({ question, onAnswerUpdate }: { question: Question; onAnswerUpdate: (answer: string) => void }) => {
    const [answer, setAnswer] = useState('');
    const [isChecking, startChecking] = useTransition();
    const [result, setResult] = useState<IntelligentAnswerCheckOutput | null>(null);
    const { toast } = useToast();

    const handleCheck = () => {
        if (!answer.trim()) {
            toast({
                title: 'No answer provided',
                description: 'Please enter your answer before checking.',
                variant: 'destructive',
            });
            return;
        }

        startChecking(async () => {
            try {
                const checkResult = await intelligentAnswerCheck({
                    studentAnswer: answer,
                    expectedAnswer: question.correctAnswer,
                    subject: question.subject,
                });
                setResult(checkResult);
                onAnswerUpdate(answer);
            } catch (error) {
                console.error('AI check failed:', error);
                toast({
                    title: 'Error',
                    description: 'Could not check the answer. Please try again.',
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <div className="space-y-4">
            <Textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[120px]"
            />
            <Button onClick={handleCheck} disabled={isChecking}>
                {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Answer with AI
            </Button>
            {result && (
                <Alert variant={result.isCorrect ? 'default' : 'destructive'} className={result.isCorrect ? 'bg-success/10 border-success/50' : ''}>
                    {result.isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <AlertTitle>{result.isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
                    <AlertDescription>{result.explanation}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default function QuestionPanel({ question, questionNumber, answerStatus, onAnswerUpdate, onNext, isLastQuestion }: QuestionPanelProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(answerStatus.answer);
  const [isMarked, setIsMarked] = useState(answerStatus.isMarkedForReview);

  useEffect(() => {
    setSelectedAnswer(answerStatus.answer);
    setIsMarked(answerStatus.isMarkedForReview);
  }, [question.id, answerStatus]);

  const handleSave = (andNext: boolean, markForReview: boolean) => {
    onAnswerUpdate(question.id, selectedAnswer, markForReview);
    if (andNext) onNext();
  };

  const handleClear = () => {
    setSelectedAnswer(null);
    onAnswerUpdate(question.id, null, isMarked);
  };
  
  return (
    <Card className="h-full flex flex-col transition-all duration-300 animate-in fade-in-50" key={question.id}>
      <CardHeader>
        <h2 className="text-xl font-semibold">Question {questionNumber}</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">{question.text}</p>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {question.image && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <Image src={question.image} alt={`Reference for question ${question.id}`} layout="fill" objectFit="contain" data-ai-hint="diagram chart" />
          </div>
        )}
        {question.type === 'MCQ' && question.options && (
          <RadioGroup value={selectedAnswer || ''} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Label key={index} className="flex items-center space-x-3 p-3 rounded-md border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <span>{option}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        )}
        {question.type === 'Subjective' && (
            <AIPoweredCheck question={question} onAnswerUpdate={(ans) => setSelectedAnswer(ans)} />
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center gap-4 border-t pt-6">
        <div className="flex items-center space-x-2">
            <Checkbox id="mark-review" checked={isMarked} onCheckedChange={(checked) => setIsMarked(!!checked)} />
            <Label htmlFor="mark-review">Mark for Review</Label>
        </div>
        <div className="flex-1 flex justify-end gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleClear}>Clear Response</Button>
            <Button variant="secondary" onClick={() => handleSave(false, true)}>Save & Mark for Review</Button>
            <Button onClick={() => handleSave(true, isMarked)}>
              {isLastQuestion ? 'Save' : 'Save & Next'}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

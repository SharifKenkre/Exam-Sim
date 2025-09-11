"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Question, AnswerStatus } from '@/lib/types';
import { CheckCircle, Circle, Bookmark, AlertCircle } from 'lucide-react';

interface NavigationPanelProps {
  questions: Question[];
  answers: Map<number, AnswerStatus>;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  timeLeft: number;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const getStatusStyles = (status: AnswerStatus | undefined, isCurrent: boolean) => {
  let styles = 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
  let Icon = null;

  if (status) {
    const isAnswered = status.answer !== null && status.answer.trim() !== '';
    if (isAnswered && status.isMarkedForReview) {
      styles = 'bg-review text-review-foreground hover:bg-review/90';
      Icon = <Bookmark className="w-3 h-3 absolute top-0.5 right-0.5" />;
    } else if (isAnswered) {
      styles = 'bg-success text-success-foreground hover:bg-success/90';
    } else if (status.isMarkedForReview) {
      styles = 'bg-review text-review-foreground hover:bg-review/90';
    } else if (status.isVisited) {
      styles = 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
    }
  }

  if (isCurrent) {
    styles += ' ring-2 ring-primary ring-offset-2 ring-offset-background';
  }
  
  return { styles, Icon };
};

const LegendItem = ({ icon: Icon, colorClass, text }: { icon: React.ElementType, colorClass: string, text: string }) => (
    <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-xs text-muted-foreground">{text}</span>
    </div>
);

export default function NavigationPanel({
  questions,
  answers,
  currentQuestionIndex,
  onQuestionSelect,
  timeLeft,
}: NavigationPanelProps) {
  return (
    <Card className="w-full flex-1 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Time Left</CardTitle>
          <div className="text-lg font-mono font-semibold bg-muted px-3 py-1 rounded-md">
            {formatTime(timeLeft)}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col flex-1 pt-4">
        <div className="mb-4">
            <h3 className="font-semibold mb-3 text-sm">Legend</h3>
            <div className="grid grid-cols-2 gap-2">
                <LegendItem icon={CheckCircle} colorClass="text-success" text="Answered" />
                <LegendItem icon={AlertCircle} colorClass="text-destructive" text="Not Answered" />
                <LegendItem icon={Bookmark} colorClass="text-review" text="Marked for Review" />
                <LegendItem icon={Circle} colorClass="text-muted-foreground" text="Not Visited" />
            </div>
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto pt-4 -mx-2 px-2">
          <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {questions.map((q, index) => {
              const status = answers.get(q.id);
              const { styles, Icon } = getStatusStyles(status, index === currentQuestionIndex);
              return (
                <Button
                  key={q.id}
                  variant="default"
                  size="icon"
                  className={`relative h-9 w-9 ${styles}`}
                  onClick={() => onQuestionSelect(index)}
                >
                  {index + 1}
                  {Icon}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

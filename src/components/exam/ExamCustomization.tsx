"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Difficulty, Question } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ExamConfig {
  numQuestions: number;
  totalTime: number; // in minutes
  difficulties: Difficulty[];
  questionOrder: 'easy-first' | 'hard-first' | 'mixed';
  chapters: string[];
}

interface ExamCustomizationProps {
  subject: string;
  questions: Question[];
  onStartExam: (config: ExamConfig) => void;
  onBack: () => void;
}

const difficultyLevels: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export function ExamCustomization({ subject, questions, onStartExam, onBack }: ExamCustomizationProps) {
  const [numQuestions, setNumQuestions] = useState(10);
  const [totalTime, setTotalTime] = useState(30);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [questionOrder, setQuestionOrder] = useState<'easy-first' | 'hard-first' | 'mixed'>('mixed');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [openChapterSelector, setOpenChapterSelector] = useState(false);

  const availableChapters = useMemo(() => 
    [...new Set(questions
      .filter(q => q.subject === subject && q.chapter)
      .map(q => q.chapter!)
    )], 
  [subject, questions]);

  const maxQuestions = useMemo(() => {
    return questions.filter(q => {
      const subjectMatch = q.subject === subject;
      const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(q.difficulty);
      const chapterMatch = selectedChapters.length === 0 || (q.chapter && selectedChapters.includes(q.chapter));
      return subjectMatch && difficultyMatch && chapterMatch;
    }).length;
  }, [subject, selectedDifficulties, selectedChapters, questions]);
  
  // Adjust numQuestions if it exceeds the new maxQuestions
  React.useEffect(() => {
    setNumQuestions(Math.min(10, maxQuestions));
  }, [maxQuestions]);

  React.useEffect(() => {
    if (numQuestions > maxQuestions) {
      setNumQuestions(maxQuestions);
    }
  }, [maxQuestions, numQuestions]);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty) 
        : [...prev, difficulty]
    );
  };
  
  const handleChapterSelect = (chapter: string) => {
    setSelectedChapters(prev => {
      const newSelected = prev.includes(chapter)
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter];
      return newSelected;
    });
  };

  const handleStartClick = () => {
    onStartExam({
      numQuestions: Math.min(numQuestions, maxQuestions),
      totalTime,
      difficulties: selectedDifficulties,
      questionOrder,
      chapters: selectedChapters,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl mx-4 shadow-lg animate-in fade-in-50">
        <CardHeader>
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <CardTitle className="text-2xl font-bold">Customize Your Exam</CardTitle>
                    <CardDescription>Set up the exam for <span className="font-semibold text-primary">{subject}</span></CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <Label htmlFor="num-questions">Number of Questions: <span className="font-bold">{numQuestions}</span></Label>
            <Slider
              id="num-questions"
              min={1}
              max={maxQuestions > 0 ? maxQuestions : 1}
              step={1}
              value={[numQuestions]}
              onValueChange={(value) => setNumQuestions(value[0])}
              disabled={maxQuestions === 0}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="total-time">Total Time (minutes)</Label>
            <Input
              id="total-time"
              type="number"
              value={totalTime}
              onChange={(e) => setTotalTime(Number(e.target.value))}
              min={5}
              step={5}
            />
          </div>
          <div className="space-y-4">
            <Label>Difficulty Level</Label>
            <div className="flex items-center gap-4">
              {difficultyLevels.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diff-${level}`}
                    checked={selectedDifficulties.includes(level)}
                    onCheckedChange={() => handleDifficultyChange(level)}
                  />
                  <Label htmlFor={`diff-${level}`} className="font-normal">{level}</Label>
                </div>
              ))}
            </div>
             <p className="text-xs text-muted-foreground">Select none to include all difficulties.</p>
          </div>
          <div className="space-y-4">
            <Label htmlFor="question-order">Question Order</Label>
            <Select value={questionOrder} onValueChange={(value: 'easy-first' | 'hard-first' | 'mixed') => setQuestionOrder(value)}>
              <SelectTrigger id="question-order">
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="easy-first">Easy First</SelectItem>
                <SelectItem value="hard-first">Hard First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 md:col-span-2">
            <Label>Chapters</Label>
            <Popover open={openChapterSelector} onOpenChange={setOpenChapterSelector}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openChapterSelector}
                  className="w-full justify-between font-normal"
                >
                  <span className="truncate">
                    {selectedChapters.length > 0 ? `${selectedChapters.length} chapter(s) selected` : "Select chapters... (optional)"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search chapters..." />
                  <CommandList>
                    <CommandEmpty>No chapters found.</CommandEmpty>
                    <CommandGroup>
                      {availableChapters.map(chapter => (
                        <CommandItem
                          key={chapter}
                          onSelect={() => {
                            handleChapterSelect(chapter)
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedChapters.includes(chapter) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {chapter}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-1 min-h-[20px]">
                {selectedChapters.map(chapter => (
                    <Badge key={chapter} variant="secondary" className="font-normal">{chapter}</Badge>
                ))}
            </div>
             <p className="text-xs text-muted-foreground">Select none to include all chapters.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button onClick={handleStartClick} disabled={maxQuestions === 0}>
            Start Exam
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

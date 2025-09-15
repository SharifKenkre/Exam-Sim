"use client";

import React, { useState } from 'react';
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
import type { Difficulty } from '@/lib/types';
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
  chapters: string[];
  maxQuestions: number;
  onStartExam: (config: ExamConfig) => void;
  onBack: () => void;
}

const difficultyLevels: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export function ExamCustomization({ subject, chapters, maxQuestions, onStartExam, onBack }: ExamCustomizationProps) {
  const [numQuestions, setNumQuestions] = useState(Math.min(10, maxQuestions));
  const [totalTime, setTotalTime] = useState(30);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(['Easy', 'Medium']);
  const [questionOrder, setQuestionOrder] = useState<'easy-first' | 'hard-first' | 'mixed'>('mixed');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [openChapterSelector, setOpenChapterSelector] = useState(false);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty) 
        : [...prev, difficulty]
    );
  };
  
  const handleChapterSelect = (chapter: string) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter) 
        : [...prev, chapter]
    );
    setOpenChapterSelector(true);
  };

  const handleStartClick = () => {
    onStartExam({
      numQuestions,
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
              max={maxQuestions}
              step={1}
              value={[numQuestions]}
              onValueChange={(value) => setNumQuestions(value[0])}
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
            <Label>Difficulty Level (select at least one)</Label>
            <div className="flex items-center gap-4">
              {difficultyLevels.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diff-${level}`}
                    checked={selectedDifficulties.includes(level)}
                    onCheckedChange={() => handleDifficultyChange(level)}
                  />
                  <Label htmlFor={`diff-${level}`}>{level}</Label>
                </div>
              ))}
            </div>
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
            <Label>Chapters (optional)</Label>
            <Popover open={openChapterSelector} onOpenChange={setOpenChapterSelector}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openChapterSelector}
                  className="w-full justify-between font-normal"
                >
                  <span className="truncate">
                    {selectedChapters.length > 0 ? `${selectedChapters.length} chapter(s) selected` : "Select chapters..."}
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
                      {chapters.map(chapter => (
                        <CommandItem
                          key={chapter}
                          onSelect={() => {
                            handleChapterSelect(chapter);
                            setOpenChapterSelector(false);
                          }}
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
            <div className="flex flex-wrap gap-1">
                {selectedChapters.map(chapter => (
                    <Badge key={chapter} variant="secondary">{chapter}</Badge>
                ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button onClick={handleStartClick} disabled={selectedDifficulties.length === 0}>
            Start Exam
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

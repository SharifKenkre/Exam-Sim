"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface SubjectSelectionProps {
  subjects: string[];
  onSubjectSelect: (subject: string) => void;
}

export function SubjectSelection({ subjects, onSubjectSelect }: SubjectSelectionProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4 shadow-lg animate-in fade-in-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to ExamSim</CardTitle>
          <CardDescription>Please select a subject to begin your exam.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {subjects.map((subject) => (
              <Button
                key={subject}
                onClick={() => onSubjectSelect(subject)}
                className="w-full text-lg py-6"
                variant="secondary"
              >
                {subject}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

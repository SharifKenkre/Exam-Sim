
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Atom, FlaskConical, BrainCircuit, BookOpen } from 'lucide-react';

interface SubjectSelectionProps {
  subjects: string[];
  onSubjectSelect: (subject: string) => void;
}

const subjectIcons: { [key: string]: React.ReactElement } = {
  'Physics': <Atom className="h-8 w-8 text-blue-500" />,
  'Chemistry': <FlaskConical className="h-8 w-8 text-green-500" />,
  'Mathematics': <BrainCircuit className="h-8 w-8 text-purple-500" />,
};

const getSubjectIcon = (subject: string) => {
    return subjectIcons[subject] || <BookOpen className="h-8 w-8 text-gray-500" />;
}

export function SubjectSelection({ subjects, onSubjectSelect }: SubjectSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome to ExamSim</h1>
            <p className="mt-2 text-lg text-muted-foreground">Choose a subject to start your customized exam.</p>
        </div>
      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
                <Card 
                    key={subject}
                    onClick={() => onSubjectSelect(subject)}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary"
                >
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 p-4 bg-primary/10 rounded-full transition-colors duration-300 group-hover:bg-primary/20">
                            {getSubjectIcon(subject)}
                        </div>
                        <h3 className="text-xl font-semibold text-card-foreground">{subject}</h3>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

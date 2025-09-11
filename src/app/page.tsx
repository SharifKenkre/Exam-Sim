import { ExamClient } from '@/components/exam/ExamClient';
import { questions } from '@/lib/questions';

export default function Home() {
  return <ExamClient questions={questions} totalTime={3600} />;
}

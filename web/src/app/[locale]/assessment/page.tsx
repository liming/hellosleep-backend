'use client';

import { useState, useMemo, useEffect } from 'react';
import { questions, getVisibleQuestions, processAssessment, type Tag } from '@/lib/assessment';
import LandingScreen from '@/components/assessment/LandingScreen';
import QuestionScreen from '@/components/assessment/QuestionScreen';
import ResultsScreen from '@/components/assessment/ResultsScreen';

type Screen = 'landing' | 'questions' | 'results';

export default function AssessmentPage() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeTags, setActiveTags] = useState<Tag[]>([]);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(questions, answers),
    [answers]
  );

  // Auto-initialize default values for scale/number questions so the Next button isn't blocked
  useEffect(() => {
    const current = visibleQuestions[questionIndex];
    if (
      current &&
      (current.type === 'scale' || current.type === 'number') &&
      answers[current.id] === undefined &&
      current.min !== undefined
    ) {
      setAnswers((prev) => ({ ...prev, [current.id]: String(current.min) }));
    }
  }, [questionIndex, visibleQuestions, answers]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (questionIndex < visibleQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setActiveTags(processAssessment(answers));
      setScreen('results');
    }
  };

  const handlePrev = () => {
    setQuestionIndex((i) => Math.max(0, i - 1));
  };

  const handleStart = () => {
    setScreen('questions');
    setQuestionIndex(0);
  };

  const handleBack = () => {
    setScreen('landing');
    setAnswers({});
    setQuestionIndex(0);
  };

  return (
    <>
      {screen === 'landing' && <LandingScreen onStart={handleStart} />}
      {screen === 'questions' && (
        <QuestionScreen
          questions={visibleQuestions}
          currentIndex={questionIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          tags={activeTags}
          answeredCount={Object.keys(answers).length}
          onBack={handleBack}
        />
      )}
    </>
  );
}

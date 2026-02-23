'use client';

import { useState, useMemo, useEffect } from 'react';
import { questions, getVisibleQuestions, processAssessment, type Tag } from '@/lib/assessment';
import LandingScreen from '@/components/assessment/LandingScreen';
import QuestionScreen from '@/components/assessment/QuestionScreen';
import ResultsScreen from '@/components/assessment/ResultsScreen';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { saveAssessmentResult } from '@/lib/auth';

type Screen = 'landing' | 'questions' | 'results';

export default function AssessmentPage() {
  const { user, jwt } = useAuth();
  const [screen, setScreen] = useState<Screen>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(questions, answers),
    [answers]
  );

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
      const tags = processAssessment(answers);
      setActiveTags(tags);
      setScreen('results');
      if (jwt) {
        const tagData = tags.map((t) => ({ name: t.name, text: t.text, priority: t.priority }));
        saveAssessmentResult(jwt, answers, tagData).catch(console.error);
      }
    }
  };

  const handlePrev = () => {
    setQuestionIndex((i) => Math.max(0, i - 1));
  };

  const handleStart = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
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

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setScreen('questions');
            setQuestionIndex(0);
          }}
        />
      )}
    </>
  );
}

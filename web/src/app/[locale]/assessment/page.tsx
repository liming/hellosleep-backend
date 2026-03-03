'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { questions, getVisibleQuestions, processAssessment, type Tag } from '@/lib/assessment';
import LandingScreen from '@/components/assessment/LandingScreen';
import QuestionScreen from '@/components/assessment/QuestionScreen';
import ResultsScreen from '@/components/assessment/ResultsScreen';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { saveAssessmentResult, fetchAssessmentHistory } from '@/lib/auth';

type Screen = 'landing' | 'questions' | 'results';
const LAST_ASSESSMENT_KEY = 'hellosleep_last_assessment';

const DEFAULT_TIME_ANSWERS: Record<string, string> = {
  sleeptime: '23:00',
  getuptime: '07:00',
};
const AUTO_NEXT_DELAY_MS = 150;

export default function AssessmentPage() {
  const { user, jwt, isLoading } = useAuth();
  const [screen, setScreen] = useState<Screen>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [historyResolved, setHistoryResolved] = useState(false);
  const autoNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(LAST_ASSESSMENT_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { answers?: Record<string, string> };
      if (parsed.answers && Object.keys(parsed.answers).length > 0) {
        setAnswers(parsed.answers);
        setActiveTags(processAssessment(parsed.answers));
        setScreen('results');
      }
    } catch {
      localStorage.removeItem(LAST_ASSESSMENT_KEY);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Not logged in: no server history to load.
    if (!user || !jwt) {
      setHistoryResolved(true);
      return;
    }

    let cancelled = false;
    const restoreFromServer = async () => {
      try {
        const history = await fetchAssessmentHistory(jwt);
        if (cancelled) return;

        if (history?.length) {
          const latest = [...history].sort((a, b) => {
            const aTs = new Date(a.completedAt || 0).getTime();
            const bTs = new Date(b.completedAt || 0).getTime();
            return bTs - aTs;
          })[0];

          if (latest?.answers && Object.keys(latest.answers).length > 0) {
            setAnswers(latest.answers);
            setActiveTags(processAssessment(latest.answers));
            setScreen('results');
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                LAST_ASSESSMENT_KEY,
                JSON.stringify({
                  answers: latest.answers,
                  completedAt: latest.completedAt ?? new Date().toISOString(),
                })
              );
            }
          }
        }
      } catch (error) {
        console.error('Failed to restore assessment history:', error);
      } finally {
        if (!cancelled) setHistoryResolved(true);
      }
    };

    restoreFromServer();
    return () => {
      cancelled = true;
    };
  }, [isLoading, user, jwt]);

  useEffect(() => {
    return () => {
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
      }
    };
  }, []);

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

    if (
      current &&
      current.type === 'time' &&
      answers[current.id] === undefined &&
      DEFAULT_TIME_ANSWERS[current.id]
    ) {
      setAnswers((prev) => ({ ...prev, [current.id]: DEFAULT_TIME_ANSWERS[current.id] }));
    }
  }, [questionIndex, visibleQuestions, answers]);

  const finalizeAssessment = (finalAnswers: Record<string, string>) => {
    const finalTags = processAssessment(finalAnswers);
    setAnswers(finalAnswers);
    setActiveTags(finalTags);
    setScreen('results');

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        LAST_ASSESSMENT_KEY,
        JSON.stringify({
          answers: finalAnswers,
          completedAt: new Date().toISOString(),
        })
      );
    }

    if (jwt) {
      const tagData = finalTags.map((t) => ({ name: t.name, text: t.text, priority: t.priority }));
      saveAssessmentResult(jwt, finalAnswers, tagData).catch(console.error);
    }
  };

  const handleAnswer = (questionId: string, value: string) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    const current = visibleQuestions[questionIndex];
    if (!current || current.id !== questionId || current.type !== 'single_choice') return;

    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
    }

    autoNextTimerRef.current = setTimeout(() => {
      if (questionIndex < visibleQuestions.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        finalizeAssessment(nextAnswers);
      }
    }, AUTO_NEXT_DELAY_MS);
  };

  const handleNext = () => {
    if (questionIndex < visibleQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      finalizeAssessment(answers);
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

    // If this user already has a resolved assessment (from server/local restore), jump to results.
    if (historyResolved && Object.keys(answers).length > 0) {
      setActiveTags(processAssessment(answers));
      setScreen('results');
      return;
    }

    // If history is still being resolved, avoid forcing user into questions prematurely.
    if (!historyResolved) {
      return;
    }

    setScreen('questions');
    setQuestionIndex(0);
  };

  const handleRetake = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LAST_ASSESSMENT_KEY);
    }
    setAnswers({});
    setActiveTags([]);
    setQuestionIndex(0);
    setScreen('questions');
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
          answers={answers}
          tags={activeTags}
          onRetake={handleRetake}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            // Let history restore decide whether to show results or questions.
            // If no history appears, user can still tap 开始评估进入 questions.
          }}
        />
      )}
    </>
  );
}

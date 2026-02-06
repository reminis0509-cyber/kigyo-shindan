'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData, DiagnosisAnswers, DiagnosisResult } from './types';

interface DiagnosisContextType {
  userData: UserData;
  setEmail: (email: string) => void;
  setLayer: (layer: 'A' | 'B') => void;
  setAnswer: (questionId: keyof DiagnosisAnswers, value: string) => void;
  setResult: (result: DiagnosisResult) => void;
  resetDiagnosis: () => void;
}

const initialUserData: UserData = {
  email: '',
  layer: null,
  answers: null,
  result: null,
};

const DiagnosisContext = createContext<DiagnosisContextType | undefined>(undefined);

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorageからデータを読み込み
  useEffect(() => {
    const saved = localStorage.getItem('diagnosisData');
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // LocalStorageにデータを保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('diagnosisData', JSON.stringify(userData));
    }
  }, [userData, isLoaded]);

  const setEmail = (email: string) => {
    setUserData((prev) => ({ ...prev, email }));
  };

  const setLayer = (layer: 'A' | 'B') => {
    setUserData((prev) => ({ ...prev, layer }));
  };

  const setAnswer = (questionId: keyof DiagnosisAnswers, value: string) => {
    setUserData((prev) => ({
      ...prev,
      answers: {
        ...(prev.answers || {
          budget: '',
          time: '',
          skill: '',
          risk: '',
          goal: '',
          pcSkill: '',
          personality: '',
        }),
        [questionId]: value,
      },
    }));
  };

  const setResult = (result: DiagnosisResult) => {
    setUserData((prev) => ({ ...prev, result }));
  };

  const resetDiagnosis = () => {
    setUserData(initialUserData);
    localStorage.removeItem('diagnosisData');
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <DiagnosisContext.Provider
      value={{
        userData,
        setEmail,
        setLayer,
        setAnswer,
        setResult,
        resetDiagnosis,
      }}
    >
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis() {
  const context = useContext(DiagnosisContext);
  if (context === undefined) {
    throw new Error('useDiagnosis must be used within a DiagnosisProvider');
  }
  return context;
}

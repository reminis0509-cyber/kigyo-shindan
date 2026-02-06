const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DiagnosisRequest {
  email: string;
  layer: 'A' | 'B';
  answers?: Record<string, string>;
}

export interface Business {
  name: string;
  cost: string;
  revenue: string;
  time: string;
  success_rate: string;
  description: string;
}

export interface DiagnosisResponse {
  success: boolean;
  result?: {
    rank1: Business;
    rank2: Business;
    rank3: Business;
  };
  message: string;
}

export async function submitEmail(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/submit-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to submit email:', error);
    return false;
  }
}

export async function runDiagnosis(data: DiagnosisRequest): Promise<DiagnosisResponse | null> {
  try {
    const response = await fetch(`${API_URL}/api/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Diagnosis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to run diagnosis:', error);
    return null;
  }
}

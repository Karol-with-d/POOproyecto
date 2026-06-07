/**
 * Servicio de API para comunicación con el backend.
 * Base URL configurable via entorno.
 * 
 * Nota POO: en React, los servicios pueden ser clases con métodos estáticos
 * o funciones puras. Usamos funciones async por simplicidad.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  status: string;
  data: T;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

// ============================================
// Usuarios
// ============================================
export interface User {
  id: string;
  randomName: string;
  createdAt: string;
}

export async function createUser(randomName: string): Promise<User> {
  return fetchApi<User>('/users', {
    method: 'POST',
    body: JSON.stringify({ randomName }),
  });
}

export async function getUserById(id: string): Promise<User> {
  return fetchApi<User>(`/users/${id}`);
}

// ============================================
// Semanas
// ============================================
export interface Semana {
  id: string;
  number: number;
  title: string;
  description: string | null;
  topic: string;
}

export async function getSemanas(): Promise<Semana[]> {
  return fetchApi<Semana[]>('/semanas');
}

export async function getSemanaById(id: string): Promise<Semana> {
  return fetchApi<Semana>(`/semanas/${id}`);
}

export async function getActivitiesBySemana(semanaId: string): Promise<any[]> {
  return fetchApi<any[]>(`/semanas/${semanaId}/activities`);
}

export async function getQuizBySemana(semanaId: string): Promise<any[]> {
  return fetchApi<any[]>(`/semanas/${semanaId}/quiz`);
}

// ============================================
// Scores
// ============================================
export async function saveScore(data: {
  userId: string;
  semanaId: string;
  activityId?: string;
  score: number;
  type: string;
}): Promise<any> {
  return fetchApi<any>('/scores', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getGlobalScore(userId: string): Promise<any> {
  return fetchApi<any>(`/users/${userId}/global-score`);
}

// ============================================
// Progreso
// ============================================
export async function getUserProgress(userId: string): Promise<any[]> {
  return fetchApi<any[]>(`/users/${userId}/progress`);
}

export async function markSemanaCompleted(
  userId: string,
  semanaId: string,
  score?: number
): Promise<any> {
  return fetchApi<any>(`/users/${userId}/progress/semana/${semanaId}`, {
    method: 'PATCH',
    body: JSON.stringify({ score }),
  });
}

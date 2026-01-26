import type { ApiError, Vacancy } from './types'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api'

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) return {} as T
  try {
    return JSON.parse(text) as T
  } catch {
    // если вдруг backend вернёт не-JSON, отдаём как есть
    return { message: text } as unknown as T
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!res.ok) {
    const err = await readJson<ApiError>(res)
    throw new Error(err?.message || `HTTP ${res.status}`)
  }

  return readJson<T>(res)
}

export const api = {
  listVacancies: () => request<Vacancy[]>('/vacancy'),
  getVacancy: (id: number) => request<Vacancy>(`/vacancy/${id}`),
  createVacancy: (dto: Vacancy) => request<Vacancy>('/vacancy', { method: 'POST', body: JSON.stringify(dto) }),
  updateVacancy: (id: number, dto: Vacancy) =>
    request<Vacancy>(`/vacancy/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  deleteVacancy: (id: number) => request<Vacancy>(`/vacancy/${id}`, { method: 'DELETE' }),
}

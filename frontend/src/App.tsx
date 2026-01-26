import React, { useEffect, useMemo, useState } from 'react'
import { api } from './app/api'
import type { Vacancy } from './app/types'
import { Toast } from './components/Toast'
import { VacancyForm } from './components/VacancyForm'

export function App() {
  const [items, setItems] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Vacancy | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'error' | 'info'; text: string } | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      const list = await api.listVacancies()
      setItems(list)
    } catch (e: any) {
      setToast({ kind: 'error', text: e?.message ?? 'Не удалось загрузить вакансии' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((v) =>
      [v.companyName, v.vacancyName, v.description ?? ''].some((x) => (x ?? '').toLowerCase().includes(q)),
    )
  }, [items, query])

  async function onCreate(dto: Vacancy) {
    setLoading(true)
    try {
      const created = await api.createVacancy(dto)
      setToast({ kind: 'ok', text: `Создано: #${created.id} ${created.companyName} — ${created.vacancyName}` })
      // НЕ переключаемся на редактирование после создания
      await refresh()
    } catch (e: any) {
      setToast({ kind: 'error', text: e?.message ?? 'Ошибка создания' })
    } finally {
      setLoading(false)
    }
  }

  async function onUpdate(dto: Vacancy) {
    if (!selected?.id) return
    setLoading(true)
    try {
      const updated = await api.updateVacancy(selected.id, dto)
      setToast({ kind: 'ok', text: `Обновлено: #${updated.id}` })
      setSelected(updated)
      await refresh()
    } catch (e: any) {
      setToast({ kind: 'error', text: e?.message ?? 'Ошибка обновления' })
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(id: number) {
    const ok = confirm(`Удалить вакансию #${id}?`)
    if (!ok) return

    setLoading(true)
    try {
      await api.deleteVacancy(id)
      setToast({ kind: 'ok', text: `Удалено: #${id}` })
      if (selected?.id === id) setSelected(null)
      await refresh()
    } catch (e: any) {
      setToast({ kind: 'error', text: e?.message ?? 'Ошибка удаления' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <h1 className="h1">JobSearch</h1>
            <div className="subtitle">CRUD по вакансиям (Spring Boot + React)</div>
          </div>
        </div>

        <div className="toolbar">
          <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по компании/вакансии/описанию" />
          <button className="button" onClick={refresh} disabled={loading}>
            Обновить
          </button>
        </div>
      </div>

      {/* Форма создания новой вакансии */}
      <div className="card" style={{ marginBottom: 24 }}>
        <p className="card-title">Создать новую вакансию</p>
        <VacancyForm mode="create" busy={loading} onSubmit={onCreate} />
        <div className="small" style={{ marginTop: 10 }}>
          Под капотом: POST <span className="mono">/vacancy</span>
        </div>
      </div>

      {/* Список всех вакансий */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <p className="card-title">Список вакансий</p>
          <span className="badge">
            <span>Всего:</span> <span className="mono">{items.length}</span> · <span>Показано:</span> <span className="mono">{filtered.length}</span>
          </span>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th>Компания</th>
              <th>Вакансия</th>
              <th>Описание</th>
              <th style={{ width: 170 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(v)}>
                <td className="mono">{v.id}</td>
                <td>{v.companyName}</td>
                <td>{v.vacancyName}</td>
                <td style={{ color: 'var(--muted)' }}>{v.description || <span className="small">(нет)</span>}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="button" onClick={() => setSelected(v)}>
                      Редактировать
                    </button>
                    <button className="button danger" onClick={() => v.id && onDelete(v.id)} disabled={!v.id || loading}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)', padding: 16 }}>
                  Ничего не найдено.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Модальное окно редактирования */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p className="card-title">Редактирование вакансии #{selected.id}</p>
              <button className="button" onClick={() => setSelected(null)} style={{ padding: '4px 12px' }}>
                ✕
              </button>
            </div>
            <VacancyForm
              mode="edit"
              initial={selected}
              busy={loading}
              onSubmit={onUpdate}
              onCancel={() => setSelected(null)}
            />
            <div className="small" style={{ marginTop: 10 }}>
              Под капотом: PUT <span className="mono">/vacancy/{selected.id}</span>
            </div>
          </div>
        </div>
      )}

      {toast ? <Toast kind={toast.kind} text={toast.text} onClose={() => setToast(null)} /> : null}

      <div className="small" style={{ marginTop: 18 }}>
        API ожидается по адресу <span className="mono">/api</span> (в dev это прокси на <span className="mono">localhost:8080</span>, в проде — nginx внутри контейнера).
      </div>
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import type { Vacancy } from '../app/types'

type Props = {
  mode: 'create' | 'edit'
  initial?: Vacancy
  busy?: boolean
  onSubmit: (dto: Vacancy) => void
  onCancel?: () => void
}

export function VacancyForm({ mode, initial, busy, onSubmit, onCancel }: Props) {
  const [companyName, setCompanyName] = useState(initial?.companyName ?? '')
  const [vacancyName, setVacancyName] = useState(initial?.vacancyName ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  const canSubmit = useMemo(() => companyName.trim().length > 0 && vacancyName.trim().length > 0, [companyName, vacancyName])

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit || busy) return
        onSubmit({ companyName: companyName.trim(), vacancyName: vacancyName.trim(), description: description.trim() || '' })
      }}
    >
      <div className="row">
        <label className="label">
          Компания*
          <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="например, Yandex" />
        </label>
        <label className="label">
          Вакансия*
          <input className="input" value={vacancyName} onChange={(e) => setVacancyName(e.target.value)} placeholder="например, Backend Developer" />
        </label>
      </div>

      <label className="label">
        Описание (до 1000 символов)
        <textarea
          className="input textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Коротко: требования, стек, условия..."
          maxLength={1000}
        />
        <div className="small">
          <span className="mono">{description.length}</span>/1000
        </div>
      </label>

      <div className="actions">
        {onCancel ? (
          <button type="button" className="button" onClick={onCancel} disabled={busy}>
            Отмена
          </button>
        ) : null}
        <button type="submit" className="button primary" disabled={!canSubmit || busy}>
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </button>
      </div>
    </form>
  )
}

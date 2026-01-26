import React from 'react'

export type ToastKind = 'ok' | 'error' | 'info'

export function Toast({ kind, text, onClose }: { kind: ToastKind; text: string; onClose?: () => void }) {
  if (!text) return null
  return (
    <div className={`toast ${kind === 'error' ? 'error' : kind === 'ok' ? 'ok' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>{text}</div>
        {onClose ? (
          <button className="button" onClick={onClose} style={{ padding: '4px 8px' }}>
            ✕
          </button>
        ) : null}
      </div>
    </div>
  )
}

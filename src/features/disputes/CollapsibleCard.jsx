// Grey details card with +/- buttons that show or hide its body, plus its InfoLine text row.
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { DISPUTES_TEXT } from '../../texts'

const TEXT = DISPUTES_TEXT.details

export default function CollapsibleCard({ icon, title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-[#F6F6F6] px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-bold text-ink" style={{ fontSize: '20px', lineHeight: '20px' }}>
            {title}
          </h3>
        </div>
        <div
          className="flex flex-col overflow-hidden rounded-lg border border-line bg-white"
          style={{ width: '32px' }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center justify-center hover:bg-gray-50"
            style={{ height: '32px', borderBottom: '1px solid #D9D9D9' }}
            aria-label={TEXT.expand}
          >
            <Plus className="h-4 w-4 text-ink" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center hover:bg-gray-50"
            style={{ height: '32px' }}
            aria-label={TEXT.collapse}
          >
            <Minus className="h-4 w-4 text-ink" />
          </button>
        </div>
      </div>
      {open && children}
    </div>
  )
}

export function InfoLine({ children }) {
  return (
    <p className="font-semibold text-ink" style={{ fontSize: '16px', lineHeight: '20px' }}>
      {children}
    </p>
  )
}

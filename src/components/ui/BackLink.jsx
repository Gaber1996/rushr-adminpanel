/** A text "Back" link (arrow + label). */
import { ArrowLeft } from 'lucide-react'
import { COMMON_TEXT } from '../../texts'

export default function BackLink({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 font-semibold text-primary"
    >
      <ArrowLeft className="h-5 w-5" />
      {COMMON_TEXT.back}
    </button>
  )
}

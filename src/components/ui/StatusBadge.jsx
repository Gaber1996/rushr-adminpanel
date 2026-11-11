// Colours per tone and shape, taken from the Figma badges each shape replaces.
const TONES = {
  success: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    pill: 'border-success bg-success-soft text-success',
  },
  danger: { chip: 'border-red-200 bg-red-50 text-red-600' },
  neutral: {
    chip: 'border-gray-200 bg-gray-50 text-gray-500',
    pill: 'border-muted bg-surface-muted text-muted',
  },
}

const SHAPES = {
  /** Small rounded tag used in verification lists. */
  chip: 'gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
  /** Larger square-ish tag used for dispute status. */
  pill: 'gap-2 rounded-lg p-2 text-[14px] font-semibold',
}

/** A coloured status tag: `tone` picks the colours, `shape` the size, `icon` sits before the text. */
export default function StatusBadge({
  tone = 'neutral',
  shape = 'chip',
  icon,
  className = '',
  children,
}) {
  return (
    <span
      className={`inline-flex items-center border ${SHAPES[shape]} ${TONES[tone][shape] ?? ''} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}

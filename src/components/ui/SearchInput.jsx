import { Search } from 'lucide-react'

const APPEARANCES = {
  /** 1px grey border. */
  outline: 'border border-line',
  /** Hairline ring plus a soft drop shadow (dispute list). */
  elevated: 'shadow-[0_0_0_1px_#E5E5E5,0_1px_3px_0_rgba(0,0,0,0.06)]',
}

/** The 56px search box used above every list. `label` names it for screen readers. */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  label,
  appearance = 'outline',
  className = '',
}) {
  return (
    <label
      className={`flex h-14 items-center gap-2 rounded-xl bg-surface px-3 ${APPEARANCES[appearance]} ${className}`}
    >
      <Search className="h-6 w-6 shrink-0 text-muted" aria-hidden="true" />
      <input
        type="text"
        aria-label={label ?? placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
      />
    </label>
  )
}

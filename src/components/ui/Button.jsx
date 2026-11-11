import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-primary text-white',
  danger: 'bg-danger text-white',
  /** Lighter red (document reject). */
  dangerSoft: 'bg-red-600 text-white',
  /** Grey outline, e.g. Cancel. */
  outline: 'border border-line text-muted hover:bg-gray-50',
  /** Outline with blue text, e.g. Filter, Prev/Next. */
  outlinePrimary: 'border border-line text-primary',
  /** Blue outline with blue text (Platform Settings filter). */
  outlineAccent: 'border border-primary text-primary',
  /** Blue outline, e.g. Try again. */
  secondary: 'border border-primary text-primary-strong hover:bg-primary-soft',
}

const SIZES = {
  lg: 'h-14 gap-2 rounded-xl px-8 text-lg font-extrabold leading-normal',
  /** Header action with an icon (Add New Category). */
  lgCompact: 'h-14 gap-2 rounded-xl px-6 text-base font-extrabold',
  md: 'h-12 gap-2 rounded-xl px-4 text-sm font-bold',
  /** Secondary action beside an `md` button (dialog Cancel). */
  mdSemibold: 'h-12 gap-2 rounded-xl px-4 text-sm font-semibold',
  /** Same height as SearchInput, for a button beside it (Filter). */
  field: 'h-14 gap-2 rounded-xl px-4 text-base font-semibold',
  sm: 'gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold leading-normal',
}

/**
 * The app's button. `loading` shows a spinner and disables it. Extra `className` is appended,
 * so layout (`flex-1`, `w-full`) stays at the call site.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <Loader2
          className={`animate-spin ${size.startsWith('lg') ? 'h-5 w-5' : 'h-4 w-4'}`}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}

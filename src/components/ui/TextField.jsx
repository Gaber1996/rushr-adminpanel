import { useId } from 'react'

const CONTROL =
  'w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-blue-400'

/**
 * A labelled input (or textarea with `rows`). The label is wired to the control, so clicking it
 * focuses the field and screen readers announce it. `hint` renders after the label text, e.g. "*".
 * `leading` puts an icon inside the field before the text. `inputClassName` sizes a single-line
 * field only (a textarea is sized by `rows`).
 */
export default function TextField({
  label,
  hint,
  rows,
  leading,
  labelClassName = 'text-sm font-medium text-ink',
  inputClassName = 'h-14',
  gapClassName = 'gap-2',
  ...inputProps
}) {
  const id = useId()
  const control = rows ? (
    <textarea {...inputProps} id={id} rows={rows} className={`${CONTROL} resize-none py-3`} />
  ) : leading ? (
    <div
      className={`flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 transition-colors hover:border-blue-400 ${inputClassName}`}
    >
      {leading}
      <input
        type="text"
        {...inputProps}
        id={id}
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
      />
    </div>
  ) : (
    <input type="text" {...inputProps} id={id} className={`${CONTROL} ${inputClassName}`} />
  )

  return (
    <div className={`flex flex-col ${gapClassName}`}>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {hint && <> {hint}</>}
      </label>
      {control}
    </div>
  )
}

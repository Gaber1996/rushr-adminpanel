import { ArrowLeft } from 'lucide-react'

const TITLE_TONES = { heading: 'text-heading', ink: 'text-ink' }

/**
 * Page title block: optional back arrow, the h1, an optional subtitle, and actions on the right.
 * Stacks the actions under the title on small screens. `titleTone` keeps each page's Figma colour.
 */
export default function PageHeader({
  title,
  subtitle,
  onBack,
  actions,
  titleTone = 'heading',
  // Replaced, not appended: each page keeps its Figma spacing without class conflicts.
  textGapClassName = 'gap-3 md:gap-4',
  subtitleClassName = 'text-base font-semibold leading-tight text-muted md:text-2xl md:leading-6',
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className={`flex flex-col ${textGapClassName}`}>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="text-muted transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-7 w-7" />
            </button>
          )}
          <h1
            className={`text-3xl font-extrabold leading-none md:text-[40px] ${TITLE_TONES[titleTone]}`}
          >
            {title}
          </h1>
        </div>
        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}

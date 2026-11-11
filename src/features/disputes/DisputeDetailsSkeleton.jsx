import { AlertCircle, Briefcase, Clock, CreditCard, MapPin, User } from 'lucide-react'
import Skeleton from '../../components/ui/Skeleton'
import { COMMON_TEXT, DISPUTES_TEXT } from '../../texts'

const TEXT = DISPUTES_TEXT.details
const ICON_CLASS = 'h-6 w-6 text-ink'
const CARD_TITLE = 'text-[20px] font-bold leading-5 text-ink'

/** The status badge's footprint, for the page header while the case loads. */
export function DisputeStatusSkeleton() {
  return <Skeleton className="h-[38px] w-[118px]" rounded="rounded-lg" />
}

/** An info card before its data arrives: real icon and title, the +/- control's footprint. */
function CardSkeleton({ icon, title, children }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-[#F6F6F6] px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className={CARD_TITLE}>{title}</h3>
        </div>
        <Skeleton className="h-[66px] w-8" rounded="rounded-lg" />
      </div>
      {children}
    </div>
  )
}

function Lines({ count }) {
  return Array.from({ length: count }, (_, i) => (
    <Skeleton key={i} className={`h-4 ${i % 2 ? 'w-1/2' : 'w-2/3'}`} />
  ))
}

/** Timeline steps: a dot on a line, then a label and a time under each. */
function TimelineSkeleton() {
  const steps = [0, 1, 2, 3]
  return (
    <div className="flex w-full items-start">
      {steps.map((i) => (
        <div key={i} className="flex flex-1 flex-col gap-2">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 shrink-0" rounded="rounded-full" />
            {i < steps.length - 1 && <div className="h-px flex-1 bg-line" />}
          </div>
          <div className="flex flex-col gap-2 pr-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * The dispute details layout while the case loads: same columns, card titles and control
 * footprints as the loaded page, with grey blocks for the case data and resolution options.
 */
export default function DisputeDetailsSkeleton() {
  return (
    <div className="flex flex-col items-start gap-6 wide:flex-row">
      <span className="sr-only" role="status">
        {TEXT.loading}
      </span>

      <div className="flex w-full flex-col gap-6 wide:w-[716px]">
        <CardSkeleton icon={<User className={ICON_CLASS} />} title={TEXT.customerInfoTitle}>
          <Lines count={3} />
        </CardSkeleton>
        <CardSkeleton icon={<Briefcase className={ICON_CLASS} />} title={TEXT.proInfoTitle}>
          <Lines count={3} />
        </CardSkeleton>
        <CardSkeleton
          icon={<AlertCircle className={ICON_CLASS} />}
          title={TEXT.disputeDetailsTitle}
        >
          <Lines count={4} />
        </CardSkeleton>
        <CardSkeleton icon={<Clock className={ICON_CLASS} />} title={TEXT.serviceTimelineTitle}>
          <TimelineSkeleton />
        </CardSkeleton>
        <CardSkeleton icon={<MapPin className={ICON_CLASS} />} title={TEXT.locationHistoryTitle}>
          <Lines count={2} />
        </CardSkeleton>
        <CardSkeleton icon={<CreditCard className={ICON_CLASS} />} title={TEXT.paymentDetailsTitle}>
          <Lines count={4} />
        </CardSkeleton>
      </div>

      <div className="w-full rounded-3xl bg-surface-muted px-4 py-6 wide:w-[320px]">
        <div className="flex flex-col gap-6">
          <h3 className={CARD_TITLE}>{TEXT.resolutionActionsTitle}</h3>
          <div className="flex flex-col gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full wide:w-[288px]" rounded="rounded-lg" />
            ))}
            <div className="flex w-full flex-col gap-3 wide:w-[288px]">
              <span className="text-base font-medium leading-4 text-ink">
                {TEXT.adminNoteLabel}
                <span className="text-danger">{COMMON_TEXT.requiredMark}</span>
              </span>
              <Skeleton className="h-[133px] w-full" rounded="rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-14 w-full wide:w-[288px]" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  )
}

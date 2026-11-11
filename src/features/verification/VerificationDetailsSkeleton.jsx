import Skeleton from '../../components/ui/Skeleton'
import { VERIFICATION_TEXT } from '../../texts'

const TEXT = VERIFICATION_TEXT.details
const CARD = 'rounded-2xl border border-gray-100 bg-gray-50 p-6'

/**
 * The verification details layout while the contractor's documents load: real card titles and
 * field labels, grey bars where the data will appear, so nothing jumps when it arrives.
 */
export default function VerificationDetailsSkeleton() {
  const fields = [TEXT.fullNameLabel, TEXT.phoneLabel, TEXT.emailLabel]

  return (
    <div className="flex flex-col gap-8 lg:flex-row" aria-busy="true">
      <span className="sr-only" role="status">
        {TEXT.loading}
      </span>

      <div className="flex flex-1 flex-col gap-8">
        <div className={CARD}>
          <h2 className="mb-4 text-lg font-bold text-heading">{TEXT.proInfoTitle}</h2>
          <div className="flex flex-col">
            {fields.map((label, i) => (
              <div
                key={label}
                className={`flex items-center justify-between py-3 ${
                  i < fields.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <span className="text-sm font-semibold text-muted">{label}</span>
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className={CARD}>
          <h2 className="mb-4 text-lg font-bold text-heading">{TEXT.documentsTitle}</h2>
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-transparent bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" rounded="rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 lg:w-[340px]">
        <div className={`flex min-h-[480px] flex-col ${CARD}`}>
          <h2 className="mb-4 text-lg font-bold text-heading">{TEXT.viewerTitle}</h2>
          <Skeleton className="w-full flex-1" rounded="rounded-xl" />
        </div>
        <Skeleton className="h-14 w-full" rounded="rounded-xl" />
        <Skeleton className="h-14 w-full" rounded="rounded-xl" />
      </div>
    </div>
  )
}

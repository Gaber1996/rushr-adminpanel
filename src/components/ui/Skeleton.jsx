/** A grey pulsing bar standing in for content that is still loading. Size it with `className`. */
export default function Skeleton({ className = 'h-4 w-full' }) {
  return (
    <span aria-hidden="true" className={`block animate-pulse rounded bg-gray-200 ${className}`} />
  )
}

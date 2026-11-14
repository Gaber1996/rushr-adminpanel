/**
 * A grey pulsing block standing in for content that is still loading. Size it with `className`;
 * `rounded` sets the corner radius (kept separate so it never collides with a size class).
 */
export default function Skeleton({ className = 'h-4 w-full', rounded = 'rounded' }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse bg-gray-200 ${rounded} ${className}`}
    />
  )
}

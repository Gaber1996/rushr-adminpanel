/** A red banner for a load error. */
export default function ErrorState({ message }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
    >
      {message}
    </div>
  )
}

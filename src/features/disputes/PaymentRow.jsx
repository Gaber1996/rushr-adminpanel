// One label/value row of the payment details card.
export default function PaymentRow({ label, value, isBlue, isLast }) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={!isLast ? { borderBottom: '1px solid #D9D9D9' } : undefined}
    >
      <span className="font-medium text-muted" style={{ fontSize: '16px', lineHeight: '16px' }}>
        {label}
      </span>
      {typeof value === 'string' ? (
        <span
          className="text-right font-bold"
          style={{ fontSize: '16px', lineHeight: '16px', color: isBlue ? '#0052B0' : '#0F0F0F' }}
        >
          {value}
        </span>
      ) : (
        value
      )}
    </div>
  )
}

// One stop in the location history list.
import { MapPin } from 'lucide-react'

export default function LocationItem({ item, isLast }) {
  const titleColor = item.highlighted ? '#0052B0' : '#0F0F0F'
  return (
    <div className="flex items-start gap-1">
      <div className="flex flex-col items-center" style={{ width: '24px' }}>
        <MapPin
          className="h-6 w-6"
          style={{ color: item.highlighted ? '#0052B0' : '#0F0F0F' }}
          fill={item.highlighted ? '#0052B0' : 'none'}
        />
        {!isLast && (
          <div
            className="mt-2 w-px flex-1"
            style={{ backgroundColor: '#D9D9D9', minHeight: '40px' }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 pb-4">
        <p
          className="font-medium"
          style={{ fontSize: '20px', lineHeight: '20px', color: titleColor }}
        >
          {item.title}
        </p>
        <p className="font-semibold text-muted" style={{ fontSize: '16px', lineHeight: '16px' }}>
          {item.subtitle}
        </p>
        <p className="font-semibold text-muted" style={{ fontSize: '16px', lineHeight: '16px' }}>
          {item.address}
        </p>
      </div>
    </div>
  )
}

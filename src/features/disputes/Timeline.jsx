// Horizontal service timeline of the case's steps.
export default function Timeline({ steps }) {
  return (
    <div className="flex w-full items-start">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1
        return (
          <div key={step.label + idx} className="flex flex-1 flex-col gap-2">
            <div className="flex items-center">
              <div
                className="flex shrink-0 items-center justify-center rounded-full border-2 bg-white"
                style={{
                  width: '20px',
                  height: '20px',
                  borderColor: step.recorded ? '#0067DE' : '#D9D9D9',
                }}
              >
                <span
                  className="block rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: step.recorded ? '#0067DE' : '#D9D9D9',
                  }}
                />
              </div>
              {!isLast && <div className="h-px flex-1" style={{ backgroundColor: '#D9D9D9' }} />}
            </div>
            <div className="flex flex-col gap-2 pr-2">
              <span
                className="font-medium text-muted"
                style={{ fontSize: '12px', lineHeight: '12px' }}
              >
                {step.label}
              </span>
              <span
                className="font-bold"
                style={{
                  fontSize: '14px',
                  lineHeight: '14px',
                  color: step.recorded ? '#0F0F0F' : '#6A6A6A',
                }}
              >
                {step.time}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

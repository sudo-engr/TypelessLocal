interface Props {
  total: number
  current: number
}

export function StepIndicator({ total, current }: Props) {
  return (
    <div className="flex items-center gap-2" role="list" aria-label="설정 단계">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          role="listitem"
          aria-label={`${i + 1} / ${total}`}
          aria-current={i === current ? 'step' : undefined}
          className={`h-2 rounded-full transition-colors ${
            i === current ? 'w-6 bg-accent' : i < current ? 'w-2 bg-accent/40' : 'w-2 bg-border'
          }`}
        />
      ))}
    </div>
  )
}

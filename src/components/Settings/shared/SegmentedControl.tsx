interface Props {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <div className="flex bg-bg-tertiary/50 rounded-md p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          type="button"
          aria-pressed={value === opt.value}
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative flex-1 px-3 py-1.5 text-footnote rounded-md border-none cursor-pointer transition-colors ${
            value === opt.value
              ? 'bg-accent text-white font-medium'
              : 'text-text-secondary hover:text-text-primary bg-transparent'
          }`}
        >
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

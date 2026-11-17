interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, disabled = false }: Props) {
  return (
    <label
      className={`flex items-center gap-2.5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6.5 w-11 shrink-0 rounded-full border-none transition-colors duration-200 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${checked ? 'bg-accent' : 'bg-bg-tertiary'}`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-0.5 h-5.5 w-5.5 rounded-full bg-white transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0'}`}
        />
      </button>
      {label && <span className="text-footnote text-text-primary">{label}</span>}
    </label>
  )
}

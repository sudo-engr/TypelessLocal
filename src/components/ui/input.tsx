// Adapted from shadcn/ui e62c943; MIT notice: docs/licenses/shadcn-ui-LICENSE.
import * as React from 'react'
const cn = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ')

type InputVariant = 'default' | 'search'

interface InputProps extends React.ComponentProps<'input'> {
  variant?: InputVariant
}

const variantClasses: Record<InputVariant, string> = {
  default: '',
  search: 'h-10 w-full bg-bg-elevated pl-9 text-footnote',
}

function Input({ className, type, variant = 'default', ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-border bg-transparent px-3 py-1 text-base transition-colors outline-none selection:bg-accent selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary placeholder:text-text-tertiary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-bg-secondary',
        'focus-visible:border-border-focus ',
        'aria-invalid:border-error ',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Input }

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

// shadcn/ui Button pattern adapted to this app's Tailwind v4 tokens. The
// project has no cva/Radix dependency, so the variants stay dependency-free.
type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'selected'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-solid disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary',
  outline: 'border border-border bg-transparent text-text-primary hover:bg-bg-secondary',
  ghost: 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
  destructive: 'bg-error text-white hover:opacity-90',
  selected: 'border border-accent bg-accent-light text-accent hover:bg-accent-light',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 rounded-md px-3 text-xs',
  lg: 'h-10 rounded-md px-8',
  icon: 'h-9 w-9',
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => (
    <button
      data-slot="button"
      ref={ref}
      type={type}
      className={joinClasses(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  ),
)

Button.displayName = 'Button'

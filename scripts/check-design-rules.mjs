import assert from 'node:assert/strict'
import { ESLint } from 'eslint'

const eslint = new ESLint()
const filePath = 'src/components/design-rule-probe.tsx'
const cases = [
  ['no-restricted-syntax', '<div className="shadow-lg" />'],
  ['no-restricted-syntax', '<div className="bg-linear-to-r" />'],
  ['shadcn/no-raw-colors', '<div className="text-red-500" />'],
  ['shadcn/no-arbitrary-values', '<div className="p-[13px]" />'],
  ['shadcn/no-unknown-classes', '<div className="rounded-huge" />'],
  ['shadcn/no-inline-styles', '<div style={{ padding: 13 }} />'],
  ['shadcn/no-restyle', 'import { Button } from "./ui/button"; <Button className="p-8" />'],
  [
    'shadcn/require-static-classes',
    'import { Button } from "./ui/button"; <Button className={unknownClasses} />',
  ],
]
for (const [rule, source] of cases) {
  const [result] = await eslint.lintText(source, { filePath })
  assert(
    result.messages.some((message) => message.ruleId === rule),
    `${rule} must reject its probe`,
  )
}
const [valid] = await eslint.lintText(
  'import { Button } from "./ui/button"; export function Probe() { return <div className="bg-bg-primary text-footnote rounded-md settings:grid-cols-dictionary-form"><Button variant="outline" size="sm" className="w-full">Okay</Button></div> }',
  { filePath },
)
assert.equal(valid.errorCount, 0, JSON.stringify(valid.messages))
console.log(
  'Six shadcn rules and the flat-surface policy reject violations; shared Button variants pass.',
)

import { Mic, ShieldCheck } from '../Icons'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

/** Explains the intentionally disabled remote-polishing surface in local builds. */
export function LocalOnlyLlmPane() {
  return (
    <div className="max-w-160 space-y-5">
      <div>
        <h3 className="text-body font-medium text-text-primary">로컬 받아쓰기 전용</h3>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          첫 버전은 녹음 후 한국어 전사에 집중합니다. 원격 LLM 문장 다듬기와 번역은 사용할 수
          없습니다.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
            <CardTitle>네트워크 차단 가능</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-start gap-3">
          <Mic className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-xs text-text-secondary">
            모델이 준비되면 녹음부터 텍스트 입력까지 외부 API와 계정 없이 실행됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

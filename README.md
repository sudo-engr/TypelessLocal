# TypelessLocal

Rust 기반 로컬 음성 받아쓰기 데스크톱 앱입니다. 음성 인식은 기기에서 실행하며 API 키·회원가입·로그인 없이 사용할 수 있습니다.

## 주요 기능

- 로컬 Whisper로 음성을 텍스트로 변환
- `large-v3-turbo`와 `large-v3` 모델 선택
- 첫 설정에서 모델 다운로드 및 파일 무결성 검증
- 단축키로 녹음 시작·종료, 받아쓴 텍스트 입력
- 모델·권한·단축키 설정 화면

모델 다운로드에는 인터넷이 필요합니다. 다운로드한 모델을 사용하는 음성 인식은 로컬에서 처리합니다. 한국어 정확도와 처리 속도는 모델·녹음 환경·기기에 따라 달라집니다.

## 기술 구성

| 영역 | 기술 |
|---|---|
| 로컬 처리·시스템 연동 | Rust, whisper-rs / whisper.cpp |
| 데스크톱 앱 | Tauri 2 |
| 화면 | React, TypeScript |
| UI 스타일 | shadcn/ui, Tailwind CSS |
| UI 아이콘 | Kubai Icons |

현재 검증은 macOS 개발 환경을 중심으로 진행했습니다. Windows·Linux 배포 및 실제 기기 동작은 별도 검증이 필요합니다.

## 개발

Node.js, Rust, CMake와 운영체제별 Tauri 빌드 도구가 필요합니다.

```sh
git clone https://github.com/sudo-engr/TypelessLocal.git
cd TypelessLocal
npm ci
npm run tauri dev
```

의존성 설치 전 이 프로젝트의 보안 검토 정책과 [기존 검토 기록](docs/installation-review.md)을 확인하세요.

```sh
npm run lint
npm run lint:ui:check
npm run build
```

## 문서

- [개발 환경과 구현 상태](docs/LOCAL-DEVELOPMENT.md)
- [개발 계획서](docs/local-stt-plan-draft.md)
- [HTML 계획서](docs/local-stt-plan.packed.html)
- [UI 규칙](docs/design-rules.md)
- [모델 검토](docs/model-review.md)

## 문의·기여

버그와 제안은 [Issues](https://github.com/sudo-engr/TypelessLocal/issues)에 등록하세요. 변경사항은 Pull Request로 제출할 수 있습니다.

## 라이선스

MIT License. 재사용 코드와 외부 구성요소의 저작권·라이선스는 [LICENSE](LICENSE)와 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)에 보존합니다.

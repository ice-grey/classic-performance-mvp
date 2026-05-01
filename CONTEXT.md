# Classic Performance MVP - 프로젝트 컨텍스트

> 이 문서는 Claude(웹)와의 대화에서 정리된 프로젝트 컨텍스트입니다.
> Claude Code는 이 문서를 먼저 읽고 작업을 이어가주세요.

---

## 1. 프로젝트 개요

**서비스명**: Classic Performance MVP (가칭: ClassicDaily)

**한 줄 소개**: 클래식 음악 공연 정보를 검색하고 스크랩할 수 있는 웹 서비스

**목적**:
- 포트폴리오용 MVP (외부 공개 배포 필수)
- 추후 수익화 계획 있음 (광고/멤버십/티켓 제휴 등 미정)

**타겟 유저**: 클래식 음악 애호가 (확장 시 힙합/R&B까지, 그 외 장르는 절대 X)

---

## 2. 현재 상태

### 코드
- **GitHub Repo**: https://github.com/ice-grey/classic-performance-mvp
- **출처**: Google AI Studio에서 생성된 프로토타입을 export한 코드
- **로컬 위치**: `/Users/icegrey/Downloads/classic공연검색mvp`

### 기술 스택
| 영역 | 사용 기술 |
|---|---|
| 빌드 도구 | Vite |
| 프레임워크 | React + TypeScript |
| AI | Google Gemini API |
| 환경변수 | `GEMINI_API_KEY` (1개) |

### 파일 구조
```
classic-performance-mvp/
├── components/
├── services/         # Gemini API 호출 로직 추정
├── migrated_prompt_history/
├── App.tsx
├── index.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── types.ts
```

---

## 3. 데이터 소스 계획

### MVP (Phase 1)
- **한국 공연**: KOPIS (공연예술통합전산망) OpenAPI
  - 신청: https://kopis.or.kr/por/cs/openapi/openApiInfo.do
  - 장르 필터: **클래식만** (다른 장르는 절대 노출 X)
  - ⚠️ API 키 신청 필요 (승인 1~2일)

### Phase 2 (사용자 확보 후)
- **해외 공연**: Ticketmaster Discovery API 또는 Bachtrack 스크래핑
- 단계적으로 힙합/R&B 장르 확장

---

## 4. 향후 기능 로드맵

### MVP에 들어갈 기능
1. ✅ 공연 검색 (지역/날짜 필터)
2. ✅ 공연 상세 페이지
3. ⬜ 회원가입/로그인 (이메일 + 구글 OAuth) — Supabase 추천
4. ⬜ 스크랩(찜) 기능
5. ⬜ 마이페이지 (내 스크랩 목록)

### DB 설계 시 미리 고려할 사항 (수익화 대비)
- `users` 테이블에 `subscription_tier` 컬럼 (free/premium)
- `performances`에 `is_premium_only` 플래그 (프리미엄 알림 등)
- `referral_clicks` 테이블 (제휴 링크 추적용)

---

## 5. 🚨 지금 당장 해결해야 할 이슈

### 🔴 우선순위 1: Gemini API 키 보안 처리

**문제**:
- 현재 Vite 프론트엔드만 있는 구조
- 환경변수가 `VITE_GEMINI_API_KEY` 같이 클라이언트에 노출되면
  → 누구나 브라우저 F12로 키 탈취 가능
  → 사용자가 내 키로 Gemini 호출 → **내 계정에 청구**

**해결책: Vercel Serverless Function으로 키 숨기기**

구현 방향:
1. `/api/gemini.ts` (또는 `.js`) 파일을 프로젝트 루트에 생성
2. 이 함수에서 `process.env.GEMINI_API_KEY` 사용 (서버사이드라 안전)
3. 프론트엔드는 `/api/gemini`로 fetch 요청
4. Vercel 환경변수에 `GEMINI_API_KEY` 등록 (VITE_ 접두사 X)

**작업 순서**:
- [ ] `services/` 폴더 안 Gemini 호출 코드 확인
- [ ] `vite.config.ts`에서 환경변수 처리 방식 확인
- [ ] `/api/` 폴더 생성하고 Serverless Function 작성
- [ ] 프론트엔드 fetch 경로 수정
- [ ] 로컬 테스트 (`vercel dev` 또는 `npm run dev`)

### 🟡 우선순위 2: Vercel 배포

준비물:
- Vercel 계정 (GitHub로 가입)
- Gemini API 키 (https://aistudio.google.com/apikey)

배포 설정:
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `GEMINI_API_KEY` (절대 `VITE_` 접두사 X)

---

## 6. Claude Code에게 요청할 작업 (제안)

```
이 프로젝트의 CONTEXT.md를 먼저 읽어주세요.

다음 작업을 순서대로 진행해주세요:

1. services/ 폴더 안의 Gemini API 호출 코드를 분석하고,
   현재 어떻게 키를 사용하는지 알려주세요.

2. Gemini API 키가 클라이언트에 노출되지 않도록
   Vercel Serverless Function (/api/gemini.ts)로 리팩토링해주세요.

3. 변경사항을 git commit하고 push해주세요.

4. Vercel 배포 단계를 안내해주세요.
   (저는 Vercel 처음 써봅니다)
```

---

## 7. 참고 사항

- **개발 환경**: macOS, 사용자 경로 `/Users/icegrey/`
- **개발 경험**: 바이브코딩 위주, 터미널 작업은 익숙하지 않음
- **AI Studio 원본 링크**: https://ai.studio/apps/b890d727-6a1f-47f0-9d7c-12a049fbbde3
- **이전 대화 요약**:
  - AI Studio 프로토타입 → GitHub 푸시 완료
  - 다음 단계는 보안 처리 + Vercel 배포

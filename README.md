# 재몬수학

6~8세 어린이를 위한 LEVEL별 덧셈/뺄셈 문제 출제, 손글씨 입력, Google Vision AI 기반 숫자 인식, 로컬 기록 대시보드 웹 앱입니다.

## 실행

```bash
npm install
npm run dev
```

Google Vision AI 사용을 위해 `.env.local`에 API 키를 넣어주세요.

```bash
GOOGLE_VISION_API_KEY=your_google_cloud_vision_api_key
```

## 배포

- Vercel Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `GOOGLE_VISION_API_KEY`
- PWA 파일: `public/manifest.webmanifest`, `public/service-worker.js`

## 개발 로드맵

| 단계 | 작업 코드 | 작업 내용 | 완료 여부 |
| --- | --- | --- | --- |
| 1단계: 환경 설정 | T1-1 | React + Vite + Tailwind CSS 초기 프로젝트 환경 세팅 | [X] |
| 1단계: 환경 설정 | T1-2 | 비비드 톤과 귀여운 스타일의 기본 레이아웃 및 라우팅 프레임 구축 | [X] |
| 2단계: 수학 문제 | T2-1 | 6~8세 타겟 LEVEL별(LV1~LV3) 덧셈/뺄셈 무작위 문제 생성 로직 구현 | [X] |
| 2단계: 수학 문제 | T2-2 | 문제 출제 화면 및 정답/오답 처리를 위한 상태(State) 바인딩 | [X] |
| 3단계: 손글씨 패드 | T3-1 | HTML5 Canvas 기반의 터치/마우스 인식 드로잉 패드(컴포넌트) 구현 | [X] |
| 3단계: 손글씨 패드 | T3-2 | 아이패드/태블릿 대응 애플 펜슬 및 터치 드로잉 최적화 | [X] |
| 4단계: AI 채점 | T4-1 | TensorFlow.js 및 MNIST 숫자 인식 경량 모델 로드 기능 추가 | [X] |
| 4단계: AI 채점 | T4-2 | 캔버스 이미지를 28x28 픽셀로 변환하여 AI 모델로 정답 예측 및 채점 연동 | [X] |
| 5단계: 데이터/UI | T5-1 | 로컬 스토리지를 연동하여 날짜별 맞은 개수 및 누적 점수 저장 기능 구현 | [X] |
| 5단계: 데이터/UI | T5-2 | 누적 학습 기록을 한눈에 볼 수 있는 대시보드 페이지 제작 | [X] |
| 6단계: 연동 및 배포 | T6-1 | 전체 흐름 통합 테스트 | [X] |
| 6단계: 연동 및 배포 | T6-2 | Vercel 최종 배포 및 PWA 확인 | [X] |

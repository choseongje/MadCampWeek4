# Music Meow

## Outline

![YaOng4](https://github.com/user-attachments/assets/682e29e2-e0b1-41d4-b265-0dce5bf86ddb)


음악은 추억을 담는 법, 자신의 추억을 음악과 함께 공유해보세요!

YaOng 4는 스포티파이 뮤직 플레이어, 커뮤니티, 비주얼라이저를 함께 즐길 수 있는 웹서비스입니다.

**Tech Stack**

- Front-End : next.js, typescript
- Server : node.js
- DB : mySQL
- IDE : Visual Studio Code
- Publish : Netlify, Google cloud

## Team

조성제

[choseongje - Overview](https://github.com/choseongje)

한종국

[jkookhan03 - Overview](https://github.com/jkookhan03)

## Details

## Login

- 로그인

<img width="1440" alt="스크린샷 2024-07-25 오후 4 13 00" src="https://github.com/user-attachments/assets/e4c1215d-b530-4f0c-b8bf-7c80644baa80">


## Main page

- 메인 화면


Uploading 화면 기록 2024-07-25 오후 4.24.59.mov…


## Player

- 스포티파이 뮤직 플레이어

### Player Page

- **기능**: 플레이어 페이지에서는 Spotify API를 통해 음악을 재생할 수 있습니다.
- **동작 방식**:
    - `access_token`을 사용하여 Spotify API에 접근합니다.
    - Spotify 웹 재생 SDK를 사용하여 웹 플레이어를 초기화합니다.
    - 음악 재생, 일시정지, 재개 등의 기능을 제공합니다.
    - 현재 재생 중인 곡의 정보(앨범 이미지, 트랙 이름, 아티스트 이름)를 업데이트합니다.
    - 현재 재생 중인 곡의 가사와 번역된 가사를 가져옵니다.
        - 가사는 Musixmatch API를 통해 가져오고, 받아온 가사가 한국어가 아닐 경우, Open AI API를 사용하여 가사를 번역시킵니다.

### Search Component

- **기능**: 사용자가 원하는 곡을 검색하고 재생하거나 재생 대기 목록에 추가합니다.
- **동작 방식**:
    - 사용자가 입력한 검색어로 Spotify에서 곡을 검색합니다.
    - 검색 결과를 보여주고, 사용자가 곡을 선택하면 재생하거나 재생 대기 목록에 추가합니다.


### Playlist Component

- **기능**: 사용자의 Spotify 플레이리스트를 보여주고, 선택한 플레이리스트를 재생 대기 목록에 추가합니다.
- **동작 방식**:
    - `access_token`을 사용하여 사용자의 Spotify 플레이리스트를 가져옵니다.
    - 가져온 플레이리스트를 보여주고, 사용자가 선택한 플레이리스트를 재생 대기 목록에 추가합니다.

### 주요 함수 설명

- **fetchLyrics**
    
    현재 재생 중인 곡의 가사와 번역된 가사를 가져옵니다.
    
- **handlePlay**
    
    선택한 곡을 재생합니다.
    
- **handlePause**
    
    현재 재생 중인 곡을 일시정지합니다.
    
- **handleResume**
    
    일시정지된 곡을 다시 재생합니다.
    
- **toggleFullscreen**
    
    플레이어의 전체 화면 모드를 켜고 끕니다.
    
- **handleAddToQueue**
    
    선택한 곡을 재생 대기 목록에 추가합니다.
    
- **handleQueueTrackPlay**
    
    재생 대기 목록에서 선택한 곡을 재생합니다.
    
- **handleCreatePlaylistClick** 및 **handleCreatePlaylistSubmit**
    
    새로운 플레이리스트를 생성합니다. 사용자가 입력한 플레이리스트 이름과 재생 대기 목록에 있는 곡들을 포함하여 새로운 플레이리스트를 생성합니다.
    

## Community

- 음악 추억 공유


### Community Page

- **기능**: 커뮤니티 페이지를 구성하여 게시글 목록을 보여줍니다.
- **동작 방식**:
    - 서버에서 게시글 목록을 가져와 `posts` 상태에 저장합니다.
    - 각 게시글을 클릭하면 애니메이션 효과와 함께 해당 게시글의 상세 페이지로 이동합니다.
    - 로고를 클릭하면 홈 페이지로 이동합니다.

### PostDetail Component

- **기능**: 선택된 게시글의 상세 내용을 보여줍니다.
- **동작 방식**:
    - 게시글 ID를 URL에서 가져와 서버로부터 해당 게시글의 세부 정보를 가져옵니다.
    - 게시글의 배경 이미지와 콘텐츠(텍스트 및 음악 정보)를 보여줍니다.
    - 사용자는 게시글 내용을 드래그하거나 리사이즈할 수 없습니다(보기 전용).


### CreatePostPage Component

- **기능**: 새로운 게시글을 작성하고 서버에 저장합니다.
- **동작 방식**:
    - 사용자는 제목을 입력하고, 드래그 가능한 박스를 추가하여 텍스트나 음악 트랙을 삽입할 수 있습니다.
    - 배경 이미지나 배경 묘사를 통해 자동 생성된 이미지를 설정할 수 있습니다.
    - 작성한 게시글을 서버에 저장하고 커뮤니티 페이지로 이동합니다.

### SearchTrack Component

- **기능**: 사용자가 원하는 곡을 검색하여 선택할 수 있게 합니다.
- **동작 방식**:
    - 사용자가 입력한 검색어를 바탕으로 Spotify에서 트랙을 검색합니다.
    - 검색 결과를 보여주고, 사용자가 곡을 선택하면 선택한 곡의 정보를 `onTrackSelect` 함수로 전달합니다.

### 주요 함수 설명

- **handlePostClick**
    - **역할**: 게시글을 클릭하면 클론 애니메이션 효과를 적용하고, 애니메이션이 끝나면 상세 페이지로 이동합니다.
- **handleLogoClick**
    - **역할**: 로고를 클릭하면 홈 페이지로 이동합니다.
- **fetch**
    - **역할**: 서버로부터 데이터를 가져오는 데 사용됩니다. 여기서는 게시글 목록과 세부 정보를 가져오는 데 사용됩니다.
- **addBox**
    - **역할**: 새로운 드래그 가능한 박스를 추가합니다.
- **moveBox**
    - **역할**: 드래그된 박스의 위치를 업데이트합니다.
- **resizeBox**
    - **역할**: 리사이즈된 박스의 크기를 업데이트합니다.
- **changeColor**
    - **역할**: 선택한 박스의 색상을 변경합니다.
- **handleTrackSelect**
    - **역할**: 검색된 곡을 선택하면 새로운 박스를 추가하고 선택한 곡의 정보를 삽입합니다.
- **handleTextChange**
    - **역할**: 박스 내 텍스트를 변경합니다.
- **openBackgroundModal** 및 **closeBackgroundModal**
    - **역할**: 배경 설정 모달을 열고 닫습니다.
- **openMusicModal** 및 **closeMusicModal**
    - **역할**: 음악 검색 모달을 열고 닫습니다.
- **generateBackground**
    - **역할**: 배경 묘사를 바탕으로 서버에서 이미지를 생성하여 배경 이미지로 설정합니다.
- **handleImageUpload**
    - **역할**: 사용자가 업로드한 이미지를 서버에 저장하고, 이를 배경 이미지로 설정합니다.
- **handleSubmit**
    - **역할**: 작성한 게시글을 서버에 저장하고 커뮤니티 페이지로 이동합니다.

### 요약

- 이 코드베이스는 사용자가 커뮤니티에서 게시글을 작성하고, 다른 게시글을 볼 수 있는 기능을 제공합니다. 게시글에는 텍스트, 음악 트랙, 배경 이미지 등을 추가할 수 있습니다. 작성된 게시글은 서버에 저장되고, 커뮤니티 페이지에서 목록 형태로 보여집니다.

## 2D Visualizer

### 2D Visualizer Page


- **기능**: 사용자가 오디오 파일을 업로드하고 다양한 형태의 시각화를 통해 음악을 즐길 수 있게 합니다.
- **주요 기능**:
    1. **오디오 파일 업로드**: 사용자가 오디오 파일을 선택하여 업로드할 수 있습니다.
    2. **시각화 유형 선택**: 사용자가 기본, 원형, 파형, 방사형 시각화 중 하나를 선택할 수 있습니다.
    3. **재생/일시정지**: 오디오 파일을 재생하거나 일시정지할 수 있습니다.
    4. **로고 클릭 시 홈으로 이동**: 로고를 클릭하면 홈 페이지로 이동합니다.
    
- Visualizer 종류
    
    ### BasicVisualizer Component
    
    - **기능**: 업로드된 오디오 파일의 주파수 데이터를 기본 막대 그래프로 시각화합니다.
    
    ### CircularVisualizer Component
    
    - **기능**: 업로드된 오디오 파일의 주파수 데이터를 원형 막대 그래프로 시각화합니다.
    
    ### RadialVisualizer Component
    
    - **기능**: 업로드된 오디오 파일의 주파수 데이터를 방사형 그래프로 시각화합니다.
    
    ### WaveformVisualizer Component
    
    - **기능**: 업로드된 오디오 파일의 파형 데이터를 선 그래프로 시각화합니다.

### 주요 함수 설명

- **useState**
    - **역할**: 상태 관리를 위해 사용됩니다. 오디오 파일, 시각화 유형, 재생 상태 등을 관리합니다.
- **useRouter**
    - **역할**: 페이지 간 이동을 위해 사용됩니다.
- **useEffect**
    - **역할**: 오디오 파일 변경 시 오디오 컨텍스트와 시각화를 설정하고, 재생 상태를 관리합니다.
- **handleFileChange**
    - **역할**: 사용자가 파일을 업로드할 때 호출되며, 파일 정보를 상태에 저장합니다.
- **handleVisualizerChange**
    - **역할**: 시각화 유형이 변경될 때 호출되며, 선택된 시각화 유형을 상태에 저장합니다.
- **handlePlayPause**
    - **역할**: 재생/일시정지 버튼이 클릭될 때 호출되며, 재생 상태를 토글합니다.
- **handleLogoClick**
    - **역할**: 로고 클릭 시 홈 페이지로 이동합니다.

### 요약

- 이 코드베이스는 사용자가 오디오 파일을 업로드하고 다양한 형태의 시각화를 통해 음악을 즐길 수 있는 웹 애플리케이션을 제공합니다. 기본, 원형, 파형, 방사형 시각화 중에서 선택할 수 있으며, 재생/일시정지 기능을 통해 음악을 제어할 수 있습니다. 각 시각화 컴포넌트는 업로드된 오디오 파일을 시각화하기 위해 `AudioContext`와 `AnalyserNode`를 사용합니다.

## 3D Visualizer

### 3D Visualizer Page



- **기능**: 3D 오디오 시각화 페이지를 구성합니다.
- **주요 기능**:
    1. **로고 클릭 시 홈으로 이동**: 로고를 클릭하면 홈 페이지로 이동합니다.
    2. **ThreeDVisualizer 컴포넌트를 포함**: 페이지 내에서 3D 오디오 시각화를 담당하는 ThreeDVisualizer 컴포넌트를 렌더링합니다.

### 3D Visualizer Component

- **기능**: 업로드된 오디오 파일을 분석하여 3D 물결파 형태로 시각화합니다.
- **주요 기능**:
    1. **오디오 파일 업로드**: 사용자가 오디오 파일을 선택하여 업로드할 수 있습니다.
    2. **오디오 재생 및 일시정지**: 업로드된 오디오 파일을 재생하거나 일시정지할 수 있습니다.
    3. **3D 시각화**: 오디오 주파수 데이터를 분석하여 3D 물결파 형태로 시각화합니다.

### 주요 함수 설명

- **handleFileUpload**
    - **역할**: 사용자가 오디오 파일을 업로드할 때 호출되며, 오디오 파일을 읽고 분석할 준비를 합니다.
    - **동작 방식**:
        - 파일을 읽어 `AudioContext`로 디코딩합니다.
        - 디코딩된 오디오 데이터를 `AnalyserNode`와 연결하여 주파수 데이터를 분석할 준비를 합니다.
- **togglePlayPause**
    - **역할**: 오디오 파일의 재생과 일시정지를 토글합니다.
    - **동작 방식**:
        - 현재 재생 중이면 오디오를 일시정지하고, 재생 중이 아니면 오디오를 재생합니다.
        - 오디오가 재생되면 시각화가 시작됩니다.
- **useEffect** (3D 시각화 초기화 및 애니메이션)
    - **역할**: 오디오 컨텍스트와 분석기가 준비되면 3D 장면을 설정하고 애니메이션을 시작합니다.
    - **동작 방식**:
        - Three.js를 사용하여 3D 장면, 카메라, 렌더러를 초기화합니다.
        - OrbitControls를 설정하여 카메라를 제어합니다.
        - 주파수 데이터에 기반하여 물결파를 생성하고 애니메이션을 업데이트합니다.
        - 애니메이션 루프를 통해 시각화를 지속적으로 업데이트합니다.

### 시각화 상세 설명

- **createWave**
    - **역할**: 새로운 물결파를 생성합니다.
    - **동작 방식**:
        - 주파수 데이터의 세기에 따라 높이를 설정하여 물결파를 생성합니다.
        - 일정 시간이 지나면 물결파를 제거합니다.
- **animate**
    - **역할**: 애니메이션 루프를 통해 3D 장면을 지속적으로 업데이트합니다.
    - **동작 방식**:
        - `requestAnimationFrame`을 사용하여 애니메이션을 지속적으로 호출합니다.
        - 분석된 주파수 데이터를 사용하여 물결파의 크기를 업데이트하고, 필요한 경우 새로운 물결파를 생성합니다.
        - OrbitControls를 업데이트하여 카메라 제어를 유지합니다.
        - Three.js 렌더러를 사용하여 장면을 렌더링합니다.

### 요약

이 코드베이스는 사용자가 오디오 파일을 업로드하고 3D 시각화를 통해 오디오 데이터를 시각적으로 즐길 수 있는 기능을 제공합니다. Three.js와 AudioContext를 사용하여 오디오 데이터를 분석하고, 주파수 데이터에 따라 3D 물결파 형태로 시각화합니다. 사용자는 오디오 파일을 재생하거나 일시정지할 수 있으며, 로고를 클릭하여 홈 페이지로 이동할 수 있습니다.

## YaOng 4 API 명세서

### 서버 기본 정보

- 기본 URL: `http://172.10.7.88`
- 포트: 80

### 공통 응답 코드

- **200**: 성공
- **201**: 생성됨
- **400**: 잘못된 요청
- **403**: 접근 금지
- **404**: 찾을 수 없음
- **500**: 서버 오류

### YaOng 4 API 명세서

| 기능 | HTTP Method | API 경로 | 요청 | 응답 |
| --- | --- | --- | --- | --- |
| 이미지 생성 | POST | /generate-image | { "description": "string" } | { "imageUrl": "uploads/<image_filename>.png" } |
| 이미지 업로드 | POST | /upload-image | image (file) | { "imageUrl": "uploads/<image_filename>" } |
| 가사 가져오기 | GET | /lyrics | track (string), artist (string), targetLang (string) | { "original": "원본 가사", "translated": "번역된 가사" (선택 사항) } |
| 사용자 저장 | POST | /saveUser | { "id": "string", "email": "string", "display_name": "string", "country": "string", "followers": number, "profile_image_url": "string", "product": "string" } | 상태 코드: 200 OK 본문: 사용자 저장 성공 메시지. |
| 게시물 저장 | POST | /posts | { "title": "string", "content": "string", "backgroundImage": "string" (선택 사항) } | { "success": true, "id": number } |
| 게시물 불러오기 | GET | /posts |  | [ { "id": number, "title": "string", "content": "string", "backgroundImage": "string" (선택 사항) }, ... ] |
| 개별 게시물 불러오기 | GET | /posts/:id | id (number) | { "id": number, "title": "string", "content": "string", "backgroundImage": "string" (선택 사항) } |


### 데이터베이스 스키마

![4주차 DB](https://github.com/user-attachments/assets/b1d309a5-8c48-43e4-a83d-100a6ed54c97)


### 후기

- 조성제

평소에 관심 있는 주제인 음악에 대한 기능들을 개발하니까 뭐가 잘 안 돼도 그냥 재미있었다. 앞으로도 개발 공부를 할 때 관심 있는 주제들을 녹여내서 프로젝트들을 만들어봐야겠다.

next랑 타입스크립트를 써보면서 새로운 경험이 쌓인 것 같아서 좋았다. 하지만 이 툴들의 장점들을 활용한 것 같지는 않아서 많이 아쉽다. 해당 프레임워크에 대한 지식이 없는 채로 개발을 하니까 오히려 불편한 점이 많았다. 다음에는 어떤 언어와 프레임워크를 사용할지 정한 후 그 특성에 맞는 서비스를 만들어보고 싶다.

- 한종국

내가 음악을 들으면서 느꼈던 감정들이나 경험을 공유하고 싶어서 이 프로젝트를 진행했다. 평소에 가장 관심이 많던 음악과 관련된 주제로 프로젝트를 하니 일주일 내내 즐겁게 코딩할 수 있었다. 평소에 밴드 음악을 들으며 느꼈던 박자감을 파도에 비유하여 표현한 3D 비주얼라이저로 표현해볼 수 있어서 굉장히 재미있었다.

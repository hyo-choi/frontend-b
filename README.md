<div align="center">
<h1>🏓 PONG Client</h1>

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React-Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Storybook](https://img.shields.io/badge/storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)


</div>

<br>

## ℹ️ 프로젝트 정보
**[PONG](https://github.com/404-DriverNotFound/ft_transcendence-b)의 클라이언트 레포지토리입니다.**

🔗 **Storybook**: https://master--6208487d2b51c1003ae8ae5e.chromatic.com/

### 개발 기간
2021.07.19 ~ 2021.10.08 (약 3개월)

### 개발 목적
PONG 프로젝트의 클라이언트를 개발합니다.

### 개발 내용
Pong 게임을 할 수 있는 웹 어플리케이션 개발
- Pong 게임
  - 승패에 따른 전적 시스템
  - 유저 초대 및 관전
- 커뮤니티
  - 유저 친구 추가 및 차단
  - 유저 프로필 확인 가능
- DM
  - 임의 유저와의 DM
- 채널
  - 채널 개설 및 채널 내 채팅
  - admin page를 통한 채널 유저 관리
- 인증
  - 42 시스템의 OAuth를 이용한 회원가입 및 로그인
  - Google Authenticator를 이용한 2FA 로그인
- 기타
  - 서비스 내 업적 달성 요소

<br />

## 🧑‍🤝‍🧑 프론트엔드 팀 소개
<table align="center">
  <tr>
    <td align="center"><a href="https://github.com/hyo-choi"><img src="https://avatars.githubusercontent.com/u/57004991?s=150" /></a></td>
    <td align="center"><a href="https://github.com/PennyBlack2008"><img src="https://avatars.githubusercontent.com/u/59194905?s=150" /></a></td>
  </tr>
  <tr>
    <td align="center"><b>최효정</b> @hyo-choi</td>
    <td align="center"><b>강진우</b> @PennyBlack2008</td>
  </tr>
</table>

<br />

## 🪄 프로젝트 실행 방법

> ⚠️ **NOTE**  
  API 서버 및 42 system OAuth와 연동된 프로젝트이므로 클라이언트만 실행시킨 경우 실제 동작을 확인할 수 없습니다. 실제 동작을 확인하고 싶으신 경우 [프로젝트 총괄 레포지토리](https://github.com/404-DriverNotFound/ft_transcendence-b)의 Getting Started를 확인해주세요.


1. git clone하여 프로젝트를 내려받습니다.
   ```bash
   git clone https://github.com/OnBoarding-Park-is-best/week2-partners-dashboard.git
   ```
2. 아래 커맨드로 패키지를 설치합니다.
   ```bash
   yarn install
   ```
3. 아래 커맨드로 프로젝트를 실행합니다.
   ```bash
   yarn start
   ```

## 📂 디렉토리 구조
```bash
.
├── public
│   └── images
└── src
    ├── components
    │   ├── atoms
    │   │   ├── Avatar
    │   │   ├── Button
    │   │   ├── ChatInput
    │   │   ├── DigitInput
    │   │   ├── Input
    │   │   ├── List
    │   │   ├── ListClickItem
    │   │   ├── ListItem
    │   │   ├── Switch
    │   │   └── Typo
    │   ├── molecules
    │   │   ├── Dialog
    │   │   ├── GameOptionCard
    │   │   ├── Menu
    │   │   ├── SubMenu
    │   │   └── UserProfile
    │   ├── organisms
    │   │   ├── AchieveListItem
    │   │   ├── ChannelInfoForm
    │   │   ├── ChannelListItem
    │   │   ├── ChannelUserListItem
    │   │   ├── ChatMessage
    │   │   ├── DMListItem
    │   │   ├── GameListItem
    │   │   ├── MatchListItem
    │   │   ├── PlayerProfile
    │   │   ├── ProfileCard
    │   │   └── UserInfoForm
    │   ├── pages
    │   │   ├── ChannelManagePage
    │   │   ├── ChannelPage
    │   │   ├── ChatPage
    │   │   ├── CommunityPage
    │   │   ├── DMPage
    │   │   ├── GamePage
    │   │   ├── GamePlayPage
    │   │   ├── GameWatchPage
    │   │   ├── LoginPage
    │   │   ├── MFAPage
    │   │   ├── MFARegisterPage
    │   │   ├── ProfilePage
    │   │   └── RegisterPage
    │   └── templates
    │       ├── LoginTemplate
    │       └── MainTemplate
    ├── types
    └── utils
        ├── game
        └── hooks
```

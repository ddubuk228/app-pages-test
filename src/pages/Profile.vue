<template>
    <div class="card" :class="{ 'darkTheme': userInfo.theme }">
      <div class="card-header">
        <h3 class="card-title mb-0">{{ t('profile') }}</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <img src="../../public/assets/profile.png" alt="프로필 이미지" class="profile-img" width="150"  />
          </div>
          <div class="form-group">
            <label for="name">{{ t('name') }}</label>
            <input type="text" class="form-control" id="name" v-model="userInfo.name" :placeholder="$t('enterName')" required />
          </div>
          <div class="form-group">
            <label for="email">{{ t('email') }}</label>
            <input type="email" class="form-control" id="email" v-model="userInfo.email" :placeholder="$t('enterEmail')" required />
          </div>
          <div class="form-group">
            <label for="maxBudget">{{ t('maxBudget') }}</label>
            <input type="text" class="form-control" id="maxBudget" v-model="userInfo.maxBudget" :placeholder="$t('enterMaxBudget')" required />
          </div>
          <div class="switch-group">
            <label class="switch-label">{{ t('notification') }}</label>
            <div class="ios-switch">
              <input type="checkbox" id="notificationSwitch" v-model="userInfo.notification" @click="toggleNotification" />
              <label for="notificationSwitch"></label>
            </div>
  
            <label class="switch-label">{{ t('language') }}</label>
            <div class="ios-switch">
              <input type="checkbox" id="languageSwitch" v-model="userInfo.language" @click="toggleLanguageSwitch" />
              <label for="languageSwitch"></label>
            </div>
  
            <label class="switch-label">{{ t('theme') }}</label>
            <div class="ios-switch">
              <input type="checkbox" id="themeSwitch" v-model="userInfo.theme" @click="toggleThemeSwitch" />
              <label for="themeSwitch"></label>
            </div>
          </div>
  
          <br />
          <div class="button-group">
            <button type="button" class="btn btn-outline-warning" @click="editUser">{{ t('edit') }}</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12 text-center">
        <router-link to="/" class="btn btn-secondary">{{ t('mainPage') }}</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { useUserStore } from '@/store/user';
  import { useI18n } from 'vue-i18n';
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const { t, locale } = useI18n(); // 언어 설정을 위한 변수 선언
    
      const userInfo = ref({
        id: '1',
        name: '',
        email: '',
        maxBudget: '',
        notification: false,
        language: localStorage.getItem('userLanguage') === 'true', // 로컬 스토리지에 저장된 언어 설정을 가져와서 초기값으로 설정
        theme: localStorage.getItem('userTheme') === 'true',// 로컬 스토리지에 저장된 테마 설정을 가져와서 초기값으로 설정
      });

      const userStore = useUserStore(); // 유저 정보를 가져오기 위한 변수 선언
  
      // 유저 정보를 가져오는 함수
      const fetchUserData = async () => { 
        try {
          const user = await userStore.fetchUser();
          if (user) { 
            userInfo.value = { ...user }; // 유저 정보를 가져와서 userInfo에 저장
          }
        } catch (error) {
          console.error('데이터를 가져오는 도중 에러 발생:', error);
        }
      };
  
      // 페이지가 로드될 때 한 번만 실행되도록 onMounted 사용
      onMounted(() => {
        fetchUserData();
        userInfo.value.language = localStorage.getItem('userLanguage') === 'true'; // 로컬 스토리지에 저장된 언어 설정을 가져와서 초기값으로 설정
        locale.value = userInfo.value.language ? 'en' : 'ko'; // 언어 설정에 따라 화면에 보여지는 언어 변경
      });
  
      // 유저 정보 수정 함수
      const editUser = async () => {
        try{
          await userStore.editUser(userInfo.value); // 수정된 유저 정보를 저장
          fetchUserData(); // 수정된 유저 정보를 다시 가져옴

          localStorage.setItem('userLanguage', userInfo.value.language.toString()); // 수정된 언어 설정을 로컬 스토리지에 저장
          localStorage.setItem('userTheme', userInfo.value.theme.toString()); // 수정된 테마 설정을 로컬 스토리지에 저장
          locale.value = userInfo.value.language ? 'ko' : 'en'; // 언어 설정에 따라 화면에 보여지는 언어 변경
          window.location.reload(); // 페이지 업데이트
        }
        catch (error) {
          console.error('데이터를 수정하는 도중 에러 발생:', error);
        }
      };
  
      //알림 설정 함수
      const toggleNotification = () => {
        userInfo.value.notification = !userInfo.value.notification; 
      };
  
      //언어 변경 함수
      const toggleLanguageSwitch = () => {
        userInfo.value.language = !userInfo.value.language;
      };
      
      //테마 변경 함수
      const toggleThemeSwitch = () => {
        userInfo.value.theme = !userInfo.value.theme;
      };
  
      return {
        t,
        locale,
        userInfo,
        editUser,
        toggleNotification,
        toggleLanguageSwitch,
        toggleThemeSwitch,
      };
    },
  };
  </script>
  
  
  <style scoped>
  .card {
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    font-family: "MangoDdobak-B";
    font-size: 20px;
    border-radius: 15px; 
    width: 460px;
    border : 5px solid rgb(255, 232, 157);
  }
  
  .label {
    padding: 12px;
  }
  
  .button {
    width: 70px;
  }
  
  input,
  select {
    border: 2px solid rgb(243, 208, 91);
  }
  
  .profile-img {
    border-radius: 50%;
    margin-left: 135px;
  }
  
  .switch-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 22px;
    padding: 8px;
  }
  
  .switch-label {
    font-size: 13px; 
    margin-left: 5px;
    flex-basis: 4%; 
    white-space: nowrap;
  }
  
  .ios-switch {
    position: relative;
    display: inline-block;
    width: 100px;
    height: 34px;
    margin-left: 2px;
  }
  
  .ios-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .ios-switch label {
    position: absolute;
    top: 0;
    left: 6px;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    cursor: pointer;
    transition: 0.4s;
  }
  
  .ios-switch label:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 10px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
  
  .ios-switch input:checked + label {
    background-color: #ffc107;
  }
  
  .ios-switch input:checked + label:before {
    transform: translateX(47px);
  }
  
  .button-group {
    display: flex;
    margin-left: 180px;
    margin-top: 5px;
  }

  .darkTheme .ios-switch label {
  background-color: #666; 
}

.darkTheme .ios-switch input:checked + label {
  background-color: #ffc400; 
}

  @font-face {
    font-family: "MangoDdobak-B";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/MangoDdobak-B.woff2")
      format("woff2");
    font-weight: 700;
    font-style: normal;
  }
  </style>
  
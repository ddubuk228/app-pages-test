import { createApp } from 'vue'
import { createPinia  } from 'pinia'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';
import messages from './local.js'; // 언어 설정 파일 

const i18n = createI18n({
    legacy: false, // legacy 모드를 비활성화
    locale: 'ko',  // 기본 언어 설정
    fallbackLocale: 'en', // fallback 언어 설정
    messages, // 번역할 데이터
  });
  
  

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n);
app.mount('#app')

<template>
  <header>
    <router-link to="/" style="text-decoration: none; ">
      <h1>KD</h1>
    </router-link>

    <div class="menu"><router-link to="/trnsc">{{ t('history') }}</router-link></div>

    <button class="settings-button" @click="openSettings">
      <router-link to="/profile" style="text-decoration: none; color: black; /"><i class="fas fa-cog"></i></router-link>
    </button>
  </header>
</template>

<script>
import { useUserStore } from '@/store/user';
import { ref, onMounted } from 'vue';
import { useI18n } from "vue-i18n";
export default {
  setup() {
    const { t, locale } = useI18n();
    const userInfo = ref({ language: 'ko' });
    const userStore = useUserStore();

    const fetchUserData = async () => {
      try {
        const user = await userStore.fetchUser();
        if (user) {
          userInfo.value = { ...user };
        }
      } catch (error) {
        console.error('데이터를 가져오는 도중 에러 발생:', error);
      }
    };
    onMounted(() => {
      fetchUserData();
      userInfo.value.language = localStorage.getItem('userLanguage') === 'true';
      locale.value = userInfo.value.language ? 'en' : 'ko';
    });

    return {
      userTheme: localStorage.getItem('userTheme') === 'true',
      t,
      locale,
      userInfo
    };


  },
};
</script>

<style scoped>
header {
  background-color: #ffd780;
  color: #000;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
  border-radius: 5px;
  position: fixed;
  top: 0;
  z-index: 10;
  height: 80px;
}

.settings-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  outline: none;
}
.settings-button a {
  font-size: 30px;
}
.settings-button a:hover {
  opacity: 0.8;
}

h1 {
  color: #474745;
  margin: 0;
}

a {
  text-decoration: none;
  color: black;
  font-family: "MangoDdobak-B";
}

.menu a {
  font-size: 20px;
}
</style>

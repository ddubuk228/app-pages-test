<template>
  <div id="calendar" class="calendar">
    <div class="dropdown">
      <!-- 드롭다운 선택 영역, 클릭 시 toggleDropdown 함수 실행 -->
      <div class="dropdown-selected" @click="toggleDropdown" :class="{ 'dark-mode': userTheme }">
        {{ months[selectMonth - 1] }}{{ t('month') }}</div>
      <!-- 드롭다운 옵션들, dropdownOpen 값에 따라 표시 여부 결정 -->
      <div class="dropdown-options" v-if="dropdownOpen" :class="{ 'dark-mode': userTheme }">
        <!-- 각 월 옵션, 클릭 시 selectOption 함수 실행 -->
        <div class="dropdown-option" v-for="(month, index) in months" :key="index" @click.stop="selectOption(index + 1)"
          :class="{ 'dark-mode': userTheme }">
          {{ month }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useEntriesStore } from "../store/entries";
import { useUserStore } from '@/store/user';
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";

export default {
  data() {
    return {
      userTheme: localStorage.getItem('userTheme') === 'true'
    }
  },
  setup() {
    const store = useEntriesStore();
    const currentMonth = new Date().getMonth() + 1; // 현재 월 (1월은 0부터 시작하므로 +1)
    const selectMonth = ref(); // 선택된 월 변수 선언
    const dropdownOpen = ref(false); // 드롭다운 열림/닫힘 상태 변수
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']; // 월 목록 배열

    const userStore = useUserStore();
    const { t, locale } = useI18n();
    const userInfo = ref({ language: 'ko' });

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

    // 드롭다운 열림/닫힘 토글 함수
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    // 월 선택 함수
    const selectOption = (month) => {
      selectMonth.value = month;
      dropdownOpen.value = false;
    };

    // 선택된 월이 변경될 때마다 store에 설정
    watch(selectMonth, (newMonth) => {
      store.setMonth(newMonth);
    });


    onMounted(() => {
      selectMonth.value = store.selectMonth || currentMonth;
      store.setMonth(selectMonth.value);
      fetchUserData();
      userInfo.value.language = localStorage.getItem('userLanguage') === 'true';
      locale.value = userInfo.value.language ? 'en' : 'ko';
    });

    // 설정 이동 함수
    const openSettings = () => {
      console.log("Settings button clicked");
    };


    return {
      selectMonth,
      dropdownOpen,
      months,
      toggleDropdown,
      selectOption,
      openSettings,
      locale,
      userInfo,
      t,

    };
  }
}
</script>

<style scoped>
.calendar {
  border-radius: 10px;
}

.dropdown {
  position: relative;
  display: inline-block;
  width: 100px;
}

.dropdown-selected {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  text-align: center;
  border-radius: 0.375rem;
  background-color: rgb(255, 232, 157);
  font-family: "MangoDdobak-B";
}

.dropdown-options {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  border: 1px solid #ccc;
  position: absolute;
  width: 185px;
  background-color: white;
  z-index: 1000;
  border-radius: 0.375rem;
  background-color: #fff;
  padding: 1px;
  font-family: "MangoDdobak-B";
  left: -40px;
  margin-top: 1px;
}

.dropdown-option {
  padding: 10px;
  cursor: pointer;
  text-align: center;
  background-color: #fff;
  padding: 5px 10px;
}

.dropdown-option:hover {
  background-color: #f1f1f1;
  color: black;
}

.dark-mode {
  background-color: #333333;
  color: #ffffff;
}

.dark-mode .dropdown-selected {
  background-color: rgb(255, 232, 157);
  color: black;
}
</style>
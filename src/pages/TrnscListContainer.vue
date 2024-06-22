<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <!-- 날짜 선택 필터 -->
        <h2 class="text-center mb-4">
          <input type="date" v-model="selectedDate" class="form-control mb-2" />
        </h2>
        <div class="button">
          <!-- 수입 버튼 -->
          <button  :class="['btn', 'mr-2', { 'btn-warning': selectedType === 'income', 'btn-light': selectedType !== 'income' }]"
            @click="selectedType = 'income'">
            {{ t('income') }}
          </button>
          <!-- 지출 버튼 -->
          <button
            :class="[ 'btn', 'mr-2', 
              { 'btn-warning': selectedType === 'expense', 'btn-light': selectedType !== 'expense' }]"
            @click="selectedType = 'expense'">
            {{ t('expense') }}
          </button>
          <!-- 카테고리 선택 -->
          <select v-model="selectedCategory" class="form-control mb-2">
            <option value="">{{ t('category') }}</option>
            <option value="식비">{{ t('food') }}</option>
            <option value="교통비">{{ t('transportation') }}</option>
            <option value="통신비">{{ t('communication') }}</option>
            <option value="기타">{{ t('etc') }}</option>
          </select>
        </div>
      </div>
    </div>
    <!-- 거래 내역 리스트 컴포넌트 -->
    <div class="btnBox">
      <router-link to="/trnsc/add"><button class="addBtn">
          <i class="fa-solid fa-plus"></i>
        </button></router-link>
    </div>
    <TrnscList />
    <!-- 메인 페이지로 이동 버튼 -->
    <div class="row mt-4">
      <div class="col-12 text-center">
        <router-link to="/" class="btn btn-secondary">
          {{ t('mainPage') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useEntriesStore } from "../store/entries";
import { computed, ref, onMounted } from "vue";
import TrnscList from "./TrnscList.vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from '@/store/user';

export default {
  name: "TrnscListContainer",
  components: {
    TrnscList,
  },
  setup() {
    const store = useEntriesStore();
    const { t, locale } = useI18n();
    const userInfo = ref({ language: 'ko' });
    const userStore = useUserStore();

    // 사용자 데이터 가져오기
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

    // 컴포넌트 마운트 시 사용자 데이터와 언어 설정 초기화
    onMounted(() => {
      fetchUserData();
      userInfo.value.language = localStorage.getItem('userLanguage') === 'true';
      locale.value = userInfo.value.language ? 'en' : 'ko';
    });

    // 선택된 날짜, 유형, 카테고리 필터링
    const selectedDate = computed({
      get: () => store.selectedDate,
      set: (value) => store.setSelectedDate(value),
    });

    const selectedType = computed({
      get: () => store.selectedType,
      set: (value) => store.setSelectedType(value),
    });

    const selectedCategory = computed({
      get: () => store.selectedCategory,
      set: (value) => store.setSelectedCategory(value),
    });

    // 필터링된 거래 내역 가져오기
    const filteredEntries = computed(() => store.filteredEntries);

    // 거래 내역 편집
    const editEntry = (id) => {
      console.log("Edit entry", id);
    };

    // 거래 내역 삭제
    const deleteEntry = async (id) => {
      await store.deleteEntry(id);
    };

    // 거래 내역 가져오기
    store.fetchEntries();

    return {
      selectedDate,
      selectedType,
      selectedCategory,
      filteredEntries,
      editEntry,
      deleteEntry,
      userTheme: localStorage.getItem('userTheme') === 'false',
      t,
      locale,
      userInfo,
    };
  },
};
</script>

<style scoped>
.container {
  margin-top: 20px;
  font-family: "MangoDdobak-B";
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  display: flex;
  justify-content: space-between;
}

@font-face {
  font-family: "MangoDdobak-B";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/MangoDdobak-B.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
}

button {
  width: 80px;
}

select {
  width: 120px;
}

h2 {
  width: 300px;
}

.btn-light {
  background-color: white;
  border-color: rgb(207, 207, 207);
}

.form-control {
  border-color: rgb(207, 207, 207);
}

.transaction-item {
  margin-top: 20px;
  font-family: "MangoDdobak-B";
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mb-2 {
  text-align: center;
  margin-bottom: 0 !important;
}

.btnBox {
  position: fixed;
  text-align: right;
  width: 489px;
  z-index: 2;
  bottom: 35px;
}

.addBtn {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: none;
  background-color: rgb(255, 232, 157);
  font-size: 25px;
  line-height: 20px;
}
</style>

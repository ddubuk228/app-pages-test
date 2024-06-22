<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <!-- 거래 내역 리스트 -->
        <div v-for="(entry, index) in paginatedEntries" :key="index">
          <div class="transaction-item">
            <!-- 거래 내역 카드 불러오기 -->
            <TrnscListItem :entry="entry" @edit-entry="editEntry" @delete-entry="deleteEntry" /> 
          </div>
        </div>
      </div>
    </div>
    <!-- 페이지네이션 -->
    <nav aria-label="Page navigation" class="paging-box">
      <ul class="pagination justify-content-center mt-4">
        <!-- 이전 페이지 버튼 -->
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <button class="page-link" @click="prevPage">{{ t('previous') }}</button>
        </li>
        <!-- 페이지 번호 버튼 -->
        <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ 'active': page === currentPage }">
          <button v-if="page !== '...'" class="page-link" @click="goToPage(page)">{{ page }}</button>
          <span v-else class="page-link">...</span>
        </li>
        <!-- 다음 페이지 버튼 -->
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <button class="page-link" @click="nextPage">{{ t('next') }}</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { useEntriesStore } from "../store/entries";
import { computed, ref, onMounted } from "vue";
import TrnscListItem from "./TrnscListItem.vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from '@/store/user';

export default {
  name: "TrnscList",
  components: {
    TrnscListItem,
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

    // 페이지네이션 설정
    const itemsPerPage = 5;
    const currentPage = ref(1);

    const totalEntries = computed(() => filteredEntries.value.length);
    const totalPages = computed(() => Math.ceil(totalEntries.value / itemsPerPage));
    const paginatedEntries = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = currentPage.value * itemsPerPage;
      return filteredEntries.value.slice(startIndex, endIndex);
    });

    const visiblePages = computed(() => {
      const pages = [];
      if (totalPages.value <= 5) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage.value <= 3) {
          pages.push(1, 2, 3, 4, totalPages.value);
        } else if (currentPage.value >= totalPages.value - 2) {
          pages.push(1, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value);
        } else {
          pages.push(1,  currentPage.value - 1, currentPage.value, currentPage.value + 1, totalPages.value);
        }
      }
      return pages;
    });

    // 이전 페이지 이동
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // 다음 페이지 이동
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    // 특정 페이지로 이동
    const goToPage = (page) => {
      if (page !== '...') {
        currentPage.value = page;
      }
    };

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
      paginatedEntries,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      goToPage,
      editEntry,
      deleteEntry,
      visiblePages,
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
}

button {
  width: 70px;
  margin-left: 10px;
}

select {
  width: 120px;
  margin-left: 10px;
}

h2 {
  width: 300px;
}

.transaction-item {
  margin-top: 20px;
  font-family: "MangoDdobak-B";
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pagination {
  color: rgb(243, 208, 91);
  width: 412px;
}

.page-link {
  color: black;
  background-color: rgb(243, 208, 91);
  border: rgb(243, 208, 91);
  width: 60px;
}
.page-item:first-child .page-link{
  margin: 0;
}
</style>

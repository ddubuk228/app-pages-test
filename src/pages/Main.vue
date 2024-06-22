<template>
  <div class="calendar-box">
    <!-- 캘린더 컴포넌트 -->
    <Calendar />
  </div>
  <div class="summary">
    <!-- 월 수입 -->
    <div class="total card">
      <div class="card-body">
        {{ currentMonth }}{{ t('month') }}<br />
        {{ t('income') }}
      </div>
      <div class="amount" style="color: greenyellow;">
        {{ formatNumber(totalIncome) }}{{ t('won') }}
      </div>
    </div>
    <!-- 월 지출 -->
    <div class="total card">
      <div class="card-body">
        {{ currentMonth }}{{ t('month') }}<br />
        {{ t('expense') }}
      </div>
      <div class="amount" style="color: red;">
        {{ formatNumber(totalExpense) }}{{ t('won') }}
      </div>
    </div>
    <!-- 월 순수익 -->
    <div class="total card">
      <div class="card-body">
        {{ currentMonth }} {{ t('month') }}<br />
        {{ t('netProfit') }}
      </div>
      <div class="amount" style="color: blue;">
        {{ formatNumber(netProfit) }}{{ t('won') }}
      </div>
    </div>
  </div>
  <!-- 최근 거래내역 -->
  <div class="container">
    <div class="btnbox">
      <button class="btnlist">
        <router-link to="/trnsc" :style="{ color: userTheme ? 'white' : 'black', 'text-decoration': 'none' }">
          {{ t('listTransaction') }}</router-link>
      </button>
    </div>
    <div class="row">
      <div class="btnBox">
        <router-link to="/trnsc/add">
          <button class="addBtn">
            <i class="fa-solid fa-plus"></i>
          </button>
        </router-link>
      </div>
      <div class="col-12" v-for="(entry, index) in entries" :key="index">
        <div class="transaction-item">
          <TrnscListItem :entry="entry" @entry-deleted="fetchRecentEntries" />
        </div>
      </div>
    </div>
  </div>
  <!-- 차트 컴포넌트 -->
  <div class="chartBox">
    <Chart />
  </div>
</template>
<script>
import { useEntriesStore } from "../store/entries";
import { ref, onMounted, watch } from 'vue';
import TrnscListItem from "@/pages/TrnscListItem.vue";
import Calendar from "@/pages/Calendar.vue";
import Chart from './Chart.vue';
import { useI18n } from "vue-i18n";
import { useUserStore } from '@/store/user';
export default {
  components: { TrnscListItem, Chart, Calendar },
  setup() {
    const store = useEntriesStore();
    const totalIncome = ref(0);
    const totalExpense = ref(0);
    const netProfit = ref(0);
    const entries = ref([]);
    const currentMonth = ref();
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

    // 최근 거래 항목들을 가져오는 함수
    const fetchRecentEntries = async () => {
      try {
        await store.recentEntries();
        entries.value = store.entries;
      } catch (error) {
        console.error('Error fetching recent entries:', error);
      }
    };

    // 숫자 포맷
    const formatNumber = (number) => {
      return number.toLocaleString('ko-KR');
    };

    // 선택된 월이 변경될 때마다 총 수입, 총 지출, 순이익 갱신
    watch(
      () => store.selectMonth,
      async (newMonth) => {
        currentMonth.value = newMonth;
        totalIncome.value = await store.getTotalIncome(); // 총 수입 fetch 및 갱신
        totalExpense.value = await store.getTotalExpense(); // 총 지출 fetch 및 갱신
        netProfit.value = totalIncome.value - totalExpense.value; // 순이익 계산 및 갱신
      }
    );

    // 컴포넌트가 마운트될 때 초기 데이터 fetch 및 설정
    onMounted(async () => {
      await fetchRecentEntries(); // 최근 거래 항목들 fetch
      totalIncome.value = await store.getTotalIncome(); // 총 수입 fetch 및 갱신
      totalExpense.value = await store.getTotalExpense(); // 총 지출 fetch 및 갱신
      netProfit.value = totalIncome.value - totalExpense.value; // 순이익 계산 및 갱신
      currentMonth.value = store.selectMonth; // 현재 월 설정
    });

    return {
      totalIncome,
      totalExpense,
      netProfit,
      entries,
      currentMonth,
      formatNumber,
      userTheme: localStorage.getItem('userTheme') === 'true',
      t,
      locale,
      userInfo,
      fetchRecentEntries,
    };
  }
}
</script>

<style scoped>
.wrap {
  width: 80%;
  margin: 0 auto;
  position: relative;
}

.summary {
  margin: 0 auto;
  width: 400px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 120px);
  justify-content: space-between;
}

.total {
  margin-top: 20px;
  border: 5px solid rgb(255, 232, 157);
  height: 120px;
  text-align: center;
  border-radius: 0.375rem;
  font-family: "MangoDdobak-B";
}

.card-body {
  font-size: 17px;
  font-weight: bold;
  flex: 0;
  padding: 0;
  margin-top: 15px;
}

.container {
  margin-top: 20px;
  font-family: "MangoDdobak-B";
  position: relative;
}

.transaction-item {
  display: flex;
  justify-content: center;
  width: 100%;
}

.btnbox {
  text-align: right;
  padding-right: 16px;
  margin-bottom: 5px;
}

.btnlist {
  border: none;
  border-radius: 5px;
  background-color: inherit;
}

.amount {
  margin: 5px 0 0 0;
  padding: 0;
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

.calendar-box {
  text-align: center
}

.chartBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<template>
   <div class="title">{{ t('monthlyExpense') }}</div> <!--제목 지정-->
   <div class="chart-container">
      <div class="chart" :class="{ 'darkTheme': userInfo.theme }">
         <div v-for="(monthData, index) in monthlyData" :key="index" class="chart-bar"
            @mouseover="updatePosition($event, index)" @mouseout="clearTooltip"> <!--차트 구현 및 마우스 이벤트 생성-->
            <div class="chart-bar__inner">
               <div :class="['chart-bar__fill', getBarClass(getMonthTotal(monthData))]"
                  :style="{ height: getFillHeight(getMonthTotal(monthData)) }"> <!--차트 바 구현-->
               </div>
               <div class="chart-bar__tooltip" v-if="tooltipText" ref="tooltip"
                  :style="{ top: tooltipTop + 'px', left: tooltipLeft + 'px' }"> <!--툴팁 구현 및 위치 설정 -->
                  {{ tooltipText }}
               </div>
            </div>
            <strong class="fs-tiny fw-light">{{ getMonthName(index) }}</strong> <!--해당 차트의 월 표시-->
         </div>
      </div>
   </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue';
import { useEntriesStore } from '../store/entries';
import axios from 'axios';
import { useI18n } from "vue-i18n";
import { useUserStore } from '@/store/user';

export default {
   name: "Chart",
   setup() {
      //데이터 초기화
      const jsonData = ref(null);
      const monthlyData = reactive({});
      const MaxMonthTotal = ref(0);
      const entriesStore = useEntriesStore();
      const tooltipText = ref('');
      const tooltipTop = ref(0);
      const tooltipLeft = ref(0);
      const maxBudget = ref(0);
      const { t, locale } = useI18n();
      const userInfo = ref({ language: 'ko' });
      const userStore = useUserStore();

      //pinia 저장소를 이용한 users 데이터 가져오는 함수
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

      //언어 설정
      onMounted(() => {
         fetchUserData();
         userInfo.value.language = localStorage.getItem('userLanguage') === 'true';
         locale.value = userInfo.value.language ? 'en' : 'ko';
      });

      //pinia 저장소를 이용한 entries 데이터 가져오는 함수
      const fetchEntries = async () => {
         try {
            await entriesStore.fetchEntries();
            jsonData.value = entriesStore.entries;
            calculateMonthlyData();
         } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
         }
      };

      //axios를 이용한 users 데이터의 maxBudget을 가져오는 함수
      const fetchUser = async () => {
         try {
            const response = await axios.get('http://localhost:3000/users?_sort=-date');
            maxBudget.value = response.data[0].maxBudget;
         } catch (error) {
            console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
         }
      };

      //목표 금액 초과시 스타일 바꾸는 함수
      const getBarClass = (total) => {
         return total > maxBudget.value ? 'high-budget' : '';
      };

      //해당 월의 총 지출액을 구하는 함수
      const getMonthTotal = (monthData) => {
         return monthData
            .filter(item => item.type === "expense")
            .reduce((total, item) => total + item.amount, 0);
      };

      //차트의 월 표시하는 함수
      const getMonthName = (monthNumber) => {
         const monthNames = [
            "1", "2", "3", "4", "5", "6",
            "7", "8", "9", "10", "11", "12"
         ];
         return monthNames[monthNumber - 1];
      };

      //차트의 높이를 구하는 함수(가장 높은 지출액 기준)
      const getFillHeight = (total) => {
         if (MaxMonthTotal.value > 0) {
            if (MaxMonthTotal.value > maxBudget.value) {
               return Math.round((total / MaxMonthTotal.value) * 100) + "%";
            } else {
               return Math.round((total / MaxMonthTotal.value) * 80) + "%";
            }

         } else {
            return "0%";
         }
      };

      //월별 데이터 계산 함수
      const calculateMonthlyData = () => {
         if (!jsonData.value) return;
         for (let i = 1; i <= 12; i++) {
            monthlyData[i] = [];
         }

         jsonData.value.forEach(item => {
            const date = new Date(item.date);
            const month = date.getMonth() + 1;
            monthlyData[month].push(item);
         });

         MaxMonthTotal.value = Object.values(monthlyData).reduce((max, monthData) => {
            const total = getMonthTotal(monthData);
            return total > max ? total : max;
         }, 0);
      };

      //툴팁 위치 구현 함수
      const updatePosition = (event, monthIndex) => {
         const totalExpense = getMonthTotal(monthlyData[monthIndex]);
         tooltipText.value = `총 지출액: ${totalExpense}`;
         tooltipTop.value = event.clientY + 350;
         tooltipLeft.value = event.clientX + 60;
      };

      //툴팁 지우는 함수
      const clearTooltip = () => {
         tooltipText.value = '';
      };

      //컴포넌트 마운트 시 데이터 반환
      onMounted(async () => {
         try {
            await Promise.all([fetchEntries(), fetchUser()]);
         } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
         }
      });

      return {
         monthlyData,
         getMonthTotal,
         getMonthName,
         getFillHeight,
         tooltipText,
         updatePosition,
         clearTooltip,
         tooltipTop,
         tooltipLeft,
         getBarClass,
         t,
         locale,
         userInfo,
      };
   }
};
</script>
<style>
.chart-container {
   display: flex;
   justify-content: center;
   font-family: "MangoDdobak-B";
   width: 400px;
}

.chart {
   display: flex;
   justify-content: space-between;
   align-items: flex-end;
   padding: 10px;
   box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
   width: 600px;
   border: 5px solid rgb(255, 232, 157);
   border-radius: 5px;
}

.chart-bar {
   display: flex;
   flex-flow: column;
   justify-content: flex-end;
   align-items: center;
}

.chart-bar__inner {
   display: flex;
   justify-content: center;
   align-items: flex-end;
   width: 17px;
   height: 156px;
   margin-bottom: 4px;
   border-radius: 5px;
   background-color: #F2F2F2;
   box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 12px;
}

.chart-bar__fill {
   width: 100%;
   border-radius: 5px;
   background-color: #ffd780;
   transition: all 300ms ease-out;
}

.chart-bar__fill.high-budget {
   background-color: red;
}

.chart-bar__tooltip {
   position: absolute;
   left: 50%;
   transform: translateX(-50%);
   padding: 4px;
   border-radius: 5px;
   background-color: rgba(255, 255, 255, 0.1);
   font-size: 12px;
   color: #333;
   white-space: nowrap;
}

.title {
   font-family: "MangoDdobak-B";
   text-align: center;
}

.darkTheme {
   background-color: white;
   color: black;
}
</style>
<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content">
      <button class="modal-close is-large" aria-label="close" @click="close">Close</button>
      <div class="box">
        <!-- 모달창 내역 (날짜,거래 내역,거래 금액, 메모)-->
         <!--TrnscListItem에서 넘겨준 데이터를 받아옴-->
        <p><strong>{{ t('summaryTransaction') }}</strong></p>
          <p>{{ t('dateTransaction') }}: {{ transactionDate }}</p>
          <p>{{ t('history') }}: {{ transactionDetails }}</p>
          <p>{{ t('amount') }}: {{ amount }}</p>
          <p>{{ t('memo') }}: {{ memo }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user';
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
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
      
        return { t, locale, userInfo };
      },
    props: {
      show: Boolean,
      transactionDate: String,
      transactionDetails: String,
      amount: Number,
      memo: String,
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: none;
  justify-content: center;
  align-items: center;
}

.is-active {
  display: flex;
}

.modal-content {
  border: 3px solid rgb(255, 232, 157);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  height: 450px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 60px;
  height: 40px;
}

strong {
  font-size: 22px;
  color: rgb(248, 139, 6);
}
</style>

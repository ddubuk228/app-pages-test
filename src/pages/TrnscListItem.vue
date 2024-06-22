<template>
    <div class="card mb-3">
      <div class="card-header">
        <small class="text-muted">{{ entry.date }}</small>
      </div>
      <!-- 각각의 거래 내역 카드 -->
      <div class="card-body d-flex justify-content-between align-items-center">
        <div class="card-item" @click="toggleModal">
          {{ entry.account }} {{ entry.amount }}원
        </div>
        <div class="card-actions">
          <button @click="editEntry(entry.id)" class="btn btn-outline-warning">
            {{ t('edit') }}
          </button>
          <button @click="handleDelete(entry.id)" class="btn btn-outline-warning">
            {{ t('delete') }}
          </button>
        </div>
      </div>
      <!-- 모달 창 컴포넌트 -->
      <MemoModal :show="showModal" :transactionDate="entry.date" :transactionDetails="entry.account" :amount="entry.amount" :memo="entry.memo" @close="toggleModal" />
    </div>
  </template>
  
  <script>
  import { useEntriesStore } from "../store/entries";
  import { useUserStore } from '@/store/user';
  import { defineComponent, toRefs, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useI18n } from "vue-i18n";
  import { onMounted } from "vue";
  import MemoModal from "@/pages/MemoModal.vue"; // 모달 컴포넌트 임포트
  
  export default defineComponent({
    props: {
      entry: Object,
    },
    setup(props, { emit }) {
      const router = useRouter();
      const store = useEntriesStore();
      const userStore = useUserStore();
      const { deleteEntry } = store;
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
      onMounted(() => {
        fetchUserData();
        userInfo.value.language = localStorage.getItem('userLanguage') === 'true';
        locale.value = userInfo.value.language ? 'en' : 'ko';
      });
  
      const editEntry = (id) => {
        // 라우터를 사용하여 경로 이동 및 데이터 전달
        router.push({ path: `/trnsc/edit/${id}` });
      };
  
      // 모달 상태 관리
      const showModal = ref(false);
      const toggleModal = () => {
        showModal.value = !showModal.value;
      };

      const handleDelete = async(id)=> {
        try {
          await deleteEntry(id);
          emit('entry-deleted');
        } catch (error) {
          console.log(error)
        }
      };
  
      return {
        ...toRefs(props),
        editEntry,
        showModal,
        toggleModal,
        t,
        locale,
        userInfo,
        handleDelete
      };
    },
    components: {
      MemoModal,
    },
  });
  </script>
  
  
  <style scoped>
  .card {
    width: 400px; 
    margin-bottom: 20px; 
    border: 5px solid rgb(255, 232, 157);
  }
  .card-header {
    background-color: transparent;
    border-bottom: none;
    padding-bottom: 0;
  }
  .card-header small {
    font-size: 0.8rem;
  }
  .card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0;
  }
  .card-item {
    flex: 1;
    padding: 0 10px;
  }
  .card-actions {
    display: flex;
    gap: 10px;
  }
  </style>
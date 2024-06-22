<template>
    <div class="wrap" :class="{ 'dark-mode': userTheme }">
        <div class="box">
            <h1>NotFound</h1>
            {{ t('error') }}
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user';

export default {
    data() {
        return {
            userTheme: localStorage.getItem('userTheme') === 'true'
        }
    },
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
            t,
            locale,
        };
    }

}
</script>

<style scoped>
.wrap {
    width: 460px;
    height: 650px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dark-mode {
    background-color: black;
    color: white;
}
</style>
<template>
  <div id="wrap">
    <Header />
    <div class="content-container" :class="{ 'dark-mode': userTheme }">
      <router-view />
    </div>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  export default {
    name: "App",
    components: { Header },
    data() {
      return {
        userTheme: localStorage.getItem('userTheme') === 'true'
      };
    },
};
</script>


<style>
#wrap {
  background-color: #fff0c7; 
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 100vh; 
}

.content-container {
  background-color: #ffffff; 
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  padding: 20px;
  max-width: 500px; 
  margin-top: 100px;
}

.dark-mode {
  background-color: #333333; 
  color: #ffffff; 
}

</style>

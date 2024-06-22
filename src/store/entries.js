import { defineStore } from 'pinia';
import axios from 'axios';

export const useEntriesStore = defineStore('entries', {
  state: () => ({
    entries: [],            // 모든 거래 내역
    filteredEntries: [],    // 필터링된 거래 내역
    selectedDate: '',       // 선택된 날짜
    selectedType: '',       // 선택된 유형 (수입 또는 지출)
    selectedCategory: '',   // 선택된 카테고리
    totalIncome: 0,         // 총 수입
    totalExpense: 0,        // 총 지출
    selectMonth: "",        // 선택된 월
  }),

  actions: {
    // 거래 내역을 서버에서 가져오는 함수
    async fetchEntries() {
      try {
        const response = await axios.get('http://localhost:3000/transaction?_sort=-date');
        this.entries = response.data;
        this.filterEntries(); // 가져온 데이터를 필터링
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    // 특정 ID의 거래 내역을 서버에서 가져오는 함수
    async getEntryById(id) {
      try {
        const response = await axios.get(`http://localhost:3000/transaction/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching entry by id:', error);
      }
    },

    // 다음 ID를 가져오는 함수 (기존 거래 내역 중 가장 큰 ID에 1을 더한 값)
    async getNextId() {
      try {
        const response = await axios.get('http://localhost:3000/transaction');
        this.entries = response.data;
        let index = (this.entries.length) -1;
        let id = parseInt(this.entries[index].id);
        return String(id + 1);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    // 특정 ID의 거래 내역을 삭제하는 함수
    async deleteEntry(id) {
      try {
        await axios.delete(`http://localhost:3000/transaction/${id}`);
        this.entries = this.entries.filter(entry => entry.id !== id);
        this.filterEntries(); // 삭제 후 데이터를 필터링
        this.recentEntries()
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    },

    // 거래 내역을 필터링하는 함수
    filterEntries() {
      this.filteredEntries = this.entries.filter(entry => {
        return (!this.selectedDate || entry.date === this.selectedDate) &&
          (!this.selectedType || entry.type === this.selectedType) &&
          (!this.selectedCategory || entry.category === this.selectedCategory);
      });
    },

    // 선택된 월을 설정하는 함수
    setMonth(month) {
      this.selectMonth = month;
    },

    // 총 수입을 계산하는 함수
    async getTotalIncome() {
      try {
        const response = await axios.get(`http://localhost:3000/transaction?type=income`);
        this.entries = response.data;
        console.log(this.entries);

        const result = this.entries.reduce((prev, cur) => {
          let month = parseInt(cur.date.substring(5,7));
          if(month == this.selectMonth) {
            return prev += cur.amount;
          } else {
            return prev;
          }
        }, 0);
        console.log(result);
        this.totalIncome = result;
        return result;
      } catch (error) {
        console.error(error);
      }
    },

    // 총 지출을 계산하는 함수
    async getTotalExpense() {
      try {
        const response = await axios.get(`http://localhost:3000/transaction?type=expense`);
        this.entries = response.data;
        console.log(this.entries);

        const result = this.entries.reduce((prev, cur) => {
          let month = parseInt(cur.date.substring(5,7));
          if(month == this.selectMonth) {
            return prev += cur.amount;
          } else {
            return prev;
          }
        }, 0);

        console.log(result);
        this.totalExpense = result;
        return result;
      } catch (error) {
        console.error(error);
      }
    },

    // 최근 거래 내역을 가져오는 함수
    async recentEntries() {
      try {
        const response = await axios.get('http://localhost:3000/transaction?_sort=-date&&_limit=5');
        this.entries = response.data;
        console.log("Fetched recent entries:", this.entries);
      } catch (error) {
        console.error(error);
      }
    },

    // 선택된 날짜를 설정하는 함수
    setSelectedDate(date) {
      this.selectedDate = date;
      this.filterEntries(); // 날짜 설정 후 데이터를 필터링
    },

    // 선택된 유형(수입/지출)을 설정하는 함수
    setSelectedType(type) {
      this.selectedType = type;
      this.filterEntries(); // 유형 설정 후 데이터를 필터링
    },

    // 선택된 카테고리를 설정하는 함수
    setSelectedCategory(category) {
      this.selectedCategory = category;
      this.filterEntries(); // 카테고리 설정 후 데이터를 필터링
    }
  }
});

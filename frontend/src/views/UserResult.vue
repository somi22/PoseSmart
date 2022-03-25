<template>
  <div>
    <div
      class="mainImg"
      :style="{ backgroundImage: `url(${require('@/assets/transmain.png')})` }"
    >
      <div class="content" :style="{ top: '20%' }">
        <div>활동 내역</div>
      </div>
    </div>
    <div class="table">
      <v-data-table
        :headers="headers"
        :items="results"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event"
      ></v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        {
          text: "날짜",
          value: "date",
        },
        { text: "시작 시간", value: "startTime" },
        { text: "종료 시간 ", value: "endTime" },
        { text: "공부 시간", value: "studyTime" },
        { text: "거북목 횟수", value: "neckCount" },
        { text: "깜빡임 횟수", value: "eyeCount" },
        { text: "스트레칭 횟수", value: "stretchCount" },
      ],
      results: [
        {
          date: "22.03.21",
          startTime: "11:40",
          endTime: "14:10",
          studyTime: "2:30",
          neckCount: 54,
          eyeCount: 333,
          stretchCount: 22,
        },
      ],
    };
  },
});
</script>

<style scoped>
.table {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  color: black;
  font-weight: bold;
  z-index: 2;
  text-align: center;
  width: 1200px;
}
</style>

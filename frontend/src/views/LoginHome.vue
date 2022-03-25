<template>
  <div>
    <div
      class="loginImg"
      :style="{ backgroundImage: `url(${require('@/assets/main.jpg')})` }"
    >
      <div class="logo">SmartPose</div>
      <div class="content" :style="{ top: '55%', fontSize: '3rem' }">
        <div>AI 거북목 탐지 & 눈 깜빡임 감지</div>
        <div :style="{ marginTop: '130px' }">
          캠을 이용하여 거북목과 눈 깜빡임 감지시 알림을 드립니다.
        </div>
      </div>
    </div>
    <div>
      <v-row class="mt-4 ml-5">
        <v-col></v-col>
        <v-col></v-col>
        <v-col>
          <img
            src="@/assets/detect.png"
            alt=""
            width="368"
            @click="click('detect')"
          />
        </v-col>
        <v-col></v-col>
        <v-col>
          <img
            src="@/assets/result.png"
            alt=""
            width="368"
            @click="click('result')"
          />
        </v-col>
        <v-col></v-col>
        <v-col>
          <img
            src="@/assets/alarm.png"
            alt=""
            width="368"
            @click="click('alarm')"
          />
        </v-col>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            알림 설정
          </v-card-title>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="6">
                <v-subheader> 거북목 자세 알림 </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="select[0]"
                  :items="items"
                  item-text="state"
                  item-value="val"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-subheader> 눈 깜빡임 알림 </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="select[1]"
                  :items="items"
                  item-text="state"
                  item-value="val"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-subheader> 스트레칭 알림 </v-subheader>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="selectStretch"
                  :items="stretchItems"
                  item-text="state"
                  item-value="val"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="setting"> 설정 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    click(val: string): void {
      if (val === "detect") {
        this.$router.push({ name: "DectectPose" });
      } else if (val === "result") {
        this.$router.push({ name: "UserResult" });
      } else if (val === "alarm") {
        this.dialog = !this.dialog;
      }
    },
    setting(): void {
      console.log(this.select[0].val);
      console.log(this.select[1].val);
      console.log(this.selectStretch.val);
      this.dialog = !this.dialog;
    },
  },
  data() {
    return {
      dialog: false,
      select: [
        { state: "20분", val: "20" },
        { state: "20분", val: "20" },
      ],
      items: [
        { state: "20분", val: "20" },
        { state: "15분", val: "15" },
        { state: "10분", val: "10" },
      ],
      selectStretch: {
        state: "3시간",
        val: "3",
      },
      stretchItems: [
        { state: "3시간", val: "3" },
        { state: "2시간", val: "2" },
        { state: "1시간", val: "1" },
        { state: "30분", val: "0.5" },
      ],
    };
  },
});
</script>

<style></style>

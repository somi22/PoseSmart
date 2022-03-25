<template>
  <div>
    <div
      class="mainImg"
      :style="{ backgroundImage: `url(${require('@/assets/transmain.png')})` }"
    >
      <div class="content">
        <div>Time : {{ timeString }}</div>
        <div>
          <video
            autoplay
            :style="{ width: '500px', height: '500px', background: 'black' }"
          ></video>
        </div>

        <v-row>
          <v-col><img class="icon" src="@/assets/play.png" alt="" /></v-col>
          <v-col
            ><img @click="pause()" class="icon" src="@/assets/pause.png" alt=""
          /></v-col>
          <v-col><img class="icon" src="@/assets/exit.png" alt="" /></v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      localStream: {},
      localVideo: {},
      time: 0,
      timeString: "",
      timeset: {},
    };
  },
  methods: {
    pause() {
      if (this.time > 0) {
        clearInterval(this.timeset);
      }
    },
    init() {
      this.timeset = setInterval(() => {
        this.time += 1;
        let hour = parseInt(this.time / 3600);
        let min = parseInt((this.time % 3600) / 60);
        let second = parseInt(this.time % 60);
        this.timeString = hour + " : " + min + " : " + second;
      }, 1000);
      this.localVideo = document.querySelector("video");
      navigator.mediaDevices
        .getUserMedia({ video: false })
        .then((mediaStream) => {
          this.localStream = mediaStream;
          this.localVideo.srcObject = mediaStream;
        })
        .catch((e) => console.log(e));
    },
  },
  mounted() {
    this.init();
  },
});
</script>

<style scoped>
.icon {
  width: 150px;
  height: 150px;
}
.content {
  top: 45%;
}
</style>

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
          <v-col
            ><img
              v-if="!playing"
              class="icon"
              src="@/assets/play.png"
              alt=""
              @click="play()"
            />
            <img
              v-if="playing"
              @click="pause()"
              class="icon"
              src="@/assets/pause.png"
              alt=""
            />
          </v-col>
          <v-col></v-col>
          <v-col
            ><img class="icon" src="@/assets/exit.png" alt="" @click="exit()"
          /></v-col>
        </v-row>
        <v-button @click="takePhoto"> click </v-button>
      </div>
    </div>
    <!-- <a href="#">download</a> -->
  </div>
</template>

<script>
import Vue from "vue";
import { insertReports, getDetect } from "@/api/user";
export default Vue.extend({
  data() {
    return {
      localStream: {},
      localVideo: {},
      time: 0,
      timeString: "",
      timeset: {},
      playing: false,
      blink_cnt: 0,
      neck_cnt: 0,
      stretching_cnt: 0,
      start_time: "",
      isStart: false,
      imageCapture: {},
      file: null,
      face_x_mean: 0.0,
      face_y_mean: 0.0,
      nose_mean: 0.0,
      data: {
        blob_data: "",
        face_x_mean: 0.0,
        face_y_mean: 0.0,
        nose_mean: 0.0,
        face_x: "",
        face_y: "",
        nose_to_center: "",
        cnt: 0,
      },
      overFive_data: {
        blob_data: "",
        face_x_mean: 0.0,
        face_y_mean: 0.0,
        nose_mean: 0.0,
        face_x: "",
        face_y: "",
        nose_to_center: "",
        cnt: 0,
      },
    };
  },
  methods: {
    pause() {
      if (this.time > 0) {
        clearInterval(this.timeset);
        this.playing = !this.playing;
        this.localVideo.srcObject = null;
      }
    },
    async exit() {
      // 나갈때 로그인 홈으로 보내기전에 reports를 저장
      if (this.isStart) {
        try {
          await insertReports({
            blink_cnt: this.blink_cnt,
            neck_cnt: this.neck_cnt,
            stretching_cnt: this.stretching_cnt,
            start_time: this.start_time,
            end_time: new Date(),
          });
        } catch (error) {
          console.log(error);
        }
      }
      this.$router.push({ name: "LoginHome" });
    },
    play() {
      // 여기서 모델 탐지하는 통신을 해야함
      if (!this.isStart) {
        this.start_time = new Date();
        this.isStart = true;
      }
      this.timeset = setInterval(() => {
        this.time += 1;
        let hour = parseInt(this.time / 3600);
        let min = parseInt((this.time % 3600) / 60);
        let second = parseInt(this.time % 60);
        this.timeString = hour + " : " + min + " : " + second;
      }, 1000);
      this.localVideo = document.querySelector("video");
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          this.localStream = mediaStream;
          this.localVideo.srcObject = mediaStream;
          const track = mediaStream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(track);
        })
        .catch((e) => console.log(e));
      this.playing = true;
    },
    takePhoto() {
      let data1 = "";
      let data2 = "";
      this.imageCapture
        .takePhoto()
        .then((blob) => {
          // console.log(blob.text());
          // const myFile = new File([blob], "image.jpeg", {
          //   type: blob.type,
          // });
          // console.log(myFile);
          // this.downloadFiles(blob, "test.png", "image/png");
          //this.file = new Blob([blob], { type: "image/png" });
          data1 = blob;
        })
        .then(() => {
          const reader = new FileReader();
          reader.onload = async () => {
            //data = this.blobToString(data);
            // console.log(this.data);
            try {
              //TODO
              this.data.blob_data = reader.result;
              if (this.data.cnt == 4) {
                this.overFive_data.cnt = this.data.cnt;
                this.nose_mean = this.data.nose_mean;
                this.face_x_mean = this.data.face_x_mean;
                this.face_y_mean = this.data.face_y_mean;
                this.overFive_data.face_x_mean = this.face_x_mean;
                this.overFive_data.face_y_mean = this.face_y_mean;
                this.overFive_data.nose_mean = this.nose_mean;
              }
              if (this.data.cnt >= 4) {
                this.overFive_data.blob_data = reader.result;
                this.overFive_data.cnt = this.overFive_data.cnt + 1;
                // console.log(this.overFive_data);
                await getDetect(this.overFive_data);
                return 
              }

              // console.log(this.data);
              this.data = (await getDetect(this.data)).data;
            } catch (error) {
              console.log(error);
            }
          };

          reader.readAsDataURL(data1);
        });
    },
    // blobToString(b) {
    //     var u, x;
    //     u = URL.createObjectURL(b);
    //     x = new XMLHttpRequest();
    //     x.open("GET", u, false); // although sync, you're not fetching over internet
    //     x.send();
    //     URL.revokeObjectURL(u);
    //     return x.responseText;
    // },

    downloadFiles(data, file_name, file_type) {
      var file = new Blob([data], { type: file_type });
      //   if (window.navigator.msSaveOrOpenBlob)
      //     window.navigator.msSaveOrOpenBlob(file, file_name);
      //   else {
      //     var a = document.createElement("a"),
      //       url = URL.createObjectURL(file);
      //     a.href = url;
      //     a.download = file_name;
      //     document.body.appendChild(a);
      //     a.click();
      //     setTimeout(function () {
      //       document.body.removeChild(a);
      //       window.URL.revokeObjectURL(url);
      //     }, 0);
      //   }
    },
  },
  // mounted() {
  //   this.init();
  // },
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

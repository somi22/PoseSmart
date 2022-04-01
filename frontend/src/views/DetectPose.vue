<template>
  <div>
    <div
      class="mainImg"
      :style="{ backgroundImage: `url(${require('@/assets/transmain.png')})` }"
    >
      <div class="logo">
        <img
          @click="home"
          src="@/assets/logo_transparent.png"
          alt=""
          width="300"
        />
      </div>
      <v-btn class="logout" @click="logout">LOGOUT</v-btn>
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
      </div>
    </div>
    <!-- <a href="#">download</a> -->
  </div>
</template>

<script>
import Vue from "vue";
import { insertReports, getDetect, getDetectBlink, getTime } from "@/api/user";
export default Vue.extend({
  data() {
    return {
      localStream: {},
      localVideo: {},
      time: -1,
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
        flag: "",
      },
      resBlinkData: {
        blob_data: "",
        count: 0, // 변수 빼기
        total: 0,
        time: 0,
        flag: "",
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
        flag: "",
      },
      eyeTimeSet: "",
      userSetting: {},
      eyeAlarm: true,
      xCnt: 0,
      yCnt: 0,
      angleSound: {}, // 고개 사운드
      distancSound: {}, // 거리 사운드
      eyeSound: {}, // 눈깜빡임 사운드
    };
  },
  async created() {
    const data = await getTime();
    console.log(data.data);
    this.userSetting = data.data;
    this.userSetting.stretching_time =
      this.userSetting.stretching_time / 60 / 60;
    console.log(this.userSetting);
    switch (this.userSetting.alarm_sound) {
      case 1:
        this.a;
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
    }
  },
  methods: {
    home() {
      this.$router.push({ name: "LoginHome" });
    },
    logout() {
      sessionStorage.removeItem("accessToken");
      this.$router.push({ name: "HomeView" });
      this.$router.go(0);
    },
    pause() {
      if (this.time > 0) {
        clearInterval(this.timeset);
        this.playing = !this.playing;
        this.localVideo.srcObject = null;
        clearInterval(this.eyeTimeSet);
        clearInterval(this.neckTime);
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
    takePhoto() {
      this.imageCapture.takePhoto().then((blob) => {
        const reader = new FileReader();
        reader.onload = async () => {
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
              this.overFive_data.cnt = this.data.cnt;
            }
            if (this.data.cnt >= 4) {
              this.overFive_data.blob_data = reader.result;
              this.overFive_data.cnt = this.overFive_data.cnt + 1;
              const data = (await getDetect(this.overFive_data)).data;
              console.log("Over 4 res", data);
              if (data.detection_flag === "detected") {
                if (!data.x_result) {
                  this.xCnt++;
                  if (this.xCnt % 5 === 0) {
                    // 고개 기울어졌다 알람
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    let audio = new Audio(require("../assets/거북목가람.mp3"));
                    audio.play();
                  }
                } else if (!data.y_result) {
                  this.yCnt++;
                  if (this.yCnt % 5 === 0) {
                    console.log("거리 가까움");
                    // 모니터랑 멀어져라 알람
                  }
                }
              }
              return;
            }
            this.data = (await getDetect(this.data)).data;
            console.log("less Cnt 4 response", this.data);
          } catch (error) {
            console.log(error);
          }
        };
        reader.readAsDataURL(blob);
      });
    },
    play() {
      // const reader = new FileReader();
      // reader.onload = async () => {
      //   try {
      //     //TODO
      //     this.resBlinkData.blob_data = reader.result;
      //     console.log(
      //       "req : ",
      //       "cnt : ",
      //       this.resBlinkData.count,
      //       "time : ",
      //       this.resBlinkData.time,
      //       "total : ",
      //       this.resBlinkData.total
      //     );
      //     this.resBlinkData = (await getDetectBlink(this.resBlinkData)).data;
      //     if (this.resBlinkData.res === true) {
      //       // 알림음 울리기
      //       this.eyeAlarm = true;
      //       clearInterval(this.eyeTimeSet);
      //     } // 20초 안에 true나오면 그만 보냈다가 다시 20초 되면 보내기
      //     console.log("res : ", this.resBlinkData);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // };

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

        // if (second % 20 === 0) {
        //   if (!this.eyeAlarm) {
        //     // 알람 울리기
        //   }
        //   this.eyeAlarm = false;
        //   this.eyeTimeSet = setInterval(() => {
        //     this.imageCapture.takePhoto().then((blob) => {
        //       reader.readAsDataURL(blob);
        //     });
        //   }, 500); // 0 -> 10 +10 / 20
        // }

        if (min === 0 && second === 1) {
          // 스트레칭 알림음 주기
        }
      }, 1000);

      this.neckTime = setInterval(() => {
        this.takePhoto();
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
.logo {
  position: absolute;
  font-size: 3rem;
  color: black;
  font-weight: bold;
  z-index: 2;
  left: -2%;
  top: -7.2%;
}
</style>

<template>
   <v-app>
      <v-app-bar app color="primary" dark>
         <div class="d-flex align-center">
            <v-img
               alt="Vuetify Logo"
               class="shrink mr-2"
               contain
               src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
               transition="scale-transition"
               width="40"
            />

            <v-img
               alt="Vuetify Name"
               class="shrink mt-1 hidden-sm-and-down"
               contain
               min-width="100"
               src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
               width="100"
            />
         </div>

         <v-spacer></v-spacer>

         <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
            <span class="mr-2">Latest Release</span>
            <v-icon>mdi-open-in-new</v-icon>
         </v-btn>
      </v-app-bar>

      <v-content>
         <Form1 />
         <v-snackbar v-model="snackWithButtons" :timeout="timeout" bottom left>
            {{ snackWithBtnText }}
            <v-spacer />
            <v-btn dark text color="#00f500" @click.stop="refreshApp">
               {{ snackBtnText }}
            </v-btn>
            <v-btn dark icon @click="snackWithButtons = false">
               <v-icon>mdi-close-circle</v-icon>
            </v-btn>
         </v-snackbar>
      </v-content>
   </v-app>
</template>

<script>
import Form1 from "./components/Form1";

export default {
   name: "App",
   components: {
      Form1
   },
   data() {
      return {
         refreshing: false,
         registration: null,
         snackBtnText: "",
         snackWithBtnText: "",
         snackWithButtons: false,
         timeout: 0
      };
   },
   created() {
      // Listen for swUpdated event and display refresh snackbar as required.
      document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
      // Refresh all open app tabs when a new service worker is installed.
      if (!navigator.serviceWorker) return;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
         if (this.refreshing) return;
         this.refreshing = true;
         window.location.reload();
      });
   },
   methods: {
      showRefreshUI(e) {
         // Display a snackbar inviting the user to refresh/reload the app due
         // to an app update being available.
         // The new service worker is installed, but not yet active.
         // Store the ServiceWorkerRegistration instance for later use.
         this.registration = e.detail;
         this.snackBtnText = "Cập nhật";
         this.snackWithBtnText = "Bạn có muốn cập nhật phiên bản mới ?";
         this.snackWithButtons = true;
      },
      refreshApp() {
         this.snackWithButtons = false;
         // Protect against missing registration.waiting.
         if (!this.registration || !this.registration.waiting) {
            return;
         }
         this.registration.waiting.postMessage("skipWaiting");
      }
   }
};
</script>

<style lang="scss">
@import "../node_modules/typeface-roboto/index.css";
@import "./assets/@mdi/css/materialdesignicons.css";
.v-messages__message {
   padding-top: 2px;
   padding-bottom: 2px;
}
</style>

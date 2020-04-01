import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import DatePicker from "./components/DatePicker";
import Autocomplete from "./components/Autocomplete";

import "./registerServiceWorker";
import { generateCommonValidator } from "@/utils/validator";
generateCommonValidator();

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("DatePicker", DatePicker);
Vue.component("Autocomplete", Autocomplete);

Vue.config.productionTip = false;

new Vue({
   router,
   store,
   vuetify,
   render: (h) => h(App)
}).$mount("#app");

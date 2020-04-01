<template>
   <v-menu
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      offset-y
      max-width="auto"
      min-width="280px"
   >
      <template v-slot:activator="{ on }">
         <v-text-field
            autocomplete="off"
            v-model="dateFormatted"
            :disabled="disabled"
            :readonly="readonly"
            :label="label"
            :error-messages="errorMessages"
            append-icon="mdi-calendar"
            @click:append="onClickDateIcon"
            @blur="onBlurDate"
            v-on="on"
         ></v-text-field>
      </template>
      <v-date-picker
         v-if="conditionShowDate"
         scrollable
         no-title
         v-model="inputVal"
         :type="getType"
         @input="onDateInputChange"
      >
         <template v-if="type == 'date-time'">
            <v-spacer></v-spacer>
            <div style="height:35.4px"></div>
         </template>
      </v-date-picker>
      <v-time-picker scrollable v-if="conditionShowTime" landscape ampm-in-title v-model="time">
         <v-spacer></v-spacer>
         <v-btn color="primary" @click="onFinishChangeDate">OK</v-btn>
      </v-time-picker>
   </v-menu>
</template>

<script>
import { formatDate, formatDateToJSON, parseDate } from "@/utils/common";

export default {
   props: ["value", "label", "type", "errorMessages", "readonly", "disabled"],
   data: () => ({
      time: null,
      dateFormatted: null,
      menu1: false,
      datePattern: [
         "dd/MM/yy",
         "dd.MM.yy",
         "dd-MM-yy",
         "dd/M/yy",
         "dd.M.yy",
         "dd-M-yy",
         "dd/MM/yyyy",
         "dd-MM-yyyy",
         "dd.MM.yyyy"
      ],
      monthPattern: [],
      dateTimePattern: []
   }),
   mounted() {
      this.monthPattern = this.datePattern.map((format) => {
         return format.substring(3, format.length);
      });
      this.dateTimePattern = this.datePattern
         .map((format) => {
            return format + " h:mm a";
         })
         .concat(
            this.datePattern.map((format) => {
               return format + " HH:mm";
            })
         );
   },
   watch: {
      value: {
         immediate: true,
         handler(val) {
            this.dateFormatted =
               this.type == "month"
                  ? formatDate(val, "MM/yyyy")
                  : this.type == "date-time"
                  ? formatDate(val, "dd/MM/yyyy h:mm aa")
                  : formatDate(val);
         }
      },
      time(val) {
         let inputVal = this.inputVal;
         if (!inputVal) {
            inputVal = `${formatDateToJSON(new Date(), "yyyy-MM-dd")} ${val}`;
         } else {
            if (inputVal.length == 10) inputVal += ` ${val}`;
            else inputVal = `${inputVal.substring(0, inputVal.length - 6)} ${val}`;
         }
         this.inputVal = inputVal;
      }
   },
   computed: {
      getType() {
         return ["date-time", "time"].indexOf(this.type) > -1 ? "date" : this.type;
      },
      conditionShowDate() {
         return this.type != "time";
      },
      conditionShowTime() {
         return ["date-time", "time"].indexOf(this.type) > -1;
      },
      inputVal: {
         get() {
            return this.value;
         },
         set(val) {
            let currentVal = val;
            if (this.type == "date-time" && currentVal.length == 10) currentVal += ` ${this.time}`;
            this.onChangeDate(this.type == "month" ? this.parseDate(val, "yyyy-MM") : currentVal);
         }
      }
   },
   methods: {
      onClickDateIcon() {
         if (this.disabled || this.readOnly) return;
         this.menu1 = true;
      },
      onBlurDate() {
         let hasValidDate = (this.type == "month"
            ? this.monthPattern
            : this.type == "date-time"
            ? this.dateTimePattern
            : this.datePattern
         ).some((format) => {
            let newDate = this.parseDate(this.dateFormatted, format);
            if (newDate) {
               this.onChangeDate(newDate);
               return true;
            }
            return false;
         });
         if (!hasValidDate) {
            this.$emit("input", null);
            this.dateFormatted = null;
         }
         setTimeout(() => this.$emit("blur"), 100);
      },
      onDateInputChange() {
         if (this.type != "date-time") {
            this.menu1 = false;
            this.$emit("blur");
         }
      },
      onChangeDate(newDate) {
         this.$emit("input", newDate);
      },
      onFinishChangeDate() {
         this.menu1 = false;
         this.$emit("blur");
      },
      parseDate(date, format) {
         if (!date) return null;
         return formatDateToJSON(parseDate(date, format));
      }
   }
};
</script>
<style lang="scss">
</style>
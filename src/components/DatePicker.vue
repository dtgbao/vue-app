<template>
   <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" offset-y max-width="290px" min-width="290px">
      <template v-slot:activator="{ on }">
         <v-text-field
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
      <v-date-picker v-model="inputVal" :type="type" no-title @input="menu1 = false"></v-date-picker>
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
      monthPattern: []
   }),
   mounted() {
      this.monthPattern = this.datePattern.map((format) => {
         return format.substring(3, format.length);
      });
   },
   computed: {
      inputVal: {
         get() {
            return this.value;
         },
         set(val) {
            this.onChangeDate(this.type == "month" ? this.parseDate(val, "yyyy-MM") : val);
         }
      }
   },
   methods: {
      onClickDateIcon() {
         if (this.disabled || this.readOnly) return;
         this.menu1 = true;
      },
      onBlurDate() {
         let hasValidDate = (this.type == "month" ? this.monthPattern : this.datePattern).some((format) => {
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
         this.$emit("blur");
      },
      onChangeDate(newDate) {
         this.dateFormatted = this.type == "month" ? formatDate(newDate, "MM/yyyy") : formatDate(newDate);
         this.$emit("input", newDate);
      },
      parseDate(date, format) {
         if (!date) return null;
         return formatDateToJSON(parseDate(date, format));
      }
   }
};
</script>

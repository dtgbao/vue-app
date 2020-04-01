<template>
   <div>
      <ValidationProvider v-slot="{ errors }" name="select" rules="required">
         <v-select
            v-model="item.select"
            :items="items"
            :error-messages="errors"
            label="Chọn"
            data-vv-name="select"
            required
         ></v-select>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" rules="required" name="checkbox">
         <v-checkbox
            v-model="item.checkbox"
            :error-messages="errors"
            value="1"
            label="Option checkbox"
            type="checkbox"
            required
         ></v-checkbox>
      </ValidationProvider>
   </div>
</template>

<script>
export default {
   data: () => ({
      item: {
         select: null,
         checkbox: null
      },
      items: ["Item 1", "Item 2", "Item 3", "Item 4"]
   }),
   methods: {
      getItem() {
         return this.item;
      },
      setItem(newItem) {
         this.item = newItem;
      }
   }
};
</script>

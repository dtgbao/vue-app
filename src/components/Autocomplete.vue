<template>
   <v-autocomplete
      autocomplete="off"
      v-model="inputVal"
      @blur="$emit('blur')"
      :readonly="readonly || false"
      :search-input.sync="search"
      :error-messages="errorMessages"
      :clearable="clearable || true"
      :cache-items="cacheItems"
      :loading="loading || $store.state.loading"
      :disabled="disabled"
      :items="this.items || []"
      :filled="filled"
      :chips="chips || multiple"
      :deletable-chips="deletableChips || multiple"
      :small-chips="smallChips || multiple"
      :color="color"
      :label="label"
      :item-text="itemText || 'name'"
      :item-value="itemValue || 'id'"
      :multiple="multiple || false"
      :hide-no-data="hideNoData"
   >
      <template v-if="hasSelectionSlot" v-slot:selection="data">
         <slot name="selection" :data="{ ...data }"></slot>
      </template>
      <template v-if="hasItemSlot" v-slot:item="data">
         <slot name="item" :data="{ ...data }"></slot>
      </template>
   </v-autocomplete>
</template>

<script>
export default {
   props: {
      value: [String, Number, Array],
      readonly: Boolean,
      cacheItems: Boolean,
      hideNoData: Boolean,
      label: String,
      clearable: Boolean,
      deletableChips: Boolean,
      smallChips: Boolean,
      loading: Boolean,
      chips: Boolean,
      color: String,
      multiple: Boolean,
      filled: Boolean,
      disabled: Boolean,
      items: Array,
      itemText: String,
      itemValue: String,
      errorMessages: Array
   },
   data: () => ({
      search: null
   }),
   computed: {
      hasSelectionSlot() {
         return !!this.$slots["selection"];
      },
      hasItemSlot() {
         return !!this.$slots["item"];
      },
      inputVal: {
         get() {
            return this.value;
         },
         set(val) {
            this.$emit("input", val);
            let selected = null;
            if (val) {
               selected = !this.multiple
                  ? this.items?.find((x) => x[this.itemValue || "id"] == val) || null
                  : this.items?.filter((x) => x[this.itemValue || "id"] == val) || [];
            }
            this.$emit("change", selected);
         }
      }
   },
   watch: {
      search(val) {
         val && this.onSearch(val);
      }
   },
   methods: {
      onSearch(textSearch) {
         this.$emit("onSearch", textSearch);
      }
   }
};
</script>

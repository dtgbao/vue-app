<template>
   <v-container>
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
         <form @submit.prevent="handleSubmit(submit)" novalidate>
            <ValidationProvider v-slot="{ errors }" name="Họ tên" rules="required|max:10">
               <v-text-field
                  v-model.trim="item.name"
                  :counter="10"
                  :error-messages="errors"
                  label="Họ tên"
                  required
               ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="E-mail" rules="required|email">
               <v-text-field
                  v-model.trim="item.email"
                  :error-messages="errors"
                  label="E-mail"
                  required
               ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, validate }" name="Ngày bắt đầu" rules="required">
               <date-picker
                  type="date-time"
                  v-model="item.date"
                  :error-messages="errors"
                  label="Ngày bắt đầu"
                  @blur="validate"
                  required
               />
            </ValidationProvider>
            <ValidationProvider
               v-slot="{ errors, validate ,}"
               name="Ngày kết thúc"
               rules="required|isDateAfter:@Ngày bắt đầu"
            >
               <date-picker
                  v-model="item.toDate"
                  :error-messages="errors"
                  label="Ngày kết thúc"
                  @blur="validate"
                  required
               />
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, validate }" name="Combobox" rules="required">
               <autocomplete
                  multiple
                  v-model="item.autocomplete"
                  @blur="validate"
                  @change="selectedUser = arguments[0]"
                  :items="users"
                  :error-messages="errors"
                  label="Combobox"
                  required
               />
            </ValidationProvider>
            <Form2 ref="form2" />
            <v-simple-table dense>
               <template v-slot:default>
                  <thead>
                     <tr>
                        <th class="text-center" width="20">
                           <v-btn icon @click="item.details.push({ name: '', calories: 0 })">
                              <v-icon>mdi-plus</v-icon>
                           </v-btn>
                        </th>
                        <th class="text-left">Tên</th>
                        <th class="text-left">Calories</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="(detail, index) in item.details" :key="index">
                        <td class="text-center">
                           <v-btn icon @click="item.details.splice(0, index)">
                              <v-icon>mdi-delete</v-icon>
                           </v-btn>
                        </td>
                        <td>
                           <ValidationProvider
                              v-slot="{ errors }"
                              :name="'detailName' + index"
                              rules="required"
                           >
                              <v-text-field
                                 v-model.trim="detail.name"
                                 :counter="10"
                                 :error-messages="errors"
                                 required
                              ></v-text-field>
                           </ValidationProvider>
                        </td>
                        <td>
                           <ValidationProvider
                              v-slot="{ errors }"
                              :name="'detailCalories' + index"
                              rules="required|positive"
                           >
                              <v-text-field
                                 v-model="detail.calories"
                                 :counter="10"
                                 :error-messages="errors"
                                 required
                              ></v-text-field>
                           </ValidationProvider>
                        </td>
                     </tr>
                  </tbody>
               </template>
            </v-simple-table>
            <v-row>
               <v-col cols="12" sm="12">
                  <v-btn class="mr-4" type="submit">submit</v-btn>
                  <v-btn @click="clear">clear</v-btn>
               </v-col>
            </v-row>
         </form>
      </ValidationObserver>
   </v-container>
</template>

<script>
import Form2 from "./Form2";

export default {
   components: {
      Form2
   },
   data: () => ({
      selectedUser: null,
      users: [
         { id: 1, name: "Sandra Adams" },
         { id: 2, name: "ABBBB Adams" },
         { id: 3, name: "GGFERERER Adams" }
      ],
      item: {
         toDate: null,
         date: null,
         autocomplete: null,
         name: "",
         email: "",
         details: []
      },
      formItem2: {
         select: null,
         checkbox: null
      }
   }),
   watch: {
      item: {
         handler(val) {
            console.log(val);
         },
         deep: true
      }
   },
   mounted() {
      this.$refs.form2.setItem({ ...this.formItem2 });
   },
   methods: {
      async submit() {
         //  console.log(this.$refs.observer);
         console.log({ ...this.item, ...this.$refs.form2.getItem() });
      },
      clear() {
         this.item.name = "";
         this.item.date = null;
         this.item.toDate = null;
         this.item.autocomplete = null;
         this.item.email = "";
         this.item.details = [];
         this.$refs.form2.setItem({ ...this.formItem2 });
         this.$refs.observer.reset();
      }
   }
};
</script>

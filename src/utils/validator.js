import { required, email } from "vee-validate/dist/rules";
import { extend, setInteractionMode } from "vee-validate";

export function generateCommonValidator() {
   setInteractionMode("eager");

   extend("required", {
      ...required,
      message: "Trường bắt buộc"
   });

   extend("email", {
      ...email,
      message: "Email không hợp lệ"
   });

   extend("positive", {
      validate: (value) => value > 0,
      message: "Số phải lớn hơn 0"
   });
}

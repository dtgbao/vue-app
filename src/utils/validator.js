import { required, email, max, min } from "vee-validate/dist/rules";
import { extend, setInteractionMode } from "vee-validate";
import compareAsc from "date-fns/compareAsc";

setInteractionMode("eager");

extend("required", {
   ...required,
   message: "Trường bắt buộc"
});

extend("email", {
   ...email,
   message: "E-mail không hợp lệ"
});

extend("positive", {
   validate: (value) => value > 0,
   message: "Giá trị phải lớn hơn 0"
});

extend("max", {
   ...max,
   message: "{_field_} không được nhiều hơn {length} ký tự"
});

extend("min", {
   ...min,
   message: "{_field_} không được ít hơn {length} ký tự"
});

extend("isDateBefore", {
   params: ["target"],
   validate(value, { target }) {
      let result = compareAsc(new Date(value), new Date(target));
      return result == -1;
   },
   message: "Ngày kết thúc không được trước ngày bắt đầu"
});

extend("isDateAfter", {
   params: ["target"],
   validate(value, { target }) {
      let result = compareAsc(new Date(value), new Date(target));
      return result == 1;
   },
   message: "Ngày bắt đầu không được sau ngày kết thúc"
});

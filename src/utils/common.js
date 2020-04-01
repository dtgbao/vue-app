/**
 * Common function
 * @module utils/common
 */

import formatDateFNS from "date-fns/format";
import parseISO from "date-fns/parseISO";
import parse from "date-fns/parse";
import isValidDateFNS from "date-fns/isValid";

export const messasge = {
   success: "Lưu thành công",
   error: "Lưu thất bại",
   finderror: "Không tìm thấy dữ liệu",
   required: "Vui lòng nhập thông tin bắt buộc",
   requiredspace: "Thông tin không hợp lệ"
};

export const permission = {
   FULLCONTROL: "FULLCONTROL",
   READ: "READ",
   VIEW: "VIEW",
   VIEWMENU: "VIEWMENU",
   DELETE: "DELETE",
   APPROVE: "APPROVE"
};

export const button = {
   save: "Lưu",
   edit: "Điều chỉnh",
   cancel: "Hủy bỏ",
   goBack: "Trở về",
   refresh: "Nhập lại",
   agree: "Đồng ý",
   delete: "Hủy",
   search: "Tìm kiếm",
   send: "Chuyển"
};

export function sort(data, prop, sortBy = "asc") {
   if (!Array.isArray(data)) return data;
   return data.sort((a, b) => {
      if (sortBy == "asc") {
         return a[prop] - b[prop];
      } else {
         return b[prop] - a[prop];
      }
   });
}

export function convertStringToList(string) {
   if (Array.isArray(string)) return string;
   if (!isNullOrEmpty(string)) {
      let newString = string.toString().trim();
      let list =
         newString.indexOf(",") > -1
            ? newString
                 .split(",")
                 .filter((x) => x)
                 .map((x) => x.trim())
            : [newString];
      return list;
   }
   return [];
}

/**
 * Kiểm tra ngày hợp lệ
 * @param {String | Date} value giá trị đầu vào để kiểm tra ngày hợp lệ
 * @returns {Boolean} Trả về giá trị kiểu bool (false: ngày không hợp lệ, true: ngày hợp lệ)
 */
export function checkIsValidDate(value) {
   return value == null ? false : typeof value === "string" ? isValidDateFNS(parseISO(value)) : isValidDateFNS(value);
}

export function formatDate(value, format = "dd/MM/yyyy") {
   let isValidDateValue = checkIsValidDate(value);
   if (isValidDateValue) {
      return typeof value === "string" ? formatDateFNS(parseISO(value), format) : formatDateFNS(value, format);
   }
   return "";
}

export function formatDateToJSON(value, format = "yyyy-MM-dd HH:mm:ss") {
   return formatDate(value, format);
}

export function parseDate(stringVal, format = "dd/MM/yyyy") {
   let date = parse(stringVal, format, new Date());
   return date == "Invalid Date" ? null : date;
}

export function countDecimals(value) {
   if (Math.floor(value) === value) return 0;
   return value.toString().split(".")[1].length || 0;
}

export function formatNumber(numberString, digit = 0) {
   if (!isNullOrEmpty(numberString) && (numberString >= 0 || numberString < 0)) {
      let number = parseFloat(numberString);
      let hasDecimalPoint = number % 1 != 0;
      let totalDecimals = countDecimals(number) || 1;
      //if (number.toFixed(digit) == 0) return 0;
      return number.toLocaleString("en-US", {
         minimumFractionDigits: hasDecimalPoint ? (digit > 0 ? digit : totalDecimals) : 0,
         maximumFractionDigits: hasDecimalPoint ? (digit > 0 ? digit : totalDecimals) : 0
      });
   }
   return null;
}

export function parseNumber(numberString, digit = 0) {
   if (isInt(numberString) || isFloat(numberString)) {
      return parseFloat(parseFloat(numberString).toFixed(digit));
   }
   return numberString;
}

export function isInt(n) {
   let newNumber = Number(n);
   if (typeof newNumber != "number" || isNullOrEmpty(n) || isNaN(newNumber)) return false;
   return newNumber % 1 == 0;
}

export function isFloat(n) {
   let newNumber = Number(n);
   if (typeof newNumber != "number" || isNullOrEmpty(newNumber) || isNaN(newNumber)) return false;
   return newNumber % 1 != 0;
}

export const getURLParamsKey = (url, key) => {
   let params = new URLSearchParams(url);
   return params.get(key);
};

//export const notification = (msg, type = "info") => {};

export function setCookie(cname, cvalue, exdays) {
   var d = new Date();
   d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
   var expires = "expires=" + d.toUTCString();
   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
   var name = cname + "=";
   var ca = document.cookie.split(";");
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}

export const updateState = (oldState, updatedState) => {
   return {
      ...oldState, // overide the old statef
      ...updatedState // update the new state
   };
};

export function removeWhiteSpace(value) {
   if (typeof value === "string" && value.replace(/\s/g, "") === "") {
      value = null;
   }
   return value;
}

export function b64DecodeUnicode(str) {
   // Going backwards: from bytestream, to percent-encoding, to original string.
   let jsonStr = null;
   try {
      jsonStr = decodeURIComponent(
         atob(str)
            .split("")
            .map(function(c) {
               return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
      );
   } catch (error) {
      jsonStr = null;
   }
   return jsonStr;
}

export function ReplaceObj(obj, value, objName) {
   for (var name in obj) {
      var search = objName + "." + name;
      if (typeof obj[name] !== "object") {
         value = value.split(search).join(obj[name]); //.replace(search, obj[name]);
      } else {
         value = ReplaceObj(obj[name], value, search);
      }
   }
   return value;
}

export function redirectPage(url) {
   window.location.href = url;
}

export function redirectPageBlank(url) {
   window.open(url, "_blank");
}

export function openPage(url) {
   window.open(url);
}

export function reloadPage() {
   window.location.reload();
}

export function goBack() {
   window.history.go(-1);
}

export function isNullOrEmpty(data) {
   if (data === null) {
      return true;
   }
   if (data === "") {
      return true;
   }
   if (data === undefined) {
      return true;
   }
   if (typeof data === "undefined") {
      return true;
   }
   return false;
}

export function dateCompare(source, destination) {
   var month = source.getMonth() >= 10 ? source.getMonth() : "0" + source.getMonth();
   var date = source.getDate() >= 10 ? source.getDate() : "0" + source.getDate();
   var sourceDate = "" + source.getFullYear() + "" + month + "" + date;

   month = destination.getMonth() >= 10 ? destination.getMonth() : "0" + destination.getMonth();
   date = destination.getDate() >= 10 ? destination.getDate() : "0" + destination.getDate();
   var destinationDate = "" + destination.getFullYear() + "" + month + "" + date;

   sourceDate = parseInt(sourceDate);
   destinationDate = parseInt(destinationDate);
   var comparer = sourceDate - destinationDate;
   if (comparer == 0) {
      return 0;
   } else if (comparer > 0) {
      return 1;
   } else {
      return -1;
   }
}

export function dateTimeCompare(date1, date2) {
   var date1_ms = date1.getTime();
   var date2_ms = date2.getTime();
   var difference_ms = date2_ms - date1_ms;
   return difference_ms;
}

export function dateDiff(date1, date2) {
   if (isNullOrEmpty(date1) || isNullOrEmpty(date2)) {
      console.log("date wrong format");
      return;
   } else {
      var one_day = 1000 * 60 * 60 * 24;

      // Convert both dates to milliseconds
      var date1_ms = date1.getTime();
      var date2_ms = date2.getTime();
      var difference_ms = date2_ms - date1_ms;
      // Convert back to days and return
      return Math.round(difference_ms / one_day);
   }
}

export function getTimeByMinute(date1, date2) {
   var one_Minute = 1000 * 60;
   // Convert both dates to milliseconds
   var date1_ms = date1.getTime();
   var date2_ms = date2.getTime();
   var difference_ms = date2_ms - date1_ms;
   // Convert back to days and return
   return Math.round(difference_ms / one_Minute);
}

export function dateDiffAdvance(date1, date2) {
   var one_day = 1000 * 60 * 60 * 24;

   // Convert both dates to milliseconds
   var date1_ms = date1.getTime();
   var date2_ms = date2.getTime();
   var difference_ms = date2_ms - date1_ms;
   if (difference_ms < 0) return -1;
   // Convert back to days and return
   return Math.round(difference_ms / one_day);
}

export function setObjectValueV2(objTemplate, objValue) {
   if (isNullOrEmpty(objValue)) return objTemplate;
   for (var property in objTemplate) {
      var value = objValue[property];
      if (typeof value !== "undefined") {
         objTemplate[property] = objValue[property];
      }
   }
   return objTemplate;
}

export function setObjectValue(objTemplate, objValue) {
   return setObjectValueV2(objTemplate, objValue);
}

export function ConvertDate(input) {
   if (input != null) {
      var d = new Date(input);
      d.setHours(8);
      return d;
   }
   return new Date();
}

export function convertDateddMMyyyy(inputFormat) {
   function pad(s) {
      return s < 10 ? "0" + s : s;
   }
   var d = new Date(inputFormat);
   return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

export function checkDateInvalid(dateFrom, dateTo) {
   var now = new Date();
   var numDateFrom = dateDiff(dateFrom, now) + 1;
   var numDateTo = dateDiff(now, dateTo) + 1;
   if (numDateFrom > 0 && numDateTo > 0) {
      return true;
   }
   return false;
}

export function CheckIsDate(date) {
   return date instanceof Date;
}

export function isEmpty(s) {
   return s == null || s.length == 0;
}

export function isWhitespace(s) {
   var whitespace = " \t\n\r";
   var i;
   if (isEmpty(s)) return true;
   for (i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (whitespace.indexOf(c) == -1) return false;
   }
   return true;
}

export function ConvertStringToObject(input) {
   //  console.log("input: ", input, typeof (input));
   if (input != null && input != "") {
      return input.split(",");
   }
   return null;
}

export function roundNumber(number) {
   var result = Math.round(number * 100) / 100;
   return result;
}

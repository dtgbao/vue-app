import axios from "axios";
import Config from "./config";
import store from "@/store";

var numberOfAjaxCAllPending = 0;

// Add a request interceptor
axios.interceptors.request.use(
   function(config) {
      if (numberOfAjaxCAllPending > 0) {
         store.commit("setLoading", true);
      }
      return config;
   },
   function(error) {
      numberOfAjaxCAllPending = 0;
      store.commit("setLoading", false);
      return Promise.reject(error);
   }
);

// Add a response interceptor
axios.interceptors.response.use(
   function(response) {
      if (numberOfAjaxCAllPending > 0) {
         numberOfAjaxCAllPending--;
      }
      if (numberOfAjaxCAllPending <= 0) {
         store.commit("setLoading", false);
      }
      return response;
   },
   function(error) {
      numberOfAjaxCAllPending = 0;
      store.commit("setLoading", false);
      return Promise.reject(error);
   }
);

/**
 * DataService Library
 * @module utils/dataService
 * @example
 * import {dataService} from "@/utils/dataService"
 * var dataService = new DataService("localhost:5000","/api/");// khi sử dụng với api khác
 * //hoặc
 * import dataService from "@/utils/dataService" // mặc định
 *
 */
export class DataService {
   /**
    * @param {String} serverAPI your server URL
    * @param {String} baseAPI your baseAPI (example: "/api/")
    */
   constructor(serverAPI, baseAPI) {
      this._controllerName = "none";
      this._baseAPI = baseAPI; //"/api/";
      this._config = Config;
      this._serverAPI = serverAPI;
      this._source = axios.CancelToken.source();
   }

   get serverAPI() {
      return this._serverAPI;
   }

   get source() {
      return this._source;
   }

   set source(source) {
      this._source = source;
   }

   get config() {
      return this._config;
   }

   get controllerName() {
      return this._controllerName;
   }
   set controllerName(newControllerName) {
      this._controllerName = newControllerName;
   }

   get baseAPI() {
      return this._baseAPI;
   }

   /**
    *
    * @param {String} newControllerName gán tên controller ở API để parse URL trước khi gọi tới API
    */
   setController(newControllerName) {
      this.controllerName = newControllerName;
   }

   setControler(newControllerName) {
      this.controllerName = newControllerName;
   }

   get token() {
      return store.state.user.token;
   }

   get email() {
      return store.state.user.email;
   }

   getUser() {
      return store.state.user;
   }

   getFeatureByURL(url) {
      dataService.setController("Feature");
      return dataService.getAll("GetFeatureByURL?url=" + url, false);
   }

   /**
    * Lấy thông tin user đang thao tác
    * @returns {Object} Trả về giá trị object các property thông tin user hiện tại đang thao tác
    * @example
    * import dataService from "@/utils/dataService";
    * let timeStamp = dataService.getTimeStamp();
    * //Trả về
    * {
    *     CreatedById: userID,// Id nhân viên đăng nhập hiện tại
    *     CreatedDate: new Date(),// Ngày hiện tại
    *     CreatedByName: fullName,// Tên nhân viên đăng nhập hiện tại
    *     ModifiedById: userID,//Id nhân viên đăng nhập hiện tại
    *     ModifiedDate: new Date(),// Ngày hiện tại
    *     ModifiedByName: fullName// Tên nhân viên đăng nhập hiện tại
    * };
    */
   getTimeStamp() {
      let { userID, fullName } = this.getUser();
      return {
         CreatedById: userID,
         CreatedDate: new Date(),
         CreatedByName: fullName,
         ModifiedById: userID,
         ModifiedDate: new Date(),
         ModifiedByName: fullName
      };
   }

   /**
    *
    * @param {String} actionName Tên method ở controller API
    * @returns {String} chuỗi URL của serverAPI
    * @example
    * import dataService from "@/utils/dataService"
    * dataService.setController("User");// set controller trước khi build URL
    * let url = dataService.buildURL("GetUser");// "localhost:5000/api/User/GetUser"
    */
   buildURL(actionName) {
      var url = this.serverAPI + this.baseAPI + this.controllerName + "/" + actionName;
      return url;
   }

   http(method, actionName, data, params) {
      var configHTTP = {
         url: this.buildURL(actionName),
         timeout: process.env.NODE_ENV === "production" ? 60000 * 3 : 24 * 60 * 60 * 1000,
         method,
         params,
         data,
         //headers: { "X-XSRF-TOKEN": token },
         headers: {
            "Content-Type": typeof data === "string" ? "text/plain" : "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.token}`
            //"X-XSRF-TOKEN": token
         },
         //headers: { TokenKey: token, Email: email }, //{ TokenKey: token, Email: email, Authorization: "Bearer " + token },
         responseType: "json",
         responseEncoding: "utf8",
         withCredentials: false,
         cancelToken: this.source.token
      };
      return axios(configHTTP)
         .then((response) => {
            return response.data;
         })
         .catch((error) => {
            if (axios.isCancel(error)) {
               this.showLoading(false);
               //console.log("Request canceled", error.message);
            } else if (error && error.response && error.response.status === 401) {
               window.location.href = "/#/login";
            }
            return null;
         });
   }

   /**
    * Cancel tất cả request khi chuyển qua feature hoặc module mới
    * Dùng trong hàm ComponentWillUnMount()
    * @example
    * ComponentWillUnMount(){
    *    dataService.cancelRequest();
    * }
    */
   cancelRequest() {
      this.source.cancel("Operation canceled");
      this.source = axios.CancelToken.source();
      this.showLoading(false);
      numberOfAjaxCAllPending = 0;
   }

   showLoading(bool) {
      store.commit("setLoading", bool);
   }

   getAll(actionName, showLoading = true) {
      if (showLoading) numberOfAjaxCAllPending++;
      var data = "";
      var result = this.http("GET", actionName, data);
      return result;
   }

   post(actionName, param, data, showLoading = true) {
      if (showLoading) numberOfAjaxCAllPending++;
      var result = this.http("POST", actionName, data, param);
      return result;
   }

   addOrUpdate(actionName, data, showLoading = true) {
      if (showLoading) numberOfAjaxCAllPending++;
      var result = this.http("POST", actionName, data);
      return result;
   }

   queryParams(method, actionName, params, showLoading = true) {
      if (showLoading) numberOfAjaxCAllPending++;
      var result = this.http(method, actionName, "", params);
      return result;
   }

   query(method, actionName, params, showLoading = true) {
      if (showLoading) numberOfAjaxCAllPending++;
      var result = this.http(method, actionName, params);
      return result;
   }

   async promiseAll(listPromise) {
      let listData = await axios.all(listPromise);
      return listData;
   }
}

var dataService = new DataService(Config.serverApi, "/api/");

export default dataService;

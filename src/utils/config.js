const NODE_ENV = process.env.NODE_ENV;
var serverApi = NODE_ENV !== "production" ? process.env.REACT_APP_LOCAL_WEB_API : window.env.API_URL;
var value = {
   defaultURL: "/trangchu",
   textEmpty: "Chưa có thông tin",
   serverApi: serverApi,
   saveURL: serverApi + "/api/Uploads/Files",
   autoHideNotify: 3000,
   IsNewTabToLogin: false, //mở tab hoặc refresh phải login lại
   EmailDefault: "@sg.cmc.com.vn",
   defaultApi: "/api/"
};
export default value;

module.exports = {
   transpileDependencies: ["vuetify"],
   configureWebpack: {
      devtool: "source-map"
   },
   pwa: {
      workboxPluginMode: "InjectManifest",
      workboxOptions: {
         swSrc: "./src/sw.js",
         swDest: "service-worker.js"
      }
   }
};

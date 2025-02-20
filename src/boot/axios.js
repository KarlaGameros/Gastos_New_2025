import { boot } from "quasar/wrappers";
import { EncryptStorage } from "storage-encryption";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const api = axios.create({ baseURL: "http://sistema.ieenayarit.org:9170/api" });

// const api = axios.create({
//   baseURL: "https://l3h1d8pk-7289.usw3.devtunnels.ms/api",
// });

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${encryptStorage.decrypt("key")}`;

  if (config.headers["Content-Type"] == "application/x-www-form-urlencoded") {
    config.headers["Content-Type"] = "application/json"; // Predeterminado
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 401) {
      alert("Su sesión ha expirado, sera redireccionado al logín");
      localStorage.clear();
      sessionStorage.clear();
      encryptStorage.remove("key");
      window.location = "http://sistema.ieenayarit.org:9171";
    }
    return Promise.reject();
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };

import { trackWhenSharePage } from "./tracking";
import { isPromise } from "./util";

export default (function () {
  // 小程序原来的Page方法
  let originalPage = Page;
  // 我们自定义的Page方法
  Page = (config) => {
    /**
     * 重写分享方法
     */
    if (config.onShareAppMessage) {
      let originalShare = config.onShareAppMessage;
      config.onShareAppMessage = function (e) {
        let callback = originalShare.call(this, e);
        if (isPromise(callback)) {
          callback.then((res) => {
            const { path, title } = res;
            console.log(res);
            // trackWhenSharePage({
            //   title,
            //   path,
            //   ...(res.params || {}),
            // });
          });
        } else if (callback) {
          const { path, title } = callback;
          // trackWhenSharePage({
          //   title,
          //   path,
          //   ...(callback.params || {}),
          // });
        }
        return callback;
      };
    }

    return originalPage(config);
  };
})();

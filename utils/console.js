import { env } from "./wx-api";

const COLOR = {
  PRIMARY: "#409EFF",
  SUCCESS: "#67C23A",
  WARN: "#E6A23C",
  DANGER: "#F56C6C",
};

export const debug = (req, res) => {
  const app = getApp();
  const { debug } = app.globalData;

  if (env == "release" || !debug) return;

  const {
    url,
    data,
    method = "GET",
    checkToken = true,
    delay = 0,
    isMock = false,
  } = req;

  if (isMock) return;

  handleCallback({ method, url }, res);

  // handleTimeConsuming({ method, url }, res)

  // if (res.statusCode == 200) {
  //   handleResonse(res.data)
  // }
};

function handleStyle(status) {
  return `background: ${COLOR[status.toUpperCase()]}; 
          border-radius: 2px;
          padding: 3px 2px; text-align: center;
          font-weight: 400;`;
}

function handleOutputUrl(url) {
  const MAX_LENGTH = 15;
  url = url.split("?")[0].split("/");
  return url.slice(url[url.length - 1].length > MAX_LENGTH ? -1 : -2).join("/");
}

function handleTimeConsuming(
  { method, url },
  { statusCode, data: res, delta }
) {
  if (statusCode == 200) {
    if (res.res == 0) {
      console.log(
        `%c ${method.toUpperCase()} %c ${handleOutputUrl(url)}  %c ${delta}ms `,
        handleStyle("success"),
        "color:" + COLOR.SUCCESS,
        "color:" + COLOR.WARN
      );
    } else {
      console.log(
        `%c ${method.toUpperCase()} %c ${handleOutputUrl(
          url
        )}  %c ${delta}ms %c ${res.msg} `,
        handleStyle("warn"),
        "color:" + COLOR.WARN,
        "color:" + COLOR.WARN,
        "color:" + COLOR.DANGER
      );
    }
  }

  return statusCode;
}

function handleCallback({ method, url }, { data: res, delta }) {
  if (res.res == 0) {
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      if (typeof res.data[0] == "number" || typeof res.data[0] == "string") {
        console.groupCollapsed(
          `%c ${method.toUpperCase()} %c ${handleOutputUrl(
            url
          )}  %c ${delta}ms `,
          handleStyle("success"),
          "color:" + COLOR.SUCCESS + ";font-weight: 400;",
          "color:" + COLOR.WARN + ";font-weight: 400;"
        );
        console.table(res.data);
        console.groupEnd("");
      } else if (isObject(res.data[0])) {
        console.groupCollapsed(
          `%c ${method.toUpperCase()} %c ${handleOutputUrl(
            url
          )}  %c ${delta}ms `,
          handleStyle("success"),
          "color:" + COLOR.SUCCESS + ";font-weight: 400;",
          "color:" + COLOR.WARN + ";font-weight: 400;"
        );
        const tableHeader = Object.keys(res.data[0]);
        console.table(res.data, tableHeader);
        console.groupEnd("");
      }
    } else {
      console.log(
        `%c ${method.toUpperCase()} %c ${handleOutputUrl(url)}  %c ${delta}ms `,
        handleStyle("success"),
        "color:" + COLOR.SUCCESS,
        "color:" + COLOR.WARN
      );
    }
  } else {
    console.log(
      `%c ${method.toUpperCase()} %c ${handleOutputUrl(
        url
      )}  %c ${delta}ms %c ${res.msg} `,
      handleStyle("warn"),
      "color:" + COLOR.WARN,
      "color:" + COLOR.WARN,
      "color:" + COLOR.DANGER
    );
  }
}

function handleResonse(res) {
  if (res.res == 0 && res.data) {
    if (Array.isArray(res.data) && res.data.length > 0) {
      if (typeof res.data[0] == "number" || typeof res.data[0] == "string") {
        console.table(res.data);
      } else if (isObject(res.data[0])) {
        const tableHeader = Object.keys(res.data[0]);
        console.table(res.data, tableHeader);
      }
    }
  }
}

function isObject(target) {
  return target && Object.prototype.toString.call(target) == "[object Object]";
}

function isArray(target) {
  return target && Array.isArray(target);
}

export const print = (...rest) => {
  // console.log(
  //   `%c ${key} %c ${value} `,
  //   handleStyle('primary'),
  //   'color:' + COLOR.PRIMARY,
  //   'color:' + COLOR.WARN,
  //   'color:' + COLOR.DANGER,
  // )

  if (rest && rest.length > 0) {
    const [key, ...params] = rest;
    let content = `%c ${key} `;
    let colorList = [handleStyle("primary")];
    let hasObj = false;

    if (params && params.length > 0) {
      params.map((item) => {
        if (typeof item == "number" || typeof item == "string") {
          content += `%c ${item} `;
          colorList.push("color:" + COLOR.PRIMARY);
        } else if (typeof item == "boolean") {
          content += `%c ${item} `;
          colorList.push("color:" + COLOR.SUCCESS);
        } else if (isObject(item)) {
          hasObj = true;
          console.group(content, ...colorList);
          for (let key in item) {
            console.group(`%c ${key}`, "color:" + COLOR.SUCCESS);
            console.log(item[key]);
            console.groupEnd();
          }
          console.groupEnd();
        } else if (isArray(item) && item.length > 0) {
          let tableHeader = null;
          hasObj = true;
          if (isObject(item[0])) {
            tableHeader = Object.keys(item[0]);
            console.table(item, tableHeader);
          } else {
            console.table(item);
          }
        }
      });

      if (!hasObj) {
        console.log(content, ...colorList);
      }
    }
  }
};

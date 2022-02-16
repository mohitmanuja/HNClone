const APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3J1d2ZiaW1paHNubG96YXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ1OTQ0MzgsImV4cCI6MTk2MDE3MDQzOH0.22p_uzytYGW8wZznlLLgB61-JYbBkV-7lcwXm_tMyWc";

function getCommonHeader() {
  return {
    apikey: APIKEY,
    "Content-Type": "application/json",
    Authorization: "Bearer " + getcookie("auth_token"),
    Prefer: "return=representation",
  };
}

function checkIsUserLoggedIn() {
  return getcookie("auth_token") ? true : false;
}

function getcookie(name = "") {
  let cookies = document.cookie;
  let cookiestore = {};

  cookies = cookies.split(";");

  if (cookies[0] == "" && cookies[0][0] == undefined) {
    return undefined;
  }

  cookies.forEach(function (cookie) {
    cookie = cookie.split(/=(.+)/);
    if (cookie[0].substr(0, 1) == " ") {
      cookie[0] = cookie[0].substr(1);
    }
    cookiestore[cookie[0]] = cookie[1];
  });

  return name !== "" ? cookiestore[name] : cookiestore;
}
var deleteCookie = function (name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};


function logOutUser() {
  fetch("https://mgsruwfbimihsnlozaus.supabase.co/auth/v1/logout", {
    method: "POST",
    headers: getCommonHeader(),
  })
    .then((response) => {
      deleteCookie("auth_token");
      window.location.reload();
      return response.json();
    })
    .catch(function () {
      // handle the error
    });
}

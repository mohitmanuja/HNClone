const APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3J1d2ZiaW1paHNubG96YXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ1OTQ0MzgsImV4cCI6MTk2MDE3MDQzOH0.22p_uzytYGW8wZznlLLgB61-JYbBkV-7lcwXm_tMyWc";
// fetch Initial page
var page = 1;

var q = {};
var favData = {};
var set = new Set();
console.log("User Logged in " + checkIsUserLoggedIn());
window.onload = function () {
  handleUser();
};
if (checkIsUserLoggedIn()) {
  getFavList();
} else {
  getInitialData();
}

function getInitialData() {
  if (location.href.includes("?")) {
    location.href
      .split("?")[1]
      .split("&")
      .forEach(function (i) {
        q[i.split("=")[0]] = i.split("=")[1];
      });
    if (q["page"]) {
      page = q["page"];
      fetchData(q["page"]);
    } else {
      fetchData(page);
    }
  } else {
    fetchData(page);
  }
  triggerPageNavColor(page);
}

function fetchData(page) {
  showLoader();
  fetch(
    "https://hn.algolia.com/api/v1/search?&page=" + page + "&hitsPerPage=50"
  )
    .then((response) => {
      hideLoader();

      return response.json();
    })
    .then((data) => {
      setData(data);

    })
    .catch(function () {
      // handle the error
    });
}

function hideLoader() {
  let loader = document.getElementById("loader");
  loader.hidden = true;
}

function showLoader() {
  let loader = document.getElementById("loader");
  loader.hidden = false;
}
function setData(data) {
  let hits = data.hits;
  hits.forEach((element) => {
    if (element.title != null && element.url != null) {
      let li = document.createElement("li");
      li.innerText = element.title;
      listView.appendChild(getListItem(element));
    }
  });
}
var audio = new Audio(
  "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-77317/zapsplat_multimedia_button_click_fast_wooden_organic_002_78836.mp3"
);

function getListItem(element) {
  // li item
  let li = document.createElement("li");
  let favTag = document.createElement("img");
  favTag.id = "favButton";
  favTag.height = 30;
  favTag.height = 30;

  const isPresent = set.has(element.objectID);
  if (isPresent) {
    favTag.innerText = "Remove";
    favTag.src =
      "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIconFilled.svg";
  } else {
    favTag.innerText = "Fav";
    favTag.src =
      "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIcon.svg";
  }

  // set 10
  favTag.addEventListener("click", function () {
    titleClicked(element, favTag); //11 //9
  });

  let titleDiv = document.createElement("div");
  titleDiv.className = "titleDiv";
  let aTitle = document.createElement("a");
  aTitle.innerText = element.title;
  aTitle.href = element.url;
  aTitle.id = "title";
  aTitle.className = "hover-link title";
  titleDiv.appendChild(aTitle);
  li.appendChild(titleDiv);

  // title
  let linkDiv = document.createElement("div");
  linkDiv.className = "linkTitle";
  let aTag = document.createElement("a");
  aTag.className = "link-doc hover-link";
  let urlHost = new URL(element.url).hostname;
  aTag.innerText = urlHost;
  aTag.href = "https://news.ycombinator.com/from?site=" + urlHost;

  linkDiv.appendChild(aTag);
  li.appendChild(linkDiv);
  li.appendChild(favTag);

  // points
  let detailDiv = document.createElement("detail");
  detailDiv.className = "detail";
  detailDiv.innerText = element.points + " points by";

  //by author
  let a1 = document.createElement("a");
  a1.className = "link";
  a1.href = "https://google.com";
  a1.innerText = element.author;
  detailDiv.appendChild(a1);

  //time ago
  let a2 = document.createElement("a");
  a2.className = "link";
  a2.href = "1 hour ago";
  // a2.innerText = moment(
  //   moment(element.created_at).format("YYYYMMDD"),
  //   "YYYYMMDD"
  // ).fromNow();
  // dayjs(element.created_at).format('YYYY-MM-DD')

  a2.innerText = dayjs(
    dayjs(element.created_at).format("YYYY-MM-DD")
  ).fromNow();
  detailDiv.appendChild(a2);

  //comments
  let a3 = document.createElement("a");
  a3.className = "link";
  a3.href = "1 hour ago";
  a3.innerText = element.num_comments + " comments";
  detailDiv.appendChild(a3);

  li.appendChild(detailDiv);

  return li;
}
function checkIsUserLoggedIn() {
  return getcookie("auth_token") ? true : false;
}

function titleClicked(element, view) {
  var ourElement = {
    title: element.title,
    url: element.url,
    author: element.author,
    objectID: element.objectID,
    points: element.points,
    userID: getcookie("user_id"),
  };
  triggerFav(ourElement, view);
}

function getMoreData(movePage) {
  if (movePage) {
    page = movePage;
    window.location = "?page=" + movePage;
  } else {
    ++page;
    window.location = "?page=" + page;
  }
}

function getCommonHeader() {
  return {
    apikey: APIKEY,
    "Content-Type": "application/json",
    "Authorization": "Bearer "+getcookie("auth_token"),
    Prefer: "return=representation",
  };
}

function getFavList() {
  fetch(
    "https://mgsruwfbimihsnlozaus.supabase.co/rest/v1/favourite?userID=eq." +
      getcookie("user_id") +
      "&select=*",
    {
      headers: getCommonHeader(),
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      favData = data;
      // on
      data.forEach((element) => {
        set.add(element.objectID);
      });
      getInitialData();
    })
    .catch(function () {
      // handle the error
    });
}

function triggerFav(element, view) {
  if(!checkIsUserLoggedIn()){
    window.location ="./login.html"
    return
  }
  const isPresent = set.has(element.objectID);
  if (!isPresent) {

    audio.play();
    view.classList.toggle("fadeIn");
    fetch("https://mgsruwfbimihsnlozaus.supabase.co/rest/v1/favourite", {
      method: "POST",
      headers: getCommonHeader(),
      body: JSON.stringify(element),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        view.src =
          "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIconFilled.svg";

        set.add(element.objectID);
      })
      .catch(function () {
        // handle the error
      });
  } else {
    audio.play();
    // https://mgsruwfbimihsnlozaus.supabase.co/rest/v1/favourite?post_id=eq.test
    fetch(
      "https://mgsruwfbimihsnlozaus.supabase.co/rest/v1/favourite?objectID=eq." +
        element.objectID,
      {
        method: "DELETE",
        headers: getCommonHeader(),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        set.delete(element.objectID);
        view.src =
          "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIcon.svg";
        view.classList.toggle("fadeOut");
      })
      .catch(function () {
        // handle the error
      });
  }
}

function triggerPageNavColor(page) {
  let page1 = document.getElementById("1");
  let page2 = document.getElementById("2");
  let page3 = document.getElementById("3");
  let page4 = document.getElementById("4");
  let page5 = document.getElementById("5");
  page1.classList.remove("pageSelected");
  page2.classList.remove("pageSelected");
  page3.classList.remove("pageSelected");
  page4.classList.remove("pageSelected");
  page5.classList.remove("pageSelected");
  if (page < 6) {
    let queryPage = document.getElementById(page);
    queryPage.classList.add("pageSelected");
  }
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

function handleUser() {
  if (checkIsUserLoggedIn()) {
    const userLabel = document.getElementById("profileLabel");
    const loginLabel = document.getElementById("loginLabel");
    userLabel.innerHTML = getcookie("email");
    loginLabel.innerHTML = "logout";
    loginLabel.href = "javascript:logoutUser()";
  }
}
function logoutUser() {
  logOutUser();
  

}
var deleteCookie = function (name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3J1d2ZiaW1paHNubG96YXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ1OTQ0MzgsImV4cCI6MTk2MDE3MDQzOH0.22p_uzytYGW8wZznlLLgB61-JYbBkV-7lcwXm_tMyWc";
const AUTH =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc3J1d2ZiaW1paHNubG96YXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ1OTQ0MzgsImV4cCI6MTk2MDE3MDQzOH0.22p_uzytYGW8wZznlLLgB61-JYbBkV-7lcwXm_tMyWc";

// fetch Initial page
var page = 1;

var q = {};
var favData = {};
var set = new Set();

getFavList();

function getInitialData() {
  console.log(JSON.stringify(favData));

  if (location.href.includes("?")) {
    location.href
      .split("?")[1]
      .split("&")
      .forEach(function (i) {
        q[i.split("=")[0]] = i.split("=")[1];
      });
    if (q["page"]) {
      console.log("query page" + page);
      page = q["page"];
      fetchData(q["page"]);
    } else {
      fetchData(page);
    }
  } else {
    fetchData(page);
  }
}

function fetchData(page) {
  fetch(
    "https://hn.algolia.com/api/v1/search?&page=" + page + "&hitsPerPage=50"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setData(data);
    })
    .catch(function () {
      // handle the error
    });
}

function setData(data) {
  let hits = data.hits;
  console.log("count " + hits.length);
  console.log(hits);
  hits.forEach((element) => {
    if (element.title != null && element.url != null) {
      let li = document.createElement("li");
      li.innerText = element.title;
      listView.appendChild(getListItem(element));
    }
  });
}

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
    favTag.src = "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIconFilled.svg";
  } else {
    favTag.innerText = "Fav";
    favTag.src = "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIcon.svg";
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

function titleClicked(element, view) {
  var ourElement = {
    title: element.title,
    url: element.url,
    author: element.author,
    objectID: element.objectID,
    points: element.points,
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
    Authorization: AUTH,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function getFavList() {
  fetch("https://mgsruwfbimihsnlozaus.supabase.co/rest/v1/favourite?select=*", {
    headers: getCommonHeader(),
  })
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
  const isPresent = set.has(element.objectID);
  if (!isPresent) {
    var audio = new Audio(
      "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-77317/zapsplat_multimedia_button_click_fast_wooden_organic_002_78836.mp3"
    );
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
        view.src = "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIconFilled.svg";

        set.add(element.objectID);
        console.log("data" + JSON.stringify(data));
      })
      .catch(function () {
        // handle the error
      });
  } else {
    var audio = new Audio("./audios/aww.mp3");
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
        console.log("removed", set);
        view.src = "https://raw.githubusercontent.com/mohitmanuja/HNClone/master/assets/favIcon.svg";
        view.classList.toggle("fadeOut");

        console.log("data" + JSON.stringify(data));
      })
      .catch(function () {
        // handle the error
      });
  }
}

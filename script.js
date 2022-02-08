// fetch Initial page
var page = 1;

var q = {};

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
  let titleDiv = document.createElement("div");
  titleDiv.className = "titleDiv";
  let aTitle = document.createElement("a");
  aTitle.innerText = element.title;
  aTitle.href = element.url;
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

function getMoreData(movePage) {
  if(movePage){
    page= movePage
    window.location = "?page=" + movePage;

  }else{
    ++page;
    window.location = "?page=" + page;
  }
}

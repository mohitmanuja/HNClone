const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login");
const createButton = document.getElementById("create");
let signupMsg = document.getElementById("postSignupMsg");
signupMsg.hidden = true;

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  login(email, password);
});
createButton.addEventListener("click", (e) => {
  e.preventDefault();
  const emailSignup = loginForm.emailSignup.value;
  const passwordSignup = loginForm.passwordSignup.value;
  signup(emailSignup, passwordSignup);
});

function login(emailValue, passwordValue) {
  let request = {
    email: emailValue,
    password: passwordValue,
  };
  console.log("<<" + JSON.stringify(request));
  fetch(
    "https://mgsruwfbimihsnlozaus.supabase.co/auth/v1/token?grant_type=password",
    {
      method: "POST",
      headers: getCommonHeader(),
      body: JSON.stringify(request),
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("data");
      if (data.error_description) {
        window.alert(data.error_description);
      } else {
        saveData(data);
        document.location.href = "/";
      }
    })
    .catch(function () {
      // handle the error
    });
}

function signup(emailValue, passwordValue) {
  createButton.innerText = "Loading";
  let request = {
    email: emailValue,
    password: passwordValue,
  };
  console.log("<<" + JSON.stringify(request));

  fetch("https://mgsruwfbimihsnlozaus.supabase.co/auth/v1/signup", {
    method: "POST",
    headers: getCommonHeader(),
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.aud === "authenticated") {
        createButton.hidden = true;
        signupMsg.hidden = false;

        console.log("success");
        window.alert(
          "User created successfully, Please confirm through your mail"
        );
      } else {
        createButton.innerText = "Signup";
        window.alert(data.msg);
      }
    })
    .catch(function () {
      // handle the error
    });
}

function saveData(data) {
  document.cookie = "auth_token=" + data.access_token;
  document.cookie = "email=" + data.user.email;
  document.cookie = "refresh_token=" + data.refresh_token;
  document.cookie = "user_id=" + data.user.id;
  document.cookie = "token_expire=" + data.expires_in;
}

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

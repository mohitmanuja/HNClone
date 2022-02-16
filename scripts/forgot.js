const resetForm = document.getElementById("reset-form");

const resetbutton = document.getElementById("resetButton");

resetbutton.addEventListener("click", (e) => {
  e.preventDefault();
  const emailReset = resetForm.emailReset.value;
  resetPassword(emailReset);
});


function resetPassword(emailValue) {
  resetbutton.innerText = "Loading";
  let request = {
    email: emailValue,
  };
  fetch("https://mgsruwfbimihsnlozaus.supabase.co/auth/v1/recover", {
    method: "POST",
    headers: getCommonHeader(),
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      window.alert(
        "Link Sent on your email, Please reset through link"
      );
    })
    .catch(function () {
      // handle the error
    });
}

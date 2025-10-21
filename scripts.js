function ValidateCreds() {
  var x = document.getElementById("creds");
  if(x[0]=="R1" and x[1]=="1785")
  {
    alert("Success.");
    window.location.assign('gateway.html');
  }
  else{
    alert("Failure");
  }
}

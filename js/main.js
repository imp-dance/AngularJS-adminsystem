localStorage.setItem("reloaded", true);
if (localStorage.getItem("imp-dm") == "true"){
    document.querySelector("body").classList.add("darkMode");
}
var app = angular.module('app', [
    'ngRoute', 
    'app.directives'
]);
const validateURL = function(str){
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(str);
}
const toggleNM = function(){
    if (document.querySelector("body").classList.contains("darkMode")){
        localStorage.setItem("imp-dm", "false");
    }else{
        localStorage.setItem("imp-dm", "true");
    }
    document.querySelector("body").classList.toggle("darkMode");
    document.location.hash = "#!/app";
    console.log("hm");
}
const fillElement = function($el, text){
    $el.value = text;
    $el.dispatchEvent(new Event('change'));
}
const fillModel = function($el, text){
    document.querySelector('[ng-model="' + $el + '"]').value = text;
    document.querySelector('[ng-model="' + $el + '"]').dispatchEvent(new Event('change'));
}
var timeOut = setTimeout(function(){});
const validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const doTableSearch = function(e, table){
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = e;
  filter = input.value.toUpperCase();
  table = document.querySelector(table);
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement && this[i].tagName != "th") {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
const logOut = function(){
    localStorage.removeItem("imp-login-key");
    window.location.hash = "#!/";
    document.querySelector(".logout").remove();
}
const errorPop = function(msg, e){
    var error = document.createElement("div");
    error.classList.add("errorPop");
    var message = msg;
    if (e == "bad"){
        error.innerHTML = `
            <i class="material-icons">error_outline</i>
            <div class="message">
                ${message}
            </div>
        `;
    }else if (e == "good"){
        error.innerHTML = `
        <i class="material-icons">account_circle</i>
        <div class="message">
            ${message}
        </div>
    `;
    error.classList.add("good");
    }
    document.querySelector(".errorcont").prepend(error);
    var errorClone = error.cloneNode();
    document.querySelector(".errorlog").prepend(errorClone);
    setTimeout(function(){
        error.remove();
    }, 8000);
}
docReady(function(){
    setTimeout(function(){
        if (localStorage.getItem("imp-theme-color") == null){
            localStorage.setItem("imp-theme-color", "#1d183a");
        }else{
            document.querySelector(".theHeader").setAttribute("style", "background:" + localStorage.getItem("imp-theme-color") + " !important;");
            document.querySelector("body").setAttribute("style", "background:" + localStorage.getItem("imp-theme-color") + " !important;");
            document.querySelector(".footer-copyright").setAttribute("style", "background:" + localStorage.getItem("imp-theme-color") + " !important;");
        }
    }, 300);

})
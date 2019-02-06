
app.controller("main", ['$scope', '$location', '$rootScope', '$http', '$route', function($scope, $location, $rootScope, $http, $route){
    $scope.$on('$routeChangeStart', function($event, next, current) { 
        document.querySelector("body").classList.add("loading");
    });
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.username = $scope.username;
    $scope.password = $scope.password;
    $scope.login = function(){
        jQuery.post("php/checklogin.php", {
            method: "password",
            username: $scope.username,
            password: $scope.password
        })
        .done(function(res){
            login(res);
        });
    }
    const loginError = function(msg){
        console.error(msg);
        var errorSpan = document.querySelector(".errorMsg");
        clearTimeout(timeOut);
        errorSpan.innerHTML = msg;
        errorSpan.classList.add("showError");
        timeOut = setTimeout(function(){
            errorSpan.innerHTML = "";
            errorSpan.classList.remove("showError");
        }, 2000);
    }
    const login = function(res){
        if(res.status == "success"){
            localStorage.setItem("imp-login-key", res.loginToken);
            window.location.hash = "#!/app";
        }else{
            localStorage.removeItem("imp-login-key");
            loginError(res.error);
        }
    }
    $scope.$on('$routeChangeSuccess', function() {
        document.querySelector(".container").classList.add("loaded");
        document.querySelector("body").classList.remove("loading");
        jQuery.post("php/getSiteSettings.php", {})
        .done(function(res){
            if (res.status == "success"){
                if (document.querySelector(".spanEl") == null){
                    var spanEl = document.createElement("span");
                    spanEl.classList.add("spanEl");
                    spanEl.innerHTML = `/ ${res.domain}`;
                    document.title = `imp/${res.domain}`;
                    document.querySelector("header h1").append(spanEl);
                }else{
                    document.querySelector(".spanEl").innerHTML = `/ ${res.domain}`;
                    document.title = `imp/${res.domain}`;
                }
                if (document.querySelector(".loginTitle") != null){
                    document.querySelector(".loginTitle").innerHTML = res.domain;
                }
            }else{
                document.querySelector(".loginTitle").innerHTML = "Logg inn";
            }
        });
        
    });
}]);
app.controller("upload", ['$scope', '$location', '$rootScope', '$http', '$route','$compile', function($scope, $location, $rootScope, $http, $route, $compile){
    $scope.$on('$routeChangeStart', function($event, next, current) { 
        document.body.classList.add("loading");
    });
    $scope.docs = [
        {
            name: "laster inn...",
            ext: " ",
            size: " "
        }
    ];
    jQuery.post("php/listDirectory.php", {
        token: localStorage.getItem("imp-login-key")
    })
    .done(function(res){
        if (res.status == "success"){
            $scope.docs = res.dir;
            $scope.$apply();
        }
    });
    $scope.doUpload = function(){
        $scope.files = $scope.files;
        jQuery.post("php/uploadFiles.php", {
            files: this.files,
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            console.log(res);
        });
    }
    $scope.$on('$routeChangeSuccess', function() {
        document.body.classList.remove("loading");
        document.querySelector(".container").classList.remove("loaded");
        jQuery.post("php/getUserInfo.php", {
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            if (res.status != "success"){
                window.location.hash = "#!/";
                return false;
            }
            if (document.querySelector(".logout") == null){
                var logOutLink = document.createElement("li");
                logOutLink.innerHTML = `<a href="" class="waves-effect waves-light btn logout red lighten-2" onclick="logOut()">Logg ut</a>`;
                document.querySelector("header ul").prepend(logOutLink);
            }
            userInfo = res;
            $scope.email = res.email;
            $scope.nick = res.nick;
            $scope.permission = res.permission;
            switch ($scope.permission){
                case "1":
                default:
                    $scope.permissionText = "Legg inn/rediger artikler";
                break;
                case "2":
                    $scope.permissionText = "2 - Rediger sider, legge inn/redigere artikler, se filer";
                break;
                case "3":
                    $scope.permissionText = "Legg inn/register sider & artikler, filopplastning";
                break;
                case "root":
                    $scope.permissionText = "Alle rettigheter";
                break;
            };
            $scope.validated = res.validated;
            $rootScope.validated = res.validated;
            $scope.files = $scope.files;
            document.querySelector(".hiddenTokenUpload").setAttribute("value", localStorage.getItem("imp-login-key"));
            if (res.validated == 'false'){
                document.querySelector("input[type='file']").setAttribute("disabled", "disabled");
                document.querySelector(".uploadBut").setAttribute("disabled", "disabled");
                document.querySelector(".file-field").classList.add("disabled");
                document.querySelector(".file-path").setAttribute("placeholder", "Vertifiser brukeren din for å laste opp filer.");
            }else{
            }
            $scope.$apply();
            document.querySelector(".container").classList.add("loaded");
        });
    });
}]);
app.controller("app", ['$scope', '$location', '$rootScope', '$http', '$route','$compile', function($scope, $location, $rootScope, $http, $route, $compile){
    $scope.$on('$routeChangeStart', function($event, next, current) { 
     document.body.classList.add("loading");
    });
    $scope.logout = function(){
        logOut();
    }
    $rootScope.themeColor = "#1d183a";
    console.log($rootScope.themeColor);
    $scope.$on('$routeChangeSuccess', function() {
        document.body.classList.remove("loading");
        if (window.location.hash.startsWith("#!/docs#")){
            var scrollEl = window.location.hash.substr(8);
            document.querySelector("*[name='" + scrollEl + "']").scrollIntoView();
        }
        document.querySelector(".container").classList.remove("loaded");
        /* document ready */
        var userInfo;
        if (document.querySelector(".logout") == null){
            var logOutLink = document.createElement("li");
            logOutLink.innerHTML = `<a href="" class="waves-effect waves-light btn logout red lighten-2" onclick="logOut()">Logg ut</a>`;
            document.querySelector("header ul").prepend(logOutLink);
        }
        jQuery.post("php/getUserInfo.php", {
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            if (res.status != "success"){
                window.location.hash = "#!/";
                return false;
            }
            userInfo = res;
            $scope.email = res.email;
            $scope.nick = res.nick;
            $scope.validated = res.validated;
            $scope.permission = res.permission;
            $rootScope.validated = res.validated;
            if (res.validated == 'false'){
                if (localStorage.getItem("reloaded") == "true"){
                    var validateReminder = document.createElement("verify");
                    document.querySelector(".appender").appendChild(validateReminder);
                    $compile(validateReminder)($scope);
                }
            }
            $scope.$apply();
            document.querySelector(".container").classList.add("loaded");
            jQuery.post("php/getSiteSettings.php", {
                token: localStorage.getItem("imp-login-key")
            })
            .done(function(res){
                if (res.status == "error"){
                    switch (res.errorCode){
                        case "1":
                            errorPop("Du har ikke tillatelse til det.", "bad");
                        break;
                        case "2":
                        default:
                            errorPop("Du må legge inn side-instillinger", "bad");
                        break;
                    }
                }else{
                    //
                    if (document.querySelector(".spanEl") == null){
                        var spanEl = document.createElement("span");
                        spanEl.classList.add("spanEl");
                        spanEl.innerHTML = `/ ${res.domain}`;
                        document.querySelector("header h1").append(spanEl);
                        document.title = `imp/${res.domain}`;
                    }else{
                        document.querySelector(".spanEl").innerHTML = `/ ${res.domain}`;
                        document.title = `imp/${res.domain}`;
                    }
                }
            });
        });
    });
}]);
app.controller("articles", ['$scope', '$location', '$rootScope', '$http', '$route','$compile', function($scope, $location, $rootScope, $http, $route, $compile){
    $scope.$on('$routeChangeStart', function($event, next, current) { 
     document.body.classList.add("loading");
    });
    $scope.logout = function(){
        logOut();
    }
    $scope.articletype = $scope.articletype;
    $scope.newArticle = function(ny, id){
        document.body.classList.add("loading");
        document.querySelector(".allArticleCont").classList.add("newArticle");




        var toolbarOptions = [
            [{'header': 
                [2, 3, 4, false] 
            }], 
            ['bold', 'italic'], 
            ['link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
        ];
        function selectLocalImage(quill){
           var imageURL = prompt("Bilde-URL", "https://...");
           var validate = validateURL(imageURL);
           if (imageURL != null && validate != false){
            insertToEditor(imageURL, quill);
           }else{
               if (imageURL != null && validate == false){
                    errorPop("Vennligst legg inn en valid bilde-URL", "bad");
               }
           }
        }
        function insertToEditor(url, quill) {
            // push image url to rich editor.
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', `${url}`);
          }
        if (document.querySelector(".quill") == null){
                                //quill main
                                var quillJS = document.createElement("script");
                                quillJS.setAttribute("src", "//cdn.quilljs.com/1.3.6/quill.min.js");
                                quillJS.setAttribute("class", "quill");
                                document.querySelector("head").append(quillJS);

                                //theme
                                var quillTheme = document.createElement("link");
                                quillTheme.setAttribute("href", "//cdn.quilljs.com/1.3.6/quill.snow.css");
                                quillTheme.setAttribute("rel", "stylesheet");
                                document.querySelector("head").append(quillTheme);
            
                setTimeout(function(){
                    document.body.classList.remove("loading");

                    var quill = new Quill('#editor-container', {
                        modules: {
                            toolbar: toolbarOptions
                        },
                        handlers: {
                            'image': selectLocalImage
                        },
                        theme: 'snow'
                    });
                    quill.getModule('toolbar').addHandler('image', () => {
                        selectLocalImage(quill);
                    });
                }, 1000);
                document.querySelector(".sitetitles").focus();
        }else{
                document.body.classList.remove("loading");

                var quill = new Quill('#editor-container', {
                    modules: {     
                    toolbar: toolbarOptions
                },
                handlers: {
                    'image': selectLocalImage
                },
                    theme: 'snow'
                });
                quill.getModule('toolbar').addHandler('image', () => {
                selectLocalImage();
                });
                document.querySelector(".sitetitles").focus();
        }





        if (document.querySelector(".hiddenIdInput") == null){

        }else{
            document.querySelector(".hiddenIdInput").remove();
        }
        if (ny == "new"){
            document.querySelector(".article-type").setAttribute("value", "new");
            document.querySelector(".pubTex").innerHTML = "Publiser med en gang";
            if (document.querySelector(".slettArtikkel") != null){
                document.querySelector(".slettArtikkel").remove();
            }
        }else{
            // edit article
            //// Removed old ID, add new to form.
            var doUpdate = function(){
                jQuery.post("php/getArticleInfo.php", {
                    token: localStorage.getItem("imp-login-key"),
                    id: window.location.hash.split("--id=")[1]
                })
                .done(function(res){
                    console.log(res);
                    if (res.status == "success"){
                        document.querySelector(".ql-editor").innerHTML = res.content;
                        document.querySelector(".sitetitles").setAttribute("value", res.title);
                        if (res.published == "true"){
                            document.querySelector(".publishCheck").click();
                        }
                    }else{
                        document.querySelector(".articleTime").innerHTML = `
                        <div class="row">
                            <div class="col s12">
                            <h3>Fant ikke artikkel</h3>
                            <p>Fant ingen artikkel med ID#`+window.location.hash.split("--id=")[1]+`</p>
                        <a href="#!/articles" class="waves-effect waves-light btn-small themeBtn"><i class="material-icons left">arrow_back</i> Tilbake</a>
                        </div></div>
                        `;
                    }
                });
            }
            if (document.querySelector(".slettArtikkel") == null){
                var slettArtikkelBut = document.createElement("a");
                slettArtikkelBut.classList.add("btn");
                slettArtikkelBut.classList.add("waves-effect");
                slettArtikkelBut.classList.add("waves-light");
                slettArtikkelBut.classList.add("red");
                slettArtikkelBut.classList.add("lighten-2");
                slettArtikkelBut.innerHTML = `Slett artikkel`;
                slettArtikkelBut.setAttribute("ng-click", "deleteArticle()");
                document.querySelector(".appSlett").appendChild(slettArtikkelBut);
                $compile(slettArtikkelBut)($scope);
                $scope.$apply();
            }
            $scope.deleteArticle = function(){
                if (confirm("Er du sikker på at du vil permanent slette denne artiklen?")){
                    // Post then
                    jQuery.post("php/deleteArticle.php", {
                        token: localStorage.getItem("imp-login-key"),
                        id: window.location.hash.split("--id=")[1]
                    })
                    .done(function(res){
                        if (res.status == "success"){
                            window.location.hash="#!/articles"
                            errorPop("Artikkel ble slettet.", "good");
                            console.log($scope.permission);
                        }else{
                            errorPop(res.error, "bad");
                        }
                    });
                }else{
                    // Nadaaa
                    console.log("Cancelled");
                }
            }
            if (document.querySelector(".ql-editor") == null){
                setTimeout(function(){
                    if (document.querySelector(".ql-editor") == null){
                        setTimeout(function(){
                            doUpdate();
                        }, 1000);
                    }else{
                        doUpdate();
                    }
            }, 1000);
            }else{
                doUpdate();
            }
            var hiddenId = document.createElement("input");
            hiddenId.setAttribute("type", "hidden");
            hiddenId.setAttribute("name", "editId");
            hiddenId.setAttribute("ng-model", "editId");
            hiddenId.setAttribute("value", id);
            hiddenId.setAttribute("class", "hiddenIdInput");
            document.querySelector(".pubTex").innerHTML = "Publisert";
            document.querySelector(".article-type").setAttribute("value", "edit");
            document.querySelector(".articleTime").append(hiddenId);
            console.log("editing " + id + "...");
        }
    }
    $scope.editArticle = function(id){
        console.log(id);
    }
    $scope.saveArticle = function(){
        var articleType = document.querySelector(".article-type").getAttribute("value");
        var title = document.querySelector(".sitetitles").value;
        var pub = document.querySelector(".publishCheck").checked;
        var html = document.querySelector(".ql-editor").innerHTML;
        if (articleType == "new"){
            console.log("new!");
            jQuery.post("php/createArticle.php", {
                token: localStorage.getItem("imp-login-key"),
                title: title,
                content: html,
                published: pub
            })
            .done(function(res){
                setTimeout(function(){
                document.querySelector(".progresscont").classList.remove("forceShow");
                    console.log(res);
                    if (res.status == "success"){
                        window.location.hash="#!/articles";
                        errorPop("Artikkel lagret", "good");
                    }else{
                        errorPop(res.error, "bad");
                    }
                }, 500);
            });
        }else{
            document.querySelector(".progresscont").classList.add("forceShow");
            var editId = document.querySelector(".hiddenIdInput").getAttribute("value");
            jQuery.post("php/editArticle.php", {
                token: localStorage.getItem("imp-login-key"),
                id: editId,
                title: title,
                content: html,
                published: pub
            })
            .done(function(res){
                setTimeout(function(){
                document.querySelector(".progresscont").classList.remove("forceShow");
                    console.log(res);
                    if (res.status == "success"){
                        window.location.hash="#!/articles";
                        errorPop("Artikkel lagret", "good");
                    }else{
                        errorPop(res.error, "bad");
                    }
                }, 500);
            });
        }
        
        
    }
    $scope.$on('$routeChangeSuccess', function() {
        document.body.classList.remove("loading");
        document.querySelector(".container").classList.remove("loaded");
        /* document ready */
        var userInfo;
        if (document.querySelector(".logout") == null){
            var logOutLink = document.createElement("li");
            logOutLink.innerHTML = `<a href="" class="waves-effect waves-light btn logout red lighten-2" onclick="logOut()">Logg ut</a>`;
            document.querySelector("header ul").prepend(logOutLink);
        }
        jQuery.post("php/getUserInfo.php", {
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            if (res.status != "success"){
                window.location.hash = "#!/";
                return false;
            }
            if (window.location.hash.split("#")[2] == "new"){
                $scope.newArticle("new");
            }
            if (window.location.hash.split("#")[2] != undefined && window.location.hash.split("#")[2].startsWith("edit")){
                if (window.location.hash.split("--id=")[1] != undefined){
                    $scope.newArticle("edit", window.location.hash.split("--id=")[1]);
                }
            }
            userInfo = res;
            $scope.email = res.email;
            $scope.nick = res.nick;
            $scope.validated = res.validated;
            $scope.permission = res.permission;
            $rootScope.validated = res.validated;
            if (res.validated == 'false'){
                if (localStorage.getItem("reloaded") == "true"){
                    var validateReminder = document.createElement("verify");
                    document.querySelector(".appender").appendChild(validateReminder);
                    $compile(validateReminder)($scope);
                }
            }
            $scope.$apply();
            document.querySelector(".container").classList.add("loaded");
            jQuery.post("php/getSiteSettings.php", {
                token: localStorage.getItem("imp-login-key")
            })
            .done(function(res){
                if (res.status == "error"){
                    switch (res.errorCode){
                        case "1":
                            errorPop("Du har ikke tillatelse til det.", "bad");
                        break;
                        case "2":
                        default:
                            errorPop("Du må legge inn side-instillinger", "bad");
                        break;
                    }
                }else{
                    //
                    if (document.querySelector(".spanEl") == null){
                        var spanEl = document.createElement("span");
                        spanEl.classList.add("spanEl");
                        spanEl.innerHTML = `/ ${res.domain}`;
                        document.title = `imp/${res.domain}`;
                        document.querySelector("header h1").append(spanEl);
                    }else{
                        document.querySelector(".spanEl").innerHTML = `/ ${res.domain}`;
                        document.title = `imp/${res.domain}`;
                    }
                }
            });
        });
    });
}]);
app.controller("settings", ['$scope', '$location', '$rootScope', '$http', '$route','$compile', function($scope, $location, $rootScope, $http, $route, $compile){
    $scope.$on('$routeChangeStart', function($event, next, current) { 
     document.body.classList.add("loading");
    });
    $scope.editUser = function(e){
        console.log(e);
    }
    $scope.reLoad = function(){
        document.querySelector("list-users").remove();
        var newList = document.createElement("list-users");
        document.querySelector(".list-user-cont").prepend(newList);
        $scope.$apply();
    }
    $scope.$on('$routeChangeSuccess', function() {
        document.body.classList.remove("loading");
        
        
        document.querySelector(".container").classList.remove("loaded");
        var userInfo;
        jQuery.post("php/getUserInfo.php", {
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            if (res.status != "success"){
                window.location.hash = "#!/";
                return false;
            }
            userInfo = res;
            $scope.email = res.email;
            $scope.nick = res.nick;
            $scope.validated = res.validated;
            $scope.permission = res.permission;
            $rootScope.validated = res.validated;
            switch ($scope.permission){
                case "1":
                default:
                    $scope.permissionText = "Legg inn/rediger artikler";
                break;
                case "2":
                    $scope.permissionText = "Rediger sider, legge inn/redigere artikler, se filer";
                break;
                case "3":
                    $scope.permissionText = "Legg inn/register sider & artikler, filopplastning";
                break;
                case "root":
                    $scope.permissionText = "Alle rettigheter";
                break;
            };
            $scope.$apply();
            if (document.querySelector(".logout") == null){
                var logOutLink = document.createElement("li");
                logOutLink.innerHTML = `<a href="" class="waves-effect waves-light btn logout red lighten-2" onclick="logOut()">Logg ut</a>`;
                document.querySelector("header ul").prepend(logOutLink);
            }
            if (document.querySelector(".registerOverlay") != null){
                document.querySelector(".registerOverlay").addEventListener("click", function(event){
                    var noRedirect = '.registerBox';
                    if (!event.target.matches(noRedirect)) {
                        document.querySelector(".registerOverlay").classList.remove("active");
                    }
                }, false);
            }
        });
    });
    $scope.register = function(){
        if ($scope.permission == "root"){
            /*
            Ask for username and password
            */ 
            document.addEventListener('DOMContentLoaded', function() {
                var elems = document.querySelectorAll('select');
                var instances = M.FormSelect.init(elems, options);
            });
           document.querySelector(".registerOverlay").classList.add("active");
        }
    }
    $scope.childClick = function($event) {
        $event.stopPropagation();
    }
    $scope.getUserList = function(res){
        console.log("heh");
    }
    $scope.doRegister = function(){
        document.body.classList.add("loading");
        $scope.regUsername = this.regUsername; 
        $scope.regName = this.regName; 
        $scope.regMessage = this.regMessage;
        $scope.regPermission = this.regPermission;       
        jQuery.post("php/createUser.php", {
            email: $scope.regUsername,
            permission: $scope.regPermission,
            name: $scope.regName,
            message: $scope.regMessage,
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            console.log(res);
            document.body.classList.remove("loading");
            if (res.status == "error"){
                errorPop(res.error, "bad");
            }else{
                errorPop("Bruker ble lagt til!", "good");
                $scope.regUsername = ""; 
                $scope.regName = ""; 
                $scope.regMessage = "";
                $scope.regPermission = "";  
                document.querySelector(".registerOverlay").click(); 
                document.querySelector(".refBut").click();
            }
        });
    }
}]);
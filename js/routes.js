app.config(['$routeProvider', function($routeProvider, $rootScope){
    $routeProvider
    .when('/', {
        resolve: {
            "check": function(){
                jQuery.post("php/checklogin.php", {
                    method: "token",
                    token: localStorage.getItem("imp-login-key")
                })
                .done(function(res){
                    if (res.status != "success"){
                        // ignore
                    }else{

                        window.location.hash = "#!/app";
                    }
                });
            }
        },
        templateUrl: 'html/login.html',
        controller: 'main'
    })
    .when('/docs', {
        resolve: {
            "check": function($location, $rootScope){

                /* Check login */
                if (localStorage.getItem("imp-login-key") === null){
                    window.location.hash = "#!/";
                }else{
                    jQuery.post("php/checklogin.php", {
                        method: "token",
                        token: localStorage.getItem("imp-login-key")
                    })
                    .done(function(res){
                        if (res.status != "success"){
                            window.location.hash = "#!/#goto=" + window.location.hash;
                            return false;
                        }
                    });
                }
            }
        },
        templateUrl: 'html/docs.html',
        controller: 'app'
    })
    .when('/upload', {
        resolve: {
            "check": function($location, $rootScope){

                /* Check login */
                if (localStorage.getItem("imp-login-key") === null){
                    window.location.hash = "#!/";
                }else{
                    jQuery.post("php/checklogin.php", {
                        method: "token",
                        token: localStorage.getItem("imp-login-key")
                    })
                    .done(function(res){
                        if (res.status != "success"){
                            window.location.hash = "#!/#goto=" + window.location.hash;
                            return false;
                        }
                    });
                }
            }
        },
        templateUrl: 'html/upload.html',
        controller: 'upload'
    })
    .when('/articles', {
        resolve: {
            "check": function($location, $rootScope){

                /* Check login */
                if (localStorage.getItem("imp-login-key") === null){
                    window.location.hash = "#!/";
                }else{
                    jQuery.post("php/checklogin.php", {
                        method: "token",
                        token: localStorage.getItem("imp-login-key")
                    })
                    .done(function(res){
                        if (res.status != "success"){
                            window.location.hash = "#!/#goto=" + window.location.hash;
                            return false;
                        }
                    });
                }
            }
        },
        templateUrl: 'html/articles.html',
        controller: 'articles'
    })
    .when('/no-permission', {
        resolve: {
            "check": function($location, $rootScope){

                
            }
        },
        templateUrl: 'html/no-permission.html',
        controller: 'app'
    })
    .when('/pages', {
        resolve: {
            "check": function($location, $rootScope){

                /* Check login */
                if (localStorage.getItem("imp-login-key") === null){
                    window.location.hash = "#!/";
                }else{
                    jQuery.post("php/checklogin.php", {
                        method: "token",
                        token: localStorage.getItem("imp-login-key")
                    })
                    .done(function(res){
                        if (res.status != "success"){
                            window.location.hash = "#!/#goto=" + window.location.hash;
                            return false;
                        }
                    });
                }
            }
        },
        templateUrl: 'html/pages.html',
        controller: 'app'
    })
    .when('/settings', {
        resolve: {
            "check": function($location, $rootScope){

                /* Check login */
                if (localStorage.getItem("imp-login-key") === null){
                    window.location.hash = "#!/";
                }else{
                    jQuery.post("php/checklogin.php", {
                        method: "token",
                        token: localStorage.getItem("imp-login-key")
                    })
                    .done(function(res){
                        if (res.status != "success"){
                            window.location.hash = "#!/#goto=" + window.location.hash;
                            return false;
                        }
                    });
                }
            }
        },
        templateUrl: 'html/settings.html',
        controller: 'settings'
    })
    .when('/app', {
        resolve: {
            "check": function($location, $rootScope){
                if (document.location.hash == "#!/app#nightmode"){
                    toggleNM();
                }
                /* Check login */
                if (localStorage.getItem("imp-login-key") === null){
                    window.location.hash = "#!/";
                }else{
                    jQuery.post("php/checklogin.php", {
                        method: "token",
                        token: localStorage.getItem("imp-login-key")
                    })
                    .done(function(res){
                        if (res.status != "success"){
                            window.location.hash = "#!/#goto=" + window.location.hash;
                            return false;
                        }
                    });
                }
                
            }
        },
        templateUrl: 'html/app.html',
        controller: 'app'
    })
    .when('/info', {
        templateUrl: 'html/info.html',
        controller: function($scope){
            $scope.$on('$routeChangeSuccess', function() {
                document.querySelector(".container").classList.add("loaded");
                document.querySelector("body").classList.remove("loading");
            });
            
        }
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
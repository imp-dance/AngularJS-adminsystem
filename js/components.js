app.component('funcList', {
    template: `<ul class="functions">
                    <li ng-repeat="a in functions"><a href="{{a.href}}" class="waves-effect waves-light btn-large hoverable" style="background:{{a.bg}} !important;">  <i class="material-icons left">{{a.icon}}</i> {{a.name}}</a></li>
                </ul>`,
    controller: function($scope){
        $scope.functions = [
            {name: "Artikler", href:"#!/articles", icon: "feedback", bg: "#6054a5"},
            {name: "Sider", href:"#!/pages", icon: "extension", bg: "#286f88"},
            {name: "Filer", href:"#!/upload", icon: "cloud_upload", bg: "#276959"},
            {name: "Innstillinger", href:"#!/settings", icon: "account_box"}
        ];
    }
});
app.component('helpList', {
    template:`<ul class="functions helpLinks">
                  <li ng-repeat="a in helpLinks"><a href="{{a.href}}" class="waves-effect waves-light btn">  <i class="material-icons left">{{a.icon}}</i> {{a.name}}</a></li>
              </ul>`,
    controller: function($scope){
        $scope.helpLinks = [
            {name: "Dokumentasjon", href:"#!/docs", icon: "folder_open"},
            {name: "FAQ", href:"#!/faq", icon: "help"},
            {name: "Nattmodus", href:"#!/app#nightmode", icon: "wb_sunny"}
        ];
    }
});
app.component('verify', {
    templateUrl: 'html/alert.html',
    controller: function($scope){
        $scope.text = "Brukeren din er ikke validert, så du kan ikke redigere noe. Vennligst valider via link sendt til email.";
        $scope.linktext = "Send ny link";
        $scope.icon = "warning";
        $scope.class = " ";
        $scope.func = function (){
            document.querySelector(".progresscont").classList.add("forceShow");
            document.querySelector(".reminder").classList.add("hide");
            
            setTimeout(function(){ // do stuff...
                                    // ..then
                document.querySelector(".progresscont").classList.remove("forceShow");
                var validateReminder = document.querySelector(".reminder");
                validateReminder.classList.remove("hide");
                validateReminder.innerHTML = `
                <div class="card-stacked">
                <div class="card-content">
                <p>Ny link ble sendt til din email.</p>
                </div>
                </div>
                `;
                localStorage.setItem("reloaded", false);
            }, 1500);
            return false;
        }
    }
});
app.component('quickLinks', {
    template: `
    <div class="qlCont">
    <a href="#!/articles#new" class="blue darken-3 btn-floating btn-tiny waves-effect waves-light red hoverable themeBtn tooltipped" data-position="top" data-tooltip="Ny artikkel"><i class="material-icons">comment</i></a>
    <a href="#!/upload" class="blue darken-3 btn-floating btn-tiny waves-effect waves-light red hoverable themeBtn tooltipped" data-position="top" data-tooltip="Last opp fil"><i class="material-icons">backup</i></a>
    </div>
    <a class="blue darken-3 btn-floating btn-large waves-effect waves-light red hoverable addArticle" ng-click="showList()"><i class="material-icons toggleMat">add</i></a>
    `,
    controller: function($scope){
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, {
            enterDelay: 300
        });
        $scope.showList = function(){
            $toggle(".qlCont", "active");
            var htmlstring = document.querySelector(".toggleMat").innerHTML;
            htmlstring = (htmlstring.trim) ? htmlstring.trim() : htmlstring.replace(/^\s+/,'')
            if (htmlstring == "add"){
                document.querySelector(".toggleMat").innerHTML = `redo`;
            }else{
                document.querySelector(".toggleMat").innerHTML = `add`;
            }
        }
    }
});
app.component('listPermissions', {
    template: `
    <ul class="collection permissions">
        <li ng-repeat="a in perm" class="collection-item">
            <b>{{a.name}}</b>: 
            <span>{{a.text}}</span>
            <div ng-if="a.name != 'root'" style="display:inline;">
                <a href="#" class="waves-effect waves-light btn">Rediger</a>
            </div>
            <div class="clear"></div>
        </li>
    </ul>
    `,
    controller: function($scope){
        $scope.perm = [
            {
                name: "1",
                text: "Legg inn innlegg"
            },
            {
                name: "2",
                text: "Legg inn innlegg, redigere sider"
            },
            {
                name: "3",
                text: "Alt utenom bruker/tillatelse-redigering"
            },
            {
                name: "root",
                text: "Alt"
            }
        ];
    }
});
app.component('siteSettings', {
    template: `


        <div ng-if="status == 'error'">


        <p><b>NB!</b>: Fant ingen sideinnstillinger.</p>

        <div class="input-field">
            <label for="username">Domene (ex: google.com)</label>
            <input type="text" autocomplete="off" ng-model="siteDomain" name="siteDomain" />
        </div>
        <div class="input-field">
            <label for="username">Navn (ex: Google)</label>
            <input type="text" autocomplete="off" ng-model="siteName" name="siteName" />
        </div>
        <div class="input-field">
            <textarea id="siteDescription" style="min-height:75px;" class="materialize-textarea" ng-model="siteDescription"></textarea>
            <label for="siteDescription">Beskrivelse</label>
        </div>
            <a href ng-click="addSettings()" class="waves-effect waves-light btn logout red lighten-2">Legg til sideinnstillinger</a>


        </div>
        <div ng-if="status == 'success'">
            <div class="notediting">
            <table>
            <tr>
            <td>
                <strong>Domene:</strong></td><td> {{domain}}</td></tr>
                <tr>
                <td>
                <strong>Navn:</strong></td><td> {{name}}</td></tr>
                <tr style="border-bottom:none;">
                <td>
                <strong>Beskrivelse:</strong></td><td> {{description}}</td></tr>
                </table>
                <a href ng-click="edit()" class="btn-floating btn-large waves-effect waves-light red editSettings themeBtn"><i class="material-icons">edit</i></a>
            </div>
            <div class="isediting">
            <a href ng-click="doEdit()" class="btn-floating btn-large waves-effect waves-light red editSettings themeBtn"><i class="material-icons">check</i></a>
            <div class="input-field">
            <label for="username" class="active">Domene (ex: google.com)</label>
                <input type="text" autocomplete="off" ng-model="siteDomains" name="siteDomain" />
            </div>
            <div class="input-field">
                <label for="username" class="active">Navn (ex: Google)</label>
                <input type="text" autocomplete="off" ng-model="siteNames" name="siteName" />
            </div>
            <div class="input-field">
                <textarea id="siteDescription" style="min-height:75px;" class="materialize-textarea" ng-model="siteDescriptions"></textarea>
                <label for="siteDescription" class="active">Beskrivelse</label>
            </div>
            </div>
        </div>



    `,
    controller: function($scope, $rootScope, $route){
        var dis = this;
        jQuery.post("php/getSiteSettings.php", {
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            var nestedRes = res;
            if (res.status == "error"){
                $scope.status = "error";
                $scope.siteDomain = $scope.siteDomain;
                $scope.siteName = $scope.siteName;
                $scope.siteDescription = $scope.siteDescription;
                $rootScope.siteName = $scope.siteName;
                $scope.addSettings = function(){
                    jQuery.post("php/addSiteSettings.php", {
                        token: localStorage.getItem("imp-login-key"),
                        domain: this.siteDomain,
                        name: this.siteName,
                        description: this.siteDescription
                    })
                    .done(function(res){
                        console.log(res);
                        if (res.status == "success"){
                            window.location.reload();
                        }
                    });
                }
                $scope.$apply();
            }else{
                $scope.edit = function(){
                    document.querySelector("site-settings").classList.add("editing");
                }
                $scope.doEdit = function(){
                    document.querySelector(".progresscont").classList.add("forceShow");
                    $scope.siteDomains = $scope.siteDomains;
                    $scope.siteNames = $scope.siteNames;
                    $scope.siteDescriptions = $scope.siteDescriptions;
                    jQuery.post("php/editSiteSettings.php", {
                        token: localStorage.getItem("imp-login-key"),
                        domain: this.siteDomains,
                        name: this.siteNames,
                        description: this.siteDescriptions
                    })
                    .done(function(res){
                        setTimeout(function(){
                            if (res.status = "success"){
                                $scope.domain = $scope.siteDomains;
                                $scope.name = $scope.siteNames;
                                $scope.description = $scope.siteDescriptions;
                                $scope.$apply();
                                document.querySelector("site-settings").classList.remove("editing");
                            }else{
                                errorPop(res.error, "bad");
                            }
                            $route.reload();
                            document.querySelector(".progresscont").classList.remove("forceShow");
                        }, 500);
                    });
                }
                $scope.status = "success";
                if (document.querySelector(".spanEl") == null){
                    var spanEl = document.createElement("span");
                    spanEl.classList.add("spanEl");
                    spanEl.innerHTML = `/ ${res.domain}`;
                    document.querySelector("header h1").append(spanEl);
                }else{
                    document.querySelector(".spanEl").innerHTML = `/ ${res.domain}`;
                }
                $scope.domain = res.domain;
                $scope.name = res.title;
                $scope.description = res.description;
                $scope.siteDomains = res.domain;
                $scope.siteNames = res.title;
                $scope.siteDescriptions = res.description;
                $scope.$apply();
            }
        });
    }
});
app.component('listArticles', {
    template: `
                            <label>
                                <input type="checkbox" class="showCheck" />
                                <span class="pubTex" style="color:#666;">Vis bare publiserte artikler</span>
                            </label>
                            <div class="clear"></div><br /><br />
    <table class="listArticlesTable">
        <thead>
            <tr>
                <th style="min-width:130px;">Tittel</th>
                <th>Forfatter</th>
                <th>Dato</th>
                <th>Publisert</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr ng-repeat="a in articles" ng-class="{true: 'notpublished', false: 'published'}[a.published == 'false']">
                <td>{{a.title}}</td>
                <td>{{a.author}}</td>
                <td>{{a.date}}</td>
                <td><i ng-if="a.date != ' '" class="material-icons">{{(a.published == "true") ? 'check_box':'check_box_outline_blank'}}</i></td>
                <td><span ng-if="a.permission != 'root' && a.date != ' '"><a href="#!/articles#edit--id={{a.id}}" class="btn-floating btn-tiny waves-effect waves-light red deleteUser themeBtn"><i class="material-icons">edit</i></a></span></td>
            </tr>
        </tbody>
    `,
    controller: function($scope){
        $scope.articles = [
            {
                title: "laster inn...",
                author: " ",
                date: " ",
                published: "false"
            }
        ];
        document.querySelector(".showCheck").addEventListener( 'change', function() {
            if(this.checked) {
                // Checkbox is checked..
            } else {
                // Checkbox is not checked..
                
            }
            $toggle(".notpublished", "hide");
        });
        $scope.reLoad = function(){
            document.querySelector(".progresscont").classList.add("forceShow");
            jQuery.post("php/listArticles.php", {
                token: localStorage.getItem("imp-login-key")
            })
            .done(function(res){
                setTimeout(function(){
                    document.querySelector(".progresscont").classList.remove("forceShow");
                }, 500);
                console.log(res);
                $scope.articles = res;
                $scope.$apply();
            });
        }
        jQuery.post("php/listArticles.php", {
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            setTimeout(function(){
                document.querySelector(".progresscont").classList.remove("forceShow");
            }, 500);
            $scope.articles = res;
            $scope.$apply();
        });
        /*
        jQuery.post("php/listUsers.php", {
            token: localStorage.getItem("imp-login-key")
        })
        .done(function(res){
            $scope.users = res;
            $scope.$apply();
        });
        */
    }
});
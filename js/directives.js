/* <list-users></list-users>*/
angular.module('app.directives', [])
.directive("listUsers", function($parse){
    return {
        restrict: "AE",
        scope: {
            data: "=",
            eufunc: "=",
            permission: "="
        },
        templateUrl: "html/dirs/listUsers.html",
        // transclude: true, // ng-transclude
        controller: function($scope, $route){
            var data = $scope.data;
            $scope.editUser = function($event){
                $scope.hiddenEditID = $scope.hiddenEditID;
                $scope.edEmail = $scope.edEmail;
                $scope.edName = $scope.edName;
                $scope.edPermission = $scope.edPermission;
                var editID = $event.target.parentNode.getAttribute("data-id");
                fillElement(document.querySelector("[ng-model='hiddenEditID']"), editID);
                $scope.hiddenEditID = editID;         
                jQuery.post("php/getUserInfo.php", {
                    token: localStorage.getItem("imp-login-key"),
                    id: editID
                })
                .done(function(res){
                    $scope.users = res;
                    $scope.edName = res.nick;
                    $scope.edEmail = res.email;
                    $scope.edPermission = res.permission;
                    $scope.$apply();
                });
                document.querySelector("list-users").classList.add("isEditing");
                
            }
            $scope.users = [ // before users are loaded
                {
                    name: "root",
                    email: "laster inn...",
                    validated: "true",
                    permission: "root",
                    id: "0"
                }
            ];
            $scope.backToUsers = function(){
                document.querySelector("list-users").classList.remove("isEditing");
                $route.reload();
            }
            $scope.saveUser = function(){
                $scope.hiddenEditID = document.querySelector("[ng-model='hiddenEditID']").value;
                $scope.edEmail = document.querySelector("[ng-model='edEmail']").value;
                $scope.edName = document.querySelector("[ng-model='edName']").value;
                $scope.edPermission = document.querySelector("[ng-model='edPermission']").value;
                jQuery.post("php/editUserInfo.php", {
                    token: localStorage.getItem("imp-login-key"),
                    id: $scope.hiddenEditID,
                    email: $scope.edEmail,
                    name: $scope.edName,
                    permission: $scope.edPermission
                })
                .done(function(res){
                    console.log(res);
                    if (res.status == "success"){
                        document.querySelector("list-users").classList.remove("isEditing");
                        $route.reload();
                        errorPop("Bruker oppdatert", "good");
                    }else{
                        errorPop(res.error, "bad");
                    }
                });
            }
            $scope.deleteUser = function(){
                $scope.hiddenEditID = document.querySelector("[ng-model='hiddenEditID']").value;

                if (confirm("Er du sikker på at du vil permanent slette brukeren?") == true){
                    jQuery.post("php/deleteUser.php", {
                        token: localStorage.getItem("imp-login-key"),
                        id: $scope.hiddenEditID
                    })
                    .done(function(res){
                        console.log(res);
                        if (res.status == "success"){
                            document.querySelector("list-users").classList.remove("isEditing");
                            $route.reload();
                            errorPop("Bruker fjernet", "good");
                        }else{
                            errorPop(res.error, "bad");
                        }
                    });
                }else{
                    console.log("cancelled");
                }


            }
            $scope.reLoad = function(){
                document.querySelector(".progresscont").classList.add("forceShow");
                jQuery.post("php/listUsers.php", {
                    token: localStorage.getItem("imp-login-key")
                })
                .done(function(res){
                        document.querySelector(".progresscont").classList.remove("forceShow");
                    $scope.users = res;
                    $scope.$apply();
                });
            }
            $scope.reLoad();
        }
    }
})
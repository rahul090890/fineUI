var loginModule = angular.module('loginUser',[]);

loginModule
		// =========================================================================
		// Base controller for common functions
		// =========================================================================
		.controller(
				'logincontroller',
				function($rootScope, $scope, $http, $location, $window) {
					$scope.webserviceshost = 'http://localhost:8080/';
					
						if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
						    $location.path('/login');
						}

						var authenticate = function(authUrl,credentials, callback) {

							var headers = credentials ? {
								authorization : "Basic "
										+ btoa(credentials.username + ":"
												+ credentials.password)
							} : {};
							var url='';
							if(credentials!=undefined)
								url=authUrl+credentials.username;
							
								
							$http.get(url, {
								headers : headers
							}).success(function(data1, status, resHeaders) {
								//console.log(data1);
								//console.log(resHeaders)
								$window.sessionStorage.setItem("Access-Token",resHeaders('xsrf-token'));
							    $window.sessionStorage.setItem("AuthKey", resHeaders('authorization'));
							    $window.sessionStorage.setItem("EmployeeId", data1.employeeId);
							    $window.sessionStorage.setItem("roleId", data1.role.employeeId);
							    							   // console.log(resHeaders('xsrf-token'),resHeaders('authorization'));
									$rootScope.employeeGlobleData=data1;
									$rootScope.authenticated = true;
								
								callback && callback();
							}).error(function() {
								$rootScope.authenticated = false;
								callback && callback();
								$rootScope.authenticated = false;
							});

						}

						//authenticate();
						$scope.credentials = {};
						$scope.login = function() {
							var authurl=$scope.webserviceshost +"hr/employee/findByloginId/"
							var data=authenticate(authurl,$scope.credentials, function() {
								if ($rootScope.authenticated) {
									$window.location.href= "/PHOENIX_ENG__TECH_EHR/index.jsp";
									$scope.error = false;
								} else {
									$location.path("/login");
									$scope.error = true;
								}
							});
							console.log(data);
						};

					
				});
materialAdmin		/*
		 * function($timeout, $state, $scope, growlService,$location) {
		 * $scope.webserviceshost = 'http://localhost:8080/'; // Detact Mobile
		 * Browser
		 * 
		 * $scope.login = function() { var employeeLoginid=$scope.loginid;
		 * if(employeeLoginid===""||employeeLoginid==undefined){ swal("Id cant
		 * be blank") return; } var
		 * loginemployee=$scope.webserviceshost+"/hr/employee/findByloginId/"+employeeLoginid;
		 * $location.path("/home"); } })
		 */
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
					    $window.sessionStorage.setItem("roleId", data1.role.roleid);
					    $window.sessionStorage.setItem("roleName", data1.role.roleName);
					    $window.sessionStorage.setItem("firstName", data1.firstName);
					    $window.sessionStorage.setItem("lastName", data1.lastName);
					    							   // console.log(resHeaders('xsrf-token'),resHeaders('authorization'));
							$rootScope.employeeGlobleData=data1;
							$rootScope.firstName=$window.sessionStorage.getItem("firstName");;
							$rootScope.lastNme=$window.sessionStorage.getItem("lastName");;
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
							if("Resource"===$window.sessionStorage.getItem("roleName")){
								$location.path("/headers/applyLeave");
								$window.location.reload();
							$scope.error = false;
							}
							else{
								$location.path("/home");
								$window.location.reload();
							}
						} else {
							$location.path("/login");
							$scope.error = true;
						}
					});
					console.log(data);
				};

			
		})
		.controller(
				'materialadminCtrl',
				function($timeout, $state, $scope, growlService) {

					// Welcome Message
				    var firstName=$window.sessionStorage.getItem("firstName");
				    var lastName=$window.sessionStorage.getItem("lastName");
					growlService.growl('Welcome'+firstName+'  '+lastName, 'inverse')
					$scope.webserviceshost = 'http://localhost:8080/';
					// Detact Mobile Browser
					if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
							.test(navigator.userAgent)) {
						angular.element('html').addClass('ismobile');
					}

					// By default Sidbars are hidden in boxed layout and in
					// wide
					// layout only the right sidebar is hidden.
					this.sidebarToggle = {
						left : false,
						right : false
					}

					// By default template has a boxed layout
					this.layoutType = localStorage.getItem('ma-layout-status');

					// For Mainmenu Active Class
					this.$state = $state;

					// Close sidebar on click
					this.sidebarStat = function(event) {
						if (!angular.element(event.target).parent().hasClass(
								'active')) {
							this.sidebarToggle.left = false;
						}
					}

					// Listview Search (Check listview pages)
					this.listviewSearchStat = false;

					this.lvSearch = function() {
						this.listviewSearchStat = true;
					}

					// Listview menu toggle in small screens
					this.lvMenuStat = false;

					// Blog
					this.wallCommenting = [];

					this.wallImage = false;
					this.wallVideo = false;
					this.wallLink = false;

					// Skin Switch
					this.currentSkin = 'blue';

					this.skinList = [ 'lightblue', 'bluegray', 'cyan', 'teal',
							'green', 'orange', 'blue', 'purple' ]

					this.skinSwitch = function(color) {
						this.currentSkin = color;
					}

				})

		// =========================================================================
		// Header
		// =========================================================================
		.controller(
				'headerCtrl',
				function($timeout, messageService, $location, $window,$scope) {

					// Top Search
					this.openSearch = function() {
						angular.element('#header').addClass('search-toggled');
						angular.element('#top-search-wrap').find('input')
								.focus();
					}

					this.closeSearch = function() {
						angular.element('#header')
								.removeClass('search-toggled');
					}

					// Get messages and notification for header
					this.img = messageService.img;
					this.user = messageService.user;
					this.user = messageService.text;

					this.messageResult = messageService.getMessage(this.img,
							this.user, this.text);

					// Clear Notification
					this.clearNotification = function($event) {
						$event.preventDefault();

						var x = angular.element($event.target).closest(
								'.listview');
						var y = x.find('.lv-item');
						var z = y.size();

						angular.element($event.target).parent().fadeOut();

						x.find('.list-group').prepend(
								'<i class="grid-loading hide-it"></i>');
						x.find('.grid-loading').fadeIn(1500);
						var w = 0;

						y.each(function() {
							var z = $(this);
							$timeout(function() {
								z.addClass('animated fadeOutRightBig').delay(
										1000).queue(function() {
									z.remove();
								});
							}, w += 150);
						})

						$timeout(
								function() {
									angular.element('#notifications').addClass(
											'empty');
								}, (z * 150) + 200);
					}

					// Clear Local Storage
					this.logoutUser = function() {

						// Get confirmation, if confirmed clear the localStorage
						//$location.path("/login");
						$window.sessionStorage.clear();
						window.location.href='/PHOENIX_ENG__TECH_EHR/'
/*
						swal(
								{
									title : "Are u sure to logout?",
									text : "Logging out ",
									showCancelButton : true,
									confirmButtonColor : "#DD6B55",
									confirmButtonText : "Yes, Logout!",
									cancelButtonText : "No, cancel it!",
									closeOnConfirm : false,
									closeOnCancel : true
								},
								function(isConfirm) {
									if (isConfirm) {
										 $window.sessionStorage.clear();
										 $location.path('/login');
									} 
								})
					
*/
					}
					this.clearLocalStorage = function() {

						// Get confirmation, if confirmed clear the localStorage
						swal(
								{
									title : "Are you sure?",
									text : "All your saved localStorage values will be removed",
									type : "warning",
									showCancelButton : true,
									confirmButtonColor : "#F44336",
									confirmButtonText : "Yes, delete it!",
									closeOnConfirm : false
								}, function() {
									localStorage.clear();
									swal("Done!", "localStorage is cleared",
											"success");
								});

					}
					// Fullscreen View
					this.fullScreen = function() {
						// Launch
						function launchIntoFullscreen(element) {
							if (element.requestFullscreen) {
								element.requestFullscreen();
							} else if (element.mozRequestFullScreen) {
								element.mozRequestFullScreen();
							} else if (element.webkitRequestFullscreen) {
								element.webkitRequestFullscreen();
							} else if (element.msRequestFullscreen) {
								element.msRequestFullscreen();
							}
						}

						// Exit
						function exitFullscreen() {
							if (document.exitFullscreen) {
								document.exitFullscreen();
							} else if (document.mozCancelFullScreen) {
								document.mozCancelFullScreen();
							} else if (document.webkitExitFullscreen) {
								document.webkitExitFullscreen();
							}
						}

						if (exitFullscreen()) {
							launchIntoFullscreen(document.documentElement);
						} else {
							launchIntoFullscreen(document.documentElement);
						}
					}

				})

		// =========================================================================
		// Best Selling Widget
		// =========================================================================

		.controller(
				'bestsellingCtrl',
				function(bestsellingService) {
					// Get Best Selling widget Data
					this.img = bestsellingService.img;
					this.name = bestsellingService.name;
					this.range = bestsellingService.range;

					this.bsResult = bestsellingService.getBestselling(this.img,
							this.name, this.range);
				})

		// =========================================================================
		// Todo List Widget
		// =========================================================================

		.controller('todoCtrl', function(todoService) {

			// Get Todo List Widget Data
			this.todo = todoService.todo;

			this.tdResult = todoService.getTodo(this.todo);

			// Add new Item (closed by default)
			this.addTodoStat = false;
		})

		// =========================================================================
		// Recent Items Widget
		// =========================================================================
		.controller(
				'timesheetcontroller',
				function($scope, $filter, $sce, ngTableParams, $http,$rootScope,
						filteredListService,$window) {
					
					function gettingDetails() {
						$scope.$on(function(x) {
							console.log('a');

						});
					}
					$scope.$on(function(x) {
						console.log('a');

					});

					$scope.onlyNumbers = /^\d+$/;

					$scope.divIterator = [ 1 ];
					$scope.totalhourhead = '';
					$scope.today = function() {
						$scope.dt = new Date();

					};
					$scope.today();

					$scope.myDate = new Date();

					$scope.toggleMin = function() {
						$scope.minDate = new Date($scope.myDate.getFullYear(),
								$scope.myDate.getMonth() - 11, $scope.myDate
										.getDate());

					};
					$scope.toggleMin();

					$scope.open = function($event, calId) {
						$event.preventDefault();
						$event.stopPropagation();
						if (calId === 1) {
							$scope.opened = true;
							$scope.opened2 = false;

						}
						if (calId === 2) {
							$scope.opened2 = true;
							$scope.opened = false;

						}

					};
					this.onlyWeekendsPredicate = function(date) {
						var day = $scope.myDate.getDay();
						return day === 0 || day === 6;
					};
					$scope.dateOptions = {
						formatYear : 'yy',
						startingDay : 1
					};

					$scope.formats = [ 'dd-MMMM-yyyy', 'yyyy-MM-dd',
							'dd.MM.yyyy', 'shortDate' ];
					$scope.format = $scope.formats[1];
					$scope.changeweekselected = function() {
						var startdate = $scope.dtPopup;
						var date2 = new Date(startdate);

						Date.prototype.addDays = function(days) {
							var dat = new Date(this.valueOf());
							dat.setDate(dat.getDate() + days);
							return dat;
						}

						var dat = startdate
						var date1 = dat.addDays(6);// new Date(enddate);
						$scope.dtPopup1 = date1;

						if (startdate > date1) {
							swal("Error",
									"From date should be less than to date.)",
									"error");
							return;
						}

						if (date2.getDay() != 1 || date1.getDay() != 0) {
							swal(
									"Error",
									"Starte date should be selected as monday and end date should be seleted as sunday )",
									"error");
							return;
						}

						var startyyyy = date2.getFullYear();
						var startdd = date2.getDate();
						var startmm = date2.getMonth()
						var endyyyy = date1.getFullYear();
						var enddd = date1.getDate();
						var totalNoOfDays = new Date(startyyyy, startmm + 1, 0)
								.getDate();
						var endmm = date1.getMonth();
						;
						if (startdd < 10) {
							startdd = '0' + startdd;
						}
						if (startmm < 10) {
							startmm = '0' + startmm;
						}
						if (enddd < 10) {
							enddd = '0' + enddd;
						}
						if (endmm < 10) {
							endmm = '0' + endmm;
						}

						$scope.start = startyyyy + '-' + startmm + '-'
								+ startdd;
						$scope.end = endyyyy + '-' + endmm + '-' + enddd;
						$scope.weeksdetails = "selected week as "
								+ $scope.start + "  to  " + $scope.end;
						var weeksdetails = [ 'MON', 'TUE', 'WED', 'THUR',
								'FRI', 'SAT', 'SUN' ];

						var weekday = [];
						for (var x = 0; x < 7; x++) {

							if (startdd > totalNoOfDays) {
								startdd = 1;
								startmm = startmm + 1;
								if (startmm > 12) {
									startmm = 1;
								}
							}
							var dateandDay = {
								'day' : "",
								'date' : ""
							};
							dateandDay.day = startdd + '(' + weeksdetails[x]
									+ ')'
							dateandDay.date = startdd + '-' + startmm + '-'
									+ startyyyy;
							weekday.push(dateandDay);
							startdd++;
						}
						$scope.weekdays = weekday;
						$scope.totalhourhead = "Total hours";
					}
					var employeeid = $window.sessionStorage.getItem("EmployeeId");;
					var employeeDetails = $scope.webserviceshost
							+ 'hr/employee/find/' + employeeid;
					var customeDetails = $scope.webserviceshost
							+ 'hr/customer/all/';
					var departments = $scope.webserviceshost
							+ 'hr/department/all';

					var taskdata = $scope.webserviceshost + 'hr/task/all';
					var allcpc = $scope.webserviceshost
							+ "hr/customerProgram/all";
					var allproject = $scope.webserviceshost + 'hr/project/all';
					$http({
						method : "GET",
						url : employeeDetails,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {

										if (response != 'undefiend'
												&& response != "") {
											$scope.employeeid = response.data.employeeId;
											$scope.employeename = response.data.firstName
													+ ' '
													+ response.data.lastName;
											;
											$scope.employeedesignation = response.data.designation;
											$scope.employeelocation = response.data.address;
											$scope.employeeType = response.data.employeeType;
											$scope.employeedepartment = response.data.department.departmentName;
											$scope.employeedepartmentId = response.data.department.departmentId;
											$scope.employeeemail = response.data.emailId;
											/*
											 * $scope.leaveTaken=response.data.employeeId;
											 * $scope.remainLeaves=response.data.employeeId;
											 */
											/*
											 * $scope.managername =
											 * response.data.manager.firstName + ' ' +
											 * response.data.manager.lastName;
											 */
											/*
											 * $scope.managerid =
											 * response.data.manager.employeeId
											 * $scope.manageremail =
											 * response.data.manager.emailId;
											 * $scope.managerid =
											 * response.data.manager.employeeId;
											 */
										}
									}, function myError(response) {
										console.log(response);
									});
					$http({
						method : "GET",
						url : taskdata,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						$scope.tasks = response.data;
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : customeDetails,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						$scope.customers = response.data;
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : departments,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						$scope.departments = response.data;
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : allproject,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						$scope.projects = response.data;
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : allcpc,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						$scope.cpcs = response.data;
					}, function myError(response) {
						console.log(response);
					});
					$scope.updateTotalhour = function() {

					}
					$scope.taskList = [];

					$scope.collectData = {

						"employeeId" : "",
						"startDateOfWeek" : "",
						"endDateOfWeek" : "",
						"timesheets" : $scope.multipleTimeSheetList,
						"comments" : $scope.comments
					}

					var myTaskName;
					$scope.commonCollect = function(data) {
						var temp = data.split("&&");

						if (temp[0] === "customer") {
							$scope.taskName.customerId = temp[1];

						} else if (temp[0] === "cpc") {
							$scope.taskName.customerProgramId = temp[1];

						} else if (temp[0] === "department") {
							$scope.taskName.departmentId = temp[1];

						} else if (temp[0] === "task") {
							myTaskName = temp[1];
							$scope.taskName.taskName = temp[2];

						} else if (temp[0] === "cpc") {
							$scope.taskName.taskId = temp[1];

						} else if (temp[0] === "project") {
							$scope.taskName.projectId = temp[1];

						} else if (temp[0] === "hours") {
							$scope.taskName.hours = temp[1];

						}

					}
					$scope.check = 'NO';
					$scope.deleteval = [];
					$scope.ids = {};

					$scope.deleteRow = function() {
						console.log($scope.ids);
						var obj = $scope.ids;

						for ( var key in obj) {
							if (obj.hasOwnProperty(key)) {

								var val = obj[key];
								if (val) {
									$scope.divIterator.pop(key);
									obj.key = false;
								}
								console.log(val);
							}
						}
						/*
						 * var pushval = $scope.deleteval.length; for (var x =
						 * 0; x < pushval; x++) {
						 * $scope.divIterator.pop(deleteval); }
						 */

					}
					$scope.saveTimeSheet = function() {
						$scope.collectData.comments = $scope.usercomments;
						// var usercomments=$scope.usercomments;
						$scope.taskDetail = {};
						// $scope.totalHour+=parseInt(dayhour);
						$scope.taskDetail[myTaskName] = $scope.timeSheetList;
						// $scope.collectData.timeSheets = $scope.taskDetail;
						// $scope.timeSheetList.push($scope.timesheet);
						$scope.totalHours = 0;
						for (var x = 0; x < $scope.timeSheetList.length; x++) {
							$scope.totalHours += parseInt($scope.timeSheetList[x].hours);
						}

						if ($scope.totalHours != 40) {

							swal(
									{
										title : "Your total hours are not 40 ! Proceed if fine",
										text : "Submitting Timesheet ",
										showCancelButton : true,
										confirmButtonColor : "#DD6B55",
										confirmButtonText : "Yes, Submit it!",
										cancelButtonText : "No, cancel it!",
										closeOnConfirm : false,
										closeOnCancel : false
									},
									function(isConfirm) {
										if (isConfirm) {
											if ($scope.timeSheetList.length > 0
													&& $scope.isadded) {
												$scope.multipleTimeSheetList[myTaskName] = $scope.timeSheetList;

												$scope.timeSheetList = [];
											}
											$scope.collectData.timesheets = $scope.multipleTimeSheetList;
											// $scope.timeSheetList = [];
											// $scope.collectData.timeSheets =
											// $scope.multipleTimeSheetList;

											var timesheeturl = $scope.webserviceshost
													+ "hr/timesheet/save/"
													+ JSON
															.stringify($scope.collectData);
											$http({
												method : "POST",
												url : timesheeturl,
												headers: {
													'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
													'authorization':$window.sessionStorage.getItem("AuthKey")
												}
											})
													.then(
															function mySucces(
																	response) {
																$scope.weeksdetails = {};
																$scope.divIterator = [ 1 ];
																$scope.customer = {};
																$scope.department = {};
																$scope.taskdetail = {};
																$scope.cpcdetails = {};
																$scope.taskdetails = {};
																$scope.daydetails = {};
																$scope.taskName = {
																	"customerId" : "",
																	"customerProgramId" : "",
																	"departmentId" : "",
																	"projectId" : "",
																	"taskName" : "",
																	"hours" : "",
																	"timesheetDate" : ""
																}
																$scope.collectData = {

																	"employeeId" : "",
																	"startDateOfWeek" : "",
																	"endDateOfWeek" : "",
																	"timesheets" : $scope.multipleTimeSheetList,
																	"comments" : $scope.comments
																}
																$scope.comments = "";
																console
																		.log(response);
																swal("timesheet submitted");
															},
															function myError(
																	response) {
																console
																		.log(response);
															});
										} else {
											swal(
													"Cancelled",
													"Request has been cancelled.)",
													"error");
										}
									})
						} else {

							swal(
									{
										title : "Are you sure",
										text : "Submitting Timesheet ",
										showCancelButton : true,
										confirmButtonColor : "#DD6B55",
										confirmButtonText : "Yes, Submit it!",
										cancelButtonText : "No, cancel it!",
										closeOnConfirm : false,
										closeOnCancel : false
									},
									function(isConfirm) {
										if (isConfirm) {
											if ($scope.timeSheetList.length > 0
													&& $scope.isadded) {
												$scope.multipleTimeSheetList[myTaskName] = $scope.timeSheetList;

												// $scope.collectData.timeSheets
												// =
												// $scope.multipleTimeSheetList
												$scope.timeSheetList = [];
											}
											// $scope.timeSheetList = [];
											$scope.collectData.timesheets = $scope.multipleTimeSheetList;
											var timesheeturl = $scope.webserviceshost
													+ "hr/timesheet/save/"
													+ JSON
															.stringify($scope.collectData);
											$http({
												method : "POST",
												url : timesheeturl,
												headers: {
													'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
													'authorization':$window.sessionStorage.getItem("AuthKey")
												}
											})
													.then(
															function mySucces(
																	response) {
																console
																		.log(response);
																swal("timesheet submitted");
															},
															function myError(
																	response) {
																$scope.weeksdetails = "";
																$scope.divIterator = [ 1 ];
																$scope.customer = "";
																$scope.department = "";
																$scope.taskdetail = "";
																$scope.cpcdetails = "";
																$scope.taskdetails = "";
																$scope.daydetails = "";
																$scope.taskName = {
																	"customerId" : "",
																	"customerProgramId" : "",
																	"departmentId" : "",
																	"projectId" : "",
																	"taskName" : "",
																	"hours" : "",
																	"timesheetDate" : ""
																}
																$scope.collectData = {

																	"employeeId" : "",
																	"startDateOfWeek" : "",
																	"endDateOfWeek" : "",
																	"timesheets" : $scope.multipleTimeSheetList,
																	"comments" : $scope.comments
																}
																$scope.comments = "";
																console
																		.log(response);
															});
										} else {
											swal(
													"Cancelled",
													"Request has been cancelled.)",
													"error");
										}
									})

						}
						console.log(JSON.stringify($scope.collectData));
					}

					$scope.multipleTimeSheetList = {};
					$scope.timeSheetList = [];
					$scope.updatemodel = function(weekday, dayhour) {
						$scope.taskName.timesheetDate = weekday;
						$scope.collectData.employeeId = $scope.employeeid
						$scope.collectData.startDateOfWeek = $scope.start;
						$scope.collectData.endDateOfWeek = $scope.end;
						$scope.timesheet = {};
						if (dayhour === "")
							dayhour = 0;

						// var exist = false;
						/*
						 * for (var i = 0; i < $scope.timeSheetList.length; i++) {
						 * 
						 * var timeSheet =
						 * $scope.timeSheetList[i][$scope.taskName.taskId]; if
						 * (timeSheet != undefined) { if (timeSheet.customerId
						 * === $scope.taskName.customerId &&
						 * timeSheet.timesheetDate===$scope.taskName.timesheetDate &&
						 * timeSheet.customerProgramId ===
						 * $scope.taskName.customerProgramId &&
						 * timeSheet.departmentId ===
						 * $scope.taskName.departmentId && timeSheet.projectId
						 * === $scope.taskName.projectId && timeSheet.taskId ===
						 * $scope.taskName.taskId && timeSheet.taskName ===
						 * $scope.taskName.taskName && dayhour != undefined) {
						 * 
						 * $scope.taskName.hours = dayhour;
						 * $scope.timeSheetList.push($scope.timesheet); exist =
						 * true; } else $scope.timeSheetList.pop(); break; } }
						 */
						// $scope.taskName
						$scope.isadded = true;
						$scope.totalHours = 0;
						if (dayhour != undefined)
							$scope.taskName.hours = dayhour;
						$scope.timesheet = $scope.taskName;
						/*
						 * for (var i = 0; i < $scope.timesheetlist.length; i++) {
						 * var timeSheetdata = $scope.timeSheetList[i]; var keys =
						 * Object.keys(timeSheetdata); $scope.totalHours =
						 * $scope.totalHours +
						 * parseInt(timeSheetdata[keys[0]].hours);
						 * 
						 * for (var j = 0; j < timeSheetdata.length; j++) { var
						 * dateData = timeSheetdata[j]; var hours =
						 * dataDate.hours; $scope.totalHours =$scope.totalHours+
						 * hours; } }
						 */

						$scope.timeSheetList.push($scope.timesheet);

						$scope.taskName = {
							"customerId" : $scope.taskName.customerId,
							"customerProgramId" : $scope.taskName.customerProgramId,
							"departmentId" : $scope.taskName.departmentId,
							"projectId" : $scope.taskName.projectId,
							"taskName" : $scope.taskName.taskName,
							"hours" : "",
							"timesheetDate" : ""
						}

					}

					// /$scope.taskName.daata.@id

					// $scope.taskName = {};

					$scope.taskName = {
						"customerId" : "",
						"customerProgramId" : "",
						"departmentId" : "",
						"projectId" : "",
						"taskName" : "",
						"hours" : "",
						"timesheetDate" : ""
					}

					$scope.multipleTimeSheetList = {};
					$scope.addRow = function() {
						$scope.isadded = false;
						if ($scope.timeSheetList.length > 0) {
							$scope.multipleTimeSheetList[$scope.taskName.taskId] = $scope.timeSheetList;
							$scope.timeSheetList = [];
						}
						$scope.timeSheetList = [];
						var pushval = $scope.divIterator.length;
						$scope.divIterator.push(++pushval);
						$scope.totalHours = {};
						$scope.taskName = {
							"customerId" : "",
							"customerProgramId" : "",
							"departmentId" : "",
							"projectId" : "",
							"taskId" : "",
							"taskName" : "",
							"hours" : "",
							"timesheetDate" : ""
						}

					};

				})
		.controller(
				'recentitemCtrl',
				function($scope, $filter,$window, $sce, ngTableParams, $http,$location,
						filteredListService,$rootScope) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var employeeid = $window.sessionStorage.getItem("EmployeeId");  // hard coded as of now
					var pendingapproval = $scope.webserviceshost
							+ 'hr/leave/pendingApproval/' + employeeid;

					$http({
						method : "GET",
						url : pendingapproval,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.employeeId = '';
												$scope.firstName = '';
												$scope.lastName = '';
												$scope.fromDate = '';
												$scope.toDate = '';
												$scope.noOfDays = ''
												$scope.searchText = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '', '', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};
											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter
												// -
												// Standard
												// Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'EmployeeId') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'firstName') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'lastName') {
													$scope.Header[2] = iconName;
												} else if (sortBy === 'leaveStatus') {
													$scope.Header[3] = iconName;
												} else {
													$scope.Header[4] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};
											$scope.sort('firstName');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});
					$scope.approveLeave = function(item) {

						swal(
								{
									title : "Are you sure?",
									text : "Approve leave ",
									showCancelButton : true,
									confirmButtonColor : "#DD6B55",
									confirmButtonText : "Yes, Approve it!",
									cancelButtonText : "No, cancel it!",
									closeOnConfirm : false,
									closeOnCancel : false
								},
								function(isConfirm) {
									if (isConfirm) {
										var leaveId = item.leaveId;
										var approveLeaveurl = $scope.webserviceshost
												+ 'hr/leave/approve/'
												+ leaveId
												+ '/' + managerid;

										$http({
											method : "POST",
											url : approveLeaveurl,
											headers: {
												'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
												'authorization':$window.sessionStorage.getItem("AuthKey")
											}
										})
												.then(
														function mySucces(
																response) {

															var managerid = $window.sessionStorage.getItem("EmployeeId");;// hard
															// coded
															// as
															// of now
															var pendingapproval = $scope.webserviceshost
																	+ 'hr/leave/pendingApproval/'
																	+ managerid;

															$http(
																	{
																		method : "GET",
																		url : pendingapproval,
																		headers: {
																			'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																			'authorization':$window.sessionStorage.getItem("AuthKey")
																		}
																	})
																	.then(
																			function mySucces(
																					response) {
																				console
																						.log(response.data);
																				if (response != 'undefiend'
																						&& response != "") {

																					$scope.allUsers = response.data;
																					$scope.pageSize = 7;
																					$scope.allItems = $scope.allUsers;
																					$scope.reverse = false;

																					$scope.resetAll = function() {
																						$scope.filteredList = $scope.allItems;
																						$scope.employeeId = '';
																						$scope.firstName = '';
																						$scope.lastName = '';
																						$scope.fromDate = '';
																						$scope.toDate = '';
																						$scope.noOfDays = ''
																						$scope.searchText = '';
																						$scope.currentPage = 0;
																						$scope.Header = [
																								'',
																								'',
																								'',
																								'',
																								'',
																								'',
																								'' ];
																					}

																					$scope.search = function() {
																						$scope.filteredList = filteredListService
																								.searched(
																										$scope.allItems,
																										$scope.searchText);

																						if ($scope.searchText == '') {
																							$scope.filteredList = $scope.allItems;
																						}
																						$scope
																								.pagination();
																					}

																					$scope.pagination = function() {
																						$scope.ItemsByPage = filteredListService
																								.paged(
																										$scope.filteredList,
																										$scope.pageSize);
																					};

																					$scope.setPage = function() {
																						$scope.currentPage = this.n;
																					};

																					$scope.firstPage = function() {
																						$scope.currentPage = 0;
																					};

																					$scope.lastPage = function() {
																						$scope.currentPage = $scope.ItemsByPage.length - 1;
																					};

																					$scope.range = function(
																							input,
																							total) {
																						var ret = [];
																						if (!total) {
																							total = input;
																							input = 0;
																						}
																						for (var i = input; i < total; i++) {
																							if (i != 0
																									&& i != total - 1) {
																								ret
																										.push(i);
																							}
																						}
																						return ret;
																					};
																					$scope.sort = function(
																							sortBy) {
																						$scope
																								.resetAll();

																						$scope.columnToOrder = sortBy;

																						// $Filter
																						// -
																						// Standard
																						// Service
																						$scope.filteredList = $filter(
																								'orderBy')
																								(
																										$scope.filteredList,
																										$scope.columnToOrder,
																										$scope.reverse);

																						if ($scope.reverse)
																							iconName = 'glyphicon glyphicon-chevron-up';
																						else
																							iconName = 'glyphicon glyphicon-chevron-down';

																						if (sortBy === 'EmployeeId') {
																							$scope.Header[0] = iconName;
																						} else if (sortBy === 'firstName') {
																							$scope.Header[1] = iconName;
																						} else if (sortBy === 'lastName') {
																							$scope.Header[2] = iconName;
																						} else if (sortBy === 'leaveStatus') {
																							$scope.Header[3] = iconName;
																						} else {
																							$scope.Header[4] = iconName;
																						}

																						$scope.reverse = !$scope.reverse;

																						$scope
																								.pagination();
																					};
																					$scope
																							.sort('firstName');

																					// console.log($scope.allUsers.length);
																				}
																			},
																			function myError(
																					response) {
																				console
																						.log(response);
																			});
															swal(
																	"Approved",
																	"leave has been approved.)",
																	"success");
														},
														function myError(
																response) {
															console
																	.log(response);
														});
									} else {
										swal("Cancelled",
												"Request has been cancelled.)",
												"error");
									}
								});
					}
					$scope.rejectLeave = function(item) {

						swal(
								{
									title : "Are you sure?",
									text : "Reject leave ",
									showCancelButton : true,
									confirmButtonColor : "#DD6B55",
									confirmButtonText : "Yes, Reject it!",
									cancelButtonText : "No, cancel it!",
									closeOnConfirm : false,
									closeOnCancel : false
								},
								function(isConfirm) {
									if (isConfirm) {
										var leaveId = item.leaveId;
										var rejecctLeaveurl = $scope.webserviceshost
												+ 'hr/leave/reject/'
												+ leaveId
												+ '/' + managerid;

										$http({
											method : "POST",
											url : rejecctLeaveurl,
											headers: {
												'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
												'authorization':$window.sessionStorage.getItem("AuthKey")
											}
										})
												.then(
														function mySucces(
																response) {

															var managerid = $window.sessionStorage.getItem("EmployeeId");;// hard
															// coded
															// as
															// of
															// now
															var pendingapproval = $scope.webserviceshost
																	+ 'hr/leave/pendingApproval/'
																	+ managerid;

															$http(
																	{
																		method : "GET",
																		url : pendingapproval,
																		headers: {
																			'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																			'authorization':$window.sessionStorage.getItem("AuthKey")
																		}
																	})
																	.then(
																			function mySucces(
																					response) {
																				console
																						.log(response.data);
																				if (response != 'undefiend'
																						&& response != "") {

																					$scope.allUsers = response.data;
																					$scope.pageSize = 7;
																					$scope.allItems = $scope.allUsers;
																					$scope.reverse = false;

																					$scope.resetAll = function() {
																						$scope.filteredList = $scope.allItems;
																						$scope.employeeId = '';
																						$scope.firstName = '';
																						$scope.lastName = '';
																						$scope.fromDate = '';
																						$scope.toDate = '';
																						$scope.noOfDays = ''
																						$scope.searchText = '';
																						$scope.currentPage = 0;
																						$scope.Header = [
																								'',
																								'',
																								'',
																								'',
																								'',
																								'',
																								'' ];
																					}

																					$scope.search = function() {
																						$scope.filteredList = filteredListService
																								.searched(
																										$scope.allItems,
																										$scope.searchText);

																						if ($scope.searchText == '') {
																							$scope.filteredList = $scope.allItems;
																						}
																						$scope
																								.pagination();
																					}

																					$scope.pagination = function() {
																						$scope.ItemsByPage = filteredListService
																								.paged(
																										$scope.filteredList,
																										$scope.pageSize);
																					};

																					$scope.setPage = function() {
																						$scope.currentPage = this.n;
																					};

																					$scope.firstPage = function() {
																						$scope.currentPage = 0;
																					};

																					$scope.lastPage = function() {
																						$scope.currentPage = $scope.ItemsByPage.length - 1;
																					};

																					$scope.range = function(
																							input,
																							total) {
																						var ret = [];
																						if (!total) {
																							total = input;
																							input = 0;
																						}
																						for (var i = input; i < total; i++) {
																							if (i != 0
																									&& i != total - 1) {
																								ret
																										.push(i);
																							}
																						}
																						return ret;
																					};
																					$scope.sort = function(
																							sortBy) {
																						$scope
																								.resetAll();

																						$scope.columnToOrder = sortBy;

																						// $Filter
																						// -
																						// Standard
																						// Service
																						$scope.filteredList = $filter(
																								'orderBy')
																								(
																										$scope.filteredList,
																										$scope.columnToOrder,
																										$scope.reverse);

																						if ($scope.reverse)
																							iconName = 'glyphicon glyphicon-chevron-up';
																						else
																							iconName = 'glyphicon glyphicon-chevron-down';

																						if (sortBy === 'EmployeeId') {
																							$scope.Header[0] = iconName;
																						} else if (sortBy === 'firstName') {
																							$scope.Header[1] = iconName;
																						} else if (sortBy === 'lastName') {
																							$scope.Header[2] = iconName;
																						} else if (sortBy === 'leaveStatus') {
																							$scope.Header[3] = iconName;
																						} else {
																							$scope.Header[4] = iconName;
																						}

																						$scope.reverse = !$scope.reverse;

																						$scope
																								.pagination();
																					};
																					$scope
																							.sort('firstName');

																					// console.log($scope.allUsers.length);
																				}
																			},
																			function myError(
																					response) {
																				console
																						.log(response);
																			});

														},
														function myError(
																response) {
															console
																	.log(response);
														})
										swal("Rejected",
												"leave has been rejected.)",
												"success");
									} else {
										swal("Cancelled",
												"Request has been cancelled.)",
												"error");
									}
								});
					}
				})
		// controller for leave applied history top table
		.controller(
				'leavebalancecontroller',
				function($scope, $filter, $sce, ngTableParams, $http,$rootScope,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					$scope.today = function() {
						$scope.dt = new Date();

					};
					$scope.today();

					$scope.myDate = new Date();

					$scope.toggleMin = function() {
						$scope.minDate = new Date($scope.myDate.getFullYear(),
								$scope.myDate.getMonth() - 11, $scope.myDate
										.getDate());

					};
					$scope.toggleMin();

					$scope.open = function($event, calId) {
						$event.preventDefault();
						$event.stopPropagation();
						if (calId === 1) {
							$scope.opened = true;
							$scope.opened2 = false;

						}
						if (calId === 2) {
							$scope.opened2 = true;
							$scope.opened = false;

						}

					};

					$scope.dateOptions = {
						formatYear : 'yy',
						startingDay : 1
					};

					$scope.formats = [ 'dd-MMMM-yyyy', 'yyyy-MM-dd',
							'dd.MM.yyyy', 'shortDate' ];
					$scope.format = $scope.formats[1];

					var employeeid = $window.sessionStorage.getItem("EmployeeId");;
					var date = new Date();
					var year = date.getFullYear();
					var leavebalanceurl = $scope.webserviceshost
							+ 'hr/leave/balance/' + employeeid + '/' + year;
					var employeeDetails = $scope.webserviceshost
							+ 'hr/employee/find/' + employeeid;
					$http({
						method : "GET",
						url : leavebalanceurl,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {

						if (response != 'undefiend' && response != "") {
							$scope.leaveupdates = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : employeeDetails,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {

										if (response != 'undefiend'
												&& response != "") {
											$scope.employeeid = response.data.employeeId;
											$scope.employeename = response.data.firstName
													+ ' '
													+ response.data.lastName;
											;
											$scope.employeedepartment = response.data.department.departmentName;
											$scope.employeedepartmentId = response.data.department.departmentId;
											$scope.employeeemail = response.data.emailId;
											/*
											 * $scope.leaveTaken=response.data.employeeId;
											 * $scope.remainLeaves=response.data.employeeId;
											 */
											$scope.managername = response.data.manager.firstName
													+ ' '
													+ response.data.manager.lastName;
											$scope.managerid = response.data.manager.employeeId
											$scope.manageremail = response.data.manager.emailId;
											$scope.managerid = response.data.manager.employeeId;
										}
									}, function myError(response) {
										console.log(response);
									});
					$scope.updateleavesdetails = function() {

						$scope.totalLeaves = $scope.itemSelected.eligible;
						console.log("Selected Value: "
								+ $scope.itemSelected.leaveBalanceId
								+ "\nSelected Text: "
								+ $scope.itemSelected.eligible);
					}
					$scope.refreshLeavetaken = function() {
						var startdate = $scope.dtPopup;
						var enddate = $scope.dtPopup1;
						var date2 = new Date(startdate);
						var date1 = new Date(enddate);
						if (startdate > enddate) {
							swal("Error",
									"From date should be less than to date.)",
									"error");
							return;
						}

						var timeDiff = Math.abs(date2.getTime()
								- date1.getTime());
						$scope.leaveTaken = Math.ceil(timeDiff
								/ (1000 * 3600 * 24)) + 1;
						if ($scope.totalLeaves != ''
								|| $scope.totalLeaves != 'undefiend') {
							var remainLeaves = $scope.totalLeaves
									- $scope.leaveTaken;
							if (remainLeaves < 0) {
								swal("Error",
										"You cant take number of leaves .)",
										"error");
								return;
							}
							$scope.remainLeaves = $scope.totalLeaves
									- $scope.leaveTaken;
						}

					}
					$scope.applyleave = function() {
						var employeeid = $scope.employeeid;
						var employeename = $scope.employeename;
						var employeedepartment = $scope.demployeedepartment;
						var employeedepartmentId = $scope.employeedepartmentId;
						var employeeemail = $scope.employeeemail;
						/*
						 * var leaveTaken=response.data.employeeId; var
						 * remainLeaves=response.data.employeeId;
						 */
						var managername = $scope.managername;
						var managerid = $scope.managerid;
						var manageremail = $scope.manageremail;

						var leaveType = $scope.itemSelected.leaveType;
						;
						var startyear = $scope.dtPopup.getFullYear();
						var startmonth = $scope.dtPopup.getMonth();
						if (startmonth.toString().length == 1) {
							startmonth = '0' + startmonth;
						}
						var startday = $scope.dtPopup.getDay();
						if (startday.toString().length == 1) {
							startday = '0' + startday;
						}
						var startdate = startyear + '-' + startmonth + '-'
								+ startday;
						var endyear = $scope.dtPopup.getFullYear();
						var endmonth = $scope.dtPopup.getMonth();
						if (endmonth.toString().length == 1) {
							endmonth = '0' + endmonth;
						}
						var endday = $scope.dtPopup.getDay();
						if (endday.toString().length == 1) {
							endday = '0' + endday;
						}
						var enddate = endyear + '-' + endmonth + '-' + endday;
						var leavetaken = $scope.leaveTaken;
						var comments = "leave applied";

						var applyleaveurl = $scope.webserviceshost
								+ 'hr/leave/apply/' + employeeid + '/'
								+ leaveType + '/' + startdate + '/' + enddate
								+ '/' + leavetaken + '/' + comments;
						$http({
							method : "POST",
							url : applyleaveurl,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(
								function mySucces(response) {

									swal("Successfull",
											"Your leave has been submitted.)",
											"success");
									$scope.totalLeaves = '';
									$scope.leaveTaken = '';
									$scope.itemSelected = {};
									$scope.dtPopup = '';
									$scope.dtPopup1 = '';
									$scope.remainLeaves = '';
								}, function myError(response) {
									console.log(response);
								});

						/*
						 * apply/{employeeId}/{leaveType}/{fromDate}/{toDate}/{noOfDays}/{comments}
						 */}
				})
		.controller(
				'leavetypehistorytable',
				function($scope, $filter, $sce, ngTableParams, $http,$rootScope,$window,$location,
						filteredListService) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var employeeid = $window.sessionStorage.getItem("EmployeeId");;
					var leavehistory = $scope.webserviceshost
							+ 'hr/leave/history/' + employeeid;
					$http({
						method : "GET",
						url : leavehistory,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.employeeId = '';
												$scope.firstName = '';
												$scope.lastName = '';
												$scope.emailId = '';
												$scope.joiningdate = ''
												$scope.searchText = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '', '', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};

											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter
												// -
												// Standard
												// Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'EmpId') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'name') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'fromDate') {
													$scope.Header[2] = iconName;
												} else if (sortBy === 'toDate') {
													$scope.Header[3] = iconName;
												} else if (sortBy === 'totalDays') {
													$scope.Header[4] = iconName;
												} else if (sortBy === 'leaveType') {
													$scope.Header[5] = iconName;
												} else if (sortBy === 'leaveStatus') {
													$scope.Header[6] = iconName;
												} else if (sortBy === 'department') {
													$scope.Header[7] = iconName;
												} else if (sortBy === 'approvedBy') {
													$scope.Header[8] = iconName;
												} else {
													$scope.Header[1] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By
											// Default
											// sort
											// ny
											// Name
											$scope.sort('name');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});

				})

		// =========================================================================
		// Recent Posts Widget
		// =========================================================================
		.controller(
				'timeSheetCtrl',
				function($scope, $filter, $sce, ngTableParams, timeSheetService) {
					this.id = timeSheetService.id;
					this.name = timeSheetService.name;
					this.fromDate = timeSheetService.from_date;
					this.toDate = timeSheetService.to_date;
					this.total_hour = timeSheetService.total_hour;
					this.department = timeSheetService.department;
					this.reporting_manager = timeSheetService.reporting_manager
					this.status = timeSheetService.status;

					this.riResult = timeSheetService.getRecentitem(this.id,
							this.name, this.from_date, this.todate,
							this.total_hour, this.department, this.status);
					$scope.totalItems = this.riResult.length;
					$scope.viewby = 5;
					$scope.currentPage = 1;
					$scope.itemsPerPage = $scope.viewby;
					$scope.maxSize = 5;
				})
		.controller(
				'cpceditcontroller',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var allcpc = $scope.webserviceshost
							+ 'hr/customerProgram/all';
					$('#updatecpcDetails').hide();
					$http({
						method : "GET",
						url : allcpc,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {

										$scope.allUsers = response.data;
										$scope.pageSize = 7;
										$scope.allItems = $scope.allUsers;
										$scope.reverse = false;

										$scope.resetAll = function() {
											$scope.filteredList = $scope.allItems;
											$scope.customerProgramId = '';
											$scope.customer = '';
											$scope.customerProgramCode = '';
											$scope.customerProgramType = '';

											$scope.searchText = '';
											$scope.currentPage = 0;
											$scope.Header = [ '', '', '', '',
													'', '', '' ];
										}

										$scope.search = function() {
											$scope.filteredList = filteredListService
													.searched($scope.allItems,
															$scope.searchText);

											if ($scope.searchText == '') {
												$scope.filteredList = $scope.allItems;
											}
											$scope.pagination();
										}

										$scope.pagination = function() {
											$scope.ItemsByPage = filteredListService
													.paged($scope.filteredList,
															$scope.pageSize);
										};

										$scope.setPage = function() {
											$scope.currentPage = this.n;
										};

										$scope.firstPage = function() {
											$scope.currentPage = 0;
										};

										$scope.lastPage = function() {
											$scope.currentPage = $scope.ItemsByPage.length - 1;
										};

										$scope.range = function(input, total) {
											var ret = [];
											if (!total) {
												total = input;
												input = 0;
											}
											for (var i = input; i < total; i++) {
												if (i != 0 && i != total - 1) {
													ret.push(i);
												}
											}
											return ret;
										};

										$scope.resetcpcuser = function() {
											$('#updatecpcDetails').hide();
										}
										$scope.sort = function(sortBy) {
											$scope.resetAll();

											$scope.columnToOrder = sortBy;

											// $Filter
											// -
											// Standard
											// Service
											$scope.filteredList = $filter(
													'orderBy')(
													$scope.filteredList,
													$scope.columnToOrder,
													$scope.reverse);

											if ($scope.reverse)
												iconName = 'glyphicon glyphicon-chevron-up';
											else
												iconName = 'glyphicon glyphicon-chevron-down';

											if (sortBy === 'customerProgramId') {
												$scope.Header[0] = iconName;
											} else if (sortBy === 'customerName') {
												$scope.Header[1] = iconName;
											} else if (sortBy === 'customerProgramCode') {
												$scope.Header[2] = iconName;
											} else if (sortBy === 'customerProgramType') {
												$scope.Header[3] = iconName;
											} else {
												$scope.Header[2] = iconName;
											}

											$scope.reverse = !$scope.reverse;

											$scope.pagination();
										};

										// By
										// Default
										// sort
										// ny
										// Name
										$scope.sort('name');

									}, function myError(response) {
										console.log(response);
									});

					$scope.editcpcDetails = function(item) {
						$scope.customerProgramId = item.customerProgramId;
						$scope.customerid = item.customer.customerId;
						$scope.customerProgramCode2 = item.customerProgramCode;
						$scope.customerProgramType = item.customerProgramType;

						var allcustomer = $scope.webserviceshost
								+ 'hr/customer/all';
						var referencedata = $scope.webserviceshost
								+ 'hr/refData/list';
						$http({
							method : "GET",
							url : referencedata,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {

							if (response != 'undefiend' && response != "") {
								$scope.customerProgramCodelist = response.data;
							}
						}, function myError(response) {
							console.log(response);
						});
						$http({
							method : "GET",
							url : allcustomer,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {

							if (response != 'undefiend' && response != "") {
								$scope.customers = response.data;
							}
						}, function myError(response) {
							console.log(response);
						});
						$('#updatecpcDetails').show();

						$scope.savecpcDetails = function() {
							var customerProgramId = $scope.customerProgramId;
							var customerprogName = $scope.customerprogName;
							var customerId = $scope.customerid;
							var customerProgramCode2 = $scope.customerProgramCode2;
							var customerProgramType = $scope.customerProgramType;
							var savecpcurl = $scope.webserviceshost
									+ 'hr/customerProgram'

							var additional = '/update/' + customerProgramId
									+ '/' + customerId + '/'
									+ customerProgramCode2 + '/'
									+ customerProgramType;
							savecpcurl += additional;
							$http({
								method : "POST",
								url : savecpcurl,
								headers: {
									'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
									'authorization':$window.sessionStorage.getItem("AuthKey")
								}
							})
									.then(
											function mySucces(response) {

												var allcpc = $scope.webserviceshost
														+ 'hr/customerProgram/all';
												$('#updatecpcDetails').hide();
												$http({
													method : "GET",
													url : allcpc,
													headers: {
														'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
														'authorization':$window.sessionStorage.getItem("AuthKey")
													}
												})
														.then(
																function mySucces(
																		response) {

																	$scope.allUsers = response.data;
																	$scope.pageSize = 7;
																	$scope.allItems = $scope.allUsers;
																	$scope.reverse = false;

																	$scope.resetAll = function() {
																		$scope.filteredList = $scope.allItems;
																		$scope.customerProgramId = '';
																		$scope.customer = '';
																		$scope.customerProgramCode = '';
																		$scope.customerProgramType = '';

																		$scope.searchText = '';
																		$scope.currentPage = 0;
																		$scope.Header = [
																				'',
																				'',
																				'',
																				'',
																				'',
																				'',
																				'' ];
																	}

																	$scope.search = function() {
																		$scope.filteredList = filteredListService
																				.searched(
																						$scope.allItems,
																						$scope.searchText);

																		if ($scope.searchText == '') {
																			$scope.filteredList = $scope.allItems;
																		}
																		$scope
																				.pagination();
																	}

																	$scope.pagination = function() {
																		$scope.ItemsByPage = filteredListService
																				.paged(
																						$scope.filteredList,
																						$scope.pageSize);
																	};

																	$scope.setPage = function() {
																		$scope.currentPage = this.n;
																	};

																	$scope.firstPage = function() {
																		$scope.currentPage = 0;
																	};

																	$scope.lastPage = function() {
																		$scope.currentPage = $scope.ItemsByPage.length - 1;
																	};

																	$scope.range = function(
																			input,
																			total) {
																		var ret = [];
																		if (!total) {
																			total = input;
																			input = 0;
																		}
																		for (var i = input; i < total; i++) {
																			if (i != 0
																					&& i != total - 1) {
																				ret
																						.push(i);
																			}
																		}
																		return ret;
																	};

																	$scope.resetcpcuser = function() {
																		$(
																				'#updatecpcDetails')
																				.hide();
																	}
																	$scope.sort = function(
																			sortBy) {
																		$scope
																				.resetAll();

																		$scope.columnToOrder = sortBy;

																		// $Filter
																		// -
																		// Standard
																		// Service
																		$scope.filteredList = $filter(
																				'orderBy')
																				(
																						$scope.filteredList,
																						$scope.columnToOrder,
																						$scope.reverse);

																		if ($scope.reverse)
																			iconName = 'glyphicon glyphicon-chevron-up';
																		else
																			iconName = 'glyphicon glyphicon-chevron-down';

																		if (sortBy === 'customerProgramId') {
																			$scope.Header[0] = iconName;
																		} else if (sortBy === 'customerName') {
																			$scope.Header[1] = iconName;
																		} else if (sortBy === 'customerProgramCode') {
																			$scope.Header[2] = iconName;
																		} else if (sortBy === 'customerProgramType') {
																			$scope.Header[3] = iconName;
																		} else {
																			$scope.Header[2] = iconName;
																		}

																		$scope.reverse = !$scope.reverse;

																		$scope
																				.pagination();
																	};

																	// By
																	// Default
																	// sort
																	// ny
																	// Name
																	$scope
																			.sort('name');

																},
																function myError(
																		response) {
																	console
																			.log(response);
																});

												swal(
														"Customer Program updated SuccessFully!",
														"", "success");

											}, function myError(response) {
												console.log(response);
											});
						}

					}
				})
		.controller(
				'customerprogramcontroller',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var allcustomer = $scope.webserviceshost
							+ 'hr/customer/all';
					var referencedata = $scope.webserviceshost
							+ 'hr/refData/list';
					$http({
						method : "GET",
						url : referencedata,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {

						if (response != 'undefiend' && response != "") {
							$scope.customerProgramCodelist = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : allcustomer,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {

						if (response != 'undefiend' && response != "") {
							$scope.customers = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});
					$scope.createCPC = function() {

						var customerProgType = $scope.customerProgCodeType;
						var customerprogName = $scope.customerprogName;
						var customerId = $scope.customerId;
						var createCPC = $scope.webserviceshost
								+ 'hr/customerProgram/create/' + customerId
								+ '/' + customerprogName + '/'
								+ customerProgType;

						$http({
							method : "POST",
							url : createCPC,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						})
								.then(
										function mySucces(response) {
											swal(
													"Customer Program created SuccessFully!",
													"", "success");

										}, function myError(response) {
											console.log(response);
										});
					}

				})
		.controller(
				'editUserController',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					$('#edituser').hide();
					var allusersURL = $scope.webserviceshost
							+ 'hr/employee/all';
					$http({
						method : "GET",
						url : allusersURL,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.employeeId = '';
												$scope.firstName = '';
												$scope.lastName = '';
												$scope.emailId = '';
												$scope.joiningdate = ''
												$scope.searchText = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '', '', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											// Calculate Total Number of Pages
											// based on Search Result
											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};
											$scope.resetPassword = function(
													userid) {

												swal(
														{
															title : "Are you sure?",
															text : "Employee can login with new password only",
															showCancelButton : true,
															confirmButtonColor : "#DD6B55",
															confirmButtonText : "Yes, Reset it!",
															cancelButtonText : "No, cancel it!",
															closeOnConfirm : false,
															closeOnCancel : false
														},
														function(isConfirm) {
															if (isConfirm) {

																var deleteemployee = $scope.webserviceshost
																		+ 'hr/employee';
																var createRoll = '/resetPassword/'
																		+ userid;
																deleteemployee = deleteemployee
																		+ createRoll;
																$http(
																		{
																			method : "POST",
																			url : deleteemployee,
																			headers: {
																				'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																				'authorization':$window.sessionStorage.getItem("AuthKey")
																			}
																		})
																		.then(
																				function mySucces(
																						response) {

																					var allusersURL = $scope.webserviceshost
																							+ 'hr/employee/all';
																					$http(
																							{
																								method : "GET",
																								url : allusersURL,
																								headers: {
																									'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																									'authorization':$window.sessionStorage.getItem("AuthKey")
																								}
																							})
																							.then(
																									function mySucces(
																											response) {
																										console
																												.log(response.data);
																										if (response != 'undefiend'
																												&& response != "") {

																											$scope.allUsers = response.data;
																											$scope.pageSize = 7;
																											$scope.allItems = $scope.allUsers;
																											$scope.reverse = false;

																											$scope.resetAll = function() {
																												$scope.filteredList = $scope.allItems;
																												$scope.employeeId = '';
																												$scope.firstName = '';
																												$scope.lastName = '';
																												$scope.emailId = '';
																												$scope.joiningdate = ''
																												$scope.searchText = '';
																												$scope.currentPage = 0;
																												$scope.Header = [
																														'',
																														'',
																														'',
																														'',
																														'',
																														'',
																														'' ];
																											}

																											$scope.search = function() {
																												$scope.filteredList = filteredListService
																														.searched(
																																$scope.allItems,
																																$scope.searchText);

																												if ($scope.searchText == '') {
																													$scope.filteredList = $scope.allItems;
																												}
																												$scope
																														.pagination();
																											}

																											// Calculate
																											// Total
																											// Number
																											// of
																											// Pages
																											// based
																											// on
																											// Search
																											// Result
																											$scope.pagination = function() {
																												$scope.ItemsByPage = filteredListService
																														.paged(
																																$scope.filteredList,
																																$scope.pageSize);
																											};

																											$scope.setPage = function() {
																												$scope.currentPage = this.n;
																											};

																											$scope.firstPage = function() {
																												$scope.currentPage = 0;
																											};

																											$scope.lastPage = function() {
																												$scope.currentPage = $scope.ItemsByPage.length - 1;
																											};

																											$scope.range = function(
																													input,
																													total) {
																												var ret = [];
																												if (!total) {
																													total = input;
																													input = 0;
																												}
																												for (var i = input; i < total; i++) {
																													if (i != 0
																															&& i != total - 1) {
																														ret
																																.push(i);
																													}
																												}
																												return ret;
																											};

																											$scope.resetuser = function() {
																												$(
																														'#edituser')
																														.hide();
																											}
																											$scope.sort = function(
																													sortBy) {
																												$scope
																														.resetAll();

																												$scope.columnToOrder = sortBy;

																												// $Filter
																												// -
																												// Standard
																												// Service
																												$scope.filteredList = $filter(
																														'orderBy')
																														(
																																$scope.filteredList,
																																$scope.columnToOrder,
																																$scope.reverse);

																												if ($scope.reverse)
																													iconName = 'glyphicon glyphicon-chevron-up';
																												else
																													iconName = 'glyphicon glyphicon-chevron-down';

																												if (sortBy === 'EmpId') {
																													$scope.Header[0] = iconName;
																												} else if (sortBy === 'name') {
																													$scope.Header[1] = iconName;
																												} else {
																													$scope.Header[2] = iconName;
																												}

																												$scope.reverse = !$scope.reverse;

																												$scope
																														.pagination();
																											};

																											// By
																											// Default
																											// sort
																											// ny
																											// Name
																											$scope
																													.sort('name');

																											// console.log($scope.allUsers.length);
																										}
																									},
																									function myError(
																											response) {
																										console
																												.log(response);
																									});

																					swal(
																							"Reset Password SuccessFully!",
																							"Employee password reset done.",
																							"success");

																				},
																				function myError(
																						response) {
																					console
																							.log(response);
																				});

															} else {
																swal(
																		"Cancelled",
																		"Request has been cancelled.)",
																		"error");
															}
														});

											}
											$scope.deleteuserdetails = function(
													userid) {
												swal(
														{
															title : "Are you sure?",
															text : "You will not be able to recover this imaginary file!",
															type : "warning",
															showCancelButton : true,
															confirmButtonColor : "#DD6B55",
															confirmButtonText : "Yes, Delete it!",
															cancelButtonText : "No, cancel it!",
															closeOnConfirm : false,
															closeOnCancel : false
														},
														function(isConfirm) {
															if (isConfirm) {

																var deleteemployee = $scope.webserviceshost
																		+ 'hr/employee';
																var createRoll = '/delete/'
																		+ userid;
																deleteemployee = deleteemployee
																		+ createRoll;
																$http(
																		{
																			method : "DELETE",
																			url : deleteemployee,
																			headers: {
																				'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																				'authorization':$window.sessionStorage.getItem("AuthKey")
																			}
																		})
																		.then(
																				function mySucces(
																						response) {

																					var allusersURL = $scope.webserviceshost
																							+ 'hr/employee/all';
																					$http(
																							{
																								method : "GET",
																								url : allusersURL,
																								headers: {
																									'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																									'authorization':$window.sessionStorage.getItem("AuthKey")
																								}
																							})
																							.then(
																									function mySucces(
																											response) {
																										console
																												.log(response.data);
																										if (response != 'undefiend'
																												&& response != "") {

																											$scope.allUsers = response.data;
																											$scope.pageSize = 7;
																											$scope.allItems = $scope.allUsers;
																											$scope.reverse = false;

																											$scope.resetAll = function() {
																												$scope.filteredList = $scope.allItems;
																												$scope.employeeId = '';
																												$scope.firstName = '';
																												$scope.lastName = '';
																												$scope.emailId = '';
																												$scope.joiningdate = ''
																												$scope.searchText = '';
																												$scope.currentPage = 0;
																												$scope.Header = [
																														'',
																														'',
																														'',
																														'',
																														'',
																														'',
																														'' ];
																											}

																											$scope.search = function() {
																												$scope.filteredList = filteredListService
																														.searched(
																																$scope.allItems,
																																$scope.searchText);

																												if ($scope.searchText == '') {
																													$scope.filteredList = $scope.allItems;
																												}
																												$scope
																														.pagination();
																											}

																											// Calculate
																											// Total
																											// Number
																											// of
																											// Pages
																											// based
																											// on
																											// Search
																											// Result
																											$scope.pagination = function() {
																												$scope.ItemsByPage = filteredListService
																														.paged(
																																$scope.filteredList,
																																$scope.pageSize);
																											};

																											$scope.setPage = function() {
																												$scope.currentPage = this.n;
																											};

																											$scope.firstPage = function() {
																												$scope.currentPage = 0;
																											};

																											$scope.lastPage = function() {
																												$scope.currentPage = $scope.ItemsByPage.length - 1;
																											};

																											$scope.range = function(
																													input,
																													total) {
																												var ret = [];
																												if (!total) {
																													total = input;
																													input = 0;
																												}
																												for (var i = input; i < total; i++) {
																													if (i != 0
																															&& i != total - 1) {
																														ret
																																.push(i);
																													}
																												}
																												return ret;
																											};

																											$scope.resetuser = function() {
																												$(
																														'#edituser')
																														.hide();
																											}
																											$scope.sort = function(
																													sortBy) {
																												$scope
																														.resetAll();

																												$scope.columnToOrder = sortBy;

																												// $Filter
																												// -
																												// Standard
																												// Service
																												$scope.filteredList = $filter(
																														'orderBy')
																														(
																																$scope.filteredList,
																																$scope.columnToOrder,
																																$scope.reverse);

																												if ($scope.reverse)
																													iconName = 'glyphicon glyphicon-chevron-up';
																												else
																													iconName = 'glyphicon glyphicon-chevron-down';

																												if (sortBy === 'EmpId') {
																													$scope.Header[0] = iconName;
																												} else if (sortBy === 'name') {
																													$scope.Header[1] = iconName;
																												} else {
																													$scope.Header[2] = iconName;
																												}

																												$scope.reverse = !$scope.reverse;

																												$scope
																														.pagination();
																											};

																											// By
																											// Default
																											// sort
																											// ny
																											// Name
																											$scope
																													.sort('name');

																											// console.log($scope.allUsers.length);
																										}
																									},
																									function myError(
																											response) {
																										console
																												.log(response);
																									});

																					swal(
																							"Deleted SuccessFully!",
																							"Employe record has been deleted.",
																							"success");

																				},
																				function myError(
																						response) {
																					console
																							.log(response);
																				});

															} else {
																swal(
																		"Cancelled",
																		"Request has been cancelled.)",
																		"error");
															}
														});

											}
											$scope.edituserdetails = function(
													item) {

												$scope.today = function() {
													$scope.dt = new Date();
												};
												$scope.today();

												$scope.myDate = new Date();

												$scope.toggleMin = function() {
													$scope.minDate = new Date(
															$scope.myDate
																	.getFullYear(),
															$scope.myDate
																	.getMonth() - 11,
															$scope.myDate
																	.getDate());

												};
												$scope.toggleMin();

												$scope.open = function($event,
														opened) {
													$event.preventDefault();
													$event.stopPropagation();

													$scope[opened] = true;
												};

												$scope.dateOptions = {
													formatYear : 'yy',
													startingDay : 1
												};

												$scope.formats = [
														'dd-MMMM-yyyy',
														'yyyy-MM-dd',
														'dd.MM.yyyy',
														'shortDate' ];
												$scope.format = $scope.formats[1];
												$('#edituser').show();
												$scope.employeeId = item.employeeId;
												$scope.firstName = item.firstName;
												$scope.lastName = item.lastName;
												$scope.emailId = item.emailId;
												$scope.loginId = item.loginId;
												$scope.loginPassword = item.loginPassword;
												$scope.address = item.address;
												$scope.employeeType = item.employeeType;
												$scope.employeeStatus = item.employeeStatus;
												$scope.userDepartmentId = item.department.departmentId;
												$scope.managerId = item.manager.employeeId;
												$scope.roleId = item.role.roleid;
												$scope.designation = item.designation;
												$scope.dtPopup = item.dateOfJoin;
												$scope.statusVal = [ {
													name : 'Active',
													value : 'active'
												}, {
													name : 'Inactive',
													shade : 'inactive'
												} ];

												var roles = $scope.webserviceshost
														+ 'hr/role/all';
												var departments = $scope.webserviceshost
														+ 'hr/department/all';
												var managers = $scope.webserviceshost
														+ 'hr/employee/managers';
												var roll = $scope.webserviceshost
														+ 'hr/role/all';

												var refrenceData = $scope.webserviceshost
														+ 'hr/refData/list';

												$http({
													method : "GET",
													url : roles,
													headers: {
														'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
														'authorization':$window.sessionStorage.getItem("AuthKey")
													}
												})
														.then(
																function mySucces(
																		response) {
																	console
																			.log(response.data);
																	if (response != 'undefiend'
																			&& response != "") {
																		$scope.rolesdata = response.data;
																	}
																},
																function myError(
																		response) {
																	console
																			.log(response);
																});
												$http({
													method : "GET",
													url : departments,
													headers: {
														'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
														'authorization':$window.sessionStorage.getItem("AuthKey")
													}
												})
														.then(
																function mySucces(
																		response) {
																	console
																			.log(response.data);
																	if (response != 'undefiend'
																			&& response != "") {
																		$scope.departments = response.data;
																	}
																},
																function myError(
																		response) {
																	console
																			.log(response);
																});
												$http({
													method : "GET",
													url : managers,
													headers: {
														'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
														'authorization':$window.sessionStorage.getItem("AuthKey")
													}
												})
														.then(
																function mySucces(
																		response) {
																	console
																			.log(response.data);
																	if (response != 'undefiend'
																			&& response != "") {
																		$scope.managers = response.data;
																	}
																},
																function myError(
																		response) {
																	console
																			.log(response);
																});

											}
											$scope.updateUser = function() {
												var employeeId = $scope.employeeId;
												var firstName = $scope.firstName;
												var lastName = $scope.lastName;
												var emailId = $scope.emailId;
												var loginId = $scope.loginId;
												var loginPassword = $scope.loginPassword;
												var managerId = $scope.managerId;
												var address = $scope.address;
												var designation = $scope.designation;
												var roleid = $scope.roleId;
												var employeeType = $scope.employeeType;
												var userdepartmentId = $scope.userDepartmentId;
												var employeeStatus = $scope.employeeStatus;
												var date = $scope.dtPopup;
												var updateEmployee = $scope.webserviceshost
														+ 'hr/employee/update/';
												var addition = employeeId + '/'
														+ firstName + '/'
														+ lastName + '/'
														+ emailId + '/'
														+ loginId + '/'
														+ loginPassword + '/'
														+ managerId + '/'
														+ address + '/'
														+ designation + '/'
														+ employeeType + '/'
														+ userdepartmentId
														+ '/' + employeeStatus
														+ '/' + date+ '/' + roleid;
												updateEmployee = updateEmployee
														+ addition;

												$http({
													method : "POST",
													url : updateEmployee,
													headers: {
														'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
														'authorization':$window.sessionStorage.getItem("AuthKey")
													}
												})
														.then(
																function mySucces(
																		response) {
																	$(
																			'#edituser')
																			.hide();
																	var allusersURL = $scope.webserviceshost
																			+ 'hr/employee/all';
																	$http(
																			{
																				method : "GET",
																				url : allusersURL,
																				headers: {
																					'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																					'authorization':$window.sessionStorage.getItem("AuthKey")
																				}
																			})
																			.then(
																					function mySucces(
																							response) {
																						console
																								.log(response.data);
																						swal({
																							title : "Employe Updated Successfully",
																							closeOnConfirm : false,
																							closeOnCancel : false
																						});
																						if (response != 'undefiend'
																								&& response != "") {

																							$scope.allUsers = response.data;
																							$scope.pageSize = 7;
																							$scope.allItems = $scope.allUsers;
																							$scope.reverse = false;

																							$scope.resetAll = function() {
																								$scope.filteredList = $scope.allItems;
																								$scope.employeeId = '';
																								$scope.firstName = '';
																								$scope.lastName = '';
																								$scope.emailId = '';
																								$scope.roleId = '';
																								$scope.joiningdate = ''
																								$scope.searchText = '';
																								$scope.currentPage = 0;
																								$scope.Header = [
																										'',
																										'',
																										'',
																										'',
																										'',
																										'',
																										'' ];
																							}

																							$scope.search = function() {
																								$scope.filteredList = filteredListService
																										.searched(
																												$scope.allItems,
																												$scope.searchText);

																								if ($scope.searchText == '') {
																									$scope.filteredList = $scope.allItems;
																								}
																								$scope
																										.pagination();
																							}

																							// Calculate
																							// Total
																							// Number
																							// of
																							// Pages
																							// based
																							// on
																							// Search
																							// Result
																							$scope.pagination = function() {
																								$scope.ItemsByPage = filteredListService
																										.paged(
																												$scope.filteredList,
																												$scope.pageSize);
																							};

																							$scope.setPage = function() {
																								$scope.currentPage = this.n;
																							};

																							$scope.firstPage = function() {
																								$scope.currentPage = 0;
																							};

																							$scope.lastPage = function() {
																								$scope.currentPage = $scope.ItemsByPage.length - 1;
																							};

																							$scope.range = function(
																									input,
																									total) {
																								var ret = [];
																								if (!total) {
																									total = input;
																									input = 0;
																								}
																								for (var i = input; i < total; i++) {
																									if (i != 0
																											&& i != total - 1) {
																										ret
																												.push(i);
																									}
																								}
																								return ret;
																							};

																							$scope.sort = function(
																									sortBy) {
																								$scope
																										.resetAll();

																								$scope.columnToOrder = sortBy;

																								// $Filter
																								// -
																								// Standard
																								// Service
																								$scope.filteredList = $filter(
																										'orderBy')
																										(
																												$scope.filteredList,
																												$scope.columnToOrder,
																												$scope.reverse);

																								if ($scope.reverse)
																									iconName = 'glyphicon glyphicon-chevron-up';
																								else
																									iconName = 'glyphicon glyphicon-chevron-down';

																								if (sortBy === 'EmpId') {
																									$scope.Header[0] = iconName;
																								} else if (sortBy === 'name') {
																									$scope.Header[1] = iconName;
																								} else {
																									$scope.Header[2] = iconName;
																								}

																								$scope.reverse = !$scope.reverse;

																								$scope
																										.pagination();
																							};

																							// By
																							// Default
																							// sort
																							// ny
																							// Name
																							$scope
																									.sort('name');

																							// console.log($scope.allUsers.length);
																						}
																					},
																					function myError(
																							response) {
																						console
																								.log(response);
																					});

																},
																function myError(
																		response) {
																	console
																			.log(response);
																});
											}
											$scope.resetuser = function() {
												$('#edituser').hide();
											}
											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter - Standard Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'EmpId') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'name') {
													$scope.Header[1] = iconName;
												} else {
													$scope.Header[2] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By Default sort ny Name
											$scope.sort('name');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});

				})
		.controller(
				'addtaskcontroller',
				function($scope, $filter, $http,$window,$location
						) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var alldepartmentURL = $scope.webserviceshost
							+ 'hr/department/all';
					var allcustomer = $scope.webserviceshost
							+ 'hr/customer/all';
					$http({
						method : "GET",
						url : alldepartmentURL,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						console.log(response.data);
						if (response != 'undefiend' && response != "") {
							$scope.departments = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : allcustomer,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						console.log(response.data);
						if (response != 'undefiend' && response != "") {
							$scope.customers = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});
					$scope.addTask = function() {
						var taskName = $scope.taskName;
						var departmentId = $scope.department;
						var customerId = $scope.customer;
						var addTask = $scope.webserviceshost + 'hr/task/'
								+ 'create/' + taskName + '/' + departmentId
								+ '/' + customerId;

						$http({
							method : "POST",
							url : addTask,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							swal({
								title : "Task Added Successfully",
								closeOnConfirm : false,
								closeOnCancel : false
							});
							$scope.taskName = '';
							$scope.department = {};
							$scope.customer = {};
							console.log(response.data);

						}, function myError(response) {
							console.log(response);
						});
					}

				})

		.controller(
				'addprojectcontroller',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}

					var referenceData = $scope.webserviceshost
							+ 'hr/refData/list';
					var allcustomer = $scope.webserviceshost
							+ 'hr/customer/all';
					var allDepartment = $scope.webserviceshost
							+ "hr/department/all";
					var allcpc = $scope.webserviceshost
							+ "hr/customerProgram/all";
					$scope.name = 'World';

					$scope.countries = [ {
						name : 'Afghanistan',
						code : 'AF'
					}, {
						name : 'Åland Islands',
						code : 'AX'
					}, {
						name : 'Albania',
						code : 'AL'
					}, {
						name : 'Algeria',
						code : 'DZ'
					}, {
						name : 'American Samoa',
						code : 'AS'
					}, {
						name : 'Andorra',
						code : 'AD'
					}, {
						name : 'Angola',
						code : 'AO'
					}, {
						name : 'Anguilla',
						code : 'AI'
					}, {
						name : 'Antarctica',
						code : 'AQ'
					}, {
						name : 'Antigua and Barbuda',
						code : 'AG'
					}, {
						name : 'Argentina',
						code : 'AR'
					}, {
						name : 'Armenia',
						code : 'AM'
					}, {
						name : 'Aruba',
						code : 'AW'
					}, {
						name : 'Australia',
						code : 'AU'
					}, {
						name : 'Austria',
						code : 'AT'
					}, {
						name : 'Azerbaijan',
						code : 'AZ'
					}, {
						name : 'Bahamas',
						code : 'BS'
					}, {
						name : 'Bahrain',
						code : 'BH'
					}, {
						name : 'Bangladesh',
						code : 'BD'
					}, {
						name : 'Barbados',
						code : 'BB'
					}, {
						name : 'Belarus',
						code : 'BY'
					}, {
						name : 'Belgium',
						code : 'BE'
					}, {
						name : 'Belize',
						code : 'BZ'
					}, {
						name : 'Benin',
						code : 'BJ'
					}, {
						name : 'Bermuda',
						code : 'BM'
					}, {
						name : 'Bhutan',
						code : 'BT'
					}, {
						name : 'Bolivia',
						code : 'BO'
					}, {
						name : 'Bosnia and Herzegovina',
						code : 'BA'
					}, {
						name : 'Botswana',
						code : 'BW'
					}, {
						name : 'Bouvet Island',
						code : 'BV'
					}, {
						name : 'Brazil',
						code : 'BR'
					}, {
						name : 'British Indian Ocean Territory',
						code : 'IO'
					}, {
						name : 'Brunei Darussalam',
						code : 'BN'
					}, {
						name : 'Bulgaria',
						code : 'BG'
					}, {
						name : 'Burkina Faso',
						code : 'BF'
					}, {
						name : 'Burundi',
						code : 'BI'
					}, {
						name : 'Cambodia',
						code : 'KH'
					}, {
						name : 'Cameroon',
						code : 'CM'
					}, {
						name : 'Canada',
						code : 'CA'
					}, {
						name : 'Cape Verde',
						code : 'CV'
					}, {
						name : 'Cayman Islands',
						code : 'KY'
					}, {
						name : 'Central African Republic',
						code : 'CF'
					}, {
						name : 'Chad',
						code : 'TD'
					}, {
						name : 'Chile',
						code : 'CL'
					}, {
						name : 'China',
						code : 'CN'
					}, {
						name : 'Christmas Island',
						code : 'CX'
					}, {
						name : 'Cocos (Keeling) Islands',
						code : 'CC'
					}, {
						name : 'Colombia',
						code : 'CO'
					}, {
						name : 'Comoros',
						code : 'KM'
					}, {
						name : 'Congo',
						code : 'CG'
					}, {
						name : 'Congo, The Democratic Republic of the',
						code : 'CD'
					}, {
						name : 'Cook Islands',
						code : 'CK'
					}, {
						name : 'Costa Rica',
						code : 'CR'
					}, {
						name : 'Cote D\'Ivoire',
						code : 'CI'
					}, {
						name : 'Croatia',
						code : 'HR'
					}, {
						name : 'Cuba',
						code : 'CU'
					}, {
						name : 'Cyprus',
						code : 'CY'
					}, {
						name : 'Czech Republic',
						code : 'CZ'
					}, {
						name : 'Denmark',
						code : 'DK'
					}, {
						name : 'Djibouti',
						code : 'DJ'
					}, {
						name : 'Dominica',
						code : 'DM'
					}, {
						name : 'Dominican Republic',
						code : 'DO'
					}, {
						name : 'Ecuador',
						code : 'EC'
					}, {
						name : 'Egypt',
						code : 'EG'
					}, {
						name : 'El Salvador',
						code : 'SV'
					}, {
						name : 'Equatorial Guinea',
						code : 'GQ'
					}, {
						name : 'Eritrea',
						code : 'ER'
					}, {
						name : 'Estonia',
						code : 'EE'
					}, {
						name : 'Ethiopia',
						code : 'ET'
					}, {
						name : 'Falkland Islands (Malvinas)',
						code : 'FK'
					}, {
						name : 'Faroe Islands',
						code : 'FO'
					}, {
						name : 'Fiji',
						code : 'FJ'
					}, {
						name : 'Finland',
						code : 'FI'
					}, {
						name : 'France',
						code : 'FR'
					}, {
						name : 'French Guiana',
						code : 'GF'
					}, {
						name : 'French Polynesia',
						code : 'PF'
					}, {
						name : 'French Southern Territories',
						code : 'TF'
					}, {
						name : 'Gabon',
						code : 'GA'
					}, {
						name : 'Gambia',
						code : 'GM'
					}, {
						name : 'Georgia',
						code : 'GE'
					}, {
						name : 'Germany',
						code : 'DE'
					}, {
						name : 'Ghana',
						code : 'GH'
					}, {
						name : 'Gibraltar',
						code : 'GI'
					}, {
						name : 'Greece',
						code : 'GR'
					}, {
						name : 'Greenland',
						code : 'GL'
					}, {
						name : 'Grenada',
						code : 'GD'
					}, {
						name : 'Guadeloupe',
						code : 'GP'
					}, {
						name : 'Guam',
						code : 'GU'
					}, {
						name : 'Guatemala',
						code : 'GT'
					}, {
						name : 'Guernsey',
						code : 'GG'
					}, {
						name : 'Guinea',
						code : 'GN'
					}, {
						name : 'Guinea-Bissau',
						code : 'GW'
					}, {
						name : 'Guyana',
						code : 'GY'
					}, {
						name : 'Haiti',
						code : 'HT'
					}, {
						name : 'Heard Island and Mcdonald Islands',
						code : 'HM'
					}, {
						name : 'Holy See (Vatican City State)',
						code : 'VA'
					}, {
						name : 'Honduras',
						code : 'HN'
					}, {
						name : 'Hong Kong',
						code : 'HK'
					}, {
						name : 'Hungary',
						code : 'HU'
					}, {
						name : 'Iceland',
						code : 'IS'
					}, {
						name : 'India',
						code : 'IN'
					}, {
						name : 'Indonesia',
						code : 'ID'
					}, {
						name : 'Iran, Islamic Republic Of',
						code : 'IR'
					}, {
						name : 'Iraq',
						code : 'IQ'
					}, {
						name : 'Ireland',
						code : 'IE'
					}, {
						name : 'Isle of Man',
						code : 'IM'
					}, {
						name : 'Israel',
						code : 'IL'
					}, {
						name : 'Italy',
						code : 'IT'
					}, {
						name : 'Jamaica',
						code : 'JM'
					}, {
						name : 'Japan',
						code : 'JP'
					}, {
						name : 'Jersey',
						code : 'JE'
					}, {
						name : 'Jordan',
						code : 'JO'
					}, {
						name : 'Kazakhstan',
						code : 'KZ'
					}, {
						name : 'Kenya',
						code : 'KE'
					}, {
						name : 'Kiribati',
						code : 'KI'
					}, {
						name : 'Korea, Democratic People\'s Republic of',
						code : 'KP'
					}, {
						name : 'Korea, Republic of',
						code : 'KR'
					}, {
						name : 'Kuwait',
						code : 'KW'
					}, {
						name : 'Kyrgyzstan',
						code : 'KG'
					}, {
						name : 'Lao People\'s Democratic Republic',
						code : 'LA'
					}, {
						name : 'Latvia',
						code : 'LV'
					}, {
						name : 'Lebanon',
						code : 'LB'
					}, {
						name : 'Lesotho',
						code : 'LS'
					}, {
						name : 'Liberia',
						code : 'LR'
					}, {
						name : 'Libyan Arab Jamahiriya',
						code : 'LY'
					}, {
						name : 'Liechtenstein',
						code : 'LI'
					}, {
						name : 'Lithuania',
						code : 'LT'
					}, {
						name : 'Luxembourg',
						code : 'LU'
					}, {
						name : 'Macao',
						code : 'MO'
					}, {
						name : 'Macedonia, The Former Yugoslav Republic of',
						code : 'MK'
					}, {
						name : 'Madagascar',
						code : 'MG'
					}, {
						name : 'Malawi',
						code : 'MW'
					}, {
						name : 'Malaysia',
						code : 'MY'
					}, {
						name : 'Maldives',
						code : 'MV'
					}, {
						name : 'Mali',
						code : 'ML'
					}, {
						name : 'Malta',
						code : 'MT'
					}, {
						name : 'Marshall Islands',
						code : 'MH'
					}, {
						name : 'Martinique',
						code : 'MQ'
					}, {
						name : 'Mauritania',
						code : 'MR'
					}, {
						name : 'Mauritius',
						code : 'MU'
					}, {
						name : 'Mayotte',
						code : 'YT'
					}, {
						name : 'Mexico',
						code : 'MX'
					}, {
						name : 'Micronesia, Federated States of',
						code : 'FM'
					}, {
						name : 'Moldova, Republic of',
						code : 'MD'
					}, {
						name : 'Monaco',
						code : 'MC'
					}, {
						name : 'Mongolia',
						code : 'MN'
					}, {
						name : 'Montserrat',
						code : 'MS'
					}, {
						name : 'Morocco',
						code : 'MA'
					}, {
						name : 'Mozambique',
						code : 'MZ'
					}, {
						name : 'Myanmar',
						code : 'MM'
					}, {
						name : 'Namibia',
						code : 'NA'
					}, {
						name : 'Nauru',
						code : 'NR'
					}, {
						name : 'Nepal',
						code : 'NP'
					}, {
						name : 'Netherlands',
						code : 'NL'
					}, {
						name : 'Netherlands Antilles',
						code : 'AN'
					}, {
						name : 'New Caledonia',
						code : 'NC'
					}, {
						name : 'New Zealand',
						code : 'NZ'
					}, {
						name : 'Nicaragua',
						code : 'NI'
					}, {
						name : 'Niger',
						code : 'NE'
					}, {
						name : 'Nigeria',
						code : 'NG'
					}, {
						name : 'Niue',
						code : 'NU'
					}, {
						name : 'Norfolk Island',
						code : 'NF'
					}, {
						name : 'Northern Mariana Islands',
						code : 'MP'
					}, {
						name : 'Norway',
						code : 'NO'
					}, {
						name : 'Oman',
						code : 'OM'
					}, {
						name : 'Pakistan',
						code : 'PK'
					}, {
						name : 'Palau',
						code : 'PW'
					}, {
						name : 'Palestinian Territory, Occupied',
						code : 'PS'
					}, {
						name : 'Panama',
						code : 'PA'
					}, {
						name : 'Papua New Guinea',
						code : 'PG'
					}, {
						name : 'Paraguay',
						code : 'PY'
					}, {
						name : 'Peru',
						code : 'PE'
					}, {
						name : 'Philippines',
						code : 'PH'
					}, {
						name : 'Pitcairn',
						code : 'PN'
					}, {
						name : 'Poland',
						code : 'PL'
					}, {
						name : 'Portugal',
						code : 'PT'
					}, {
						name : 'Puerto Rico',
						code : 'PR'
					}, {
						name : 'Qatar',
						code : 'QA'
					}, {
						name : 'Reunion',
						code : 'RE'
					}, {
						name : 'Romania',
						code : 'RO'
					}, {
						name : 'Russian Federation',
						code : 'RU'
					}, {
						name : 'Rwanda',
						code : 'RW'
					}, {
						name : 'Saint Helena',
						code : 'SH'
					}, {
						name : 'Saint Kitts and Nevis',
						code : 'KN'
					}, {
						name : 'Saint Lucia',
						code : 'LC'
					}, {
						name : 'Saint Pierre and Miquelon',
						code : 'PM'
					}, {
						name : 'Saint Vincent and the Grenadines',
						code : 'VC'
					}, {
						name : 'Samoa',
						code : 'WS'
					}, {
						name : 'San Marino',
						code : 'SM'
					}, {
						name : 'Sao Tome and Principe',
						code : 'ST'
					}, {
						name : 'Saudi Arabia',
						code : 'SA'
					}, {
						name : 'Senegal',
						code : 'SN'
					}, {
						name : 'Serbia and Montenegro',
						code : 'CS'
					}, {
						name : 'Seychelles',
						code : 'SC'
					}, {
						name : 'Sierra Leone',
						code : 'SL'
					}, {
						name : 'Singapore',
						code : 'SG'
					}, {
						name : 'Slovakia',
						code : 'SK'
					}, {
						name : 'Slovenia',
						code : 'SI'
					}, {
						name : 'Solomon Islands',
						code : 'SB'
					}, {
						name : 'Somalia',
						code : 'SO'
					}, {
						name : 'South Africa',
						code : 'ZA'
					}, {
						name : 'South Georgia and the South Sandwich Islands',
						code : 'GS'
					}, {
						name : 'Spain',
						code : 'ES'
					}, {
						name : 'Sri Lanka',
						code : 'LK'
					}, {
						name : 'Sudan',
						code : 'SD'
					}, {
						name : 'Suriname',
						code : 'SR'
					}, {
						name : 'Svalbard and Jan Mayen',
						code : 'SJ'
					}, {
						name : 'Swaziland',
						code : 'SZ'
					}, {
						name : 'Sweden',
						code : 'SE'
					}, {
						name : 'Switzerland',
						code : 'CH'
					}, {
						name : 'Syrian Arab Republic',
						code : 'SY'
					}, {
						name : 'Taiwan, Province of China',
						code : 'TW'
					}, {
						name : 'Tajikistan',
						code : 'TJ'
					}, {
						name : 'Tanzania, United Republic of',
						code : 'TZ'
					}, {
						name : 'Thailand',
						code : 'TH'
					}, {
						name : 'Timor-Leste',
						code : 'TL'
					}, {
						name : 'Togo',
						code : 'TG'
					}, {
						name : 'Tokelau',
						code : 'TK'
					}, {
						name : 'Tonga',
						code : 'TO'
					}, {
						name : 'Trinidad and Tobago',
						code : 'TT'
					}, {
						name : 'Tunisia',
						code : 'TN'
					}, {
						name : 'Turkey',
						code : 'TR'
					}, {
						name : 'Turkmenistan',
						code : 'TM'
					}, {
						name : 'Turks and Caicos Islands',
						code : 'TC'
					}, {
						name : 'Tuvalu',
						code : 'TV'
					}, {
						name : 'Uganda',
						code : 'UG'
					}, {
						name : 'Ukraine',
						code : 'UA'
					}, {
						name : 'United Arab Emirates',
						code : 'AE'
					}, {
						name : 'United Kingdom',
						code : 'GB'
					}, {
						name : 'United States',
						code : 'US'
					}, {
						name : 'United States Minor Outlying Islands',
						code : 'UM'
					}, {
						name : 'Uruguay',
						code : 'UY'
					}, {
						name : 'Uzbekistan',
						code : 'UZ'
					}, {
						name : 'Vanuatu',
						code : 'VU'
					}, {
						name : 'Venezuela',
						code : 'VE'
					}, {
						name : 'Vietnam',
						code : 'VN'
					}, {
						name : 'Virgin Islands, British',
						code : 'VG'
					}, {
						name : 'Virgin Islands, U.S.',
						code : 'VI'
					}, {
						name : 'Wallis and Futuna',
						code : 'WF'
					}, {
						name : 'Western Sahara',
						code : 'EH'
					}, {
						name : 'Yemen',
						code : 'YE'
					}, {
						name : 'Zambia',
						code : 'ZM'
					}, {
						name : 'Zimbabwe',
						code : 'ZW'
					} ];

					$http({
						method : "GET",
						url : allDepartment,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {

						$scope.departments = response.data;

					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : allcpc,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {

						$scope.cpc = response.data;

					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : allcustomer,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {

						$scope.customers = response.data;

					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : referenceData,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {

						console.log(response.data);
						$scope.customerprojectype = response.data.ProjectType;
						console.log($scope.customerprojectype);
						$scope.projectStatus = response.data.ProjectStatus;
						console.log($scope.projectStatus);

					}, function myError(response) {
						console.log(response);
					});

					$scope.addprojecttocustomer = function() {
						var projectName = $scope.projectname;
						var customerProgramId = $scope.customerprogramcode;
						var projectType = $scope.customerproject;
						var projectStatus = $scope.projectstatus;
						var customer = $scope.customerid;
						var department = $scope.departmentid;
						var country = $scope.country.name;
						/* /{projectName}/{customerId}/{customerProgramId}/{departmentId}/{projectType}/{projectStatus}/{location */
						var projectadd = $scope.webserviceshost + 'hr/project';
						var additional = '/create/' + projectName + '/'
								+ customer + '/' + +customerProgramId + '/'
								+ department + '/' + projectType + '/'
								+ projectStatus + '/' + country;
						projectadd = projectadd + additional;
						$http({
							method : "POST",
							url : projectadd,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {

							console.log(response.data);
							swal({
								title : "Project Added Successfully",
								closeOnConfirm : false,
								closeOnCancel : false
							});
							$scope.projectname = '';
							$scope.customerproject = {};
							$scope.projectstatus = {};
							$scope.customerprogramcode = '';
							$scope.departmentid = {};
							$scope.country = {};
							$scope.customer = {};

						}, function myError(response) {
							console.log(response);
						});
					}

				})
		.controller(
				'editprojectdetails',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var allTask = $scope.webserviceshost + 'hr/project/all';
					$("#editprojectdata").hide();
					$http({
						method : "GET",
						url : allTask,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {

										console.log(response.data);

										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.projectId = '';
												$scope.projectName = '';
												$scope.customerProgramCode = '';
												$scope.projectType = '';
												$scope.projectStatus = '';
												$scope.searchText = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '', '', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											// Calculate Total Number of Pages
											// based on Search Result
											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};

											$scope.sort = function(sortBy) {
												console.log(sortBy);
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter - Standard Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'projectid') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'projectName') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'customerProjectCode') {
													$scope.Header[2] = iconName;
												} else if (sortBy === 'projectType') {
													$scope.Header[3] = iconName;
												} else if (sortBy === 'projectStatus') {
													$scope.Header[4] = iconName;
												} else {
													$scope.Header[1] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By Default sort ny Name
											$scope.sort('projectName');

											// console.log($scope.allUsers.length);
										}

									}, function myError(response) {
										console.log(response);
									});
					$scope.editprojects = function(item) {
						$("#editprojectdata").show();
						$scope.projectid = item.projectid;
						$scope.projectname = item.projectName;
						$scope.customerprogramcode = item.customerProgram.customerProgramId;
						$scope.customerproject = item.projectType;
						$scope.projectstatus = item.projectStatus;
						$scope.customerid = item.customerProgram.customer.customerId;
						$scope.departmentid = item.department.departmentId;
						$scope.country = item.location;
						var referenceData = $scope.webserviceshost
								+ 'hr/refData/list';
						var allcustomer = $scope.webserviceshost
								+ 'hr/customer/all';
						var allDepartment = $scope.webserviceshost
								+ "hr/department/all";
						var allcpc = $scope.webserviceshost
								+ "hr/customerProgram/all";
						$scope.name = 'World';

						$scope.countries = [
								{
									name : 'Afghanistan',
									code : 'AF'
								},
								{
									name : 'Åland Islands',
									code : 'AX'
								},
								{
									name : 'Albania',
									code : 'AL'
								},
								{
									name : 'Algeria',
									code : 'DZ'
								},
								{
									name : 'American Samoa',
									code : 'AS'
								},
								{
									name : 'Andorra',
									code : 'AD'
								},
								{
									name : 'Angola',
									code : 'AO'
								},
								{
									name : 'Anguilla',
									code : 'AI'
								},
								{
									name : 'Antarctica',
									code : 'AQ'
								},
								{
									name : 'Antigua and Barbuda',
									code : 'AG'
								},
								{
									name : 'Argentina',
									code : 'AR'
								},
								{
									name : 'Armenia',
									code : 'AM'
								},
								{
									name : 'Aruba',
									code : 'AW'
								},
								{
									name : 'Australia',
									code : 'AU'
								},
								{
									name : 'Austria',
									code : 'AT'
								},
								{
									name : 'Azerbaijan',
									code : 'AZ'
								},
								{
									name : 'Bahamas',
									code : 'BS'
								},
								{
									name : 'Bahrain',
									code : 'BH'
								},
								{
									name : 'Bangladesh',
									code : 'BD'
								},
								{
									name : 'Barbados',
									code : 'BB'
								},
								{
									name : 'Belarus',
									code : 'BY'
								},
								{
									name : 'Belgium',
									code : 'BE'
								},
								{
									name : 'Belize',
									code : 'BZ'
								},
								{
									name : 'Benin',
									code : 'BJ'
								},
								{
									name : 'Bermuda',
									code : 'BM'
								},
								{
									name : 'Bhutan',
									code : 'BT'
								},
								{
									name : 'Bolivia',
									code : 'BO'
								},
								{
									name : 'Bosnia and Herzegovina',
									code : 'BA'
								},
								{
									name : 'Botswana',
									code : 'BW'
								},
								{
									name : 'Bouvet Island',
									code : 'BV'
								},
								{
									name : 'Brazil',
									code : 'BR'
								},
								{
									name : 'British Indian Ocean Territory',
									code : 'IO'
								},
								{
									name : 'Brunei Darussalam',
									code : 'BN'
								},
								{
									name : 'Bulgaria',
									code : 'BG'
								},
								{
									name : 'Burkina Faso',
									code : 'BF'
								},
								{
									name : 'Burundi',
									code : 'BI'
								},
								{
									name : 'Cambodia',
									code : 'KH'
								},
								{
									name : 'Cameroon',
									code : 'CM'
								},
								{
									name : 'Canada',
									code : 'CA'
								},
								{
									name : 'Cape Verde',
									code : 'CV'
								},
								{
									name : 'Cayman Islands',
									code : 'KY'
								},
								{
									name : 'Central African Republic',
									code : 'CF'
								},
								{
									name : 'Chad',
									code : 'TD'
								},
								{
									name : 'Chile',
									code : 'CL'
								},
								{
									name : 'China',
									code : 'CN'
								},
								{
									name : 'Christmas Island',
									code : 'CX'
								},
								{
									name : 'Cocos (Keeling) Islands',
									code : 'CC'
								},
								{
									name : 'Colombia',
									code : 'CO'
								},
								{
									name : 'Comoros',
									code : 'KM'
								},
								{
									name : 'Congo',
									code : 'CG'
								},
								{
									name : 'Congo, The Democratic Republic of the',
									code : 'CD'
								},
								{
									name : 'Cook Islands',
									code : 'CK'
								},
								{
									name : 'Costa Rica',
									code : 'CR'
								},
								{
									name : 'Cote D\'Ivoire',
									code : 'CI'
								},
								{
									name : 'Croatia',
									code : 'HR'
								},
								{
									name : 'Cuba',
									code : 'CU'
								},
								{
									name : 'Cyprus',
									code : 'CY'
								},
								{
									name : 'Czech Republic',
									code : 'CZ'
								},
								{
									name : 'Denmark',
									code : 'DK'
								},
								{
									name : 'Djibouti',
									code : 'DJ'
								},
								{
									name : 'Dominica',
									code : 'DM'
								},
								{
									name : 'Dominican Republic',
									code : 'DO'
								},
								{
									name : 'Ecuador',
									code : 'EC'
								},
								{
									name : 'Egypt',
									code : 'EG'
								},
								{
									name : 'El Salvador',
									code : 'SV'
								},
								{
									name : 'Equatorial Guinea',
									code : 'GQ'
								},
								{
									name : 'Eritrea',
									code : 'ER'
								},
								{
									name : 'Estonia',
									code : 'EE'
								},
								{
									name : 'Ethiopia',
									code : 'ET'
								},
								{
									name : 'Falkland Islands (Malvinas)',
									code : 'FK'
								},
								{
									name : 'Faroe Islands',
									code : 'FO'
								},
								{
									name : 'Fiji',
									code : 'FJ'
								},
								{
									name : 'Finland',
									code : 'FI'
								},
								{
									name : 'France',
									code : 'FR'
								},
								{
									name : 'French Guiana',
									code : 'GF'
								},
								{
									name : 'French Polynesia',
									code : 'PF'
								},
								{
									name : 'French Southern Territories',
									code : 'TF'
								},
								{
									name : 'Gabon',
									code : 'GA'
								},
								{
									name : 'Gambia',
									code : 'GM'
								},
								{
									name : 'Georgia',
									code : 'GE'
								},
								{
									name : 'Germany',
									code : 'DE'
								},
								{
									name : 'Ghana',
									code : 'GH'
								},
								{
									name : 'Gibraltar',
									code : 'GI'
								},
								{
									name : 'Greece',
									code : 'GR'
								},
								{
									name : 'Greenland',
									code : 'GL'
								},
								{
									name : 'Grenada',
									code : 'GD'
								},
								{
									name : 'Guadeloupe',
									code : 'GP'
								},
								{
									name : 'Guam',
									code : 'GU'
								},
								{
									name : 'Guatemala',
									code : 'GT'
								},
								{
									name : 'Guernsey',
									code : 'GG'
								},
								{
									name : 'Guinea',
									code : 'GN'
								},
								{
									name : 'Guinea-Bissau',
									code : 'GW'
								},
								{
									name : 'Guyana',
									code : 'GY'
								},
								{
									name : 'Haiti',
									code : 'HT'
								},
								{
									name : 'Heard Island and Mcdonald Islands',
									code : 'HM'
								},
								{
									name : 'Holy See (Vatican City State)',
									code : 'VA'
								},
								{
									name : 'Honduras',
									code : 'HN'
								},
								{
									name : 'Hong Kong',
									code : 'HK'
								},
								{
									name : 'Hungary',
									code : 'HU'
								},
								{
									name : 'Iceland',
									code : 'IS'
								},
								{
									name : 'India',
									code : 'IN'
								},
								{
									name : 'Indonesia',
									code : 'ID'
								},
								{
									name : 'Iran, Islamic Republic Of',
									code : 'IR'
								},
								{
									name : 'Iraq',
									code : 'IQ'
								},
								{
									name : 'Ireland',
									code : 'IE'
								},
								{
									name : 'Isle of Man',
									code : 'IM'
								},
								{
									name : 'Israel',
									code : 'IL'
								},
								{
									name : 'Italy',
									code : 'IT'
								},
								{
									name : 'Jamaica',
									code : 'JM'
								},
								{
									name : 'Japan',
									code : 'JP'
								},
								{
									name : 'Jersey',
									code : 'JE'
								},
								{
									name : 'Jordan',
									code : 'JO'
								},
								{
									name : 'Kazakhstan',
									code : 'KZ'
								},
								{
									name : 'Kenya',
									code : 'KE'
								},
								{
									name : 'Kiribati',
									code : 'KI'
								},
								{
									name : 'Korea, Democratic People\'s Republic of',
									code : 'KP'
								},
								{
									name : 'Korea, Republic of',
									code : 'KR'
								},
								{
									name : 'Kuwait',
									code : 'KW'
								},
								{
									name : 'Kyrgyzstan',
									code : 'KG'
								},
								{
									name : 'Lao People\'s Democratic Republic',
									code : 'LA'
								},
								{
									name : 'Latvia',
									code : 'LV'
								},
								{
									name : 'Lebanon',
									code : 'LB'
								},
								{
									name : 'Lesotho',
									code : 'LS'
								},
								{
									name : 'Liberia',
									code : 'LR'
								},
								{
									name : 'Libyan Arab Jamahiriya',
									code : 'LY'
								},
								{
									name : 'Liechtenstein',
									code : 'LI'
								},
								{
									name : 'Lithuania',
									code : 'LT'
								},
								{
									name : 'Luxembourg',
									code : 'LU'
								},
								{
									name : 'Macao',
									code : 'MO'
								},
								{
									name : 'Macedonia, The Former Yugoslav Republic of',
									code : 'MK'
								},
								{
									name : 'Madagascar',
									code : 'MG'
								},
								{
									name : 'Malawi',
									code : 'MW'
								},
								{
									name : 'Malaysia',
									code : 'MY'
								},
								{
									name : 'Maldives',
									code : 'MV'
								},
								{
									name : 'Mali',
									code : 'ML'
								},
								{
									name : 'Malta',
									code : 'MT'
								},
								{
									name : 'Marshall Islands',
									code : 'MH'
								},
								{
									name : 'Martinique',
									code : 'MQ'
								},
								{
									name : 'Mauritania',
									code : 'MR'
								},
								{
									name : 'Mauritius',
									code : 'MU'
								},
								{
									name : 'Mayotte',
									code : 'YT'
								},
								{
									name : 'Mexico',
									code : 'MX'
								},
								{
									name : 'Micronesia, Federated States of',
									code : 'FM'
								},
								{
									name : 'Moldova, Republic of',
									code : 'MD'
								},
								{
									name : 'Monaco',
									code : 'MC'
								},
								{
									name : 'Mongolia',
									code : 'MN'
								},
								{
									name : 'Montserrat',
									code : 'MS'
								},
								{
									name : 'Morocco',
									code : 'MA'
								},
								{
									name : 'Mozambique',
									code : 'MZ'
								},
								{
									name : 'Myanmar',
									code : 'MM'
								},
								{
									name : 'Namibia',
									code : 'NA'
								},
								{
									name : 'Nauru',
									code : 'NR'
								},
								{
									name : 'Nepal',
									code : 'NP'
								},
								{
									name : 'Netherlands',
									code : 'NL'
								},
								{
									name : 'Netherlands Antilles',
									code : 'AN'
								},
								{
									name : 'New Caledonia',
									code : 'NC'
								},
								{
									name : 'New Zealand',
									code : 'NZ'
								},
								{
									name : 'Nicaragua',
									code : 'NI'
								},
								{
									name : 'Niger',
									code : 'NE'
								},
								{
									name : 'Nigeria',
									code : 'NG'
								},
								{
									name : 'Niue',
									code : 'NU'
								},
								{
									name : 'Norfolk Island',
									code : 'NF'
								},
								{
									name : 'Northern Mariana Islands',
									code : 'MP'
								},
								{
									name : 'Norway',
									code : 'NO'
								},
								{
									name : 'Oman',
									code : 'OM'
								},
								{
									name : 'Pakistan',
									code : 'PK'
								},
								{
									name : 'Palau',
									code : 'PW'
								},
								{
									name : 'Palestinian Territory, Occupied',
									code : 'PS'
								},
								{
									name : 'Panama',
									code : 'PA'
								},
								{
									name : 'Papua New Guinea',
									code : 'PG'
								},
								{
									name : 'Paraguay',
									code : 'PY'
								},
								{
									name : 'Peru',
									code : 'PE'
								},
								{
									name : 'Philippines',
									code : 'PH'
								},
								{
									name : 'Pitcairn',
									code : 'PN'
								},
								{
									name : 'Poland',
									code : 'PL'
								},
								{
									name : 'Portugal',
									code : 'PT'
								},
								{
									name : 'Puerto Rico',
									code : 'PR'
								},
								{
									name : 'Qatar',
									code : 'QA'
								},
								{
									name : 'Reunion',
									code : 'RE'
								},
								{
									name : 'Romania',
									code : 'RO'
								},
								{
									name : 'Russian Federation',
									code : 'RU'
								},
								{
									name : 'Rwanda',
									code : 'RW'
								},
								{
									name : 'Saint Helena',
									code : 'SH'
								},
								{
									name : 'Saint Kitts and Nevis',
									code : 'KN'
								},
								{
									name : 'Saint Lucia',
									code : 'LC'
								},
								{
									name : 'Saint Pierre and Miquelon',
									code : 'PM'
								},
								{
									name : 'Saint Vincent and the Grenadines',
									code : 'VC'
								},
								{
									name : 'Samoa',
									code : 'WS'
								},
								{
									name : 'San Marino',
									code : 'SM'
								},
								{
									name : 'Sao Tome and Principe',
									code : 'ST'
								},
								{
									name : 'Saudi Arabia',
									code : 'SA'
								},
								{
									name : 'Senegal',
									code : 'SN'
								},
								{
									name : 'Serbia and Montenegro',
									code : 'CS'
								},
								{
									name : 'Seychelles',
									code : 'SC'
								},
								{
									name : 'Sierra Leone',
									code : 'SL'
								},
								{
									name : 'Singapore',
									code : 'SG'
								},
								{
									name : 'Slovakia',
									code : 'SK'
								},
								{
									name : 'Slovenia',
									code : 'SI'
								},
								{
									name : 'Solomon Islands',
									code : 'SB'
								},
								{
									name : 'Somalia',
									code : 'SO'
								},
								{
									name : 'South Africa',
									code : 'ZA'
								},
								{
									name : 'South Georgia and the South Sandwich Islands',
									code : 'GS'
								},
								{
									name : 'Spain',
									code : 'ES'
								},
								{
									name : 'Sri Lanka',
									code : 'LK'
								},
								{
									name : 'Sudan',
									code : 'SD'
								},
								{
									name : 'Suriname',
									code : 'SR'
								},
								{
									name : 'Svalbard and Jan Mayen',
									code : 'SJ'
								},
								{
									name : 'Swaziland',
									code : 'SZ'
								},
								{
									name : 'Sweden',
									code : 'SE'
								},
								{
									name : 'Switzerland',
									code : 'CH'
								},
								{
									name : 'Syrian Arab Republic',
									code : 'SY'
								},
								{
									name : 'Taiwan, Province of China',
									code : 'TW'
								},
								{
									name : 'Tajikistan',
									code : 'TJ'
								},
								{
									name : 'Tanzania, United Republic of',
									code : 'TZ'
								},
								{
									name : 'Thailand',
									code : 'TH'
								},
								{
									name : 'Timor-Leste',
									code : 'TL'
								},
								{
									name : 'Togo',
									code : 'TG'
								},
								{
									name : 'Tokelau',
									code : 'TK'
								},
								{
									name : 'Tonga',
									code : 'TO'
								},
								{
									name : 'Trinidad and Tobago',
									code : 'TT'
								},
								{
									name : 'Tunisia',
									code : 'TN'
								},
								{
									name : 'Turkey',
									code : 'TR'
								},
								{
									name : 'Turkmenistan',
									code : 'TM'
								},
								{
									name : 'Turks and Caicos Islands',
									code : 'TC'
								},
								{
									name : 'Tuvalu',
									code : 'TV'
								},
								{
									name : 'Uganda',
									code : 'UG'
								},
								{
									name : 'Ukraine',
									code : 'UA'
								},
								{
									name : 'United Arab Emirates',
									code : 'AE'
								},
								{
									name : 'United Kingdom',
									code : 'GB'
								},
								{
									name : 'United States',
									code : 'US'
								},
								{
									name : 'United States Minor Outlying Islands',
									code : 'UM'
								}, {
									name : 'Uruguay',
									code : 'UY'
								}, {
									name : 'Uzbekistan',
									code : 'UZ'
								}, {
									name : 'Vanuatu',
									code : 'VU'
								}, {
									name : 'Venezuela',
									code : 'VE'
								}, {
									name : 'Vietnam',
									code : 'VN'
								}, {
									name : 'Virgin Islands, British',
									code : 'VG'
								}, {
									name : 'Virgin Islands, U.S.',
									code : 'VI'
								}, {
									name : 'Wallis and Futuna',
									code : 'WF'
								}, {
									name : 'Western Sahara',
									code : 'EH'
								}, {
									name : 'Yemen',
									code : 'YE'
								}, {
									name : 'Zambia',
									code : 'ZM'
								}, {
									name : 'Zimbabwe',
									code : 'ZW'
								} ];

						$http({
							method : "GET",
							url : allDepartment,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {

							$scope.departments = response.data;

						}, function myError(response) {
							console.log(response);
						});
						$http({
							method : "GET",
							url : allcpc,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {

							$scope.cpc = response.data;

						}, function myError(response) {
							console.log(response);
						});
						$http({
							method : "GET",
							url : allcustomer,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {

							$scope.customers = response.data;

						}, function myError(response) {
							console.log(response);
						});
						$http({
							method : "GET",
							url : referenceData,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						})
								.then(
										function mySucces(response) {

											console.log(response.data);
											$scope.customerprojectype = response.data.ProjectType;

											$scope.projectStatus = response.data.ProjectStatus;
											console.log($scope.projectStatus);

										}, function myError(response) {
											console.log(response);
										});

						$http({
							method : "GET",
							url : referenceData,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						})
								.then(
										function mySucces(response) {

											console.log(response.data);
											$scope.customerprojectype = response.data.ProjectType;
											console
													.log($scope.customerprojectype);
											$scope.projectStatus = response.data.ProjectStatus;
											console.log($scope.projectStatus);

										}, function myError(response) {
											console.log(response);
										});

					}
					$scope.updateprojectdata = function() {
						var projectid = $scope.projectid;
						var projectName = $scope.projectname;
						var customerid = $scope.customerid;
						var departmentid = $scope.departmentid;
						var customerprogramcode = $scope.customerprogramcode;
						var customerproject = $scope.customerproject;
						var country = $scope.country.name;
						var projectType = $scope.customerproject;
						var projectStatus = $scope.projectstatus;
						'/update/{projectid}/{projectName}/{customerId}/{customerProgramId}/{departmentId}/{projectType}/{projectStatus}/{location}'
						var projectadd = $scope.webserviceshost + 'hr/project';
						var additional = '/update/' + projectid + '/'
								+ projectName + '/' + customerid + '/'
								+ customerprogramcode + '/' + departmentid
								+ '/' + projectType + '/' + projectStatus + '/'
								+ country;
						projectadd = projectadd + additional;
						$http({
							method : "POST",
							url : projectadd,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						})
								.then(
										function mySucces(response) {
											$("#editprojectdata").hide();
											console.log(response.data);

											var allTask = $scope.webserviceshost
													+ 'hr/project/all';
											$("#editprojectdata").hide();
											$http({
												method : "GET",
												url : allTask,
												headers: {
													'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
													'authorization':$window.sessionStorage.getItem("AuthKey")
												}
											})
													.then(
															function mySucces(
																	response) {

																console
																		.log(response.data);

																console
																		.log(response.data);
																if (response != 'undefiend'
																		&& response != "") {

																	$scope.allUsers = response.data;
																	$scope.pageSize = 7;
																	$scope.allItems = $scope.allUsers;
																	$scope.reverse = false;

																	$scope.resetAll = function() {
																		$scope.filteredList = $scope.allItems;
																		$scope.projectId = '';
																		$scope.projectName = '';
																		$scope.customerProgramCode = '';
																		$scope.projectType = '';
																		$scope.projectStatus = '';
																		$scope.searchText = '';
																		$scope.currentPage = 0;
																		$scope.Header = [
																				'',
																				'',
																				'',
																				'',
																				'',
																				'',
																				'' ];
																	}

																	$scope.search = function() {
																		$scope.filteredList = filteredListService
																				.searched(
																						$scope.allItems,
																						$scope.searchText);

																		if ($scope.searchText == '') {
																			$scope.filteredList = $scope.allItems;
																		}
																		$scope
																				.pagination();
																	}

																	// Calculate
																	// Total
																	// Number of
																	// Pages
																	// based on
																	// Search
																	// Result
																	$scope.pagination = function() {
																		$scope.ItemsByPage = filteredListService
																				.paged(
																						$scope.filteredList,
																						$scope.pageSize);
																	};

																	$scope.setPage = function() {
																		$scope.currentPage = this.n;
																	};

																	$scope.firstPage = function() {
																		$scope.currentPage = 0;
																	};

																	$scope.lastPage = function() {
																		$scope.currentPage = $scope.ItemsByPage.length - 1;
																	};

																	$scope.range = function(
																			input,
																			total) {
																		var ret = [];
																		if (!total) {
																			total = input;
																			input = 0;
																		}
																		for (var i = input; i < total; i++) {
																			if (i != 0
																					&& i != total - 1) {
																				ret
																						.push(i);
																			}
																		}
																		return ret;
																	};

																	$scope.sort = function(
																			sortBy) {
																		console
																				.log(sortBy);
																		$scope
																				.resetAll();

																		$scope.columnToOrder = sortBy;

																		// $Filter
																		// -
																		// Standard
																		// Service
																		$scope.filteredList = $filter(
																				'orderBy')
																				(
																						$scope.filteredList,
																						$scope.columnToOrder,
																						$scope.reverse);

																		if ($scope.reverse)
																			iconName = 'glyphicon glyphicon-chevron-up';
																		else
																			iconName = 'glyphicon glyphicon-chevron-down';

																		if (sortBy === 'projectid') {
																			$scope.Header[0] = iconName;
																		} else if (sortBy === 'projectName') {
																			$scope.Header[1] = iconName;
																		} else if (sortBy === 'customerProjectCode') {
																			$scope.Header[2] = iconName;
																		} else if (sortBy === 'projectType') {
																			$scope.Header[3] = iconName;
																		} else if (sortBy === 'projectStatus') {
																			$scope.Header[4] = iconName;
																		} else {
																			$scope.Header[1] = iconName;
																		}

																		$scope.reverse = !$scope.reverse;

																		$scope
																				.pagination();
																	};

																	// By
																	// Default
																	// sort ny
																	// Name
																	$scope
																			.sort('projectName');

																	// console.log($scope.allUsers.length);
																}

															},
															function myError(
																	response) {
																console
																		.log(response);
															});

											swal({
												title : "Project Updated Successfully",
												closeOnConfirm : false,
												closeOnCancel : false
											});

										}, function myError(response) {
											console.log(response);
										});

					}
				})
		.controller(
				'edittaskcontroller',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var allTask = $scope.webserviceshost + 'hr/task/all';

					$('#updatetask').hide();
					$http({
						method : "GET",
						url : allTask,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.taskId = '';
												$scope.TaskName = '';
												$scope.customer = '';
												$scope.department = '';
												$scope.searchText = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '', '', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											// Calculate Total Number of Pages
											// based on Search Result
											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};

											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter - Standard Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'taskId') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'taskName') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'customerName') {
													$scope.Header[2] = iconName;
												} else if (sortBy === 'departmentName') {
													$scope.Header[3] = iconName;
												} else {
													$scope.Header[1] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By Default sort ny Name
											$scope.sort('taskName');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});
					$scope.edittaskDetails = function(item) {
						$('#updatetask').show();

						$scope.taskId = item.taskId;
						$scope.taskName = item.taskName;
						$scope.departmentid = item.department.departmentId;
						$scope.customerid = item.customer.customerId;
						var alldepartmentURL = $scope.webserviceshost
								+ 'hr/department/all';

						var allcustomer = $scope.webserviceshost
								+ 'hr/customer/all';
						$http({
							method : "GET",
							url : alldepartmentURL,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							console.log(response.data);
							if (response != 'undefiend' && response != "") {
								$scope.departments = response.data;
							}
						}, function myError(response) {
							console.log(response);
						});
						$http({
							method : "GET",
							url : allcustomer,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							console.log(response.data);
							if (response != 'undefiend' && response != "") {
								$scope.customers = response.data;
							}
						}, function myError(response) {
							console.log(response);
						});
					}
					$scope.resettaskUpdate = function() {
						$('#updatetask').hide();
					}
					$scope.updatetaskDetails = function() {
						var taskId = $scope.taskId;
						var taskName = $scope.taskName;
						var customerId = $scope.customerid;
						var departmentId = $scope.departmentid;
						var taskUpdate = $scope.webserviceshost + 'hr/task';
						var add = '/update/' + taskId + '/' + taskName + '/'
								+ departmentId + '/' + customerId
						taskUpdate = taskUpdate + add;
						$http({
							method : "POST",
							url : taskUpdate,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						})
								.then(
										function mySucces(response) {
											console.log(response.data);

											var allTask = $scope.webserviceshost
													+ 'hr/task/all';

											$('#updatetask').hide();
											$http({
												method : "GET",
												url : allTask,
												headers: {
													'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
													'authorization':$window.sessionStorage.getItem("AuthKey")
												}
											})
													.then(
															function mySucces(
																	response) {
																console
																		.log(response.data);
																if (response != 'undefiend'
																		&& response != "") {
																	swal({
																		title : "Task Updated Successfully",

																		closeOnConfirm : false,
																		closeOnCancel : false
																	});
																	$scope.allUsers = response.data;
																	$scope.pageSize = 7;
																	$scope.allItems = $scope.allUsers;
																	$scope.reverse = false;

																	$scope.resetAll = function() {
																		$scope.filteredList = $scope.allItems;
																		$scope.taskId = '';
																		$scope.TaskName = '';
																		$scope.customer = '';
																		$scope.department = '';
																		$scope.searchText = '';
																		$scope.currentPage = 0;
																		$scope.Header = [
																				'',
																				'',
																				'',
																				'',
																				'',
																				'',
																				'' ];
																	}

																	$scope.search = function() {
																		$scope.filteredList = filteredListService
																				.searched(
																						$scope.allItems,
																						$scope.searchText);

																		if ($scope.searchText == '') {
																			$scope.filteredList = $scope.allItems;
																		}
																		$scope
																				.pagination();
																	}

																	// Calculate
																	// Total
																	// Number of
																	// Pages
																	// based on
																	// Search
																	// Result
																	$scope.pagination = function() {
																		$scope.ItemsByPage = filteredListService
																				.paged(
																						$scope.filteredList,
																						$scope.pageSize);
																	};

																	$scope.setPage = function() {
																		$scope.currentPage = this.n;
																	};

																	$scope.firstPage = function() {
																		$scope.currentPage = 0;
																	};

																	$scope.lastPage = function() {
																		$scope.currentPage = $scope.ItemsByPage.length - 1;
																	};

																	$scope.range = function(
																			input,
																			total) {
																		var ret = [];
																		if (!total) {
																			total = input;
																			input = 0;
																		}
																		for (var i = input; i < total; i++) {
																			if (i != 0
																					&& i != total - 1) {
																				ret
																						.push(i);
																			}
																		}
																		return ret;
																	};

																	$scope.sort = function(
																			sortBy) {
																		$scope
																				.resetAll();

																		$scope.columnToOrder = sortBy;

																		// $Filter
																		// -
																		// Standard
																		// Service
																		$scope.filteredList = $filter(
																				'orderBy')
																				(
																						$scope.filteredList,
																						$scope.columnToOrder,
																						$scope.reverse);

																		if ($scope.reverse)
																			iconName = 'glyphicon glyphicon-chevron-up';
																		else
																			iconName = 'glyphicon glyphicon-chevron-down';

																		if (sortBy === 'taskId') {
																			$scope.Header[0] = iconName;
																		} else if (sortBy === 'taskName') {
																			$scope.Header[1] = iconName;
																		} else if (sortBy === 'customerName') {
																			$scope.Header[2] = iconName;
																		} else if (sortBy === 'departmentName') {
																			$scope.Header[3] = iconName;
																		} else {
																			$scope.Header[1] = iconName;
																		}

																		$scope.reverse = !$scope.reverse;

																		$scope
																				.pagination();
																	};

																	// By
																	// Default
																	// sort ny
																	// Name
																	$scope
																			.sort('taskName');

																	// console.log($scope.allUsers.length);
																}
															},
															function myError(
																	response) {
																console
																		.log(response);
															});
										}, function myError(response) {
											console.log(response);
										});
					}

				})
		.controller(
				'editRollcontroller',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var getroll = $scope.webserviceshost + 'hr/role/all';
					$('#updateRoleDetails').hide();
					$http({
						method : "GET",
						url : getroll,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.roleId = '';
												$scope.roleName = '';
												$scope.parentRoleName = '';
												$scope.searchText = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '' ];
											}

											$scope.editRoleDetails = function(
													item) {
												$('#updateRoleDetails').show();
												$scope.roleid = item.roleid;
												$scope.roleName = item.roleName;
												if (item.parentRole == 'undefined'
														|| item.parentRole == undefined
														|| item.parentRole == null
														|| item.parentRole == 'null') {
													$scope.parentroleId = {};
												} else {
													$scope.parentroleId = item.parentRole.roleId;
												}
												var getroll = $scope.webserviceshost
														+ 'hr/role/all';

												$http({
													method : "GET",
													url : getroll
												})
														.then(
																function mySucces(
																		response) {
																	console
																			.log(response.data);
																	$scope.rolls = response.data;

																},
																function myError(
																		response) {
																	console
																			.log(response);
																});
											}
											$scope.clearRole = function() {
												$('#updateRoleDetails').hide();
											}
											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											// Calculate Total Number of Pages
											// based on Search Result
											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};

											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter - Standard Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'roleid') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'roleName') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'parentRole') {
													$scope.Header[2] = iconName;
												} else {
													$scope.Header[1] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By Default sort ny Name
											$scope.sort('roleName');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});
					$scope.updateRoleDetailsTable = function() {
						var roleid = $scope.roleid;
						var roleName = $scope.roleName;
						var parentRole = $scope.parentRole;
						var addroll = $scope.webserviceshost + 'hr/role';
						var updaterole = addroll + '/update/' + roleid + '/'
								+ roleName + '/' + parentRole;
						$http({
							method : "POST",
							url : updaterole,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						})
								.then(
										function mySucces(response) {
											var getroller = $scope.webserviceshost
													+ 'hr/role/all';
											$('#updateRoleDetails').hide();
											$http({
												method : "GET",
												url : getroller,
												headers: {
													'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
													'authorization':$window.sessionStorage.getItem("AuthKey")
												}
											})
													.then(
															function mySucces(
																	response) {

																console
																		.log(response.data);
																if (response != 'undefiend') {
																	$(
																			'#updateRoleDetails')
																			.hide();
																	swal({
																		title : "Role Updated Successfully",

																		closeOnConfirm : false,
																		closeOnCancel : false
																	});
																	$scope.newusers = response.data;
																	$scope.pageSize = 7;
																	$scope.allItems = $scope.newusers;
																	$scope.reverse = false;

																	$scope.resetAll = function() {
																		$scope.filteredList = $scope.newusers;
																		$scope.roleId = '';
																		$scope.roleName = '';
																		$scope.parentRoleName = '';
																		$scope.searchText = '';
																		$scope.currentPage = 0;
																		$scope.Header = [
																				'',
																				'',
																				'',
																				'',
																				'' ];
																	}

																	/*
																	 * $scope.editRoleDetails =
																	 * function(
																	 * item) {
																	 * $('#updateRoleDetails').show();
																	 * $scope.roleid =
																	 * item.roleid;
																	 * $scope.roleName =
																	 * item.roleName;
																	 * var
																	 * getroll =
																	 * $scope.webserviceshost +
																	 * 'hr/role/all';
																	 * 
																	 * $http({
																	 * method :
																	 * "GET",
																	 * url :
																	 * getroll
																	 * }).then(function
																	 * mySucces(response) {
																	 * console.log(response.data);
																	 * $scope.rolls =
																	 * response.data; },
																	 * function
																	 * myError(response) {
																	 * console.log(response);
																	 * }); }
																	 */
																	$scope.clearRole = function() {
																		$(
																				'#updateRoleDetails')
																				.hide();
																	}
																	$scope.search = function() {
																		$scope.filteredList = filteredListService
																				.searched(
																						$scope.allItems,
																						$scope.searchText);

																		if ($scope.searchText == '') {
																			$scope.filteredList = $scope.allItems;
																		}
																		$scope
																				.pagination();
																	}

																	// Calculate
																	// Total
																	// Number of
																	// Pages
																	// based on
																	// Search
																	// Result
																	$scope.pagination = function() {
																		$scope.ItemsByPage = filteredListService
																				.paged(
																						$scope.filteredList,
																						$scope.pageSize);
																	};

																	$scope.setPage = function() {
																		$scope.currentPage = this.n;
																	};

																	$scope.firstPage = function() {
																		$scope.currentPage = 0;
																	};

																	$scope.lastPage = function() {
																		$scope.currentPage = $scope.ItemsByPage.length - 1;
																	};

																	$scope.range = function(
																			input,
																			total) {
																		var ret = [];
																		if (!total) {
																			total = input;
																			input = 0;
																		}
																		for (var i = input; i < total; i++) {
																			if (i != 0
																					&& i != total - 1) {
																				ret
																						.push(i);
																			}
																		}
																		return ret;
																	};

																	$scope.sort = function(
																			sortBy) {
																		$scope
																				.resetAll();

																		$scope.columnToOrder = sortBy;

																		// $Filter
																		// -
																		// Standard
																		// Service
																		$scope.filteredList = $filter(
																				'orderBy')
																				(
																						$scope.filteredList,
																						$scope.columnToOrder,
																						$scope.reverse);

																		if ($scope.reverse)
																			iconName = 'glyphicon glyphicon-chevron-up';
																		else
																			iconName = 'glyphicon glyphicon-chevron-down';

																		if (sortBy === 'roleid') {
																			$scope.Header[0] = iconName;
																		} else if (sortBy === 'roleName') {
																			$scope.Header[1] = iconName;
																		} else if (sortBy === 'parentRole') {
																			$scope.Header[2] = iconName;
																		} else {
																			$scope.Header[1] = iconName;
																		}

																		$scope.reverse = !$scope.reverse;

																		$scope
																				.pagination();
																	};

																	// By
																	// Default
																	// sort ny
																	// Name
																	$scope
																			.sort('roleName');

																	// console.log($scope.allUsers.length);
																}
															},
															function myError(
																	response) {
																console
																		.log(response);
															});
											$scope.updateRoleDetails = function() {
												var roleid = $scope.roleid;
												var roleName = $scope.roleName;
												var parentRole = $scope.parentRole;
												var addroll = $scope.webserviceshost
														+ 'hr/role';
												var updaterole = addroll
														+ '/update/' + roleid
														+ '/' + roleName + '/'
														+ parentRole;
												$http({
													method : "POST",
													url : updaterole,
													headers: {
														'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
														'authorization':$window.sessionStorage.getItem("AuthKey")
													}
												})
														.then(
																function mySucces(
																		response) {
																	console
																			.log(response.data);
																	var getroll = $scope.webserviceshost
																			+ 'hr/role/all';

																	$http(
																			{
																				method : "GET",
																				url : getroll,
																				headers: {
																					'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																					'authorization':$window.sessionStorage.getItem("AuthKey")
																				}
																			})
																			.then(
																					function mySucces(
																							response) {
																						console
																								.log(response.data);
																						$scope.rolls = response.data;
																					},
																					function myError(
																							response) {
																						console
																								.log(response);
																					});
																},
																function myError(
																		response) {
																	console
																			.log(response);
																});
											}

										}, function myError(response) {
											console.log(response);
										});
					}

				})

		.controller('addrollcontroller', function($scope, $filter, $http,$window,$location) {
			if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
			    $location.path('/login');
			}
			var getroll = $scope.webserviceshost + 'hr/role/all';

			$http({
				method : "GET",
				url : getroll,
				headers: {
					'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
					'authorization':$window.sessionStorage.getItem("AuthKey")
				}
			}).then(function mySucces(response) {
				console.log(response.data);
				$scope.rolls = response.data;
			}, function myError(response) {
				console.log(response);
			});
			$scope.addroll = function() {
				var roleName = $scope.roleName;
				var parentRollId = $scope.parentroleId;
				if (parentRollId == 'undefined' || parentRollId == undefined)
					parentRollId = null;
				var addroll = $scope.webserviceshost + 'hr/role';
				var createRoll = '/create/' + roleName + '/' + parentRollId;
				addroll = addroll + createRoll;
				$http({
					method : "POST",
					url : addroll,
					headers: {
						'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
						'authorization':$window.sessionStorage.getItem("AuthKey")
					}
				}).then(function mySucces(response) {
					console.log(response.data);
					$scope.rolls = response.data;
					swal({
						title : "Role Added Successfully",

						closeOnConfirm : false,
						closeOnCancel : false
					});
					$scope.roleName = '';
					$scope.parentroleId = {};
				}, function myError(response) {
					console.log(response);
				});
			}
			$scope.clearRole = function() {
				$scope.parentroleId = '';
				$scope.roleName = '';
			}
		})

		.controller(
				'editdepartmentcontroller',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					$('#departmentupdatedetails').hide();
					var allusersURL = $scope.webserviceshost
							+ 'hr/department/all';
					$http({
						method : "GET",
						url : allusersURL,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.departmentId = '';
												$scope.dpartmentName = '';
												$scope.parentDepartment = '';
												$scope.manager = '';
												$scope.searchText = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											// Calculate Total Number of Pages
											// based on Search Result
											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};

											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter - Standard Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'depratmentId') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'departmentName') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'parentDepartment') {
													$scope.Header[2] = iconName;
												} else if (sortBy === 'manager') {
													$scope.Header[3] = iconName;
												} else {
													$scope.Header[1] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By Default sort ny Name
											$scope.sort('name');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});

					$scope.editdepartmentDetails = function(item) {
						$('#departmentupdatedetails').show();
						$scope.departmentid = item.departmentId;
						$scope.departmentName = item.departmentName;
						if (item.manager == 'undefined'
								|| item.manager == undefined
								|| item.manager == null
								|| item.manager == 'null') {
							$scope.managerId = {};
						} else {
							$scope.managerId = item.manager.employeeId;
						}
						if (item.parentDepartment == 'undefined'
								|| item.parentDepartment == undefined
								|| item.parentDepartment == null
								|| item.parentDepartment == 'null') {
							$scope.parentDepartment = {};
						} else {
							$scope.parentDepartment = item.parentDepartment.departmentId;
						}

						var allusersURL = $scope.webserviceshost
								+ 'hr/department/all';
						$http({
							method : "GET",
							url : allusersURL,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							$scope.departments = response.data;

						}, function myError(response) {
							console.log(response);
						});
						var allManager = $scope.webserviceshost
								+ 'hr/employee/managers';
						$http({
							method : "GET",
							url : allManager,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							$scope.managersList = response.data;
						}, function myError(response) {
							console.log(response);
						});
						$scope.resetupdateDepartment = function() {
							$('#departmentupdatedetails').hide();
						}
						$scope.savedepartmentUpdate = function() {
							var departmentid = $scope.departmentid;
							var departmentName = $scope.departmentName;
							var parentDepartmentId = $scope.parentDepartment;
							var managerId = $scope.managerId;
							var addDepartment = $scope.webserviceshost
									+ "hr/department";
							var additional = '/update/' + departmentid + '/'
									+ departmentName + '/' + parentDepartmentId
									+ '/' + managerId;
							addDepartment = addDepartment + additional;
							$http({
								method : "POST",
								url : addDepartment,
								headers: {
									'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
									'authorization':$window.sessionStorage.getItem("AuthKey")
								}
							})
									.then(
											function mySucces(response) {
												console.log(response.data);
												$scope.departments = response.data;

												$('#departmentupdatedetails')
														.hide();
												var allusersURL = $scope.webserviceshost
														+ 'hr/department/all';
												$http({
													method : "GET",
													url : allusersURL,
													headers: {
														'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
														'authorization':$window.sessionStorage.getItem("AuthKey")
													}
												})
														.then(
																function mySucces(
																		response) {
																	console
																			.log(response.data);
																	if (response != 'undefiend'
																			&& response != "") {
																		swal({
																			title : "Department Updated Successfully",

																			closeOnConfirm : false,
																			closeOnCancel : false
																		});

																		$scope.allUsers = response.data;
																		$scope.pageSize = 7;
																		$scope.allItems = $scope.allUsers;
																		$scope.reverse = false;

																		$scope.resetAll = function() {
																			$scope.filteredList = $scope.allItems;
																			$scope.departmentId = '';
																			$scope.dpartmentName = '';
																			$scope.parentDepartment = '';
																			$scope.manager = '';
																			$scope.searchText = '';
																			$scope.currentPage = 0;
																			$scope.Header = [
																					'',
																					'',
																					'',
																					'',
																					'' ];
																		}

																		$scope.search = function() {
																			$scope.filteredList = filteredListService
																					.searched(
																							$scope.allItems,
																							$scope.searchText);

																			if ($scope.searchText == '') {
																				$scope.filteredList = $scope.allItems;
																			}
																			$scope
																					.pagination();
																		}

																		// Calculate
																		// Total
																		// Number
																		// of
																		// Pages
																		// based
																		// on
																		// Search
																		// Result
																		$scope.pagination = function() {
																			$scope.ItemsByPage = filteredListService
																					.paged(
																							$scope.filteredList,
																							$scope.pageSize);
																		};

																		$scope.setPage = function() {
																			$scope.currentPage = this.n;
																		};

																		$scope.firstPage = function() {
																			$scope.currentPage = 0;
																		};

																		$scope.lastPage = function() {
																			$scope.currentPage = $scope.ItemsByPage.length - 1;
																		};

																		$scope.range = function(
																				input,
																				total) {
																			var ret = [];
																			if (!total) {
																				total = input;
																				input = 0;
																			}
																			for (var i = input; i < total; i++) {
																				if (i != 0
																						&& i != total - 1) {
																					ret
																							.push(i);
																				}
																			}
																			return ret;
																		};

																		$scope.sort = function(
																				sortBy) {
																			$scope
																					.resetAll();

																			$scope.columnToOrder = sortBy;

																			// $Filter
																			// -
																			// Standard
																			// Service
																			$scope.filteredList = $filter(
																					'orderBy')
																					(
																							$scope.filteredList,
																							$scope.columnToOrder,
																							$scope.reverse);

																			if ($scope.reverse)
																				iconName = 'glyphicon glyphicon-chevron-up';
																			else
																				iconName = 'glyphicon glyphicon-chevron-down';

																			if (sortBy === 'depratmentId') {
																				$scope.Header[0] = iconName;
																			} else if (sortBy === 'departmentName') {
																				$scope.Header[1] = iconName;
																			} else if (sortBy === 'parentDepartment') {
																				$scope.Header[2] = iconName;
																			} else if (sortBy === 'manager') {
																				$scope.Header[3] = iconName;
																			} else {
																				$scope.Header[1] = iconName;
																			}

																			$scope.reverse = !$scope.reverse;

																			$scope
																					.pagination();
																		};

																		// By
																		// Default
																		// sort
																		// ny
																		// Name
																		$scope
																				.sort('name');

																		// console.log($scope.allUsers.length);
																	}
																},
																function myError(
																		response) {
																	console
																			.log(response);
																});

												if (response == 200) {
													console.log("success")
												}
											}, function myError(response) {
												console.log(response);
											});
						}
					}

				})
		.controller(
				'allManagerCTRL',
				function($scope, $filter, $sce, ngTableParams, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}

					$scope.today = function() {
						$scope.dt = new Date();
					};
					$scope.today();

					$scope.myDate = new Date();

					$scope.toggleMin = function() {
						$scope.minDate = new Date($scope.myDate.getFullYear(),
								$scope.myDate.getMonth() - 11, $scope.myDate
										.getDate());

					};
					$scope.toggleMin();

					$scope.open = function($event, opened) {
						$event.preventDefault();
						$event.stopPropagation();

						$scope[opened] = true;
					};

					$scope.dateOptions = {
						formatYear : 'yy',
						startingDay : 1
					};

					$scope.formats = [ 'dd-MMMM-yyyy', 'yyyy-MM-dd',
							'dd.MM.yyyy', 'shortDate' ];
					$scope.format = $scope.formats[1];

					$scope.statusVal = [ {
						name : 'Active',
						value : 'active'
					}, {
						name : 'Inactive',
						shade : 'inactive'
					} ];
					var roles = $scope.webserviceshost + 'hr/role/all';
					var departments = $scope.webserviceshost
							+ 'hr/department/all';
					var managers = $scope.webserviceshost
							+ 'hr/employee/managers';
					var roll = $scope.webserviceshost + 'hr/role/all';

					var refrenceData = $scope.webserviceshost
							+ 'hr/refData/list';

					$http({
						method : "GET",
						url : roles,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						console.log(response.data);
						if (response != 'undefiend' && response != "") {
							$scope.rolesdata = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : departments,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						console.log(response.data);
						if (response != 'undefiend' && response != "") {
							$scope.departments = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : managers,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						console.log(response.data);
						if (response != 'undefiend' && response != "") {
							$scope.managers = response.data;
						}
					}, function myError(response) {
						console.log(response);
					});

					$scope.addnewUser = function() {
						/*
						 * create/{firstName}/{lastName}/{emailId}/{loginId}/{loginPassword}/" +
						 * "{managerId}/{address}/{designation}/{employeeType}/{departmentId}/{employementStatus}
						 * 
						 */
						var year = $scope.dtPopup.getFullYear();
						var month = $scope.dtPopup.getMonth();
						if (month.toString().length == 1) {
							month = '0' + month;
						}
						var day = $scope.dtPopup.getDay();
						if (day.toString().length == 1) {
							day = '0' + day;
						}
						var date = year + '-' + month + '-' + day;
						var firstName = $scope.firstName;
						var lastName = $scope.lastName;
						var emailId = $scope.emailId;
						var loginId = $scope.loginId;
						var loginPassword = $scope.loginPassword;
						var managerId = $scope.managerId;
						var address = $scope.address;
						var roleid = $scope.role;
						var designation=$scope.designation;
						var employeeType = $scope.employeeType;
						var userdepartmentId = $scope.userDepartmentId;
						var employeeStatus = $scope.employeeStatus;
						var createEmployee = $scope.webserviceshost
								+ 'hr/employee/create/';
						var addition = firstName + '/' + lastName + '/'
								+ emailId + '/' + loginId + '/' + loginPassword
								+ '/' + managerId + '/' + address + '/'
								+ designation + '/' + employeeType + '/'
								+ userdepartmentId + '/' + employeeStatus + '/'
								+ date+'/'+roleid;
						createEmployee = createEmployee + addition;
						$http({
							method : "POST",
							url : createEmployee,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							console.log(response.data);
							$scope.rolls = response.data;
							swal({
								title : "Employee Added Successfully",

								closeOnConfirm : false,
								closeOnCancel : false
							});
							$scope.employeeId = '';
							$scope.firstName = '';
							$scope.lastName = '';
							$scope.emailId = '';
							$scope.loginId = '';
							$scope.loginPassword = '';
							$scope.managerId = '';
							$scope.address = '';
							$scope.roleid='';
							$scope.designation = '';
							$scope.employeeType = {};
							$scope.userDepartmentId = {};
							$scope.dtPopup = {};
							$scope.employeeStatus = {};
						}, function myError(response) {
							console.log(response);
						});
					}
				})
		.controller(
				'adddepartmentcontroller',
				function($scope, $filter, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}

					var departmentcontroller = $scope.webserviceshost
							+ 'hr/department/all';
					var managersdata = $scope.webserviceshost
							+ 'hr/employee/managers';

					$http({
						method : "GET",
						url : departmentcontroller,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					}).then(function mySucces(response) {
						console.log(response.data);
						$scope.departments = response.data;

						if (response == 200) {
							console.log("success")
						}
					}, function myError(response) {
						console.log(response);
					});
					$http({
						method : "GET",
						url : managersdata
					}).then(function mySucces(response) {
						console.log(response.data);

						$scope.managers = response.data;

						if (response == 200) {
							console.log("success")
						}
					}, function myError(response) {
						console.log(response);
					});

					$scope.creatDepartment = function() {
						var parentDepartmentId = $scope.parentDepartment;
						var departmentName = $scope.departmentName;
						var managerId = $scope.managerId;
						var addDepartment = $scope.webserviceshost
								+ "hr/department";
						var additional = '/create/' + departmentName + '/'
								+ parentDepartmentId + '/' + managerId;
						addDepartment = addDepartment + additional;
						$http({
							method : "POST",
							url : addDepartment,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							console.log(response.data);
							swal({
								title : "Department Added Successfully",

								closeOnConfirm : false,
								closeOnCancel : false
							});
							$scope.parentDepartment = {};
							$scope.departmentName = '';
							$scope.managerId = {};
							if (response == 200) {
								console.log("success")
							}
						}, function myError(response) {
							console.log(response);
						});
					}

				})
		.controller(
				'editcustomercontroller',
				function($scope, $filter, filteredListService, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					$('#updateCustomerData').hide();
					var allcustomer = $scope.webserviceshost
							+ 'hr/customer/all';
					$http({
						method : "GET",
						url : allcustomer,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										$scope.allCoustomer = response.data;
										$scope.pageSize = 7;
										$scope.allItems = $scope.allCoustomer;
										$scope.reverse = false;

										$scope.resetAll = function() {
											$scope.filteredList = $scope.allItems;
											$scope.customerId = '';
											$scope.address = '';
											$scope.country = '';
											$scope.customerName = '';
											$scope.zipCode = ''
											$scope.searchText = '';
											$scope.currentPage = 0;
											$scope.Header = [ '', '', '', '',
													'', '', '' ];
										}

										$scope.search = function() {
											$scope.filteredList = filteredListService
													.searched($scope.allItems,
															$scope.searchText);

											if ($scope.searchText == '') {
												$scope.filteredList = $scope.allItems;
											}
											$scope.pagination();
										}
										$scope.editcustomerdetails = function(
												item) {
											$('#updateCustomerData').show();
											console.log(item);

											$scope.customerID = item.customerId;
											$scope.customerNAME = item.customerName;
											$scope.customerAddress = item.address;
											$scope.countryname = item.country;
											$scope.customerZipCode = item.zipCode;

											$scope.name = 'World';

											$scope.countries = [
													{
														name : 'Afghanistan',
														code : 'AF'
													},
													{
														name : 'Åland Islands',
														code : 'AX'
													},
													{
														name : 'Albania',
														code : 'AL'
													},
													{
														name : 'Algeria',
														code : 'DZ'
													},
													{
														name : 'American Samoa',
														code : 'AS'
													},
													{
														name : 'Andorra',
														code : 'AD'
													},
													{
														name : 'Angola',
														code : 'AO'
													},
													{
														name : 'Anguilla',
														code : 'AI'
													},
													{
														name : 'Antarctica',
														code : 'AQ'
													},
													{
														name : 'Antigua and Barbuda',
														code : 'AG'
													},
													{
														name : 'Argentina',
														code : 'AR'
													},
													{
														name : 'Armenia',
														code : 'AM'
													},
													{
														name : 'Aruba',
														code : 'AW'
													},
													{
														name : 'Australia',
														code : 'AU'
													},
													{
														name : 'Austria',
														code : 'AT'
													},
													{
														name : 'Azerbaijan',
														code : 'AZ'
													},
													{
														name : 'Bahamas',
														code : 'BS'
													},
													{
														name : 'Bahrain',
														code : 'BH'
													},
													{
														name : 'Bangladesh',
														code : 'BD'
													},
													{
														name : 'Barbados',
														code : 'BB'
													},
													{
														name : 'Belarus',
														code : 'BY'
													},
													{
														name : 'Belgium',
														code : 'BE'
													},
													{
														name : 'Belize',
														code : 'BZ'
													},
													{
														name : 'Benin',
														code : 'BJ'
													},
													{
														name : 'Bermuda',
														code : 'BM'
													},
													{
														name : 'Bhutan',
														code : 'BT'
													},
													{
														name : 'Bolivia',
														code : 'BO'
													},
													{
														name : 'Bosnia and Herzegovina',
														code : 'BA'
													},
													{
														name : 'Botswana',
														code : 'BW'
													},
													{
														name : 'Bouvet Island',
														code : 'BV'
													},
													{
														name : 'Brazil',
														code : 'BR'
													},
													{
														name : 'British Indian Ocean Territory',
														code : 'IO'
													},
													{
														name : 'Brunei Darussalam',
														code : 'BN'
													},
													{
														name : 'Bulgaria',
														code : 'BG'
													},
													{
														name : 'Burkina Faso',
														code : 'BF'
													},
													{
														name : 'Burundi',
														code : 'BI'
													},
													{
														name : 'Cambodia',
														code : 'KH'
													},
													{
														name : 'Cameroon',
														code : 'CM'
													},
													{
														name : 'Canada',
														code : 'CA'
													},
													{
														name : 'Cape Verde',
														code : 'CV'
													},
													{
														name : 'Cayman Islands',
														code : 'KY'
													},
													{
														name : 'Central African Republic',
														code : 'CF'
													},
													{
														name : 'Chad',
														code : 'TD'
													},
													{
														name : 'Chile',
														code : 'CL'
													},
													{
														name : 'China',
														code : 'CN'
													},
													{
														name : 'Christmas Island',
														code : 'CX'
													},
													{
														name : 'Cocos (Keeling) Islands',
														code : 'CC'
													},
													{
														name : 'Colombia',
														code : 'CO'
													},
													{
														name : 'Comoros',
														code : 'KM'
													},
													{
														name : 'Congo',
														code : 'CG'
													},
													{
														name : 'Congo, The Democratic Republic of the',
														code : 'CD'
													},
													{
														name : 'Cook Islands',
														code : 'CK'
													},
													{
														name : 'Costa Rica',
														code : 'CR'
													},
													{
														name : 'Cote D\'Ivoire',
														code : 'CI'
													},
													{
														name : 'Croatia',
														code : 'HR'
													},
													{
														name : 'Cuba',
														code : 'CU'
													},
													{
														name : 'Cyprus',
														code : 'CY'
													},
													{
														name : 'Czech Republic',
														code : 'CZ'
													},
													{
														name : 'Denmark',
														code : 'DK'
													},
													{
														name : 'Djibouti',
														code : 'DJ'
													},
													{
														name : 'Dominica',
														code : 'DM'
													},
													{
														name : 'Dominican Republic',
														code : 'DO'
													},
													{
														name : 'Ecuador',
														code : 'EC'
													},
													{
														name : 'Egypt',
														code : 'EG'
													},
													{
														name : 'El Salvador',
														code : 'SV'
													},
													{
														name : 'Equatorial Guinea',
														code : 'GQ'
													},
													{
														name : 'Eritrea',
														code : 'ER'
													},
													{
														name : 'Estonia',
														code : 'EE'
													},
													{
														name : 'Ethiopia',
														code : 'ET'
													},
													{
														name : 'Falkland Islands (Malvinas)',
														code : 'FK'
													},
													{
														name : 'Faroe Islands',
														code : 'FO'
													},
													{
														name : 'Fiji',
														code : 'FJ'
													},
													{
														name : 'Finland',
														code : 'FI'
													},
													{
														name : 'France',
														code : 'FR'
													},
													{
														name : 'French Guiana',
														code : 'GF'
													},
													{
														name : 'French Polynesia',
														code : 'PF'
													},
													{
														name : 'French Southern Territories',
														code : 'TF'
													},
													{
														name : 'Gabon',
														code : 'GA'
													},
													{
														name : 'Gambia',
														code : 'GM'
													},
													{
														name : 'Georgia',
														code : 'GE'
													},
													{
														name : 'Germany',
														code : 'DE'
													},
													{
														name : 'Ghana',
														code : 'GH'
													},
													{
														name : 'Gibraltar',
														code : 'GI'
													},
													{
														name : 'Greece',
														code : 'GR'
													},
													{
														name : 'Greenland',
														code : 'GL'
													},
													{
														name : 'Grenada',
														code : 'GD'
													},
													{
														name : 'Guadeloupe',
														code : 'GP'
													},
													{
														name : 'Guam',
														code : 'GU'
													},
													{
														name : 'Guatemala',
														code : 'GT'
													},
													{
														name : 'Guernsey',
														code : 'GG'
													},
													{
														name : 'Guinea',
														code : 'GN'
													},
													{
														name : 'Guinea-Bissau',
														code : 'GW'
													},
													{
														name : 'Guyana',
														code : 'GY'
													},
													{
														name : 'Haiti',
														code : 'HT'
													},
													{
														name : 'Heard Island and Mcdonald Islands',
														code : 'HM'
													},
													{
														name : 'Holy See (Vatican City State)',
														code : 'VA'
													},
													{
														name : 'Honduras',
														code : 'HN'
													},
													{
														name : 'Hong Kong',
														code : 'HK'
													},
													{
														name : 'Hungary',
														code : 'HU'
													},
													{
														name : 'Iceland',
														code : 'IS'
													},
													{
														name : 'India',
														code : 'IN'
													},
													{
														name : 'Indonesia',
														code : 'ID'
													},
													{
														name : 'Iran, Islamic Republic Of',
														code : 'IR'
													},
													{
														name : 'Iraq',
														code : 'IQ'
													},
													{
														name : 'Ireland',
														code : 'IE'
													},
													{
														name : 'Isle of Man',
														code : 'IM'
													},
													{
														name : 'Israel',
														code : 'IL'
													},
													{
														name : 'Italy',
														code : 'IT'
													},
													{
														name : 'Jamaica',
														code : 'JM'
													},
													{
														name : 'Japan',
														code : 'JP'
													},
													{
														name : 'Jersey',
														code : 'JE'
													},
													{
														name : 'Jordan',
														code : 'JO'
													},
													{
														name : 'Kazakhstan',
														code : 'KZ'
													},
													{
														name : 'Kenya',
														code : 'KE'
													},
													{
														name : 'Kiribati',
														code : 'KI'
													},
													{
														name : 'Korea, Democratic People\'s Republic of',
														code : 'KP'
													},
													{
														name : 'Korea, Republic of',
														code : 'KR'
													},
													{
														name : 'Kuwait',
														code : 'KW'
													},
													{
														name : 'Kyrgyzstan',
														code : 'KG'
													},
													{
														name : 'Lao People\'s Democratic Republic',
														code : 'LA'
													},
													{
														name : 'Latvia',
														code : 'LV'
													},
													{
														name : 'Lebanon',
														code : 'LB'
													},
													{
														name : 'Lesotho',
														code : 'LS'
													},
													{
														name : 'Liberia',
														code : 'LR'
													},
													{
														name : 'Libyan Arab Jamahiriya',
														code : 'LY'
													},
													{
														name : 'Liechtenstein',
														code : 'LI'
													},
													{
														name : 'Lithuania',
														code : 'LT'
													},
													{
														name : 'Luxembourg',
														code : 'LU'
													},
													{
														name : 'Macao',
														code : 'MO'
													},
													{
														name : 'Macedonia, The Former Yugoslav Republic of',
														code : 'MK'
													},
													{
														name : 'Madagascar',
														code : 'MG'
													},
													{
														name : 'Malawi',
														code : 'MW'
													},
													{
														name : 'Malaysia',
														code : 'MY'
													},
													{
														name : 'Maldives',
														code : 'MV'
													},
													{
														name : 'Mali',
														code : 'ML'
													},
													{
														name : 'Malta',
														code : 'MT'
													},
													{
														name : 'Marshall Islands',
														code : 'MH'
													},
													{
														name : 'Martinique',
														code : 'MQ'
													},
													{
														name : 'Mauritania',
														code : 'MR'
													},
													{
														name : 'Mauritius',
														code : 'MU'
													},
													{
														name : 'Mayotte',
														code : 'YT'
													},
													{
														name : 'Mexico',
														code : 'MX'
													},
													{
														name : 'Micronesia, Federated States of',
														code : 'FM'
													},
													{
														name : 'Moldova, Republic of',
														code : 'MD'
													},
													{
														name : 'Monaco',
														code : 'MC'
													},
													{
														name : 'Mongolia',
														code : 'MN'
													},
													{
														name : 'Montserrat',
														code : 'MS'
													},
													{
														name : 'Morocco',
														code : 'MA'
													},
													{
														name : 'Mozambique',
														code : 'MZ'
													},
													{
														name : 'Myanmar',
														code : 'MM'
													},
													{
														name : 'Namibia',
														code : 'NA'
													},
													{
														name : 'Nauru',
														code : 'NR'
													},
													{
														name : 'Nepal',
														code : 'NP'
													},
													{
														name : 'Netherlands',
														code : 'NL'
													},
													{
														name : 'Netherlands Antilles',
														code : 'AN'
													},
													{
														name : 'New Caledonia',
														code : 'NC'
													},
													{
														name : 'New Zealand',
														code : 'NZ'
													},
													{
														name : 'Nicaragua',
														code : 'NI'
													},
													{
														name : 'Niger',
														code : 'NE'
													},
													{
														name : 'Nigeria',
														code : 'NG'
													},
													{
														name : 'Niue',
														code : 'NU'
													},
													{
														name : 'Norfolk Island',
														code : 'NF'
													},
													{
														name : 'Northern Mariana Islands',
														code : 'MP'
													},
													{
														name : 'Norway',
														code : 'NO'
													},
													{
														name : 'Oman',
														code : 'OM'
													},
													{
														name : 'Pakistan',
														code : 'PK'
													},
													{
														name : 'Palau',
														code : 'PW'
													},
													{
														name : 'Palestinian Territory, Occupied',
														code : 'PS'
													},
													{
														name : 'Panama',
														code : 'PA'
													},
													{
														name : 'Papua New Guinea',
														code : 'PG'
													},
													{
														name : 'Paraguay',
														code : 'PY'
													},
													{
														name : 'Peru',
														code : 'PE'
													},
													{
														name : 'Philippines',
														code : 'PH'
													},
													{
														name : 'Pitcairn',
														code : 'PN'
													},
													{
														name : 'Poland',
														code : 'PL'
													},
													{
														name : 'Portugal',
														code : 'PT'
													},
													{
														name : 'Puerto Rico',
														code : 'PR'
													},
													{
														name : 'Qatar',
														code : 'QA'
													},
													{
														name : 'Reunion',
														code : 'RE'
													},
													{
														name : 'Romania',
														code : 'RO'
													},
													{
														name : 'Russian Federation',
														code : 'RU'
													},
													{
														name : 'Rwanda',
														code : 'RW'
													},
													{
														name : 'Saint Helena',
														code : 'SH'
													},
													{
														name : 'Saint Kitts and Nevis',
														code : 'KN'
													},
													{
														name : 'Saint Lucia',
														code : 'LC'
													},
													{
														name : 'Saint Pierre and Miquelon',
														code : 'PM'
													},
													{
														name : 'Saint Vincent and the Grenadines',
														code : 'VC'
													},
													{
														name : 'Samoa',
														code : 'WS'
													},
													{
														name : 'San Marino',
														code : 'SM'
													},
													{
														name : 'Sao Tome and Principe',
														code : 'ST'
													},
													{
														name : 'Saudi Arabia',
														code : 'SA'
													},
													{
														name : 'Senegal',
														code : 'SN'
													},
													{
														name : 'Serbia and Montenegro',
														code : 'CS'
													},
													{
														name : 'Seychelles',
														code : 'SC'
													},
													{
														name : 'Sierra Leone',
														code : 'SL'
													},
													{
														name : 'Singapore',
														code : 'SG'
													},
													{
														name : 'Slovakia',
														code : 'SK'
													},
													{
														name : 'Slovenia',
														code : 'SI'
													},
													{
														name : 'Solomon Islands',
														code : 'SB'
													},
													{
														name : 'Somalia',
														code : 'SO'
													},
													{
														name : 'South Africa',
														code : 'ZA'
													},
													{
														name : 'South Georgia and the South Sandwich Islands',
														code : 'GS'
													},
													{
														name : 'Spain',
														code : 'ES'
													},
													{
														name : 'Sri Lanka',
														code : 'LK'
													},
													{
														name : 'Sudan',
														code : 'SD'
													},
													{
														name : 'Suriname',
														code : 'SR'
													},
													{
														name : 'Svalbard and Jan Mayen',
														code : 'SJ'
													},
													{
														name : 'Swaziland',
														code : 'SZ'
													},
													{
														name : 'Sweden',
														code : 'SE'
													},
													{
														name : 'Switzerland',
														code : 'CH'
													},
													{
														name : 'Syrian Arab Republic',
														code : 'SY'
													},
													{
														name : 'Taiwan, Province of China',
														code : 'TW'
													},
													{
														name : 'Tajikistan',
														code : 'TJ'
													},
													{
														name : 'Tanzania, United Republic of',
														code : 'TZ'
													},
													{
														name : 'Thailand',
														code : 'TH'
													},
													{
														name : 'Timor-Leste',
														code : 'TL'
													},
													{
														name : 'Togo',
														code : 'TG'
													},
													{
														name : 'Tokelau',
														code : 'TK'
													},
													{
														name : 'Tonga',
														code : 'TO'
													},
													{
														name : 'Trinidad and Tobago',
														code : 'TT'
													},
													{
														name : 'Tunisia',
														code : 'TN'
													},
													{
														name : 'Turkey',
														code : 'TR'
													},
													{
														name : 'Turkmenistan',
														code : 'TM'
													},
													{
														name : 'Turks and Caicos Islands',
														code : 'TC'
													},
													{
														name : 'Tuvalu',
														code : 'TV'
													},
													{
														name : 'Uganda',
														code : 'UG'
													},
													{
														name : 'Ukraine',
														code : 'UA'
													},
													{
														name : 'United Arab Emirates',
														code : 'AE'
													},
													{
														name : 'United Kingdom',
														code : 'GB'
													},
													{
														name : 'United States',
														code : 'US'
													},
													{
														name : 'United States Minor Outlying Islands',
														code : 'UM'
													},
													{
														name : 'Uruguay',
														code : 'UY'
													},
													{
														name : 'Uzbekistan',
														code : 'UZ'
													},
													{
														name : 'Vanuatu',
														code : 'VU'
													},
													{
														name : 'Venezuela',
														code : 'VE'
													},
													{
														name : 'Vietnam',
														code : 'VN'
													},
													{
														name : 'Virgin Islands, British',
														code : 'VG'
													},
													{
														name : 'Virgin Islands, U.S.',
														code : 'VI'
													},
													{
														name : 'Wallis and Futuna',
														code : 'WF'
													},
													{
														name : 'Western Sahara',
														code : 'EH'
													}, {
														name : 'Yemen',
														code : 'YE'
													}, {
														name : 'Zambia',
														code : 'ZM'
													}, {
														name : 'Zimbabwe',
														code : 'ZW'
													} ];

										}
										$scope.resetCustomerUpdate = function() {
											$('#updateCustomerData').hide();
										}
										$scope.updateCustomerDetails = function() {
											/* /update/{customerId}/{customerName}/{address}/{country}/{zipCode} */
											var updatecustomer = $scope.webserviceshost
													+ 'hr/customer/';

											var customerId = $scope.customerID;
											var customerName = $scope.customerNAME;
											var address = $scope.customerAddress;
											var country = $scope.countryname;
											var zipCode = $scope.customerZipCode;

											updatecustomer = updatecustomer
													+ '/update/' + customerId
													+ '/' + customerName + '/'
													+ address + '/' + country
													+ '/' + zipCode;
											$http({
												method : "POST",
												url : updatecustomer,
												headers: {
													'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
													'authorization':$window.sessionStorage.getItem("AuthKey")
												}
											})
													.then(
															function mySucces(
																	response) {
																$http(
																		{
																			method : "GET",
																			url : allcustomer,
																			headers: {
																				'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																				'authorization':$window.sessionStorage.getItem("AuthKey")
																			}
																		})
																		.then(
																				function mySucces(
																						response) {
																					$(
																							'#updateCustomerData')
																							.hide();
																					$scope.allCoustomer = response.data;
																					$scope.pageSize = 7;
																					$scope.allItems = $scope.allCoustomer;
																					$scope.reverse = false;

																					$scope.resetAll = function() {
																						$scope.filteredList = $scope.allItems;
																						$scope.customerId = '';
																						$scope.address = '';
																						$scope.country = '';
																						$scope.customerName = '';
																						$scope.zipCode = ''
																						$scope.searchText = '';
																						$scope.currentPage = 0;
																						$scope.Header = [
																								'',
																								'',
																								'',
																								'',
																								'',
																								'',
																								'' ];
																					}

																					$scope.search = function() {
																						$scope.filteredList = filteredListService
																								.searched(
																										$scope.allItems,
																										$scope.searchText);

																						if ($scope.searchText == '') {
																							$scope.filteredList = $scope.allItems;
																						}
																						$scope
																								.pagination();
																					}
																					$scope.pagination = function() {
																						$scope.ItemsByPage = filteredListService
																								.paged(
																										$scope.filteredList,
																										$scope.pageSize);
																					};

																					$scope.setPage = function() {
																						$scope.currentPage = this.n;
																					};

																					$scope.firstPage = function() {
																						$scope.currentPage = 0;
																					};

																					$scope.lastPage = function() {
																						$scope.currentPage = $scope.ItemsByPage.length - 1;
																					};

																					$scope.range = function(
																							input,
																							total) {
																						var ret = [];
																						if (!total) {
																							total = input;
																							input = 0;
																						}
																						for (var i = input; i < total; i++) {
																							if (i != 0
																									&& i != total - 1) {
																								ret
																										.push(i);
																							}
																						}
																						return ret;
																					};

																					$scope.sort = function(
																							sortBy) {
																						$scope
																								.resetAll();

																						$scope.columnToOrder = sortBy;

																						// $Filter
																						// -
																						// Standard
																						// Service
																						$scope.filteredList = $filter(
																								'orderBy')
																								(
																										$scope.filteredList,
																										$scope.columnToOrder,
																										$scope.reverse);

																						if ($scope.reverse)
																							iconName = 'glyphicon glyphicon-chevron-up';
																						else
																							iconName = 'glyphicon glyphicon-chevron-down';

																						if (sortBy === 'customerId') {
																							$scope.Header[0] = iconName;
																						} else if (sortBy === 'customerName') {
																							$scope.Header[1] = iconName;
																						} else if (sortBy === 'zipCode') {
																							$scope.Header[2] = iconName;
																						} else if (sortBy === 'country') {
																							$scope.Header[3] = iconName;
																						} else if (sortBy === 'address') {
																							$scope.Header[4] = iconName;
																						} else {
																							$scope.Header[1] = iconName;
																						}

																						$scope.reverse = !$scope.reverse;

																						$scope
																								.pagination();
																					};

																					// By
																					// Default
																					// sort
																					// ny
																					// Name
																					$scope
																							.sort('customerName');

																				})
																console
																		.log(response.data);

																if (response == 200) {
																	console
																			.log("success")
																}
															},
															function myError(
																	response) {
																console
																		.log(response);
															});

										}
										// Calculate Total Number of Pages
										// based on Search Result
										$scope.pagination = function() {
											$scope.ItemsByPage = filteredListService
													.paged($scope.filteredList,
															$scope.pageSize);
										};

										$scope.setPage = function() {
											$scope.currentPage = this.n;
										};

										$scope.firstPage = function() {
											$scope.currentPage = 0;
										};

										$scope.lastPage = function() {
											$scope.currentPage = $scope.ItemsByPage.length - 1;
										};

										$scope.range = function(input, total) {
											var ret = [];
											if (!total) {
												total = input;
												input = 0;
											}
											for (var i = input; i < total; i++) {
												if (i != 0 && i != total - 1) {
													ret.push(i);
												}
											}
											return ret;
										};

										$scope.sort = function(sortBy) {
											$scope.resetAll();

											$scope.columnToOrder = sortBy;

											// $Filter - Standard Service
											$scope.filteredList = $filter(
													'orderBy')(
													$scope.filteredList,
													$scope.columnToOrder,
													$scope.reverse);

											if ($scope.reverse)
												iconName = 'glyphicon glyphicon-chevron-up';
											else
												iconName = 'glyphicon glyphicon-chevron-down';

											if (sortBy === 'customerId') {
												$scope.Header[0] = iconName;
											} else if (sortBy === 'customerName') {
												$scope.Header[1] = iconName;
											} else if (sortBy === 'zipCode') {
												$scope.Header[2] = iconName;
											} else if (sortBy === 'country') {
												$scope.Header[3] = iconName;
											} else if (sortBy === 'address') {
												$scope.Header[4] = iconName;
											} else {
												$scope.Header[1] = iconName;
											}

											$scope.reverse = !$scope.reverse;

											$scope.pagination();
										};

										// By Default sort ny Name
										$scope.sort('customerName');

										// console.log($scope.allUsers.length);

									}, function myError(response) {
										console.log(response);
									});

				})

		.controller(
				'addcustomercontroller',
				function($scope, $filter, $sce, ngTableParams, $http,$window,$location) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					$scope.submitemployee = function() {
						var customerName = $scope.customerName;
						var customerAddress = $scope.customerAddress;
						var customerZip = $scope.customerZip;
						var customerCountry = $scope.country.name;
						var createCustomer = $scope.webserviceshost
								+ 'hr/customer';
						createCustomer = createCustomer + '/create/'
								+ customerName + '/' + customerAddress + '/'
								+ customerCountry + '/' + customerZip + '';
						$http({
							method : "POST",
							url : createCustomer,
							headers: {
								'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
								'authorization':$window.sessionStorage.getItem("AuthKey")
							}
						}).then(function mySucces(response) {
							console.log(response.data);
							swal({
								title : "Customer Created Successfully",

								closeOnConfirm : false,
								closeOnCancel : false
							});
							$scope.customerName = '';
							$scope.customerAddress = '';
							$scope.customerZip = '';
							$scope.country = {};
							$scope.webserviceshost
							if (response == 200) {
								console.log("success")
							}
						}, function myError(response) {
							console.log(response);
						});
					};
					$scope.name = 'World';

					$scope.countries = [ {
						name : 'Afghanistan',
						code : 'AF'
					}, {
						name : 'Åland Islands',
						code : 'AX'
					}, {
						name : 'Albania',
						code : 'AL'
					}, {
						name : 'Algeria',
						code : 'DZ'
					}, {
						name : 'American Samoa',
						code : 'AS'
					}, {
						name : 'Andorra',
						code : 'AD'
					}, {
						name : 'Angola',
						code : 'AO'
					}, {
						name : 'Anguilla',
						code : 'AI'
					}, {
						name : 'Antarctica',
						code : 'AQ'
					}, {
						name : 'Antigua and Barbuda',
						code : 'AG'
					}, {
						name : 'Argentina',
						code : 'AR'
					}, {
						name : 'Armenia',
						code : 'AM'
					}, {
						name : 'Aruba',
						code : 'AW'
					}, {
						name : 'Australia',
						code : 'AU'
					}, {
						name : 'Austria',
						code : 'AT'
					}, {
						name : 'Azerbaijan',
						code : 'AZ'
					}, {
						name : 'Bahamas',
						code : 'BS'
					}, {
						name : 'Bahrain',
						code : 'BH'
					}, {
						name : 'Bangladesh',
						code : 'BD'
					}, {
						name : 'Barbados',
						code : 'BB'
					}, {
						name : 'Belarus',
						code : 'BY'
					}, {
						name : 'Belgium',
						code : 'BE'
					}, {
						name : 'Belize',
						code : 'BZ'
					}, {
						name : 'Benin',
						code : 'BJ'
					}, {
						name : 'Bermuda',
						code : 'BM'
					}, {
						name : 'Bhutan',
						code : 'BT'
					}, {
						name : 'Bolivia',
						code : 'BO'
					}, {
						name : 'Bosnia and Herzegovina',
						code : 'BA'
					}, {
						name : 'Botswana',
						code : 'BW'
					}, {
						name : 'Bouvet Island',
						code : 'BV'
					}, {
						name : 'Brazil',
						code : 'BR'
					}, {
						name : 'British Indian Ocean Territory',
						code : 'IO'
					}, {
						name : 'Brunei Darussalam',
						code : 'BN'
					}, {
						name : 'Bulgaria',
						code : 'BG'
					}, {
						name : 'Burkina Faso',
						code : 'BF'
					}, {
						name : 'Burundi',
						code : 'BI'
					}, {
						name : 'Cambodia',
						code : 'KH'
					}, {
						name : 'Cameroon',
						code : 'CM'
					}, {
						name : 'Canada',
						code : 'CA'
					}, {
						name : 'Cape Verde',
						code : 'CV'
					}, {
						name : 'Cayman Islands',
						code : 'KY'
					}, {
						name : 'Central African Republic',
						code : 'CF'
					}, {
						name : 'Chad',
						code : 'TD'
					}, {
						name : 'Chile',
						code : 'CL'
					}, {
						name : 'China',
						code : 'CN'
					}, {
						name : 'Christmas Island',
						code : 'CX'
					}, {
						name : 'Cocos (Keeling) Islands',
						code : 'CC'
					}, {
						name : 'Colombia',
						code : 'CO'
					}, {
						name : 'Comoros',
						code : 'KM'
					}, {
						name : 'Congo',
						code : 'CG'
					}, {
						name : 'Congo, The Democratic Republic of the',
						code : 'CD'
					}, {
						name : 'Cook Islands',
						code : 'CK'
					}, {
						name : 'Costa Rica',
						code : 'CR'
					}, {
						name : 'Cote D\'Ivoire',
						code : 'CI'
					}, {
						name : 'Croatia',
						code : 'HR'
					}, {
						name : 'Cuba',
						code : 'CU'
					}, {
						name : 'Cyprus',
						code : 'CY'
					}, {
						name : 'Czech Republic',
						code : 'CZ'
					}, {
						name : 'Denmark',
						code : 'DK'
					}, {
						name : 'Djibouti',
						code : 'DJ'
					}, {
						name : 'Dominica',
						code : 'DM'
					}, {
						name : 'Dominican Republic',
						code : 'DO'
					}, {
						name : 'Ecuador',
						code : 'EC'
					}, {
						name : 'Egypt',
						code : 'EG'
					}, {
						name : 'El Salvador',
						code : 'SV'
					}, {
						name : 'Equatorial Guinea',
						code : 'GQ'
					}, {
						name : 'Eritrea',
						code : 'ER'
					}, {
						name : 'Estonia',
						code : 'EE'
					}, {
						name : 'Ethiopia',
						code : 'ET'
					}, {
						name : 'Falkland Islands (Malvinas)',
						code : 'FK'
					}, {
						name : 'Faroe Islands',
						code : 'FO'
					}, {
						name : 'Fiji',
						code : 'FJ'
					}, {
						name : 'Finland',
						code : 'FI'
					}, {
						name : 'France',
						code : 'FR'
					}, {
						name : 'French Guiana',
						code : 'GF'
					}, {
						name : 'French Polynesia',
						code : 'PF'
					}, {
						name : 'French Southern Territories',
						code : 'TF'
					}, {
						name : 'Gabon',
						code : 'GA'
					}, {
						name : 'Gambia',
						code : 'GM'
					}, {
						name : 'Georgia',
						code : 'GE'
					}, {
						name : 'Germany',
						code : 'DE'
					}, {
						name : 'Ghana',
						code : 'GH'
					}, {
						name : 'Gibraltar',
						code : 'GI'
					}, {
						name : 'Greece',
						code : 'GR'
					}, {
						name : 'Greenland',
						code : 'GL'
					}, {
						name : 'Grenada',
						code : 'GD'
					}, {
						name : 'Guadeloupe',
						code : 'GP'
					}, {
						name : 'Guam',
						code : 'GU'
					}, {
						name : 'Guatemala',
						code : 'GT'
					}, {
						name : 'Guernsey',
						code : 'GG'
					}, {
						name : 'Guinea',
						code : 'GN'
					}, {
						name : 'Guinea-Bissau',
						code : 'GW'
					}, {
						name : 'Guyana',
						code : 'GY'
					}, {
						name : 'Haiti',
						code : 'HT'
					}, {
						name : 'Heard Island and Mcdonald Islands',
						code : 'HM'
					}, {
						name : 'Holy See (Vatican City State)',
						code : 'VA'
					}, {
						name : 'Honduras',
						code : 'HN'
					}, {
						name : 'Hong Kong',
						code : 'HK'
					}, {
						name : 'Hungary',
						code : 'HU'
					}, {
						name : 'Iceland',
						code : 'IS'
					}, {
						name : 'India',
						code : 'IN'
					}, {
						name : 'Indonesia',
						code : 'ID'
					}, {
						name : 'Iran, Islamic Republic Of',
						code : 'IR'
					}, {
						name : 'Iraq',
						code : 'IQ'
					}, {
						name : 'Ireland',
						code : 'IE'
					}, {
						name : 'Isle of Man',
						code : 'IM'
					}, {
						name : 'Israel',
						code : 'IL'
					}, {
						name : 'Italy',
						code : 'IT'
					}, {
						name : 'Jamaica',
						code : 'JM'
					}, {
						name : 'Japan',
						code : 'JP'
					}, {
						name : 'Jersey',
						code : 'JE'
					}, {
						name : 'Jordan',
						code : 'JO'
					}, {
						name : 'Kazakhstan',
						code : 'KZ'
					}, {
						name : 'Kenya',
						code : 'KE'
					}, {
						name : 'Kiribati',
						code : 'KI'
					}, {
						name : 'Korea, Democratic People\'s Republic of',
						code : 'KP'
					}, {
						name : 'Korea, Republic of',
						code : 'KR'
					}, {
						name : 'Kuwait',
						code : 'KW'
					}, {
						name : 'Kyrgyzstan',
						code : 'KG'
					}, {
						name : 'Lao People\'s Democratic Republic',
						code : 'LA'
					}, {
						name : 'Latvia',
						code : 'LV'
					}, {
						name : 'Lebanon',
						code : 'LB'
					}, {
						name : 'Lesotho',
						code : 'LS'
					}, {
						name : 'Liberia',
						code : 'LR'
					}, {
						name : 'Libyan Arab Jamahiriya',
						code : 'LY'
					}, {
						name : 'Liechtenstein',
						code : 'LI'
					}, {
						name : 'Lithuania',
						code : 'LT'
					}, {
						name : 'Luxembourg',
						code : 'LU'
					}, {
						name : 'Macao',
						code : 'MO'
					}, {
						name : 'Macedonia, The Former Yugoslav Republic of',
						code : 'MK'
					}, {
						name : 'Madagascar',
						code : 'MG'
					}, {
						name : 'Malawi',
						code : 'MW'
					}, {
						name : 'Malaysia',
						code : 'MY'
					}, {
						name : 'Maldives',
						code : 'MV'
					}, {
						name : 'Mali',
						code : 'ML'
					}, {
						name : 'Malta',
						code : 'MT'
					}, {
						name : 'Marshall Islands',
						code : 'MH'
					}, {
						name : 'Martinique',
						code : 'MQ'
					}, {
						name : 'Mauritania',
						code : 'MR'
					}, {
						name : 'Mauritius',
						code : 'MU'
					}, {
						name : 'Mayotte',
						code : 'YT'
					}, {
						name : 'Mexico',
						code : 'MX'
					}, {
						name : 'Micronesia, Federated States of',
						code : 'FM'
					}, {
						name : 'Moldova, Republic of',
						code : 'MD'
					}, {
						name : 'Monaco',
						code : 'MC'
					}, {
						name : 'Mongolia',
						code : 'MN'
					}, {
						name : 'Montserrat',
						code : 'MS'
					}, {
						name : 'Morocco',
						code : 'MA'
					}, {
						name : 'Mozambique',
						code : 'MZ'
					}, {
						name : 'Myanmar',
						code : 'MM'
					}, {
						name : 'Namibia',
						code : 'NA'
					}, {
						name : 'Nauru',
						code : 'NR'
					}, {
						name : 'Nepal',
						code : 'NP'
					}, {
						name : 'Netherlands',
						code : 'NL'
					}, {
						name : 'Netherlands Antilles',
						code : 'AN'
					}, {
						name : 'New Caledonia',
						code : 'NC'
					}, {
						name : 'New Zealand',
						code : 'NZ'
					}, {
						name : 'Nicaragua',
						code : 'NI'
					}, {
						name : 'Niger',
						code : 'NE'
					}, {
						name : 'Nigeria',
						code : 'NG'
					}, {
						name : 'Niue',
						code : 'NU'
					}, {
						name : 'Norfolk Island',
						code : 'NF'
					}, {
						name : 'Northern Mariana Islands',
						code : 'MP'
					}, {
						name : 'Norway',
						code : 'NO'
					}, {
						name : 'Oman',
						code : 'OM'
					}, {
						name : 'Pakistan',
						code : 'PK'
					}, {
						name : 'Palau',
						code : 'PW'
					}, {
						name : 'Palestinian Territory, Occupied',
						code : 'PS'
					}, {
						name : 'Panama',
						code : 'PA'
					}, {
						name : 'Papua New Guinea',
						code : 'PG'
					}, {
						name : 'Paraguay',
						code : 'PY'
					}, {
						name : 'Peru',
						code : 'PE'
					}, {
						name : 'Philippines',
						code : 'PH'
					}, {
						name : 'Pitcairn',
						code : 'PN'
					}, {
						name : 'Poland',
						code : 'PL'
					}, {
						name : 'Portugal',
						code : 'PT'
					}, {
						name : 'Puerto Rico',
						code : 'PR'
					}, {
						name : 'Qatar',
						code : 'QA'
					}, {
						name : 'Reunion',
						code : 'RE'
					}, {
						name : 'Romania',
						code : 'RO'
					}, {
						name : 'Russian Federation',
						code : 'RU'
					}, {
						name : 'Rwanda',
						code : 'RW'
					}, {
						name : 'Saint Helena',
						code : 'SH'
					}, {
						name : 'Saint Kitts and Nevis',
						code : 'KN'
					}, {
						name : 'Saint Lucia',
						code : 'LC'
					}, {
						name : 'Saint Pierre and Miquelon',
						code : 'PM'
					}, {
						name : 'Saint Vincent and the Grenadines',
						code : 'VC'
					}, {
						name : 'Samoa',
						code : 'WS'
					}, {
						name : 'San Marino',
						code : 'SM'
					}, {
						name : 'Sao Tome and Principe',
						code : 'ST'
					}, {
						name : 'Saudi Arabia',
						code : 'SA'
					}, {
						name : 'Senegal',
						code : 'SN'
					}, {
						name : 'Serbia and Montenegro',
						code : 'CS'
					}, {
						name : 'Seychelles',
						code : 'SC'
					}, {
						name : 'Sierra Leone',
						code : 'SL'
					}, {
						name : 'Singapore',
						code : 'SG'
					}, {
						name : 'Slovakia',
						code : 'SK'
					}, {
						name : 'Slovenia',
						code : 'SI'
					}, {
						name : 'Solomon Islands',
						code : 'SB'
					}, {
						name : 'Somalia',
						code : 'SO'
					}, {
						name : 'South Africa',
						code : 'ZA'
					}, {
						name : 'South Georgia and the South Sandwich Islands',
						code : 'GS'
					}, {
						name : 'Spain',
						code : 'ES'
					}, {
						name : 'Sri Lanka',
						code : 'LK'
					}, {
						name : 'Sudan',
						code : 'SD'
					}, {
						name : 'Suriname',
						code : 'SR'
					}, {
						name : 'Svalbard and Jan Mayen',
						code : 'SJ'
					}, {
						name : 'Swaziland',
						code : 'SZ'
					}, {
						name : 'Sweden',
						code : 'SE'
					}, {
						name : 'Switzerland',
						code : 'CH'
					}, {
						name : 'Syrian Arab Republic',
						code : 'SY'
					}, {
						name : 'Taiwan, Province of China',
						code : 'TW'
					}, {
						name : 'Tajikistan',
						code : 'TJ'
					}, {
						name : 'Tanzania, United Republic of',
						code : 'TZ'
					}, {
						name : 'Thailand',
						code : 'TH'
					}, {
						name : 'Timor-Leste',
						code : 'TL'
					}, {
						name : 'Togo',
						code : 'TG'
					}, {
						name : 'Tokelau',
						code : 'TK'
					}, {
						name : 'Tonga',
						code : 'TO'
					}, {
						name : 'Trinidad and Tobago',
						code : 'TT'
					}, {
						name : 'Tunisia',
						code : 'TN'
					}, {
						name : 'Turkey',
						code : 'TR'
					}, {
						name : 'Turkmenistan',
						code : 'TM'
					}, {
						name : 'Turks and Caicos Islands',
						code : 'TC'
					}, {
						name : 'Tuvalu',
						code : 'TV'
					}, {
						name : 'Uganda',
						code : 'UG'
					}, {
						name : 'Ukraine',
						code : 'UA'
					}, {
						name : 'United Arab Emirates',
						code : 'AE'
					}, {
						name : 'United Kingdom',
						code : 'GB'
					}, {
						name : 'United States',
						code : 'US'
					}, {
						name : 'United States Minor Outlying Islands',
						code : 'UM'
					}, {
						name : 'Uruguay',
						code : 'UY'
					}, {
						name : 'Uzbekistan',
						code : 'UZ'
					}, {
						name : 'Vanuatu',
						code : 'VU'
					}, {
						name : 'Venezuela',
						code : 'VE'
					}, {
						name : 'Vietnam',
						code : 'VN'
					}, {
						name : 'Virgin Islands, British',
						code : 'VG'
					}, {
						name : 'Virgin Islands, U.S.',
						code : 'VI'
					}, {
						name : 'Wallis and Futuna',
						code : 'WF'
					}, {
						name : 'Western Sahara',
						code : 'EH'
					}, {
						name : 'Yemen',
						code : 'YE'
					}, {
						name : 'Zambia',
						code : 'ZM'
					}, {
						name : 'Zimbabwe',
						code : 'ZW'
					} ];

				})
		/*
		 * var allusers=$scope.webserviceshost + 'hr/employee/all'; $http({
		 * method : "GET", url : allusers }).then(function mySucces(response) {
		 * console.log(response.data); if(response!='undefiend' &&response!=""){
		 * $scope.allUsers=response.data; } }, function myError(response) {
		 * console.log(response); });
		 */

		.controller(
				'leaveHistory',
				function($scope, $filter, $sce, ngTableParams,$window,
						LeaveHistoryService) {
					this.id = LeaveHistoryService.id;
					this.name = LeaveHistoryService.name;
					this.fromDate = LeaveHistoryService.from_date;
					this.toDate = LeaveHistoryService.to_date;
					this.totalDays = LeaveHistoryService.total_days;
					this.department = LeaveHistoryService.department;
					this.status = LeaveHistoryService.status;
					this.reporting_manager = LeaveHistoryService.reporting_manager
					this.approvedBy = LeaveHistoryService.approvedBy;
					this.riResult = LeaveHistoryService.getRecentitem(this.id,
							this.name, this.from_date, this.todate,
							this.total_hour, this.department, this.status);
					$scope.totalItems = this.riResult.length;
					$scope.viewby = 10;
					$scope.currentPage = 1;
					$scope.itemsPerPage = $scope.viewby;
					$scope.maxSize = 10;
				})
		.controller(
				'timesheet',
				function($scope, $filter, $sce, ngTableParams, TimeSheetService,$window) {
					this.id = TimeSheetService.id;
					this.name = TimeSheetService.name;
					this.fromDate = TimeSheetService.from_date;
					this.toDate = TimeSheetService.to_date;
					this.totalDays = TimeSheetService.total_days;
					this.department = TimeSheetService.department;
					this.status = TimeSheetService.status;
					this.reporting_manager = TimeSheetService.reporting_manager
					this.approvedBy = TimeSheetService.approvedBy;
					this.riResult = TimeSheetService.getRecentitem(this.id,
							this.name, this.from_date, this.todate,
							this.total_hour, this.department, this.status);
					$scope.totalItems = this.riResult.length;
					$scope.viewby = 10;
					$scope.currentPage = 1;
					$scope.itemsPerPage = $scope.viewby;
					$scope.maxSize = 10;
				})
		.controller(
				'timesheethistory',
				function($scope, $filter, $sce, ngTableParams, $http,$window,
						$location, $uibModal, $rootScope, filteredListService) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var employeeid = $window.sessionStorage.getItem("EmployeeId");;
					var date2 = new Date();
					var startyyyy = date2.getFullYear();
					var startdd = date2.getDate();
					var startmm = date2.getMonth()
					var endyyyy = date2.getFullYear();
					var enddd = date2.getDate();
					var totalNoOfDays = new Date(startyyyy, startmm + 1, 0)
							.getDate();
					var endmm = date2.getMonth();
					;

					if (startmm < 10) {
						startmm = '0' + startmm;
					}
					if (endmm < 10) {
						endmm = '0' + endmm;
					}

					$scope.start = startyyyy + '-' + startmm + '-' + 01;
					$scope.end = endyyyy + '-' + endmm + '-' + totalNoOfDays;
					var timesheethistory = $scope.webserviceshost
							+ 'hr/timesheet/summary/' + employeeid + "/"
							+ $scope.start + "/" + $scope.end;
					$http({
						method : "GET",
						url : timesheethistory,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.employeeId = '';

												$scope.firstName = '';
												$scope.lastName = '';
												$scope.weekStartDate = '';
												$scope.weekEndDate = '';
												$scope.totalHours = '';
												$scope.timesheetStatus = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '', '', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};

											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter
												// -
												// Standard
												// Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'EmpId') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'firstName') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'lastName') {
													$scope.Header[2] = iconName;
												} else if (sortBy === 'weekStartDate') {
													$scope.Header[3] = iconName;
												} else if (sortBy === 'weekEndDate') {
													$scope.Header[4] = iconName;
												} else if (sortBy === 'totalHours') {
													$scope.Header[5] = iconName;
												} else if (sortBy === 'timesheetStatus') {
													$scope.Header[6] = iconName;
												} else {
													$scope.Header[1] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By
											// Default
											// sort
											// ny
											// Name
											$scope.sort('name');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});

					$scope.showDetails = function(employeeid, argStart, argEnd) {
						// $window.location.path='headers.timesheet';

						$scope.$emit('eventName');
						$scope.$broadcast('eventName');

						/*
						 * var modalInstance = $uibModal.open({ templateUrl :
						 * 'views/timesheet.html', controller :
						 * 'timesheethistoryDetails', backdrop : 'static',
						 * keyboard : false, resolve : { userData : function() {
						 * var x = { 'employeeid' : employeeid, 'startDate' :
						 * argStart, 'endDate' : argEnd } return x; } } });
						 */
						/*
						 * return { restrict: 'E', link: function(scope,
						 * element, attrs) { // some ode }, templateUrl:
						 * function(elem,attrs) { return attrs.templateUrl ||
						 * 'view/timesheet.html' } }
						 */
						/*
						 * var modalInstance = $uibModal.open({ templateUrl :
						 * 'views/timesheetDetails.html', controller :
						 * 'timesheethistoryDetails', backdrop : 'static',
						 * keyboard : false, resolve : { userData : function() {
						 * var x = { 'employeeid' : employeeid, 'startDate' :
						 * argStart, 'endDate' : argEnd } return x; } } });
						 * modalInstance.result.then(function(selectedItem) {
						 * $scope.selected = selectedItem; })
						 */
					}

				}

		/*
		 * function($scope, $filter, $sce, ngTableParams,
		 * TimeSheetHistoryService) { this.id = TimeSheetHistoryService.id;
		 * this.name = TimeSheetHistoryService.name; this.fromDate =
		 * TimeSheetHistoryService.from_date; this.toDate =
		 * TimeSheetHistoryService.to_date; this.totalDays =
		 * TimeSheetHistoryService.total_days; this.department =
		 * TimeSheetHistoryService.department; this.status =
		 * TimeSheetHistoryService.status; this.reporting_manager =
		 * TimeSheetHistoryService.reporting_manager this.approvedBy =
		 * TimeSheetHistoryService.approvedBy; this.riResult =
		 * TimeSheetHistoryService.getRecentitem( this.id, this.name,
		 * this.from_date, this.todate, this.total_hour, this.department,
		 * this.status); $scope.totalItems = this.riResult.length; $scope.viewby =
		 * 10; $scope.currentPage = 1; $scope.itemsPerPage = $scope.viewby;
		 * $scope.maxSize = 10; }
		 */)
		.controller(
				'timesheetapproval',
				function($scope, $filter, $sce,$window, ngTableParams, $http,$location,
						$uibModal, $rootScope, filteredListService,$window) {
					if(!$window.sessionStorage.getItem("Access-Token") || !$window.sessionStorage.getItem("AuthKey") || !$window.sessionStorage.getItem("EmployeeId")){
					    $location.path('/login');
					}
					var employeeid = $window.sessionStorage.getItem("EmployeeId");
					var date2 = new Date();
					var startyyyy = date2.getFullYear();
					var startdd = date2.getDate();
					var startmm = date2.getMonth()
					var endyyyy = date2.getFullYear();
					var enddd = date2.getDate();
					var totalNoOfDays = new Date(startyyyy, startmm + 1, 0)
							.getDate();
					var endmm = date2.getMonth();
					;

					if (startmm < 10) {
						startmm = '0' + startmm;
					}
					if (endmm < 10) {
						endmm = '0' + endmm;
					}

					$scope.start = startyyyy + '-' + startmm + '-' + 01;
					$scope.end = endyyyy + '-' + endmm + '-' + totalNoOfDays;
					var timesheettoapprove = $scope.webserviceshost
							+ 'hr/timesheet/timesheetsToApprove/' + employeeid;
					$http({
						method : "GET",
						url : timesheettoapprove,
						headers: {
							'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
							'authorization':$window.sessionStorage.getItem("AuthKey")
						}
					})
							.then(
									function mySucces(response) {
										console.log(response.data);
										if (response != 'undefiend'
												&& response != "") {

											$scope.allUsers = response.data;
											$scope.pageSize = 7;
											$scope.allItems = $scope.allUsers;
											$scope.reverse = false;

											$scope.resetAll = function() {
												$scope.filteredList = $scope.allItems;
												$scope.employeeId = '';

												$scope.firstName = '';
												$scope.lastName = '';
												$scope.weekStartDate = '';
												$scope.weekEndDate = '';
												$scope.totalHours = '';
												$scope.timesheetStatus = '';
												$scope.currentPage = 0;
												$scope.Header = [ '', '', '',
														'', '', '', '' ];
											}

											$scope.search = function() {
												$scope.filteredList = filteredListService
														.searched(
																$scope.allItems,
																$scope.searchText);

												if ($scope.searchText == '') {
													$scope.filteredList = $scope.allItems;
												}
												$scope.pagination();
											}

											$scope.pagination = function() {
												$scope.ItemsByPage = filteredListService
														.paged(
																$scope.filteredList,
																$scope.pageSize);
											};

											$scope.setPage = function() {
												$scope.currentPage = this.n;
											};

											$scope.firstPage = function() {
												$scope.currentPage = 0;
											};

											$scope.lastPage = function() {
												$scope.currentPage = $scope.ItemsByPage.length - 1;
											};

											$scope.range = function(input,
													total) {
												var ret = [];
												if (!total) {
													total = input;
													input = 0;
												}
												for (var i = input; i < total; i++) {
													if (i != 0
															&& i != total - 1) {
														ret.push(i);
													}
												}
												return ret;
											};

											$scope.sort = function(sortBy) {
												$scope.resetAll();

												$scope.columnToOrder = sortBy;

												// $Filter
												// -
												// Standard
												// Service
												$scope.filteredList = $filter(
														'orderBy')(
														$scope.filteredList,
														$scope.columnToOrder,
														$scope.reverse);

												if ($scope.reverse)
													iconName = 'glyphicon glyphicon-chevron-up';
												else
													iconName = 'glyphicon glyphicon-chevron-down';

												if (sortBy === 'EmpId') {
													$scope.Header[0] = iconName;
												} else if (sortBy === 'firstName') {
													$scope.Header[1] = iconName;
												} else if (sortBy === 'lastName') {
													$scope.Header[2] = iconName;
												} else if (sortBy === 'weekStartDate') {
													$scope.Header[3] = iconName;
												} else if (sortBy === 'weekEndDate') {
													$scope.Header[4] = iconName;
												} else if (sortBy === 'totalHours') {
													$scope.Header[5] = iconName;
												} else if (sortBy === 'timesheetStatus') {
													$scope.Header[6] = iconName;
												} else {
													$scope.Header[1] = iconName;
												}

												$scope.reverse = !$scope.reverse;

												$scope.pagination();
											};

											// By
											// Default
											// sort
											// ny
											// Name
											$scope.sort('name');

											// console.log($scope.allUsers.length);
										}
									}, function myError(response) {
										console.log(response);
									});
					$scope.approveTimeSheet = function(item) {

						swal(
								{
									title : "Are you sure?",
									text : "Approve Timesheet ",
									showCancelButton : true,
									confirmButtonColor : "#DD6B55",
									confirmButtonText : "Yes, Approve it!",
									cancelButtonText : "No, cancel it!",
									closeOnConfirm : false,
									closeOnCancel : false
								},
								function(isConfirm) {
									if (isConfirm) {
										var employeeId = item.id.employeeId;
										var weekStartDate = item.id.weekStartDate;
										var weekEndDate = item.id.weekEndDate;
										var approveLeaveurl = $scope.webserviceshost
												+ 'hr/timesheet/approve/'
												+ employeeId
												+ '/'
												+ weekStartDate
												+ '/'
												+ weekEndDate;

										$http({
											method : "POST",
											url : approveLeaveurl,
											headers: {
												'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
												'authorization':$window.sessionStorage.getItem("AuthKey")
											}
										})
												.then(
														function mySucces(
																response) {

															var managerid = $window.sessionStorage.getItem("EmployeeId");// hard
															// coded
															// as
															// of now
															var timesheettoapprove = $scope.webserviceshost
																	+ 'hr/timesheet/timesheetsToApprove/'
																	+ 70;

															$http(
																	{
																		method : "GET",
																		url : timesheettoapprove,
																		headers: {
																			'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																			'authorization':$window.sessionStorage.getItem("AuthKey")
																		}
																	})
																	.then(
																			function mySucces(
																					response) {
																				console
																						.log(response.data);
																				if (response != 'undefiend'
																						&& response != "") {

																					$scope.allUsers = response.data;
																					$scope.pageSize = 7;
																					$scope.allItems = $scope.allUsers;
																					$scope.reverse = false;

																					$scope.resetAll = function() {
																						$scope.filteredList = $scope.allItems;
																						$scope.employeeId = '';
																						$scope.firstName = '';
																						$scope.lastName = '';
																						$scope.fromDate = '';
																						$scope.toDate = '';
																						$scope.noOfDays = ''
																						$scope.searchText = '';
																						$scope.currentPage = 0;
																						$scope.Header = [
																								'',
																								'',
																								'',
																								'',
																								'',
																								'',
																								'' ];
																					}

																					$scope.search = function() {
																						$scope.filteredList = filteredListService
																								.searched(
																										$scope.allItems,
																										$scope.searchText);

																						if ($scope.searchText == '') {
																							$scope.filteredList = $scope.allItems;
																						}
																						$scope
																								.pagination();
																					}

																					$scope.pagination = function() {
																						$scope.ItemsByPage = filteredListService
																								.paged(
																										$scope.filteredList,
																										$scope.pageSize);
																					};

																					$scope.setPage = function() {
																						$scope.currentPage = this.n;
																					};

																					$scope.firstPage = function() {
																						$scope.currentPage = 0;
																					};

																					$scope.lastPage = function() {
																						$scope.currentPage = $scope.ItemsByPage.length - 1;
																					};

																					$scope.range = function(
																							input,
																							total) {
																						var ret = [];
																						if (!total) {
																							total = input;
																							input = 0;
																						}
																						for (var i = input; i < total; i++) {
																							if (i != 0
																									&& i != total - 1) {
																								ret
																										.push(i);
																							}
																						}
																						return ret;
																					};
																					$scope.sort = function(
																							sortBy) {
																						$scope
																								.resetAll();

																						$scope.columnToOrder = sortBy;

																						// $Filter
																						// -
																						// Standard
																						// Service
																						$scope.filteredList = $filter(
																								'orderBy')
																								(
																										$scope.filteredList,
																										$scope.columnToOrder,
																										$scope.reverse);

																						if ($scope.reverse)
																							iconName = 'glyphicon glyphicon-chevron-up';
																						else
																							iconName = 'glyphicon glyphicon-chevron-down';

																						if (sortBy === 'EmployeeId') {
																							$scope.Header[0] = iconName;
																						} else if (sortBy === 'firstName') {
																							$scope.Header[1] = iconName;
																						} else if (sortBy === 'lastName') {
																							$scope.Header[2] = iconName;
																						} else if (sortBy === 'timesheetStatus') {
																							$scope.Header[3] = iconName;
																						} else {
																							$scope.Header[4] = iconName;
																						}

																						$scope.reverse = !$scope.reverse;

																						$scope
																								.pagination();
																					};
																					$scope
																							.sort('firstName');

																					// console.log($scope.allUsers.length);
																				}
																			},
																			function myError(
																					response) {
																				console
																						.log(response);
																			});
															swal(
																	"Approved",
																	"Timesheet has been approved.)",
																	"success");
														},
														function myError(
																response) {
															console
																	.log(response);
														});
									} else {
										swal("Cancelled",
												"Request has been cancelled.)",
												"error");
									}
								});
					}
					$scope.rejecttimeSheet = function(item) {

						swal(
								{
									title : "Are you sure?",
									text : "Reject Timesheet ",
									showCancelButton : true,
									confirmButtonColor : "#DD6B55",
									confirmButtonText : "Yes, Reject it!",
									cancelButtonText : "No, cancel it!",
									closeOnConfirm : false,
									closeOnCancel : false
								},
								function(isConfirm) {
									if (isConfirm) {
										var employeeId = item.id.employeeId;
										var weekStartDate = item.id.weekStartDate;
										var weekEndDate = item.id.weekEndDate;
										var rejeccttimesheet = $scope.webserviceshost
												+ 'hr/timesheet/reject/'
												+ employeeId
												+ '/'
												+ weekStartDate
												+ '/'
												+ weekEndDate;

										$http({
											method : "POST",
											url : rejeccttimesheet,
											headers: {
												'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
												'authorization':$window.sessionStorage.getItem("AuthKey")
											}
										})
												.then(
														function mySucces(
																response) {

															var managerid = $window.sessionStorage.getItem("EmployeeId");;// hard
															// coded
															// as
															// of
															// now
															var timesheettoapprove = $scope.webserviceshost
																	+ 'hr/timesheet/timesheetsToApprove/'
																	+ 70;

															$http(
																	{
																		method : "GET",
																		url : timesheettoapprove,
																		headers: {
																			'XSRF-TOKEN':$window.sessionStorage.getItem("Access-Token"),
																			'authorization':$window.sessionStorage.getItem("AuthKey")
																		}
																	})
																	.then(
																			function mySucces(
																					response) {
																				console
																						.log(response.data);
																				if (response != 'undefiend'
																						&& response != "") {

																					$scope.allUsers = response.data;
																					$scope.pageSize = 7;
																					$scope.allItems = $scope.allUsers;
																					$scope.reverse = false;

																					$scope.resetAll = function() {
																						$scope.filteredList = $scope.allItems;
																						$scope.employeeId = '';
																						$scope.firstName = '';
																						$scope.lastName = '';
																						$scope.fromDate = '';
																						$scope.toDate = '';
																						$scope.noOfDays = ''
																						$scope.searchText = '';
																						$scope.currentPage = 0;
																						$scope.Header = [
																								'',
																								'',
																								'',
																								'',
																								'',
																								'',
																								'' ];
																					}

																					$scope.search = function() {
																						$scope.filteredList = filteredListService
																								.searched(
																										$scope.allItems,
																										$scope.searchText);

																						if ($scope.searchText == '') {
																							$scope.filteredList = $scope.allItems;
																						}
																						$scope
																								.pagination();
																					}

																					$scope.pagination = function() {
																						$scope.ItemsByPage = filteredListService
																								.paged(
																										$scope.filteredList,
																										$scope.pageSize);
																					};

																					$scope.setPage = function() {
																						$scope.currentPage = this.n;
																					};

																					$scope.firstPage = function() {
																						$scope.currentPage = 0;
																					};

																					$scope.lastPage = function() {
																						$scope.currentPage = $scope.ItemsByPage.length - 1;
																					};

																					$scope.range = function(
																							input,
																							total) {
																						var ret = [];
																						if (!total) {
																							total = input;
																							input = 0;
																						}
																						for (var i = input; i < total; i++) {
																							if (i != 0
																									&& i != total - 1) {
																								ret
																										.push(i);
																							}
																						}
																						return ret;
																					};
																					$scope.sort = function(
																							sortBy) {
																						$scope
																								.resetAll();

																						$scope.columnToOrder = sortBy;

																						// $Filter
																						// -
																						// Standard
																						// Service
																						$scope.filteredList = $filter(
																								'orderBy')
																								(
																										$scope.filteredList,
																										$scope.columnToOrder,
																										$scope.reverse);

																						if ($scope.reverse)
																							iconName = 'glyphicon glyphicon-chevron-up';
																						else
																							iconName = 'glyphicon glyphicon-chevron-down';

																						if (sortBy === 'EmployeeId') {
																							$scope.Header[0] = iconName;
																						} else if (sortBy === 'firstName') {
																							$scope.Header[1] = iconName;
																						} else if (sortBy === 'lastName') {
																							$scope.Header[2] = iconName;
																						} else if (sortBy === 'timesheetStatus') {
																							$scope.Header[3] = iconName;
																						} else {
																							$scope.Header[4] = iconName;
																						}

																						$scope.reverse = !$scope.reverse;

																						$scope
																								.pagination();
																					};
																					$scope
																							.sort('firstName');

																					// console.log($scope.allUsers.length);
																				}
																			},
																			function myError(
																					response) {
																				console
																						.log(response);
																			});

														},
														function myError(
																response) {
															console
																	.log(response);
														})
										swal(
												"Rejected",
												"Timesheet has been rejected.)",
												"success");
									} else {
										swal(
												"Cancelled",
												"Timesheet has been cancelled.)",
												"error");
									}
								});
					}

				})
		.controller(
				'timesheethistoryDetails',
				function($scope, $rootScope, $uibModalInstance, userData,$window) {
					$scope.items = userData;
					$scope.selected = {
						item : $scope.items[0]
					};
					console.log(userData);
					var employeeId = userData.employeeid;
					var startDate = userData.startDate;
					var endDate = userData.endDate;
					$scope.cancelbutton = function() {
						$rootScope.modalInstance.close();
					};
					var timesheetDetail = $scope.webserviceshost
							+ 'hr/timesheet/details/' + employeeId + "/"
							+ $scope.startDate + "/" + endDate;

				})
		.controller(
				'recentpostCtrl',
				function(recentpostService) {

					// Get Recent Posts Widget Items
					this.img = recentpostService.img;
					this.user = recentpostService.user;
					this.text = recentpostService.text;

					this.rpResult = recentpostService.getRecentpost(this.img,
							this.user, this.text);
				})

		// =================================================
		// Profile
		// =================================================

		.controller(
				'profileCtrl',
				function(growlService) {

					// Get Profile Information from profileService Service

					// User
					this.profileSummary = "Sed eu est vulputate, fringilla ligula ac, maximus arcu. Donec sed felis vel magna mattis ornare ut non turpis. Sed id arcu elit. Sed nec sagittis tortor. Mauris ante urna, ornare sit amet mollis eu, aliquet ac ligula. Nullam dolor metus, suscipit ac imperdiet nec, consectetur sed ex. Sed cursus porttitor leo.";

					this.fullName = "Mallinda Hollaway";
					this.gender = "female";
					this.birthDay = "23/06/1988";
					this.martialStatus = "Single";
					this.mobileNumber = "00971123456789";
					this.emailAddress = "malinda.h@gmail.com";
					this.twitter = "@malinda";
					this.twitterUrl = "twitter.com/malinda";
					this.skype = "malinda.hollaway";
					this.addressSuite = "44-46 Morningside Road";
					this.addressCity = "Edinburgh";
					this.addressCountry = "Scotland";

					// Edit
					this.editSummary = 0;
					this.editInfo = 0;
					this.editContact = 0;

					this.submit = function(item, message) {
						if (item === 'profileSummary') {
							this.editSummary = 0;
						}

						if (item === 'profileInfo') {
							this.editInfo = 0;
						}

						if (item === 'profileContact') {
							this.editContact = 0;
						}

						growlService.growl(message
								+ ' has updated Successfully!', 'inverse');
					}

				})

		// =================================================
		// LOGIN
		// =================================================

		// =================================================
		// CALENDAR
		// =================================================

		.controller(
				'calendarCtrl',
				function($modal) {

					// Create and add Action button with dropdown in Calendar
					// header.
					this.month = 'month';

					this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">'
							+ '<li class="dropdown" dropdown>'
							+ '<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>'
							+ '<ul class="dropdown-menu dropdown-menu-right">'
							+ '<li class="active">'
							+ '<a data-calendar-view="month" href="">Month View</a>'
							+ '</li>'
							+ '<li>'
							+ '<a data-calendar-view="basicWeek" href="">Week View</a>'
							+ '</li>'
							+ '<li>'
							+ '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>'
							+ '</li>'
							+ '<li>'
							+ '<a data-calendar-view="basicDay" href="">Day View</a>'
							+ '</li>'
							+ '<li>'
							+ '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>'
							+ '</li>' + '</ul>' + '</div>' + '</li>';

					// Open new event modal on selecting a day
					this.onSelect = function(argStart, argEnd) {
						var modalInstance = $modal.open({
							templateUrl : 'addEvent.html',
							controller : 'addeventCtrl',
							backdrop : 'static',
							keyboard : false,
							resolve : {
								calendarData : function() {
									var x = [ argStart, argEnd ];
									return x;
								}
							}
						});
					}
				})

		// Add event Controller (Modal Instance)
		.controller(
				'addeventCtrl',
				function($scope, $modalInstance, calendarData) {

					// Calendar Event Data
					$scope.calendarData = {
						eventStartDate : calendarData[0],
						eventEndDate : calendarData[1]
					};

					// Tags
					$scope.tags = [ 'bgm-teal', 'bgm-red', 'bgm-pink',
							'bgm-blue', 'bgm-lime', 'bgm-green', 'bgm-cyan',
							'bgm-orange', 'bgm-purple', 'bgm-gray',
							'bgm-black', ]

					// Select Tag
					$scope.currentTag = '';

					$scope.onTagClick = function(tag, $index) {
						$scope.activeState = $index;
						$scope.activeTagColor = tag;
					}

					// Add new event
					$scope.addEvent = function() {
						if ($scope.calendarData.eventName) {

							// Render Event
							$('#calendar').fullCalendar('renderEvent', {
								title : $scope.calendarData.eventName,
								start : $scope.calendarData.eventStartDate,
								end : $scope.calendarData.eventEndDate,
								allDay : true,
								className : $scope.activeTagColor

							}, true); // Stick the event

							$scope.activeState = -1;
							$scope.calendarData.eventName = '';
							$modalInstance.close();
						}
					}

					// Dismiss
					$scope.eventDismiss = function() {
						$modalInstance.dismiss();
					}
				})

		// =========================================================================
		// COMMON FORMS
		// =========================================================================

		.controller('formCtrl', function() {

			// Input Slider
			this.nouisliderValue = 4;
			this.nouisliderFrom = 25;
			this.nouisliderTo = 80;
			this.nouisliderRed = 35;
			this.nouisliderBlue = 90;
			this.nouisliderCyan = 20;
			this.nouisliderAmber = 60;
			this.nouisliderGreen = 75;

			// Color Picker
			this.color = '#03A9F4';
			this.color2 = '#8BC34A';
			this.color3 = '#F44336';
			this.color4 = '#FFC107';
		})

		// =========================================================================
		// PHOTO GALLERY
		// =========================================================================

		.controller('photoCtrl', function() {

			// Default grid size (2)
			this.photoColumn = 'col-md-2';
			this.photoColumnSize = 2;

			this.photoOptions = [ {
				value : 2,
				column : 6
			}, {
				value : 3,
				column : 4
			}, {
				value : 4,
				column : 3
			}, {
				value : 1,
				column : 12
			}, ]

			// Change grid
			this.photoGrid = function(size) {
				this.photoColumn = 'col-md-' + size;
				this.photoColumnSize = size;
			}

		})

		// =========================================================================
		// ANIMATIONS DEMO
		// =========================================================================
		.controller('animCtrl', function($timeout) {

			// Animation List
			this.attentionSeekers = [ {
				animation : 'bounce',
				target : 'attentionSeeker'
			}, {
				animation : 'flash',
				target : 'attentionSeeker'
			}, {
				animation : 'pulse',
				target : 'attentionSeeker'
			}, {
				animation : 'rubberBand',
				target : 'attentionSeeker'
			}, {
				animation : 'shake',
				target : 'attentionSeeker'
			}, {
				animation : 'swing',
				target : 'attentionSeeker'
			}, {
				animation : 'tada',
				target : 'attentionSeeker'
			}, {
				animation : 'wobble',
				target : 'attentionSeeker'
			} ]
			this.flippers = [ {
				animation : 'flip',
				target : 'flippers'
			}, {
				animation : 'flipInX',
				target : 'flippers'
			}, {
				animation : 'flipInY',
				target : 'flippers'
			}, {
				animation : 'flipOutX',
				target : 'flippers'
			}, {
				animation : 'flipOutY',
				target : 'flippers'
			} ]
			this.lightSpeed = [ {
				animation : 'lightSpeedIn',
				target : 'lightSpeed'
			}, {
				animation : 'lightSpeedOut',
				target : 'lightSpeed'
			} ]
			this.special = [ {
				animation : 'hinge',
				target : 'special'
			}, {
				animation : 'rollIn',
				target : 'special'
			}, {
				animation : 'rollOut',
				target : 'special'
			} ]
			this.bouncingEntrance = [ {
				animation : 'bounceIn',
				target : 'bouncingEntrance'
			}, {
				animation : 'bounceInDown',
				target : 'bouncingEntrance'
			}, {
				animation : 'bounceInLeft',
				target : 'bouncingEntrance'
			}, {
				animation : 'bounceInRight',
				target : 'bouncingEntrance'
			}, {
				animation : 'bounceInUp',
				target : 'bouncingEntrance'
			} ]
			this.bouncingExits = [ {
				animation : 'bounceOut',
				target : 'bouncingExits'
			}, {
				animation : 'bounceOutDown',
				target : 'bouncingExits'
			}, {
				animation : 'bounceOutLeft',
				target : 'bouncingExits'
			}, {
				animation : 'bounceOutRight',
				target : 'bouncingExits'
			}, {
				animation : 'bounceOutUp',
				target : 'bouncingExits'
			} ]
			this.rotatingEntrances = [ {
				animation : 'rotateIn',
				target : 'rotatingEntrances'
			}, {
				animation : 'rotateInDownLeft',
				target : 'rotatingEntrances'
			}, {
				animation : 'rotateInDownRight',
				target : 'rotatingEntrances'
			}, {
				animation : 'rotateInUpLeft',
				target : 'rotatingEntrances'
			}, {
				animation : 'rotateInUpRight',
				target : 'rotatingEntrances'
			} ]
			this.rotatingExits = [ {
				animation : 'rotateOut',
				target : 'rotatingExits'
			}, {
				animation : 'rotateOutDownLeft',
				target : 'rotatingExits'
			}, {
				animation : 'rotateOutDownRight',
				target : 'rotatingExits'
			}, {
				animation : 'rotateOutUpLeft',
				target : 'rotatingExits'
			}, {
				animation : 'rotateOutUpRight',
				target : 'rotatingExits'
			} ]
			this.fadeingEntrances = [ {
				animation : 'fadeIn',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInDown',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInDownBig',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInLeft',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInLeftBig',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInRight',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInRightBig',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInUp',
				target : 'fadeingEntrances'
			}, {
				animation : 'fadeInBig',
				target : 'fadeingEntrances'
			} ]
			this.fadeingExits = [ {
				animation : 'fadeOut',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutDown',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutDownBig',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutLeft',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutLeftBig',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutRight',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutRightBig',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutUp',
				target : 'fadeingExits'
			}, {
				animation : 'fadeOutUpBig',
				target : 'fadeingExits'
			} ]
			this.zoomEntrances = [ {
				animation : 'zoomIn',
				target : 'zoomEntrances'
			}, {
				animation : 'zoomInDown',
				target : 'zoomEntrances'
			}, {
				animation : 'zoomInLeft',
				target : 'zoomEntrances'
			}, {
				animation : 'zoomInRight',
				target : 'zoomEntrances'
			}, {
				animation : 'zoomInUp',
				target : 'zoomEntrances'
			} ]
			this.zoomExits = [ {
				animation : 'zoomOut',
				target : 'zoomExits'
			}, {
				animation : 'zoomOutDown',
				target : 'zoomExits'
			}, {
				animation : 'zoomOutLeft',
				target : 'zoomExits'
			}, {
				animation : 'zoomOutRight',
				target : 'zoomExits'
			}, {
				animation : 'zoomOutUp',
				target : 'zoomExits'
			} ]

			// Animate
			this.ca = '';

			this.setAnimation = function(animation, target) {
				if (animation === "hinge") {
					animationDuration = 2100;
				} else {
					animationDuration = 1200;
				}

				angular.element('#' + target).addClass(animation);

				$timeout(function() {
					angular.element('#' + target).removeClass(animation);
				}, animationDuration);
			}

		})
function searchUtil(item, toSearch) {
	/* Search Text in all 3 fields */
	if (item.firstName != undefined) {
		return (item.firstName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1
				|| item.lastName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.employeeId == toSearch) ? true
				: false;
	} else if (item.address != undefined) {
		return (item.address.toLowerCase().indexOf(toSearch.toLowerCase()) > -1
				|| item.customerName.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1
				|| item.country.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.zipCode == toSearch) ? true
				: false;
	} else if (item.departmentName != undefined) {
		return (item.departmentName.toLowerCase().indexOf(
				toSearch.toLowerCase()) > -1
				|| item.manager.parentDepartment.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1 || item.zipCode == toSearch) ? true
				: false;
	} else if (item.roleName != undefined) {
		return (item.roleName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true
				: false;
	} else if (item.taskName != undefined) {
		return (item.taskName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1
				|| item.customer.customerName.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1
				|| item.department.departmentName.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1 || item.zipCode == toSearch) ? true
				: false;
	} else if (item.projectid != undefined) {

		return (item.projectName.toLowerCase().indexOf(toSearch.toLowerCase()) > -1
				|| item.projectName.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1
				|| item.customerProjectCode.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1
				|| item.projectType.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1
				|| item.projectStatus.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1 || item.zipCode == toSearch) ? true
				: false;

	} else if (item.leaveId != undefined) {

		return (item.employee.lastName.toLowerCase().indexOf(
				toSearch.toLowerCase()) > -1 || item.employee.firstName
				.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true
				: false;

	} else if (item.customerProgramId != undefined) {

		return (item.customer.customerName.toLowerCase().indexOf(
				toSearch.toLowerCase()) > -1
				|| item.customerProgramCode.toLowerCase().indexOf(
						toSearch.toLowerCase()) > -1 || item.customerProgramType
				.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true
				: false;

	}
}

/* Get Dummy Data for Example */
function getDummyData() {
	return [ {
		EmpId : 2,
		name : 'Jitendra',
		Email : 'jz@gmail.com'
	}, {
		EmpId : 1,
		name : 'Minal',
		Email : 'amz@gmail.com'
	}, {
		EmpId : 3,
		name : 'Rudra',
		Email : 'ruz@gmail.com'
	}, {
		EmpId : 21,
		name : 'Jitendra1',
		Email : 'jz@gmail.com'
	}, {
		EmpId : 11,
		name : 'Minal1',
		Email : 'amz@gmail.com'
	}, {
		EmpId : 31,
		name : 'Rudra1',
		Email : 'ruz@gmail.com'
	}, {
		EmpId : 22,
		name : 'Jitendra2',
		Email : 'jz@gmail.com'
	}, {
		EmpId : 12,
		name : 'Minal2',
		Email : 'amz@gmail.com'
	}, {
		EmpId : 32,
		name : 'Rudra2',
		Email : 'ruz@gmail.com'
	}, {
		EmpId : 23,
		name : 'Jitendra3',
		Email : 'jz@gmail.com'
	}, {
		EmpId : 13,
		name : 'Minal3',
		Email : 'amz@gmail.com'
	}, {
		EmpId : 33,
		name : 'Rudra3',
		Email : 'ruz@gmail.com'
	} ];
}
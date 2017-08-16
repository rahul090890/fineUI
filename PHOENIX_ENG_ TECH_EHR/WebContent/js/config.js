materialAdmin
		.config(function($stateProvider, $urlRouterProvider, $windowProvider) {
			// $urlRouterProvider.otherwise("/home");
			var $window = $windowProvider.$get();
			$urlRouterProvider.otherwise("/");
			// var homeurl='views/home.html';
			/*
			 * if(!$window.sessionStorage.getItem("Access-Token") ||
			 * !$window.sessionStorage.getItem("AuthKey") ||
			 * !$window.sessionStorage.getItem("EmployeeId")){
			 * homeurl='views/home.html'; } $route.reload();
			 */
			/*
			 * else if(1==$window.sessionStorage.getItem("roleId")){
			 * homeurl='views/home.html'; } else
			 * if(1==$window.sessionStorage.getItem("roleId")){
			 * homeurl='views/home.html'; } else
			 * if(1==$window.sessionStorage.getItem("roleId")){
			 * homeurl='views/home.html'; }
			 */
			$stateProvider

					.state('/', {
						url : '/',
						templateUrl : 'views/login.html'
					})

					.state(
							'home',
							{
								url : '/home',
								templateUrl : 'views/home.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [
																	'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css', ]
														},
														{
															name : 'vendors',
															insertBefore : '#app-level-js',
															files : [
																	'vendors/sparklines/jquery.sparkline.min.js',
																	'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
																	'vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js' ]
														} ])
									}
								}
							})

					// ------------------------------
					// HEADERS
					// ------------------------------
					.state('headers.addleaves', {
						url : '/addLeaves',
						templateUrl : 'views/adminleavesetting.html'
					})
					.state('headers',{
						url:'/headers',
						templateUrl : 'views/common-2.html'
					})
					.state('headers.applyLeave', {
						url : '/applyLeave',
						templateUrl : 'views/applyLeave.html'
					})
					.state('headers.approveTimeSheet', {
						url : '/approveTimeSheet',
						templateUrl : 'views/approveTimeSheet.html'
					})
					.state('headers.leavehistory', {
						url : '/leavehistory',
						templateUrl : 'views/leavehistory.html'
					})
					.state('headers.createuser', {
						url : '/createuser',
						templateUrl : 'views/createuser.html'
					})
					.state('headers.edituser', {
						url : '/edituser',
						templateUrl : 'views/edituser.html'
					})
					.state('headers.edituserdetails', {
						url : '/edituserdetails',
						templateUrl : 'views/edituserdetails.html'
					})
					.state('headers.addcustomer', {
						url : '/addcustomer',
						templateUrl : 'views/addcustomer.html'
					})
					.state('headers.editcustomer', {
						url : '/editcustomer',
						templateUrl : 'views/editcustomer.html'
					})
					.state('headers.adddepartment', {
						url : '/adddepartment',
						templateUrl : 'views/adddepartment.html'
					})
					.state('headers.updateuserdetails', {
						url : '/updateuserdetails',
						templateUrl : 'views/updateuserdetails.html'

					})
					.state('headers.updatetask', {
						url : '/updatetask',
						templateUrl : 'views/updatetask.html'

					})
					.state('headers.editdepartment', {
						url : '/editdepartment',
						templateUrl : 'views/editdepartment.html'
					})
					.state('headers.addrole', {
						url : '/addrole',
						templateUrl : 'views/addrole.html'
					})
					.state('headers.approveLeave', {
						url : '/approveLeave',
						templateUrl : 'views/approveLeave.html'
					})
					.state('headers.editrole', {
						url : '/editrole',
						templateUrl : 'views/editrole.html'
					})
					.state('headers.addproject', {
						url : '/addproject',
						templateUrl : 'views/addproject.html'
					})
					.state('headers.editproject', {
						url : '/editproject',
						templateUrl : 'views/editproject.html'
					})
					.state('headers.addleave', {
						url : '/addleave',
						templateUrl : 'views/addleave.html'
					})
					.state('headers.editleave', {
						url : '/editleave',
						templateUrl : 'views/editleave.html'
					})
					.state('headers.addcpc', {
						url : '/addcustomerprogramcode',
						templateUrl : 'views/addcpc.html'
					})
					.state('headers.editcpc', {
						url : '/editcustomerprogramcode',
						templateUrl : 'views/editcpc.html'
					})
					.state('headers.addtimesheet', {
						url : '/addtimesheet',
						templateUrl : 'views/addtimesheet.html'
					})
					.state('headers.edittimesheet', {
						url : '/edittimesheet',
						templateUrl : 'views/edittimesheet.html'
					})
					.state('headers.timesheet', {
						url : '/timesheet',
						templateUrl : 'views/timesheet.html'
					})
					.state('headers.timesheethistory', {
						url : '/timesheethistory',
						templateUrl : 'views/timesheethistory.html'
					})

					.state('headers.taskoperations', {
						url : '/taskoperations',
						templateUrl : 'views/taskoperations.html'
					})
					.state('headers.userprofile', {
						url : '/user',
						templateUrl : 'views/userprofile.html'
					})
					.state('headers.mainmenu-on-top', {
						url : '/mainmenu-on-top',
						templateUrl : 'views/mainmenu-on-top.html'
					})

					// ------------------------------
					// TYPOGRAPHY
					// ------------------------------

					.state('typography', {
						url : '/typography',
						templateUrl : 'views/typography.html'
					})

					// ------------------------------
					// WIDGETS
					// ------------------------------

					.state('widgets', {
						url : '/widgets',
						templateUrl : 'views/common.html'
					})

					.state(
							'widgets.widgets',
							{
								url : '/widgets',
								templateUrl : 'views/widgets.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [
																	'vendors/bower_components/mediaelement/build/mediaelementplayer.css', ]
														},
														{
															name : 'vendors',
															files : [
																	'vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
																	'vendors/bower_components/autosize/dist/autosize.min.js' ]
														} ])
									}
								}
							})

					.state('widgets.widget-templates', {
						url : '/widget-templates',
						templateUrl : 'views/widget-templates.html',
					})

					// ------------------------------
					// TABLES
					// ------------------------------

					.state('tables', {
						url : '/tables',
						templateUrl : 'views/common.html'
					})

					.state('tables.tables', {
						url : '/tables',
						templateUrl : 'views/tables.html'
					})

					.state('tables.data-table', {
						url : '/data-table',
						templateUrl : 'views/data-table.html'
					})

					// ------------------------------
					// FORMS
					// ------------------------------
					.state('form', {
						url : '/form',
						templateUrl : 'views/common.html'
					})

					.state(
							'form.basic-form-elements',
							{
								url : '/basic-form-elements',
								templateUrl : 'views/form-elements.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([ {
													name : 'vendors',
													files : [ 'vendors/bower_components/autosize/dist/autosize.min.js' ]
												} ])
									}
								}
							})

					.state(
							'form.form-components',
							{
								url : '/form-components',
								templateUrl : 'views/form-components.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [
																	'vendors/bower_components/nouislider/jquery.nouislider.css',
																	'vendors/farbtastic/farbtastic.css',
																	'vendors/bower_components/summernote/dist/summernote.css',
																	'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
																	'vendors/bower_components/chosen/chosen.min.css' ]
														},
														{
															name : 'vendors',
															files : [
																	'vendors/input-mask/input-mask.min.js',
																	'vendors/bower_components/nouislider/jquery.nouislider.min.js',
																	'vendors/bower_components/moment/min/moment.min.js',
																	'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
																	'vendors/bower_components/summernote/dist/summernote.min.js',
																	'vendors/fileinput/fileinput.min.js',
																	'vendors/bower_components/chosen/chosen.jquery.js',
																	'vendors/bower_components/angular-chosen-localytics/chosen.js',
																	'vendors/bower_components/angular-farbtastic/angular-farbtastic.js' ]
														} ])
									}
								}
							})

					.state('form.form-examples', {
						url : '/form-examples',
						templateUrl : 'views/form-examples.html'
					})

					.state('form.form-validations', {
						url : '/form-validations',
						templateUrl : 'views/form-validations.html'
					})

					// ------------------------------
					// USER INTERFACE
					// ------------------------------

					.state('user-interface', {
						url : '/user-interface',
						templateUrl : 'views/common.html'
					})

					.state('user-interface.ui-bootstrap', {
						url : '/ui-bootstrap',
						templateUrl : 'views/ui-bootstrap.html'
					})

					.state('user-interface.colors', {
						url : '/colors',
						templateUrl : 'views/colors.html'
					})

					.state('user-interface.animations', {
						url : '/animations',
						templateUrl : 'views/animations.html'
					})

					.state('user-interface.box-shadow', {
						url : '/box-shadow',
						templateUrl : 'views/box-shadow.html'
					})

					.state('user-interface.buttons', {
						url : '/buttons',
						templateUrl : 'views/buttons.html'
					})

					.state('user-interface.icons', {
						url : '/icons',
						templateUrl : 'views/icons.html'
					})

					.state('user-interface.alerts', {
						url : '/alerts',
						templateUrl : 'views/alerts.html'
					})

					.state('user-interface.preloaders', {
						url : '/preloaders',
						templateUrl : 'views/preloaders.html'
					})

					.state('user-interface.notifications-dialogs', {
						url : '/notifications-dialogs',
						templateUrl : 'views/notification-dialog.html'
					})

					.state(
							'user-interface.media',
							{
								url : '/media',
								templateUrl : 'views/media.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [
																	'vendors/bower_components/mediaelement/build/mediaelementplayer.css',
																	'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css' ]
														},
														{
															name : 'vendors',
															files : [
																	'vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
																	'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js' ]
														} ])
									}
								}
							})

					.state('user-interface.other-components', {
						url : '/other-components',
						templateUrl : 'views/other-components.html'
					})

					// ------------------------------
					// CHARTS
					// ------------------------------

					.state('charts', {
						url : '/charts',
						templateUrl : 'views/common.html'
					})

					.state('charts.flot-charts', {
						url : '/flot-charts',
						templateUrl : 'views/flot-charts.html',
					})

					.state(
							'charts.other-charts',
							{
								url : '/other-charts',
								templateUrl : 'views/other-charts.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([ {
													name : 'vendors',
													files : [
															'vendors/sparklines/jquery.sparkline.min.js',
															'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js', ]
												} ])
									}
								}
							})

					// ------------------------------
					// CALENDAR
					// ------------------------------

					.state(
							'calendar',
							{
								url : '/calendar',
								templateUrl : 'views/calendar.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [
																	'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css', ]
														},
														{
															name : 'vendors',
															files : [
																	'vendors/bower_components/moment/min/moment.min.js',
																	'vendors/bower_components/fullcalendar/dist/fullcalendar.min.js' ]
														} ])
									}
								}
							})

					// ------------------------------
					// PHOTO GALLERY
					// ------------------------------

					.state(
							'photo-gallery',
							{
								url : '/photo-gallery',
								templateUrl : 'views/common.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [ 'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css' ]
														},
														{
															name : 'vendors',
															files : [ 'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js' ]
														} ])
									}
								}
							})

					// Default

					.state('photo-gallery.photos', {
						url : '/photos',
						templateUrl : 'views/photos.html'
					})

					// Timeline

					.state('photo-gallery.timeline', {
						url : '/timeline',
						templateUrl : 'views/photo-timeline.html'
					})

					// ------------------------------
					// GENERIC CLASSES
					// ------------------------------

					.state('generic-classes', {
						url : '/generic-classes',
						templateUrl : 'views/generic-classes.html'
					})

					// ------------------------------
					// PAGES
					// ------------------------------

					.state('pages', {
						url : '/pages',
						templateUrl : 'views/common.html'
					})

					// Profile

					.state('pages.profile', {
						url : '/profile',
						templateUrl : 'views/passwordmanagement.html'
					})

					.state('pages.profile.profile-about', {
						url : '/profile-about',
						templateUrl : 'views/profile-about.html'
					})

					.state(
							'pages.profile.profile-timeline',
							{
								url : '/profile-timeline',
								templateUrl : 'views/profile-timeline.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [ 'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css' ]
														},
														{
															name : 'vendors',
															files : [ 'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js' ]
														} ])
									}
								}
							})

					.state(
							'pages.profile.profile-photos',
							{
								url : '/profile-photos',
								templateUrl : 'views/profile-photos.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'css',
															insertBefore : '#app-level',
															files : [ 'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css' ]
														},
														{
															name : 'vendors',
															files : [ 'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js' ]
														} ])
									}
								}
							})

					.state('pages.profile.profile-connections', {
						url : '/profile-connections',
						templateUrl : 'views/profile-connections.html'
					})

					// -------------------------------

					.state('pages.listview', {
						url : '/listview',
						templateUrl : 'views/list-view.html'
					})

					.state('pages.messages', {
						url : '/messages',
						templateUrl : 'views/messages.html'
					})

					.state('pages.pricing-table', {
						url : '/pricing-table',
						templateUrl : 'views/pricing-table.html'
					})

					.state('pages.contacts', {
						url : '/contacts',
						templateUrl : 'views/contacts.html'
					})

					.state('pages.invoice', {
						url : '/invoice',
						templateUrl : 'views/invoice.html'
					})

					.state(
							'pages.wall',
							{
								url : '/wall',
								templateUrl : 'views/wall.html',
								resolve : {
									loadPlugin : function($ocLazyLoad) {
										return $ocLazyLoad
												.load([
														{
															name : 'vendors',
															insertBefore : '#app-level',
															files : [
																	'vendors/bower_components/autosize/dist/autosize.min.js',
																	'vendors/bower_components/lightgallery/light-gallery/css/lightGallery.css' ]
														},
														{
															name : 'vendors',
															files : [
																	'vendors/bower_components/mediaelement/build/mediaelement-and-player.js',
																	'vendors/bower_components/lightgallery/light-gallery/js/lightGallery.min.js' ]
														} ])
									}
								}
							})

					// ------------------------------
					// BREADCRUMB DEMO
					// ------------------------------
					.state('breadcrumb-demo', {
						url : '/breadcrumb-demo',
						templateUrl : 'views/breadcrumb-demo.html'
					})
		});

materialAdmin.config(function($httpProvider) {
	// Enable cross domain calls
	// Remove the header used to identify ajax call that would prevent CORS from
	// working
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

});

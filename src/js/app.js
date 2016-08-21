require('jquery');
require('jquery-bridget');
require('ev-emitter');
require('matches-selector');
require('fizzy-ui-utils');
require('get-size');
require('mixpanel');
require('outlayer/item');
require('outlayer');
require('masonry-layout');
require('imagesloaded');
var angular = require('angular');
require('angular-masonry');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('ng-tags-input');

angular.module('partnr.auth', [])
    .factory('principal', require('./auth/principalService.js'))
    .factory('authorization', require('./auth/authorizeService.js'))
    .directive('loginForm', require('./auth/loginFormDirective.js'))
    .controller('LoginController', require('./auth/loginCtrl.js'));

angular.module('partnr.users', [])
    .controller('CreateUserController', require('./user/createUserCtrl.js'))
    .controller('ForgotPasswordController', require('./user/forgotPasswordCtrl.js'))
    .controller('ResetPasswordController', require('./user/resetPasswordCtrl.js'))
    .directive('userCard', require('./user/userCardDirective.js'))
    .factory('users', require('./user/userService.js'));

angular.module('partnr.messaging', [])
    .factory('conversations', require('./conversations/conversationService.js'))
    .controller('ListConversationController', require('./conversations/listConversationCtrl.js'))
    .controller('ProjectConversationController', require('./conversations/projectConversationCtrl.js'));

angular.module('partnr.notify', [])
    .factory('toaster', require('./toaster/toasterService.js'))
    .factory('notifications', require('./notifications/notificationService.js'))
    .directive('toaster', require('./toaster/toastDirective.js'))
    .controller('ListNotificationsController', require('./notifications/listNotificationsCtrl.js'));

angular.module('partnr.search', [])
    .factory('search', require('./search/searchService.js'))
    .controller('SearchController', require('./search/searchCtrl.js'));

angular.module('partnr.users.assets', [])
    .factory('feeds', require('./feed/feedService.js'))
    .factory('skills', require('./skills/skillService.js'))
    .factory('profiles', require('./user/profile/profileService.js'))
    .factory('projects', require('./projects/projectService.js'))
    .factory('applications', require('./projects/applications/applicationService.js'))
    .factory('comments', require('./projects/comments/commentService.js'))
    .factory('roles', require('./projects/roles/roleService.js'))
    .factory('milestones', require('./projects/taskmgr/milestoneService.js'))
    .factory('tasks', ['$rootScope', '$http', '$log', 'principal', require('./projects/taskmgr/taskService.js')])
    .directive('feedActivity', require('./feed/feedActivityDirective.js'))
    .directive('categoryButton', require('./skills/categoryButtonDirective.js'))
    .directive('skillCategoryEditor', require('./skills/skillCategoryEditorDirective.js'))
    .directive('roleCard', require('./projects/roles/roleCardDirective.js'))
    .directive('milestoneTile', require('./projects/taskmgr/milestoneTileDirective.js'))
    .directive('taskTile', require('./projects/taskmgr/taskTileDirective.js'))
    .directive('projectTile', require('./projects/projectTileDirective.js'))
    .controller('FeedController', require('./feed/feedCtrl.js'))
    .controller('SettingsController', require('./settings/settingsCtrl.js'))
    .controller('pnConnBtn', require('./shared/connBtnDirective.js'))
    .controller('CreateProfileController', require('./user/profile/createProfileCtrl.js'))
    .controller('EditProfileController', require('./user/profile/editProfileCtrl.js'))
    .controller('ProfileController', require('./user/profile/profileCtrl.js'))
    .controller('PartnersController', require('./partners/partnersCtrl.js'))
    .controller('ListApplicationsController', require('./projects/applications/listApplicationsCtrl.js'))
    .controller('ListTasksController', require('./projects/taskmgr/ListTasksCtrl.js'))
    .controller('MilestoneController', require('./projects/taskmgr/milestoneCtrl.js'))
    .controller('MilestoneFormController', require('./projects/taskmgr/milestoneCtrl.js'))
    .controller('TaskFormController', require('./projects/taskmgr/taskFormCtrl.js'))
    .controller('CreateProjectController', require('./projects/createProjectCtrl.js'))
    .controller('EditProjectController', require('./projects/editProjectCtrl.js'))
    .controller('ListProjectController', require('./projects/listProjectCtrl.js'))
    .controller('ProjectController', require('./projects/projectCtrl.js'))
    .controller('ProjectWrapperController', require('./projects/projectWrapperCtrl.js'))
    .controller('UserListProjectController', require('./projects/userListProjectCtrl.js'));

angular.module('partnr.core', ['ui.router',
        'ui.bootstrap', 'wu.masonry', 'ngTagsInput',
        'partnr.auth', 'partnr.users', 'partnr.messaging',
        'partnr.notify', 'partnr.search', 'partnr.users.assets',
        'templates'
    ])
    .config(require('./appRoutes.js'))
    .factory('routeUtils', require('./utils/routeUtilsService.js'))
    .controller('LandingController', require('./landing/landingCtrl.js'))
    .directive('pnBgImg', require('./shared/bgImgDirective.js'))
    .controller('HomeController', require('./home/homeCtrl'))
    .controller('SharedController', require('./shared/sharedCtrl.js'))
    .run(['$state', '$rootScope', '$compile', '$log', '$window', '$location', 'principal', 'authorization', 'skills', '$templateCache',
        function($state, $rootScope, $compile, $log, $window, $location, principal, authorization, skills, $templateCache) {

            /**
             * Set basic app-level variables and manage state changes
             */

            var apiHostElt = document.getElementById('api-endpoints');
            var apiHost = '';
            document.domain = 'partnr-up.com';
            if (window.location.host === 'app.partnr-up.com') {
                apiHost = apiHostElt.getAttribute('prd');
                $logProvider.debugEnabled(false);
                $compile.debugInfoEnabled(false);
            } else if (window.location.host === 'dev.partnr-up.com') {
                apiHost = apiHostElt.getAttribute('dev');
            } else {
                apiHost = apiHostElt.getAttribute('lcl');
            }

            principal.fetchCsrf();
            $rootScope.$state = $state; // application state
            $rootScope.apiVersion = "v1";
            $rootScope.apiRoute = apiHost + '/api/' + $rootScope.apiVersion + '/';
            $rootScope.version = '1.1.0';
            $rootScope.pollDuration = 10000;
            var bypassAuthCheck = false;

            console.log($rootScope.apiRoute);
            console.log(apiHost);

            $rootScope.isLoggedIn = function() {
                return principal.isAuthenticated();
            };

            $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
                if (bypassAuthCheck) {
                    bypassAuthCheck = false;
                    return;
                }

                e.preventDefault();
                $log.debug("[STATE] State change occurring: " + toState.name);
                bypassAuthCheck = true;
                $rootScope.toState = toState;
                $rootScope.toParams = toParams;

                authorization.authorize().then(function(authorized) {
                    if (authorized) {
                        if ($state.current.name == toState) {
                            bypassAuthCheck = false;
                        } else {
                            $state.go(toState, toParams);
                        }
                    } else {
                        if ($state.current.name == 'login') {
                            bypassAuthCheck = false;
                        } else {
                            $state.go('login');
                        }
                    }
                });
            });

            $rootScope.$on('$stateChangeSuccess', function(event) {
                if (!$window.ga)
                    return;

                $window.ga('send', 'pageview', { page: $location.url() });
            });

            /**
             * Load skill categories
             */
            $rootScope.categories = [];
            skills.listCategories().then(function(result) {
                if (result.data) {
                    $rootScope.categories = result.data;

                    for (var i = 0; i < $rootScope.categories.length; i++) {
                        $rootScope.categories[i].color_rgb = skills.hexToRgb($rootScope.categories[i].color_hex);
                    }

                    $log.debug(result.data);
                }
            });

            document.getElementById('appVersion').text = $rootScope.version;
        }
    ]);

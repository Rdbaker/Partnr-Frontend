require('jquery');
require('jquery-bridget');
require('ev-emitter');
require('matches-selector');
require('fizzy-ui-utils');
require('get-size');
require('outlayer/item');
require('outlayer');
require('masonry-layout');
require('imagesloaded');
var angular = require('angular');
require('angular-masonry');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('ng-tags-input');

require('./skills/skillService.js');

angular.module('partnr.auth', [])
  .factory('principal', ['$rootScope', '$http', '$log', '$q', 'toaster', require('./auth/principalService.js')])
  .factory('authorization', ['$rootScope', '$state', '$log', '$q', 'principal', require('./auth/authorizeService.js')])
  .directive('loginForm', require('./auth/loginFormDirective.js'))
  .controller('LoginController', ['$scope', '$log', '$state', '$q', 'principal', 'toaster', require('./auth/loginCtrl.js')]);

angular.module('partnr.users', [])
  .controller('CreateUserController', ['$scope', '$state', '$log', '$q', 'users', 'principal', 'toaster', require('./user/createUserCtrl.js')])
  .controller('ForgotPasswordController', ['$scope', '$state', '$log', '$q', 'users', 'principal', 'toaster', require('./user/forgotPasswordCtrl.js')])
  .controller('ResetPasswordController', ['$scope', '$state', '$stateParams', '$log', '$q', 'users', 'principal', 'toaster', require('./user/resetPasswordCtrl.js')])
  .directive('userCard', ['$rootScope', '$state', require('./user/userCardDirective.js')])
  .factory('users', ['$rootScope', '$http', '$log', 'principal', require('./user/userService.js')]);

angular.module('partnr.messaging', [])
  .factory('conversations', ['$rootScope', '$http', '$log', 'principal', require('./conversations/conversationService.js')])
  .controller('ListConversationController', ['$scope', 'conversations', require('./conversations/listConversationCtrl.js')])
  .controller('ProjectConversationController', ['$rootScope', '$scope', '$stateParams',
    '$log', '$interval', 'toaster', 'conversations', require('./conversations/projectConversationCtrl.js')]);

angular.module('partnr.notify', [])
  .factory('toaster', ['$rootScope', require('./toaster/toasterService.js')])
  .factory('notifications', ['$rootScope', '$http', '$log', '$q', '$timeout', 'principal', require('./notifications/notificationService.js')])
  .directive('toaster', ['$rootScope', 'toaster', require('./toaster/toastDirective.js')])
  .controller('ListNotificationsController', ['$scope', '$state', '$stateParams',
    '$log', 'notifications', 'routeUtils', require('./notifications/listNotificationsCtrl.js')]);

angular.module('partnr.search', [])
  .factory('search', ['$rootScope', '$http', '$log', 'principal', require('./search/searchService.js')])
  .controller('SearchController', ['$scope', '$state', '$stateParams', '$q', '$log', 'principal',
    'search', 'toaster', 'applications', require('./search/searchCtrl.js')]);

angular.module('partnr.users.assets', [])
  .factory('skills', ['$rootScope', '$http', '$log', 'principal', require('./skills/skillService.js')])
  .factory('profiles', ['$rootScope', '$http', '$log', 'principal', require('./user/profile/profileService.js')])
  .factory('projects', ['$rootScope', '$http', '$log', 'principal', require('./projects/projectService.js')])
  .factory('applications', ['$rootScope', '$http', '$log', 'principal', require('./projects/applications/applicationService.js')])
  .factory('comments', ['$rootScope', '$http', '$log', 'principal', require('./projects/comments/commentService.js')])
  .factory('roles', ['$rootScope', '$http', '$log', 'principal', require('./projects/roles/roleService.js')])
  .factory('milestones', ['$rootScope', '$http', '$log', 'principal', require('./projects/taskmgr/milestoneService.js')])
  .factory('tasks', ['$rootScope', '$http', '$log', 'principal', require('./projects/taskmgr/taskService.js')])
  .directive('categoryButton', ['$rootScope', '$state', 'skills', require('./skills/categoryButtonDirective.js')])
  .directive('skillCategoryEditor', ['$rootScope', '$state', '$log', 'skills', require('./skills/skillCategoryEditorDirective.js')])
  .directive('roleCard', ['$rootScope', '$state', require('./projects/roles/roleCardDirective.js')])
  .directive('milestoneTile', ['$rootScope', '$state', require('./projects/taskmgr/milestoneTileDirective.js')])
  .directive('taskTile', ['$rootScope', '$state', 'tasks', require('./projects/taskmgr/taskTileDirective.js')])
  .directive('projectTile', ['$rootScope', '$state', require('./projects/projectTileDirective.js')])
  .controller('SettingsController', ['$scope', require('./settings/settingsCtrl.js')])
  .controller('pnConnBtn', require('./shared/connBtnDirective.js'))
  .controller('CreateProfileController', ['$scope', '$state', '$log', '$q', 'toaster', 'profiles', 'users', require('./user/profile/createProfileCtrl.js')])
  .controller('EditProfileController', ['$scope', '$state', '$log', '$q', '$filter', 'toaster', 'users',
    'principal', 'profiles', '$rootScope', '$timeout', require('./user/profile/editProfileCtrl.js')])
  .controller('ProfileController', ['$scope', '$state', '$stateParams', '$log', 'toaster', 'users', require('./user/profile/profileCtrl.js')])
  .controller('PartnersController', ['$scope', require('./partners/partnersCtrl.js')])
  .controller('ListApplicationsController', ['$scope', '$state', '$stateParams', '$log',
    '$q', 'projects', 'applications', 'principal', 'toaster', require('./projects/applications/listApplicationsCtrl.js')])
  .controller('ListTasksController', ['$scope', '$state', '$filter', '$stateParams', '$log',
    '$q', 'projects', 'milestones', 'tasks', 'principal', 'toaster', require('./projects/taskmgr/ListTasksCtrl.js')])
  .controller('MilestoneController', ['$scope', '$state', '$filter', '$stateParams', '$log',
    '$q', 'projects', 'milestones', 'tasks', 'principal', 'toaster', require('./projects/taskmgr/milestoneCtrl.js')])
  .controller('MilestoneFormController', ['$scope', '$state', '$stateParams', '$log', '$q',
    '$timeout', 'milestones', 'principal', 'modals', 'toaster', require('./projects/taskmgr/milestoneCtrl.js')])
  .controller('TaskFormController', ['$scope', '$state', '$stateParams', '$log', '$q',
    '$timeout', 'tasks', 'milestones', 'skills', 'principal', 'modals', 'toaster', require('./projects/taskmgr/milestoneCtrl.js')])
  .controller('CreateProjectController', ['$scope', '$state', '$log', '$q',
    '$timeout', 'projects', 'roles', 'principal', 'toaster', require('./projects/createProjectCtrl.js')])
  .controller('EditProjectController', ['$scope', '$state', '$stateParams', '$log', '$q',
    '$filter', 'projects', 'applications', 'roles', 'principal', 'toaster', 'modals', '$rootScope', require('./projects/createProjectCtrl.js')])
  .controller('ListProjectController', ['$scope', '$state', '$log', '$q', 'projects', 'principal', 'toaster', require('./projects/listProjectCtrl.js')])
  .controller('ProjectController', ['$scope', '$state', '$stateParams', '$log', '$q', 'projects',
    'applications', 'comments', 'principal', 'toaster', require('./projects/listProjectCtrl.js')])
  .controller('ProjectWrapperController', ['$scope', '$state', '$stateParams', '$log',
    '$q', 'principal', 'projects', require('./projects/projectWrapperCtrl.js')])
  .controller('UserListProjectController', ['$scope', '$state', '$log',
    '$q', 'projects', 'principal', 'toaster', require('./projects/userListProjectCtrl.js')])
  .controller('ProfileController', ['$scope', '$state', '$stateParams', '$log', '$q', 'toaster', 'users', require('./user/profile/profileCtrl.js')]);

angular.module('partnr.core', ['ui.router',
  'ui.bootstrap', 'wu.masonry', 'ngTagsInput',
  'partnr.auth', 'partnr.users', 'partnr.messaging',
  'partnr.notify', 'partnr.search', 'partnr.users.assets',
  'templates'
  ])
  .config(['$stateProvider', '$urlRouterProvider', require('./appRoutes.js')])
  .factory('routeUtils', ['$rootScope', '$http', '$log', '$q', '$state', 'principal', require('./utils/routeUtilsService.js')])
  .directive('pnBgImg', require('./shared/bgImgDirective.js'))
  .controller('HomeController', ['$scope', '$state', '$q', '$log', 'principal', 'search', 'toaster', 'projects', require('./home/homeCtrl')])
  .controller('SharedController', ['$rootScope', '$scope', '$state', '$stateParams', '$log', '$q',
    'notifications', 'routeUtils', 'principal', 'users', require('./shared/sharedCtrl.js')])
  .run(['$state', '$rootScope', '$compile', '$log', '$log', '$window', '$location', 'principal', 'authorization', 'skills', '$templateCache',
    function ($state, $rootScope, $compile, $log, $log, $window, $location, principal, authorization, skills, $templateCache) {

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
  $rootScope.apiRoute  = apiHost + '/api/' + $rootScope.apiVersion + '/';
  $rootScope.version   = '1.1.0';
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
    };

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
}]);

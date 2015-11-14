(function() {
  'use strict';
  var homeCtrl, listCtrl, parseList, parsePost, parseTitle, postCtrl;

    window.guideApp = angular.module("guide", ["ngRoute", "ngAnimate"]);

    // guideApp.directive('markdown', function() {
    //     return {
    //         restrict: 'EA',
    //         require: '?ngModel',
    //         link: function(scope, element, attrs, ngModel) {
    //             return scope.$watch((function() {
    //                 return ngModel.$modelValue;
    //             }), function(newValue) {
    //                 if (newValue) {
    //                     return element.html(marked(newValue));
    //                 } else {
    //                     return element.html('<div class="sk-spinner sk-spinner-chasing-dots">' +
    //                                         '<div class="sk-dot1"></div>' +
    //                                         '<div class="sk-dot2"></div>' +
    //                                         '</div>');
    //                 }
    //             });
    //         }
    //     };
    // });

    // guideApp.directive('markdowntext', function() {
    //     return {
    //         restrict: 'EA',
    //         link: function(scope, element, attrs) {
    //             return element.html(marked(element.text()));
    //         }
    //     };
    // });

    guideApp.config(function($routeProvider, $locationProvider,$sceProvider) {
        //$sceProvider.enabled(false);

        return $routeProvider.when("/", {

            templateUrl: "/posts/base.html",
            //templateUrl: "/template/home.html",
        }).when("/post/:name/", {
            templateUrl: "/posts/base.html",
            controller: 'postCtrl',
        }).otherwise({
            redirectTo: "/",
        });

        $locationProvider.html5Mode(true);
    });

    parseTitle = function(data) {
        var key, line, r, value, _i, _len, _ref, _ref1;
        r = {
            title: '',
            url: '',
        };
        _ref = data.split('\n');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            _ref1 = line.split(':'), key = _ref1[0], value = _ref1[1];
            value = $.trim(value);
            if (r.hasOwnProperty(key)) {
                r[key] = value;
            }
        }
        return r;
    };

    parseList = function(data) {
        return _.map(data.split(/\n[\-=]+\n/), parseTitle);
    };

    listCtrl = function($scope, $http) {
        window.w = $scope;
        return $http.get("/posts/list.md", {
            cache: true
        }).success(function(data) {
            return $scope.blogList = parseList(data)
        });
    };

    listCtrl.$inject = ['$scope', '$http'];

    parsePost = function(text) {
        var flag, head, line, post, tail, _i, _len, _ref;
        flag = false;
        head = "";
        tail = "";
        _ref = text.split('\n');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            if (/[\-=]+/.test(line)) {
                flag = true;
            }
            if (flag) {
                tail += '\n' + line;
            } else {
                head += '\n' + line;
            }
        }
        post = parseTitle(head);
        post.text = tail;
        if (post.hide === "true") {
            return;
        }
        return post;
    };

    postCtrl = function($scope, $http, $routeParams, $sce) {
        $scope.src_name = $sce.trustAsResourceUrl('/template/' + $routeParams.name)
        //$scope.srcname = $sce.trustAsJs($routeParams.name);

        console.log(!$routeParams.name);
        console.log($routeParams.name)
        //return $http.get('/posts/' + $scope.name).success(function(data) {

        return $http.get('/template/' + $routeParams.name).success(function(data) {

                //return $scope.post = $sce.getTrustedHtml(data);
                //return $scope.post = $sce.trustAsHtml(data);

                //console.log(data);
                return $scope.post = $sce.trustAsHtml(data);
            
            });
        
    };

// Blog.controller('PostsController', function ($scope, $http, $sce) {
//   $scope.posts = [];

//   $scope.syncPosts = function () {
//     var request = $http.get('http:/localhost:3000/posts.json');
//     request.success(function (response) {
//       $scope.posts = angular.forEach(angular.fromJson(response), function (post) {
//         post.trustedBody = $sce.trustAsHtml(post.html_body);
//       });
//     });
//   };

//   $scope.syncPosts();
// });

    postCtrl.$inject = ['$scope', '$http', '$routeParams', '$sce'];

    homeCtrl = function($scope) {};

    homeCtrl.$injector = ['$scope'];

    guideApp.controller('listCtrl', listCtrl);

    guideApp.controller('postCtrl', postCtrl);

    guideApp.controller('homeCtrl', homeCtrl);

}).call(this);

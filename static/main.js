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
            templateUrl: "/template/home.html"
            //templateUrl: "/template/home.html",
        }).when("/post/:name", {
            templateUrl: "/posts/base.html",
            controller: 'postCtrl'
            //templateUrl: "/template/post.html"
        }).otherwise({
            redirectTo: "/",
        });
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
        $scope.name = $routeParams.name;

        $scope.$on('$viewContentLoaded', function(){

            

            Reveal.initialize({
                controls: true,
                progress: true,
                history: true,
                center: true,

                //transition: 'slide', // none/fade/slide/convex/concave/zoom

                // Optional reveal.js plugins
                dependencies: [
                    //{ src: 'bower_components/reveal/lib/js/classList.js', condition: function() { return !document.body.classList; } },
                    { src: 'bower_components/reveal/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    { src: 'bower_components/reveal/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                    { src: 'bower_components/reveal/plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
                    { src: 'bower_components/reveal/plugin/zoom-js/zoom.js', async: true },
                    { src: 'bower_components/reveal/plugin/notes/notes.js', async: true },
                    { src: 'bower_components/reveal/plugin/tagcloud/tagcloud.js', async: true } 
                ]
            });
            alert("123");
        });

        return $http.get('/posts/' + $scope.name).success(function(data) {

            //return $scope.post = parsePost(data);
            //alert(data);
            //alert($sce.isEnabled())
            //return $scope.post = $sce.getTrustedHtml(data);
            //return $scope.post = $sce.trustAsHtml(data);
            //return $scope.post = data;
            //alert("123");
            //$('.slides').innerHtml=
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

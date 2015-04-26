'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoApp
 */
angular.module('angularWaterfallApp',["ngWaterfall","ui.router"])
    .config([          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider,   $urlRouterProvider) {
            $stateProvider.state("home",{
                url: "/home",
                templateUrl: "views/main.html",
                controller: "MainCtrl"
            })
            $urlRouterProvider.otherwise("/home");

        }])
    .factory("myService",function($http){
        return {
            getImages : function(cb){
                $http({ method : "GET", url: 'images.json'}).
                    success(function(data, status) {
                        cb(data,status);
                    }).
                    error(function(data, status) {
                    });
            }
        }
    })
  .controller('MainCtrl', function ($scope,$rootScope,$state,$location,$timeout,myService) {
        var page = 1;
        var pageSize = 20;


        myService.getImages(function(data){
            $scope.images = [];
            $scope.results = data.results.slice(0,page*pageSize);
            for (var i = 0; i < $scope.results.length; i++) {
                $scope.images.push($scope.results[i]);
            }
        })
        $scope.text = "点我加载更多"
        $scope.loadMore = true;
        $scope.loadMoreData = function(){
            $scope.text = "加载中，请稍后···";
            $timeout(function(){
                page++;
                myService.getImages(function(data){
                    $scope.images = [];
                    $scope.results = data.results.slice(0,page*pageSize);
                    if ($scope.results.length == 73) {
                        $scope.text = "内容已经全部加载完毕"
                    }
                    for (var i = 0; i < $scope.results.length; i++) {
                        $scope.images.push($scope.results[i]);
                    }
                })
                $scope.text = "点我加载更多···"
            },1500);
        };
//        $scope.$on("loadMore",function(){//滚动自动填充事件
//            $scope.loadMoreData();
//        })
  })


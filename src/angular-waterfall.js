/**
 * Created by Zed on 2015/4/26.
 * @name ngWaterfall
 */
(function(window,angular){

    angular.module('ngWaterfall',[])
        .directive("repeatFinished",function(){
            return {
                restrict: "A",
                link: function (scope) {
                    if (scope.$last === true) {
                        scope.$emit("repeatFinished");
                    }
                }
            }
        })
        .directive("ngInfiniteScroll",function($rootScope){
            return {
                restrict: "AE",
                replace: true,
                link:function(scope,element,attr,controller){
                    element[0].style.position = "absolute";
                    element[0].style.left = 0;
                    $rootScope.$on("colData",function(ev,data){
                        var sorted = data.sort(function(a,b){
                            return a-b
                        });
                        scope.max = sorted[sorted.length - 1];
                        element[0].style.top = scope.max + 30 + 'px';
                    })
                }
            }
        })
        .directive("ngWaterfall",function($window,$document,$rootScope,$timeout){
            return {
                restrict: "A",
                scope: {
                    contentWidth : "@",
                    colMargin : "@",
                    cols : "@"
                },
                link: function(scope,element){
                    scope.minCols = scope.cols || 6;
                    scope.colMargin = scope.colMargin || 10;
                    $rootScope.$on("repeatFinished",function(){
                        $timeout.cancel();
                        $timeout(function(){
                            waterfall(scope.minCols,scope.colMargin);
                        },5);

                    });
                    $window.onresize = function(){
                        $timeout.cancel();
                        $timeout(function(){
                            waterfall(scope.minCols,scope.colMargin);
                        },200)
                    };


                    function scroll(){
                        var index = getMinKeyByArray(scope.oLiHeight);
                        var short = scope.oLiHeight[index];
                        var clientHeight = $document[0].documentElement.clientHeight;
                        var scrollTop = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
                        if (scrollTop + clientHeight >= short) {
                            scope.$emit("loadMore");
                            $window.onscroll = null;
                        }
                    }
                    function waterfall(minCols,colMargin){
                        scope.wrapWidth = scope.contentWidth || element[0].offsetWidth;
                        scope.oLiHeight = [];//存每行的高度
                        var
                            colWidth,
                            oLis = element.find("li");
                        colWidth = scope.wrapWidth/minCols;
                        for (var m = 0; m < oLis.length; m++){
                            oLis[m].style.width = colWidth + "px";
                        }
                        for (var i = 0; i < minCols; i++){
                            oLis[i].style.top = 0;
                            oLis[i].style.left = (i * colWidth) - colMargin + "px";
                            var h = parseInt(oLis[i].offsetHeight);
                            scope.oLiHeight.push(h);
                        }
                        for (var k = minCols; k < oLis.length; k++){
                            var index = getMinKeyByArray(scope.oLiHeight);
                            oLis[k].style.top = scope.oLiHeight[index] +"px";
                            oLis[k].style.left = colWidth * index - colMargin +"px";
                            scope.oLiHeight[index] = scope.oLiHeight[index] + parseInt(oLis[k].offsetHeight)
                        }
                        scope.$emit("colData",scope.oLiHeight);
                        $window.onscroll = scroll;
                    }


                    function getMinKeyByArray(arr){
                        var val = arr[0];
                        var key = 0;
                        for (var k in arr) {
                            if (arr[k] < val) {
                                val = arr[k];
                                key = k;
                            }
                        }
                        return key;

                    }

                }
            }
        })

})(window,angular)
# angular-waterfall
a responsive waterfall plugin of angular<br>
定列自适应瀑布流指令

# options
* contentWidth(optional) 外层容器宽度，不设则auto
* cols(optional) 指定显示列数，默认6

# example
1.模块注入
```javascript
    angular.module('angularWaterfallApp',["ngWaterfall","ui.router"])
```

2.模板

```javascript

<ul class="waterfall-list" ng-waterfall cols="6">
        <li ng-repeat="image in images" repeat-finished>
            <div class="data-block">
                <img src="{{image.url}}" alt="{{image.summary}}"/>
                <p>{{image.title}}</p>
                <p>{{image.summary}}</p>
            </div>
        </li>
        <div class="loadMore" ng-if="loadMore" ng-infinite-scroll ng-click="loadMoreData()">{{text}}</div>
    </ul>
    
```

3.controller

```javascript
    page++;
    $scope.$on("loadMore",function(){//滚动自动填充事件
            $scope.loadMoreData();
    })
    
```

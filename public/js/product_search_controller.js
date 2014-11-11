var ProductSearchController = function($view,$trunk,index)
{
    this.$view = $view;
    this.$trunk = $trunk;

    $(".series_title",$view).text(this.$trunk.attr("name"));
    $("h4",$view).attr("expand-group","series");

    var self = this;

    var $leafContainer = $(".searchList",$view);
    $leafContainer.empty();
    var $leaves = $("serie_leaf",$trunk);
    this.$leaves = $leaves;

    this.leafViews = [];
    $leaves.each(function(i,leaf)
    {
        var $leaf = $(leaf);
        var $leafView = $("<li></li>");
        self.leafViews.push($leafView);

        var $button = $("<a></a>");
        var leafName = $leaf.attr("name");

        var $span = $("<span></span>");
        $span.css("text-align","center");
        $span.text(leafName)
        $button.append($span);
        $button.attr("href","#");

        $button.click(function()
        {
            if(self.selectedIndex > -1)
                self.leafViews[self.selectedIndex].removeClass("selected");

            self.selectedIndex = i;
            self.leafViews[self.selectedIndex].addClass("selected");

            return false;
        });

        $leafView.append($button);
        $leafContainer.append($leafView);
    });


    if($leaves.length > 0)
    {
        this.selectedIndex = 0;
        this.leafViews[0].addClass("selected");
    }

    $(".search",$view).click(function()
    {
        var seriesName = $($("serie_leaf",$trunk)[self.selectedIndex]).attr("name");
        var path = $($("serie_leaf",$trunk)[self.selectedIndex]).attr("path");
        var conditions = [];

        var $selects = $(".feature select",$view);
        $selects.each(function(i,select)
        {
            var $select = $(select);
            conditions.push($select.val());

        });

        self.search(seriesName,path,conditions);
        return false;
    });
}

var pscPT = ProductSearchController.prototype;

pscPT.$view = null;
pscPT.$trunk = null;

pscPT.$leaves = null;
pscPT.leafViews = null;
pscPT.selectedIndex = -1;

pscPT.search = function(path,conditions){};
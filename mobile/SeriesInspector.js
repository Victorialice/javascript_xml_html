function ($trunk,expandId,index,isRoot)
{
    this.$trunk = $trunk;
    this.isRoot = isRoot;
    this.expandId = expandId;
    this.index = index;

    this.subInspectors = [];

    if(this.isRoot)
    {
        this.$view = $("div.root_demo").clone();
        this.$view.removeClass("root_demo");
    }else{
        this.$view = $(".trunk_demo").clone();
        this.$view.removeClass("trunk_demo");
    }
    this.$view.show();

    $("h4 > span",this.$view).text(this.$trunk.attr("name"));
    $("h4",this.$view).attr("expand-group",this.expandId);

    this.$btnSearch = $("a.search",this.$view);

    this.$subLeavesWrap = $(".sub_series:eq(0)",this.$view);
    this.$subLeavesBox = $("<ul></ul>");
    this.$subLeavesBox.addClass("searchList");
    this.$subLeavesWrap.append(this.$subLeavesBox);
    this.$subTrunkBox = $(".sub_series:eq(1)",this.$view);

    var $subTrunks = $("> serie_trunk",$trunk);
    var $subLeaves = $("> serie_leaf",$trunk);

    if($subTrunks.length == 0 && $subLeaves.length == 0)
    {
        this.$view = null;
        return;
    }

    this.renderLeaves($subLeaves);
    this.renderTrunks($subTrunks);

    var self = this;
    this.$btnSearch.click(function()
    {
        var $data = self.$selectedLeaf.data;

        var pathes = [];
        var seriesName = null;
        if($data.attr("id") == "all")
        {
            seriesName = self.$trunk.attr("name");

            $allLeaves = $("serie_leaf",self.$trunk);
            $allLeaves.each(function(i,leaf)
            {
                pathes.push($(leaf).attr("path"));
            });
        }else{
            seriesName = $data.attr("name");
            pathes.push($data.attr("path"));
        }

        search(seriesName,pathes,null);

        return false;
    });
}

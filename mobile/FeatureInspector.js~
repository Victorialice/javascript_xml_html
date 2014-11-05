function ($trunk,expandId,index,isRoot)
{
    this.$trunk = $trunk;
    this.expandId = expandId;
    this.index = index;
    this.isRoot = isRoot;

    this.inspectors = [];

    if(this.isRoot)
    {
        this.$view = $("div.root_demo").clone();
        this.$view.removeClass("root_demo");
    }else{
        this.$view = $(".trunk_demo").clone();
        this.$view.removeClass("trunk_demo");
    }
    this.$view.show();

    this.$btnSearch = $("a.search",this.$view);

    $("h4 > span",this.$view).text(this.$trunk.attr("name"));
    $("h4",this.$view).attr("expand-group",this.expandId);

    this.$subLeavesBox = $(".sub_series:eq(0)",this.$view);
    this.$subTrunkBox = $(".sub_series:eq(1)",this.$view);
    this.$subTrunkBox.hide();

    var $properties = $("> property-key",$trunk);
    var $subTrunks = $("> serie_trunk",$trunk);

    if($properties.length > 0 || $subTrunks.length <= 0)
    {
        this.renderProperties($properties);
    }else{
        var subProp =  $("property-key",$trunk);
        if(subProp.length > 0)
            this.renderTrunks($subTrunks);
        else
            this.renderProperties($properties);
    }

    var self = this;
    this.$btnSearch.click(function()
    {
        var $slectors = $("select",self.$view);
        var options = {};

        $slectors.each(function(i,select)
        {
            var $select = $(select);

            if($select.val() != null && $select.val().length > 0)
                options[$select.attr("name")] = $select.val();
        });

        var $leaves = $("serie_leaf",self.$trunk);
        var pathes = [];

        $leaves.each(function(j,leaf)
        {
            var $leaf = $(leaf);
            pathes.push($leaf.attr("path"));
        });

        search(self.$trunk.attr("name"),pathes,options);
        return false;
    });
}

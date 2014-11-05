siPT.renderLeaves = function($leaves)
{
    if($leaves.length <= 0)
    {
        this.$btnSearch.hide();
        this.$subLeavesWrap.hide();
        return;
    }

    this.$btnSearch.show();
    this.$subLeavesWrap.show();

    var $existedItems = $("li",this.$subLeavesBox);
    if($existedItems.length <= 0)
    {
        var $allLeaf = $("<serie_leaf></serie_leaf>");
        $allLeaf.attr("id","all");
        $allLeaf.attr("name","全部");

        var $tempWrap = $("<trunk></trunk>");
        $tempWrap.append($allLeaf);

        if($leaves.length > 1)
            $tempWrap.append($leaves.clone());

        $leaves = $("serie_leaf",$tempWrap);
    }

    var self = this;
    $leaves.each(function(i,leaf)
    {
        var $leaf = $(leaf);

        var $leafView = $("<li></li>");
        $leafView.data = $leaf;
        var $button = $("<a></a>");
        var leafName = $leaf.attr("name");
        var $span = $("<span></span>");
        $span.css("text-align","center");
        $span.text(leafName)
        $button.append($span);
        $button.attr("href","#");

        $button.click(function()
        {
            if(self.$selectedLeaf != null)
                self.$selectedLeaf.removeClass("selected");

            self.$selectedLeaf = $leafView;
            self.$selectedLeaf.addClass("selected");

            return false;
        });

        if(i == 0 && self.$selectedLeaf == null)
            $button.trigger('click');

        $leafView.append($button);
        self.$subLeavesBox.append($leafView);
    });
}

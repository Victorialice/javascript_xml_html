/** Trunk controller **/

var SeriesInspector = function($trunk,expandId,index,isRoot)
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


var siPT = SeriesInspector.prototype;

siPT.$view = null;
siPT.$subLeavesBox = null;
siPT.$subLeavesWrap = null;
siPT.$subTrunkBox = null;
siPT.$btnSearch = null;

siPT.$trunk = null;
siPT.expandId = null;
siPT.index = null;
siPT.isRoot = false;

siPT.$selectedLeaf = null;

siPT.subInspectors = null;


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

siPT.renderTrunks = function($trunks)
{
    if($trunks.length <= 0)
    {
        this.$subTrunkBox.hide();
        return;
    }
    this.$subTrunkBox.show();

    var self = this;
    $trunks.each(function(i,trunk)
    {
        var $trunk = $(trunk);

        if(self.isRoot)
        {
            var inspector = new SeriesInspector($trunk,self.expandId + "_" + self.index,i,false);
            if(inspector.$view != null)
            {
                self.$subTrunkBox.append(inspector.$view);
                self.subInspectors.push(inspector);
            }
        }else{
            var $subLeaves = self.getSubLeaves($trunk);
            self.renderLeaves($subLeaves);
        }
    });
}


siPT.getSubLeaves = function($trunk)
{
    var $leavesBox = $("<leaves></leaves>")
    var prefix = $trunk.attr("name");

    var $subLeaves = $("> serie_leaf",$trunk);
    $subLeaves.each(function(i,leaf)
    {
        var $leaf = $(leaf).clone();
        $leaf.attr("name",prefix + "-" + $leaf.attr("name"));
        $leavesBox.append($leaf);
    });

    var $subTrunks = $("> serie_trunk",$trunk);
    var self = this;
    $subTrunks.each(function(i,subtrunk)
    {
        var $subTrunk = $(subtrunk);
        $leavesBox.append(self.getSubLeaves($subTrunk));
    })

    return $("*",$leavesBox);
}



/** Feature controller **/
FeatureInspector = function($trunk,expandId,index,isRoot)
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

var fiPT = FeatureInspector.prototype;
fiPT.$view = null;
siPT.$subLeavesBox = null;
siPT.$subTrunkBox = null;
siPT.$btnSearch = null;


fiPT.$trunk = null;
fiPT.expandId = null;
fiPT.index = null;
fiPT.isRoot = false;

fiPT.inspectors = null;


fiPT.renderProperties = function($properties)
{
    this.$btnSearch.show();

    var self = this;
    var $featureView = $(".feature_demo").clone();
    $featureView.removeClass("feature_demo");
    $featureView.show();
    this.$subLeavesBox.append($featureView);

    var $ul = $(".searchCategory",$featureView);
    var $listDemo = $(".list:eq(0)",$ul);
    $ul.empty();

    var $tempWrap = $("<temp></temp>")
    $tempWrap.append($properties.clone());
    var $price = $("*[key=price]",$tempWrap);

    if($price.length > 0)
    {
        $price.remove();
        $tempWrap.append($price);

        $properties = $("property-key",$tempWrap);
    }

    var $tempWrap = $("<temp></temp>")
    $tempWrap.append($properties.clone());
    var $orderKey = $("<property-key></property-key>");
    $tempWrap.append($orderKey);
    $orderKey.attr("key","order");
    $orderKey.attr("title","价格排序");

    var $optionAsc = $("<property-value></property-value>");
    $optionAsc.attr("value","asc");
    $optionAsc.attr("title","升序");
    var $optionDesc = $("<property-value></property-value>");
    $optionDesc.attr("value","desc");
    $optionDesc.attr("title","降序");
    $orderKey.append($optionAsc);
    $orderKey.append($optionDesc);

    $properties = $("property-key",$tempWrap);

    $properties.each(function(i,prop)
    {
        var $prop = $(prop);

        var $propView = $listDemo.clone();
        $ul.append($propView);

        $(".title",$propView).text($prop.attr("title"));

        var $selector = $("select",$propView);
        $selector.attr("name",$prop.attr("key"));
        $selector.empty();

        if($prop.attr("key") != "order")
        {
            var noneOption = $("<option></option>");
            noneOption.text("不限");
            noneOption.attr("value","");
            $selector.append(noneOption);
        }

        if($prop.attr("key") == "price")
            $prop = self.sortPrice($prop);

        var $options = $("property-value",$prop);
        $options.each(function(j,option)
        {
            var $option = $(option);
            var $optionView = $("<option></option>");
            $optionView.attr("value",$option.attr("value"));
            $optionView.text($option.attr("title"));
            $selector.append($optionView);
        });

    })
}

fiPT.sortPrice = function($prices)
{
    var $values = $("property-value",$prices);
    var values = [];

    $values.each(function(i,value)
    {
        var $value = $(value);
        var price = $value.attr("value");
        var title = $value.attr("title");
        values.push({"value":price,"title":title});
    });

    var bubbleCount = 0;
    do{
        bubbleCount = 0;
        for(var i = 0;i < values.length - 1;i++)
        {
            var value0 = values[i];
            var value1 = values[i + 1];

            if(value0["value"] > value1["value"])
            {
                values[i] = value1;
                values[i + 1] = value0;
                bubbleCount ++;
            }
        }
    }while(bubbleCount > 0)

    var tempPrices = [];

    $.each(values,function(i,value)
    {
        var price = value['value'];
        var objPrice = {"title":value['title']};
        if(i == 0)
        {
            objPrice["value"] = "," + price
        }else if(i == values.length - 1)
        {
            objPrice["value"] = price + ",";
        }else{
            var price2 = values[i - 1]["value"];
            objPrice["value"] = price2 + "," + price;
        }

        tempPrices.push(objPrice);
    })

    values = tempPrices;

    var $prices2 = $prices.clone();
    $prices2.empty();

    $.each(values,function(i,value)
    {
        var $prop = $("<<property-value/>");
        $prop.attr("value",value['value']);
        $prop.attr("title",value["title"]);
        $prices2.append($prop);
    });

    return $prices2;
}

fiPT.renderTrunks = function($trunks)
{
    var self = this;
    this.$btnSearch.hide();
    $trunks.each(function(i,trunk)
    {
        var $trunk = $(trunk);

        var $properties = $("> property-key",$trunk);
        var $subTrunks = $("> serie_trunk",$trunk);

        if($properties.length <= 0)
        {
            self.renderTrunks($subTrunks);
        }else{
            var inspector = new FeatureInspector($trunk,self.expandId + "_" + self.index,i,false);
            if(inspector.$view != null)
            {
                self.$subLeavesBox.append(inspector.$view);
                self.inspectors.push(inspector);
            }
        }
    });
}
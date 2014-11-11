var ExpandView = function(id,$header,$content)
{
    this.id = id;
    this.$header = $header;
    this.$content = $content;

    var strHeader = this.$header.html();
  /* commented by wenbo on 2014年 11月 08日 星期六 16:14:32 CST
    this.$header.empty();

    this.$button = $("<a style='width:100%;height:100%;display:block' href=\"#\"></a>")
    this.$button.html(strHeader);
    this.$button.addClass("button");
    this.$header.append(this.$button);
    */
    this.$button = $("a", $header);

    var $iconImg = $("img",$header);
    if($iconImg.length <= 0)
    {
        //this.$icon = $("<div></div>");
        //this.$icon.addClass("icon");
        //this.$button.append(this.$icon);
    }else{
        this.$iconImg = $iconImg;
    }

    if(this.$header.attr("state") == null ||
       this.$header.attr("state") == "close")
        this.close();
    else
        this.show();

    var self = this;
    this.$button.click(function()
    {
        if(self.isHidden)
        {
            self.showAnimated();
            if(self.delegate != null)
                self.delegate.itemOpen(self);
        }else{
            self.closeAnimated();
            if(self.delegate != null)
                self.delegate.itemClose(self);
        }
        return false;
    });
}

var evPT = ExpandView.prototype;

evPT.id = null;
evPT.$header = null;
evPT.$content = null;
evPT.$button = null;
evPT.$icon = null;
evPT.$iconImg = null;

evPT.isHidden = false;

evPT.delegate = null;

evPT.close = function()
{
    this.isHidden = true;
    if(this.$iconImg != null)
    {
        this.$iconImg.attr("src","images/add.png");
    }else if(this.$icon != null){
        this.$icon.removeClass("icon_rollback");
        this.$icon.addClass("icon_exapnd");
    }
    this.$content.hide(0);

    $("[scroller]",this.$content).trigger("hide");
}

evPT.closeAnimated = function()
{
    this.isHidden = true;
    if(this.$iconImg != null)
    {
        this.$iconImg.attr("src","images/add.png");
    }else if(this.$icon != null){
        this.$icon.removeClass("icon_rollback");
        this.$icon.addClass("icon_exapnd");
    }

    var self = this;
    this.$content.slideUp(200,function(){$("[scroller]",self.$content).trigger("hide");});
}

evPT.show = function()
{
    this.isHidden = false;
    if(this.$iconImg != null)
    {
        this.$iconImg.attr("src","images/subtract.png");
    }else if(this.$icon != null){
        this.$icon.removeClass("icon_exapnd");
        this.$icon.addClass("icon_rollback");
    }

    this.$content.show(0);
    $("[scroller]",this.$content).trigger("show");
}

evPT.showAnimated = function()
{
    this.isHidden = false;
    if(this.$iconImg != null)
    {
        this.$iconImg.attr("src","images/subtract.png");
    }else if(this.$icon != null){
        this.$icon.removeClass("icon_exapnd");
        this.$icon.addClass("icon_rollback");
    }

    var self = this;
    this.$content.slideDown(400,function(){$("[scroller]",self.$content).trigger("show");});
}

ExpandView.allViews = {};
ExpandView.getView = function(id)
{
    var view = ExpandView.allViews[id];
    return view;
}

ExpandView.addView = function(id,$header,$content)
{
    var view = new ExpandView(id,$header,$content)
    ExpandView.allViews[id] = view;

    return view;
}

ExpandView.initialize = function()
{
    var $headers = $("*[expand]");
    $headers.each(function(index,header)
    {
        var $header = $(header);
        var id = $header.attr("expand");
        $header.attr("id",id);
        var $content = $("#"+id+" + *");

        ExpandView.addView(id,$header,$content);
    });
}


var ExpandViewGroup = function()
{

}

ExpandViewGroup.allGroups = {};

ExpandViewGroup.initialize = function()
{
    var $groupHeaders = $("*[expand-group]");
    $groupHeaders.each(function(index,header)
    {
        var $header = $(header);
        var groupId = $header.attr("expand-group");
        var group = ExpandViewGroup.getGroup(groupId);
        if(group == null)
            group = ExpandViewGroup.addGroup(groupId);

        var viewId = groupId + "_" + group.count();
        $header.attr("id",viewId);
        var $content = $("#"+viewId+" + *");
        var view = ExpandView.addView(viewId,$header,$content);
        group.addView(view);
    });
}

ExpandViewGroup.addGroup = function(id)
{
    var group = new ExpandViewGroup();
    ExpandViewGroup.allGroups[id] = group;

    return group;
}

ExpandViewGroup.getGroup = function(id)
{
    return ExpandViewGroup.allGroups[id];
}

var evPT = ExpandViewGroup.prototype;

evPT.views = [];
evPT.openView = null;

evPT.addView = function(view)
{
    this.views.push(view);
    view.close();
    view.delegate = this;
}

evPT.itemOpen = function(view)
{
    if(this.openView != null && this.openView != view)
        this.openView.close();
    this.openView = view;
}

evPT.itemClose = function(view)
{
    if(view == this.openView)
        this.openView = null;
}

evPT.count = function()
{
    return this.views.length;
}

evPT.openItemByIndex = function(index)
{
    var view = this.views[index];
    if(view == null) return;

    view.show();
    this.itemOpen(view);
}

evPT.closeAll = function()
{
    if(this.openView != null)
    {
        this.openView.close();
        this.openView = null;
    }
}

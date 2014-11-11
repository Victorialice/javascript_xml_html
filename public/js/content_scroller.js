var ContentScroller = function($view,$dotContainer)
{
    this.$view = $view;

    this.fixHeight = this.$view.attr("fix-height") == "true";
    this.autoScroll = this.$view.attr("auto-scroll") == "false" ? false : true;

    this.$container = $(".container",this.$view);
    this.$dotContainer = $dotContainer == null ?  $(".dot_container",this.$view) : $dotContainer;

    this.width = this.$view.width();
    this.height = this.$view.height();
    this.rateHW = this.$view.height() / this.$view.width();
    this.$view.css("width","auto");

    this.$contents = $(".content",this.$view);
    var $firstContent = $(this.$contents[0]).clone();
    this.$container.append($firstContent);
    this.$contents = $(".content",this.$view);

    this.drawDots();
    this.resize();

    this.addListeners();

    this.setCurrentIndex(0);

    this.startAnimate();
}

ContentScroller.SWITCH_DURATION = 500;
ContentScroller.SWITCH_INTERVAL = 4000;
ContentScroller.RESTART_ANIMATE_INTERVAL = 6000;

ContentScroller.scrollers = {};
ContentScroller.initialize = function()
{
    var $scrollView = $("*[scroller]");
    $scrollView.each(function(index,view)
    {
        var $view = $(view);
        var id = $view.attr("scroller");
        $view.attr("id",id);

        var $dotContaienr = $("[scroller-dots=" + id +"]");
        $dotContaienr = $dotContaienr.length <= 0 ? null : $dotContaienr;
        var scroller = new ContentScroller($view,$dotContaienr);
        ContentScroller.scrollers[id] = scroller;
    });
}
ContentScroller.getScroller = function(id)
{
    return ContentScroller.scrollers[id];
}

var csPT = ContentScroller.prototype;

csPT.$view = null;
csPT.$container = null;
csPT.$dotContainer = null;

csPT.fixHeight = false;
csPT.autoScroll = false;
csPT.$contents = null;

csPT.dots = null;
csPT.drawDots = function()
{
    var self = this;

    var $dot = $("<div></div>");
    $dot.addClass("scroller_dot");

    var space = (this.$dotContainer.width() - 6 * (this.$contents.length - 1)) / (this.$contents.length - 2);
    var startX = 0;
    this.dots = [];
    this.$contents.each(function(index,content)
    {
        if(index >= self.$contents.length - 1)
            return;

        var $dot = $("<div></div>");
        $dot.addClass("scroller_dot");
        $dot.css("left",startX + "px");

        self.$dotContainer.append($dot);
        self.dots.push($dot);

        startX += $dot.width() + space;
    });
}

csPT.startX = 0;
csPT.swipe = true;
csPT.offsetX = 0.0;

csPT.touched = false;
csPT.addListeners = function()
{
    var self = this;
    $(window).resize(function(){self.resize();});
    this.$view.bind("show",function(){self.resize();});

    this.$view[0].addEventListener("touchstart",function(evt)
    {
        self.touched = true;
        self.swipe = false;

        self.stopAnimate();

        var touch = evt.targetTouches[0];
        self.startX = touch.pageX;
    });

    this.$view[0].addEventListener("touchend",function(evt)
    {
        self.touched = false;
        if(self.swipe)
        {
            if(self.offsetX > 0)
                self.setCurrentIndex(self.index - 1);
            else
                self.setCurrentIndex(self.index + 1);
        }

        setTimeout(function(){self.startAnimate();},ContentScroller.RESTART_ANIMATE_INTERVAL);
    });

    this.$view[0].addEventListener("touchmove",function(evt)
    {
        self.swipe = true;
        var touch = evt.targetTouches[0];
        self.offsetX = touch.pageX - self.startX;

        evt.stopImmediatePropagation();
        evt.preventDefault();
    });
}

csPT.timerId;
csPT.startAnimate = function()
{
    if(this.touched) return;
    if(!this.autoScroll) return;

    window.clearInterval(this.timerId);
    var self = this;
    this.timerId = window.setInterval(function(){self.setCurrentIndex(self.index + 1);},ContentScroller.SWITCH_INTERVAL);
}

csPT.stopAnimate = function()
{
    if(!this.autoScroll) return;
    window.clearInterval(this.timerId);
}

csPT.index = 0;
csPT.setCurrentIndex = function(index)
{
    if(this.isAnimating) return;
    if(this.index == index)
        return;

    if(index < 0)
    {
        index = this.$contents.length - 2;
        this.$container.css("left", -1 * (this.$contents.length - 1) * this.width +  "px");
    }

    index = index % this.$contents.length;

    this.index = index;
    this.render();
}

csPT.isAnimating = false;
csPT.render = function()
{
    this.isAnimating = true;
    var self = this;
    $("*:animated",this.$view).stop(true,true);
    this.$container.animate({"left":this.index * this.width * -1 + "px"},
                            ContentScroller.SWITCH_DURATION,
                            "easeOutCubic",
                            function()
                            {
                                self.isAnimating = false;
                                if(self.index == self.$contents.length - 1)
                                {
                                    self.$container.css("left","0px");
                                    self.index = 0;
                                }
                            });

    var dotIndex = this.index % (this.$contents.length - 1);
    $.each(this.dots,function(i,$dot)
    {
        $dot.removeClass("scroller_dot_selected");
        if(i == dotIndex)
            $dot.addClass("scroller_dot_selected");
    });
}


csPT.rateHW = 0;
csPT.width = 0;
csPT.height = 0;
csPT.resize = function()
{
    var self = this;

    this.width = this.$view.width();
    if(!this.fixHeight)
    {
        this.height = this.width * this.rateHW;
        this.$view.height(this.height);
    }

    var startX = 0.0;
    this.$contents.each(function(index,content)
    {
        var $content = $(content);
        $content.css("left",startX + "px");
        startX += self.width;
    });

    $("*:animated",this.$view).stop(true,true);
    this.isAnimating = false;
    this.$container.css("left",-1 * this.width * (this.index % (this.$contents.length - 1)) + "px");

    try{
        var dotIndex = this.index % (this.$contents.length - 1);
        $.each(this.dots,function(i,$dot)
        {
            $dot.removeClass("scroller_dot_selected");
            if(i == dotIndex)
                $dot.addClass("scroller_dot_selected");
        });
    }catch(err){};
}
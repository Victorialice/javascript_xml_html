var ProductSearchBox = function($view,id)
{
    this.$view = $view;
    this.id = id;
    this.$view.attr("id",this.id);
    this.allSite = this.$view.attr("all-site") == "true";

    this.$loading = $(".input_loading",this.$view);
    this.$loading.hide();

    var self = this;
    this.$textField = $("input[type='text']",this.$view);
    this.$textField.val(ProductSearchBox.DEFAULT_TEXT);
    this.$textField.focusin(function()
    {
        self.$textField.val("");
    });
    this.$textField.focusout(function()
    {
        var content = self.$textField.val();
        content = $.trim(content);
        if(content.length <= 0)
            self.$textField.val(ProductSearchBox.DEFAULT_TEXT);
    });

    this.$btnSearch = $("button",this.$view);

    this.$form = $("form",this.$view);
    this.$form.submit(function()
    {
        self.search();
        return false;
    });
}


ProductSearchBox.DEFAULT_TEXT = "请输入产品型号";
ProductSearchBox.items = {};
ProductSearchBox.initialize = function()
{
    var $searchBoxes = $("*[product-search]");
    $searchBoxes.each(function(index,searchBox)
    {
        var $boxView = $(searchBox);
        var id = $boxView.attr("product-search");
        var prdSearch = new ProductSearchBox($(searchBox),id);
        ProductSearchBox.items[id] = prdSearch;
    });
}

ProductSearchBox.getSearchBox = function(id)
{
    return ProductSearchBox.items[id];
}

var psbPT = ProductSearchBox.prototype;

psbPT.$view = null;
psbPT.$btnSearch = null;
psbPT.$textField = null;
psbPT.$form =  null;
psbPT.$loading = null;

psbPT.id = null;
psbPT.allSite = false;

psbPT.search = function()
{
    var content = this.$textField.val();
    content = $.trim(content);
    if(content.length <= 0 || content == ProductSearchBox.DEFAULT_TEXT)
    {
        alert("请输入要搜索的产品型号");
        this.$textField[0].focus();
        return false;
    }

    if(this.allSite)
        this.allSiteSearch(content);
    else
        this.productSearch(content);
}

psbPT.allSiteSearch = function(content)
{
    this.showLoading();
    var params = {"keyword":content};
    window.location.href = "all_site_search.html?" + encodeParams(params);
}

psbPT.productSearch = function(content)
{
    this.showLoading();

    var self = this;
    $.get("http://www.yamaha.com.cn/app/public/search/mobileproductsearch",
        {"id":content},
        function(data,status){self.onDataLoaded(data,status);},
        "json");
}

psbPT.onDataLoaded = function(data,status)
{
    if(status != "success")
    {
        alert("Error occured when get data from http://www.yamaha.com.cn/app/public/search/mobileproductsearch!");
        this.hideLoading();
        return;
    }

    /*
    array("name"=>$categoryName,
          "series_name"=>$seriesName,
          "series_path"=>$url,
          "path"=>$seriesPath,
          "product_name"=>$productName);
    */

    if(data == null)
    {
        alert("未找到指定的产品！");

        this.$textField[0].focus();
        this.$textField.val("");
        this.hideLoading();
    }else{
        var params = {"name":data["name"],
                      "series_name":data["series_name"],
                      "back_url":encodeURI("product_search.html?path=" + data["series_path"] + "&name=" + data["name"]),
                      "pathes":JSON.stringify([data["path"]]),
                      "conditions":JSON.stringify({"order":"asc"}),
                      "product_name":data["product_name"]};
        var strParams = encodeParams(params);
        window.location.href = "product_search_result.html?" + strParams;
    }
}

psbPT.showLoading = function()
{
    this.$textField.attr("disabled","disabled");
    this.$btnSearch.attr("disabled","disabled");
    this.$loading.show();
}

psbPT.hideLoading = function()
{
    this.$textField.removeAttr("disabled");
    this.$btnSearch.removeAttr("disabled");
    this.$loading.hide();
}
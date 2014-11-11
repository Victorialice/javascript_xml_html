/**
 *     var params = {"type":"featue",
                  "name":name,
                  "series_name":title,
                  "back_url":currentURL,
                  "pathes":JSON.stringify(pathes),
                  "conditions":JSON.stringify(conditions)};
 *
 */

/*
 var params = {"type":"category",
 "name":name,
 "series_name":title,
 "back_url":currentURL,
 "path":path,
 "conditions":JSON.stringify({"order":"asc"})};
 */
var params = null;
var $products = null;
var $willShowCell = null;

var priceRange = null;
var defaultOrder = null;

var allPathes = null;

var keys = ["name","series_name","back_url","conditions"]
prepare = function()
{
    ExpandViewGroup.initialize();

    params = decodeParams(window.location.href);
    if(!validateParams(params,keys))
    {
        window.location.href = "index.html"
        return;
    }

    if(params.conditions != null)
        params.conditions = JSON.parse(params["conditions"]);
    if(params.pathes != null)
        params.pathes = JSON.parse(params["pathes"]);

    priceRange = params["conditions"]["price"];
    delete params["conditions"]["price"];

    if(priceRange != null)
    {
        var range = priceRange.split(',');
        range[0] = range[0].length <= 0 ? 0 : parseFloat(range[0]);
        range[1] = range[1].length <= 0 ? Infinity : parseFloat(range[1]);
        priceRange = range;
    }

    defaultOrder = params["conditions"]["order"];
    delete params["conditions"]["order"];

    if(params["name"] == "家庭音响")
    {
        $("#order_asc,#order_desc").hide();
    }

    $("title").text(params["name"] + TITLE_SUFFIX);
    $(".header_title").text(params["name"]);
    $(".back_link").attr("href",params["back_url"]);
    $(".title strong").text(params["series_name"]);

    $("#detail_view h2 span").text(params["name"]);
    $("#detail_view dd:eq(1) span").text(params["series_name"]);
    var $btnReturn = $("#detail_view h2 a");
    $btnReturn.click(function()
    {
        switchToList();
        return false;
    });

    allPathes = [];
    $.each(params["pathes"],function(i,path)
    {
        var objPath = {"path":path,"data":null};
        allPathes.push(objPath);
        featureSearch(objPath);
    });
}

var orderType = null;
var orderAsc = function()
{
    if(orderType == "asc")
        return false;
    orderType = "asc";

    var $btnOrderAsc = $("#order_asc");
    $btnOrderAsc.addClass("now");
    var $btnOrderDesc = $("#order_desc");
    $btnOrderDesc.removeClass("now");

    var bubbleCount = 0;
    do{
        bubbleCount = 0;
        for(var i = 0;i < products.length - 1;i++)
        {
            var $prd0 = products[i];
            var $prd1 = products[i + 1];

            var price0 = parseFloat($("price",$prd0).text());
            var price1 = parseFloat($("price",$prd1).text());

            if(price0 > price1)
            {
                products[i] = $prd1;
                products[i+ 1] = $prd0;
                bubbleCount++;
            }
        }

    }while(bubbleCount > 0);

    renderResultList(products);

    return false;
}

var orderDesc = function()
{
    if(orderType == "desc")
        return false;
    orderType = "desc";

    var $btnOrderDesc = $("#order_desc");
    $btnOrderDesc.addClass("now");
    var $btnOrderAsc = $("#order_asc");
    $btnOrderAsc.removeClass("now");

    var bubbleCount = 0;
    do{
        bubbleCount = 0;
        for(var i = 0;i < products.length - 1;i++)
        {
            var $prd0 = products[i];
            var $prd1 = products[i + 1];

            var price0 = parseFloat($("price",$prd0).text());
            var price1 = parseFloat($("price",$prd1).text());

            if(price0 < price1)
            {
                products[i] = $prd1;
                products[i+ 1] = $prd0;
                bubbleCount++;
            }
        }

    }while(bubbleCount > 0);

    renderResultList(products);

    return false;
}

var checkAllDataLoaded = function()
{
    var $allData = $("<products></products>")

    for(var i= 0;i < allPathes.length ;i++)
    {
        var objPath = allPathes[i];
        if(objPath.data == null)
            return;

        var $data = $(objPath.data);
        var $productList = $("product",$data);
        $allData.append($productList.clone());
    }

    $products = $("product",$allData);
    convertData($products);
    onDataLoaded($products);
}


var featureSearch = function(objPath)
{
    var url = URL_PREFIX + objPath["path"];

    $.get(url,
        null,
        function(data,status)
        {
            if(status != "success")
            {
                alert("Error occured when get data from " + url + "!");
                return;
            }

            objPath["data"] = data;
            checkAllDataLoaded();
        },
        "xml");
}

var products = null;

var onDataLoaded = function($products)
{
    filterProducts($products);

    var $btnOrderAsc = $("#order_asc");
    var $btnOrderDesc = $("#order_desc");
    $btnOrderAsc.click(orderAsc);
    $btnOrderDesc.click(orderDesc);

    var order = defaultOrder;
    if(order == "asc")
        $btnOrderAsc.trigger("click");
    else if(order== "desc")
        $btnOrderDesc.trigger("click");

    hideLoading();

    if($willShowCell != null)
        $willShowCell.trigger("click");
}

var convertData = function($list)
{
    $list.each(function(index,item)
    {
        var $item = $item;
        var price = $("price",$item).text();
        price = price.replace(/\,/gi,"");
        var numPrice = parseFloat(price);
        $("price",$item).text(numPrice);
    });
}

var filterProducts = function($products)
{
    var conditions = params["conditions"];

    products = [];

    $products.each(function(i,product)
    {
        var $product = $(product);
        if(priceRange != null)
        {
            var $price = $("price",$product);
            if($price.length <= 0)
                return;

            var numPrice = parseFloat($price.text());
            if(isNaN(numPrice))
                return;

            if(numPrice < priceRange[0] || numPrice > priceRange[1])
                return;
        }

        for(var prop in conditions)
        {
            var value = $(prop,$product).text();
            if(value.indexOf(conditions[prop]) < 0)
                return;
        }

        products.push($product);
    });
}

var renderResultList = function(list)
{
    var $resultContainer = $("#result_container");
    $resultContainer.empty();

    var resultDemo = $(".result_demo");
    $.each(list,function(index,$item)
    {
        var $resultView = resultDemo.clone();
        $resultView.click(function()
        {
            switchToDetail($item);
            return false;
        });

        $("dt img",$resultView).attr("src",URL_PREFIX + $("thumb_image",$item).text());
        $("dd strong",$resultView).text($("title",$item).text());

        if(params["product_name"] != null &&  $.trim($("title",$item).text()).toLowerCase() == params["product_name"].toLowerCase())
        {
            $willShowCell = $resultView;
        }

        var strPrice = $("price",$item).text();

        if(strPrice.length > 0)
        {
            var numPrice = parseFloat(strPrice);
            strPrice = String(numPrice) == strPrice ? strPrice + "元" : strPrice;
            $("dd span span",$resultView).text(strPrice);
        }else{
            $("dd span",$resultView).hide();
        }

        var des = $("overview",$item).text();
        des = des.replace(/img/gi,"option");
        var $tempdes = $("<div></div>");
        $tempdes.html(des);
        des = $tempdes.text();
        des = des.length > 100 ? des.slice(0,100) + "..." : des;
        $("dd:eq(2)",$resultView).html(des);

        $resultView.show();
        $resultContainer.append($resultView);
    });
}

var tableBeginTag = "<table class=\"guigeTable\">";
var tableEnddingTag = "</table>";

var desBeginTag = "<div class=\"descriptionA01\">"
var desEndTag = "<!-- /div.descriptionA01 -->"

var switchToDetail = function($item)
{
    showLoading();

    var $listView = $("#list_view");
    $listView.hide();
    var $detailView = $("#detail_view");
    $detailView.show();
    ExpandViewGroup.getGroup("product_detail").closeAll();

    var url = URL_PREFIX + $("path",$item).text();
    $.get(url,
          null,
          function(html,status)
          {
              if(status != "success")
              {
                  alert("Error occured when get data from " + url + "!");
                  return;
              }

              var thumbSrc = $("thumb_image",$item).text();
              var thumbScale = null;
              var $mainImage = $("main_image",$item);
              var $colorImage = $("color_image",$item);

              if($mainImage.length > 0)
              {
                  thumbSrc = $("middle_image",$($mainImage[0])).text();
                  thumbScale = $("large_image",$($mainImage[0])).text();
              }else if($colorImage.length > 0){
                  thumbSrc = $("middle_image",$($colorImage[0])).text();
                  thumbScale = $("large_image",$($colorImage[0])).text();
              }
              $("#detail_view .detail_img img").attr("src",URL_PREFIX + thumbSrc);
              if(thumbScale != null)
              {
                  $("#detail_view .scale").attr("href",URL_PREFIX + thumbScale);
              }else{
                  $("#detail_view .scale").hide();
              }


              var $header = $("#detail_view dd:first");
              $("strong",$header).text($("title",$item).text());

              if($("if_new",$item).text().toLowerCase() == "yes")
                    $(".is_new",$header).show();
              else
                  $(".is_new",$header).hide();

              if($("recommend",$item).text().toLowerCase() == "yes")
                  $(".is_recommend",$header).show();
              else
                  $(".is_recommend",$header).hide();

              if($colorImage.length > 1)
                  $(".mul_color",$header).show();
              else
                  $(".mul_color",$header).hide();

              var strPrice = $("price",$item).text();
              var numPrice = parseFloat(strPrice);
              strPrice = String(numPrice) == strPrice ? strPrice + "元" : strPrice;
              if($("price",$item).text().length > 0)
              {
                  $("#detail_view dd:eq(2) p span").show();
                  $("#detail_view dd:eq(2) p span").text(strPrice);
              }else{
                  $("#detail_view dd:eq(2)").hide();
              }

              var strOverview = $("overview",$item).text();
              strOverview = strOverview.replace(/img/gi,"br");
              var $temp = $("<div></div>");
              $temp.html(strOverview);
              $("#detail_view dd:eq(3)").html($temp.text());


              if($mainImage.length < 2 && $colorImage.length < 2)
              {
                  $("#detail_view .more_photo").hide();
                  $("#detail_view .productImg").hide();
              }else{
                  $("#detail_view .more_photo").show();

                  if($colorImage.length > 1)
                  {
                      $("#detail_view .productImg h4:eq(0)").show();
                      $("#detail_view .productImg h4:eq(0) + ul").show();
                      $("#detail_view .productImg h4:eq(0) + ul").empty();

                      $colorImage.each(function(i,image)
                      {
                          var $imgData = $(image);
                          var $imgView = $("<img/>");
                          var colorImgSrc = $("middle_image",$imgData).text();
                          colorImgSrc = colorImgSrc.length <= 0 ? DEFAULT_IMAGE_SRC : colorImgSrc;
                          $imgView.attr("src",URL_PREFIX + colorImgSrc);

                          var $imgBox = $("<div></div>");
                          $imgBox.append($imgView);
                          var $colorImgView = $("<li></li>");
                          $colorImgView.append($imgBox);

                          var imgDes = $.trim($("color_description",$imgData).text());
                          if(imgDes.length > 0)
                          {
                              var $desSpan = $("<span></span>");
                              $desSpan.text("颜色：" + imgDes);
                              $colorImgView.append($desSpan);
                          }


                          var largeColorImgSrc = $("large_image",$imgData).text();
                          if(largeColorImgSrc.length > 0)
                          {
                              var $link = $("<a></a>");
                              $link.attr("href",URL_PREFIX + largeColorImgSrc);
                              $link.attr("target","yamaha_scale");
                              $imgView.wrap($link);
                          }

                          $("#detail_view .productImg h4:eq(0) + ul").append($colorImgView);
                      });

                  }else{
                      $("#detail_view .productImg h4:eq(0)").hide();
                      $("#detail_view .productImg h4:eq(0) + ul").hide();
                  }

                  if($mainImage.length > 1)
                  {
                      $("#detail_view .productImg h4:eq(1)").show();
                      $("#detail_view .productImg h4:eq(1) + ul").show();
                      $("#detail_view .productImg h4:eq(1) + ul").empty();

                      $mainImage.each(function(i,image)
                      {
                          var $imgData = $(image);
                          var $imgView = $("<img/>");
                          var mainImgSrc = $("middle_image",$imgData).text();
                          mainImgSrc = mainImgSrc.length <= 0 ? DEFAULT_IMAGE_SRC : mainImgSrc;
                          $imgView.attr("src",URL_PREFIX + mainImgSrc);

                          var $imgBox = $("<div></div>");
                          $imgBox.append($imgView);

                          var $mainImgView = $("<li></li>");
                          $mainImgView.append($imgBox);

                          var largeMainImage = $("large_image",$imgData).text();
                          if(largeMainImage.length > 0)
                          {
                              var $link = $("<a></a>");
                              $link.attr("href",URL_PREFIX + largeMainImage);
                              $link.attr("target","yamaha_scale");
                              $imgView.wrap($link);
                          }

                          $("#detail_view .productImg h4:eq(1) + ul").append($mainImgView);
                      });

                  }else{
                      $("#detail_view .productImg h4:eq(1)").hide();
                      $("#detail_view .productImg h4:eq(1) + ul").hide();
                  }

              }


              fillDescription(html);

              var bIndex = html.indexOf(tableBeginTag);
              var eIndex = html.indexOf(tableEnddingTag,bIndex) + tableEnddingTag.length;
              var table = html.slice(bIndex,eIndex);
              var $table = $(table);
              $("#detail_view .product_spec").empty();
              $("#detail_view .product_spec").append($table);


              hideLoading();
          },
          "text");
}

var fillDescription = function(html)
{
    var sIndex = html.indexOf(desBeginTag) + desBeginTag.length;
    var eIndex = html.indexOf(desEndTag,sIndex);
    var desSource = html.slice(sIndex,eIndex);
    desSource = desSource.replace(/src\s*=\s*"\//gi,"src=\"" + URL_PREFIX + "/");
    desSource = desSource.replace(/href\s*=\s*"\//gi,"href=\"" + URL_PREFIX + "/");
    desSource = desSource.replace(/<script[\d\D]*?<\/script>/gi,"");
    desSource = desSource.replace(/<object[\d\D]*?<\/object>/gi,"");

    var $seriesContainer = $("#detail_view .series_description");
    $seriesContainer.empty();
    $seriesContainer.html(desSource);

    $("*.expansion",$seriesContainer).remove();
    $("*[class]",$seriesContainer).removeClass();
    $("*[style]",$seriesContainer).attr("style","");

    $("*",$seriesContainer).each(function(i,element)
    {
        var $element = $(element);
        if($element.css("position") == "absolute")
            $element.remove();
    });

    $("a",$seriesContainer).each(function(i,a)
    {
        var href = $(a).attr("href");
        if(href != null &&  href.charAt(0) == "/")
        {
            href = URL_PREFIX + href;
            $(a).attr("href",href);
        }
        $(a).attr("target","_blank");
    });
}

var switchToList = function()
{
    var $listView = $("#list_view");
    $listView.show();
    var $detailView = $("#detail_view");
    $detailView.hide();
}
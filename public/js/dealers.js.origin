var dealerList1 = null;
var dealerList2 = null;
var dealerList3 = null;

prepare = function()
{
    function checkIfAllDataLoaded()
    {
        if(dealerList1 != null && dealerList2!= null && dealerList3 != null)
        {
            parseData();
            hideLoading();
        }
    }

    $.get("http://www.yamaha.com.cn/dealers/dealers/audio-visual/data.txt",
          null,
          function(data,status)
          {
              if(status != "success")
              {
                  alert("Error occured when get data from http://www.yamaha.com.cn/dealers/dealers/audio-visual/data.txt!");
                  return;
              }

              var list = eval(data);
              dealerList1 = list;
              checkIfAllDataLoaded();
          },
          "text");

    $.get("http://www.yamaha.com.cn/dealers/dealers/music-production/data.txt",
        null,
        function(data,status)
        {
            if(status != "success")
            {
                alert("Error occured when get data from http://www.yamaha.com.cn/dealers/dealers/music-production/data.txt!");
                return;
            }

            var list = eval(data);
            dealerList2 = list;
            checkIfAllDataLoaded();
        },
        "text");

    $.get("http://www.yamaha.com.cn/dealers/dealers/musical-instruments/data.txt",
        null,
        function(data,status)
        {
            if(status != "success")
            {
                alert("Error occured when get data from http://www.yamaha.com.cn/dealers/dealers/musical-instruments/data.txt!");
                return;
            }

            var list = eval(data);
            dealerList3 = list;
            checkIfAllDataLoaded();
        },
        "text");
}


var parseData = function()
{
    var provinces = [];
    var cities = [];
    var productNames = ["家庭音响","音乐制作产品"];
    var dealers = [];

    function storeDealers(dealerList,pName)
    {
        $.each(dealerList,function(index,dealer)
        {
            var province = dealer["province"];
            var index = provinces.indexOf(province);
            if(index < 0)
            {
                index = provinces.length;
                provinces.push(province);
                cities.push([]);
            }

            var city = dealer["city"];
            city = city.charAt(city.length - 1) == "市" ? city.substr(0,city.length - 1) : city;
            dealer["city"] = city;
            var scities = cities[index];
            var cindex = scities.indexOf(city);
            if(cindex < 0)
                scities.push(city);

            var products = dealer["products"];
            if(products.length > 0)
            {
                $.each(products,function(pi,product)
                {
                    var productName = product["key"];
                    var pIndex = productNames.indexOf(productName);
                    if(pIndex < 0)
                        productNames.push(productName);
                });
            }else if(pName != null){
                dealer["products"] = [{"key":pName}];
            }

            dealers.push(dealer);
        });
    }

    storeDealers(dealerList1,productNames[0]);
    storeDealers(dealerList2,productNames[1]);
    storeDealers(dealerList3);

    var $provinceView = $("#district_search .provinces");
    var $cityView = $("#district_search .cities");
    var $productView = $("#district_search .products");

    $.each(productNames,function(i,productName)
    {
        var $allProductView = $(".products")
        var $option = $("<option></option>");
        $option.text(productName);
        $option.attr("value",i);
        $allProductView.append($option);
    });

    $.each(provinces,function(i,strProv)
    {
        var $option = $("<option></option>");
        $option.text(strProv);
        $option.attr("value",i);
        $provinceView.append($option);
    });

    $provinceView.change(function(evt)
    {
        var index = Number($provinceView.val());
        $cityView.empty();
        var $defOption = $("<option>请选择城市</option>");
        $cityView.append($defOption);

        if(!isNaN(index))
        {
            var cityList = cities[index];
            $.each(cityList,function(i,strCity)
            {
                var $option = $("<option></option>");
                $option.text(strCity);
                $option.attr("value",i);
                $cityView.append($option);
            });
        }
    });

    var $keywordView = $("#keyword_search .keywords");
    var $kwProductView = $("#keyword_search .products");
    var defKeyword = $keywordView.attr("default-value");
    $keywordView.val(defKeyword);
    $keywordView.addClass("default_text");

    $keywordView.focusin(function()
    {
        $keywordView.removeClass("default_text");
        $keywordView.val("");
    });

    $keywordView.focusout(function()
    {
        if($keywordView.val().length == 0)
        {
            $keywordView.addClass("default_text");
            $keywordView.val(defKeyword);
        }
    });


    $("#keyword_search .search").click(function()
    {
        var strKeywords = $.trim($keywordView.val());
        if(strKeywords.length <= 0 || strKeywords == defKeyword)
        {
            alert("请输入关键字！");
            $keywordView[0].focus();

            return false;
        }

        var pIndex = Number($kwProductView.val());
        var pName = isNaN(pIndex) ? null : productNames[pIndex];

        var resultList = [];
        $.each(dealers,function(i,dealer)
        {
            if(pName != null)
            {
                var match = false;
                $.each(dealer.products,function(j,product)
                {
                    if(product.key == pName)
                    {
                        match = true;
                        return false;
                    }
                });

                if(!match) return;
            }

            var matchRate = 0;
            var keywordList = strKeywords.split(" ");
            for(var i = 0;i < keywordList.length;i++)
            {
                var strKeyItem = keywordList[i];
                for(var prop in dealer)
                {
                    var value = String(dealer[prop]);
                    if(prop == "products")
                    {
                        value = "";
                        $.each(dealer.products,function(m,product)
                        {
                            value += product.key + " ";
                        });
                    }

                    if(value.indexOf(strKeyItem) > -1)
                    {
                        matchRate ++;
                        break;
                    }
                }
            }

            if(matchRate >= keywordList.length)
                resultList.push(dealer);
        });



        var strProduct = pName == null ? "" : "产品种类'" + pName + "'，";
        var strKWCopy = "关键字'" + strKeywords + "'，";
        var strInfo = "你搜索的" + strKWCopy + strProduct + "找到'" + resultList.length +"'家经销商"
        var $infoView = $("#keyword_search .result_info");
        $infoView.html(strInfo);
        $infoView.show();

        showResult(resultList,$("#keyword_search + .result"));

        return false;
    });

    $("#district_search .search").click(function()
    {
        var pIndex = Number($provinceView.val());
        var pName = isNaN(pIndex) ? null : provinces[pIndex];

        var cName = null;
        if(pName != null)
        {
            var cIndex = Number($cityView.val());
            var cName = isNaN(cIndex) ? null : cities[pIndex][cIndex];
        }

        var proIndex = $productView.val();
        var proName = isNaN(proIndex) ? null : productNames[proIndex];

        var resultList = [];
        if(pName != null || cName != null || proName != null)
        {
            $.each(dealers,function(i,dealer)
            {
               if(dealer.province != pName && pName != null)
                    return;
               if(dealer.city != cName && cName != null)
                    return;

                if(proName != null)
                {
                    var match = false;
                    $.each(dealer.products,function(k,product)
                    {
                        if(product.key == proName)
                        {
                            match = true;
                            return false;
                        }
                    });

                    if(match) resultList.push(dealer);
                }else{
                    resultList.push(dealer);
                }
            });

            var strDistrct = pName == null ? "" : "地区'" + pName +  (cName == null ? "" : "&nbsp;&nbsp;" + cName) + "'，";
            var strProduct = proName == null ? "" : "产品种类'" + proName + "'，";
            var strInfo = "你搜索的" + strDistrct + strProduct + "找到'" + resultList.length +"'家经销商"
            var $infoView = $("#district_search .result_info");
            $infoView.html(strInfo);
            $infoView.show();

            showResult(resultList,$("#district_search + .result"));
        }else{
            alert("搜索信息不全");
        }

        return false;
    });

    function showResult(dealers,$container)
    {
        $container.empty();
        var $demo = $("#result_view > *");
        $.each(dealers,function(index,dealer)
        {
            var $resultView = $demo.clone();
            $($($resultView)[0]).html(dealer.name);
            $(".dealer_address",$resultView).html(dealer.address);

            if(dealer.tel != null && dealer.tel.length > 0)
            {
                $(".dealer_tel",$resultView).attr("href","tel:" + dealer.tel.replace(/-/gi,""));
                $(".dealer_tel",$resultView).text(dealer.tel);
            }else{
                $(".tel_con",$resultView).hide();
            }

            var $iconView = $(".product_icons",$resultView);
            $iconView.empty();
            $.each(dealer.products,function(i,product)
            {
                if(product.value != null && product.value.length > 0)
                {
                    var $icon = $("<img/>");
                    $icon.attr("src",URL_PREFIX + product.value);
                    $icon.attr("alt",product.key);
                    $icon.attr("title",product.key);
                    $iconView.append($icon);
                }else{
                    var $text = $("<span></span>");
                    $text.html("&nbsp;&nbsp;" + product.key);
                    $iconView.append($text);
                }
            });

            if(dealer.coordinate != null && dealer.coordinate.length > 0)
            {
                var mapSrc = generateMap(dealer.coordinate,600,400);
                var mapLink = generateMapLink(dealer.coordinate);

                var $mapContaienr = $($resultView[3]);
                var $btnScale = $("<a></a>");
                $btnScale.addClass("btn_scale_map");
                $btnScale.attr("href",mapLink);
                $btnScale.attr("target","yamaha_map");
                $mapContaienr.append($btnScale);

                $(".btn_map",$resultView).click(function()
                {
                    $(".google_map",$resultView).attr("src",mapSrc);
                    $($resultView[3]).slideToggle();

                    return false;
                });
            }else{
                $(".btn_map",$resultView).hide();
            }

            $container.append($resultView);
        });
    }
}

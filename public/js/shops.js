var provinces = [];
var shopList = [{"type":"钢琴","shops":[]},
                {"type":"家庭音响","shops":[]}];


var CATEGORIES = {"flagship.html":{"title":"旗舰店","order":0},
                  "s_level.html":{"title":"S级店","order":1},
                  "a_level.html":{"title":"标准店","order":2},
                  "b_level.html":{"title":"混合店","order":3},
                  "micro_dta_corner.html":{"title":"台响专柜","order":4},
                  "other":{"title":"其它","order":5}};

prepare = function()
{
    loadData();
}

var saveData = function($shops,container)
{
    $shops.each(function(index,shop)
    {
        var $shop = $(shop);
        var province = $("province",$shop).text();

        if(provinces.indexOf(province) < 0)
        {
            var $option = $("<option></option>");
            $option.val(provinces.length);
            $option.text(province);
            $("#province_selector").append($option);

            provinces.push(province);
        }

        var objShop = {};
        objShop["title"] = $("title",$shop).text();
        objShop["province"] = province;
        objShop["thumbImage"] = $shop.attr("thumb_image");
        objShop["shopHour"] = $("shop_hour",$shop).text();
        objShop["phoneNumber"] = $("phone_number",$shop).text();
        objShop["address"] = $("address",$shop).text();
        objShop["googleCode"] = $("google_code",$shop).text();

        if($("category",$shop).length > 0)
            objShop["category"] = $("category",$shop).text();
        else
            objShop["category"] = "other";

        container.push(objShop);
    });
}

var showResult = function(resultList,province,type)
{
    var strProvince = province == null ? "" : "地区'" + province +"'，";
    var strType = type == null ? "" : "乐器种类'" + type + "'，";
    var strInfo = "你搜索的" + strProvince + strType + "找到'" + resultList.length + "'专卖店"
    $("#result_info").text(strInfo);
    $(".map").hide();

    var $demoView = $("#result_demo > *");
    var $resultContainer = $("#result_container");
    $resultContainer.empty();

    var coordinates = [];
    $.each(resultList,function(index,result)
    {
        var $resultView = $demoView.clone();
        $($resultView[0]).text(result["title"]);

        if(result["shopHour"]!=null && result["shopHour"].length > 0)
        {
            $(".hours",$resultView).text(result["shopHour"]);
        }else{
            $(".hours",$resultView).hide();
            $(".hours_icon",$resultView).hide();
        }

        if(result["phoneNumber"] != null && result["phoneNumber"].length > 0)
        {
            $(".phone_num",$resultView).text(result["phoneNumber"]);

            var strPhoneNum = result["phoneNumber"].replace(/-/gi,"");
            $(".phone_num_link",$resultView).attr("href","tel:" + strPhoneNum);
        }else{
            $(".phone_num",$resultView).hide();
            $(".phone_num_icon",$resultView).hide();
            $(".phone_num_link",$resultView).hide();
        }

        $(".address",$resultView).text(result["address"]);

        if(result.googleCode != null && result.googleCode.length > 0)
        {
            coordinates.push({"index":index,"coordinate":result.googleCode});

            $(".btn_map",$resultView).show();
            $($resultView[3]).hide();

            var mapLink = generateMapLink(result.googleCode);
            var $mapContaienr = $($resultView[3]);
            $mapContaienr.hide();
            var $btnScale = $("<a></a>");
            $btnScale.addClass("btn_scale_map");
            $btnScale.attr("href",mapLink);
            $btnScale.attr("target","yamaha_map");
            $mapContaienr.append($btnScale);

            $(".btn_map",$resultView).click(function()
            {
                $(".google_map",$resultView).attr("src",generateMap(result.googleCode,600,400));
                $($resultView[3]).slideToggle();
                return false;
            });
        }else{
            $(".btn_map",$resultView).hide();
        }

        $resultContainer.append($resultView);
    });

    if(coordinates.length > 0)
        showMap(coordinates);
}

var objMap = null;

var showMap = function(coordinates)
{
    $(".map").empty();
    var $mapCanvas = $("<div style='width:100%;height:100%'></div>")
    $(".map").append($mapCanvas);
    $(".map").show();

    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false,
    };

    objMap = new google.maps.Map($mapCanvas[0],mapOptions);

    objMap.setCenter(new google.maps.LatLng(region["lat"],region["lon"],true));
    objMap.setZoom(region["zoom"]);

    $.each(coordinates,function(i,coordinate)
    {
        var title = String(coordinate["index"]);
        var code = coordinate["coordinate"];
        var lat = code.split(",")[0];
        var lon = code.split(",")[1];

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lon,true),
            title:title
        });

        marker.setMap(objMap);
    });
}

var sortResult = function(list)
{
    list = list.slice(0,list.length);
    var bubbleCount = 0;

    do
    {
        bubbleCount = 0;
        for(var i = 0; i < list.length - 1;i++)
        {
            var item1 = list[i];
            var item2 = list[i + 1];

            var cate1 = item1["category"];
            var cate2 = item2["category"];

            var order1 = CATEGORIES [cate1]["order"];
            var order2 = CATEGORIES [cate2]["order"];

            if(order1 > order2)
            {
                list[i] = item2;
                list[i+1] = item1;

                bubbleCount ++;
            }
        }
    }while(bubbleCount > 0)


    return list;
}

var region = null;

var loadData = function()
{
    $.get("http://www.yamaha.com.cn/mobile/shops.xml",
          null,
          function(data,status)
          {
              if(status != "success")
              {
                  alert("Error occured when get data from http://www.yamaha.com.cn/mobile/shops.xml!");
                  return;
              }

              var $pianoShops = $("piano_shops > shop",$(data));
              saveData($pianoShops,shopList[0]["shops"]);
              var $avShops = $("av_shops > shop",$(data));
              saveData($avShops,shopList[1]["shops"]);

              $.each(shopList,function(i,shop)
              {
                  var $option = $("<option></option>");
                  $option.text(shop["type"]);
                  $option.val(i);
                  $("#shop_selector").append($option);
              });

              $(".search").click(function()
              {
                  var pIndex = Number($("#province_selector").val());
                  var pName = isNaN(pIndex) ? null : provinces[pIndex];
                  var sIndex = Number($("#shop_selector").val());
                  if(isNaN(pIndex) && isNaN(sIndex))
                  {
                      alert("请选择省份或者产品");
                      return false;
                  }

                  region = CHINA_REGION;
                  if(pName != null)
                  {
                      $.each(regions,function(rindex,objr)
                      {
                          if(pName == objr["name"])
                          {
                              region = objr;
                              return false;
                          }
                      });
                  }

                  var shops = [];
                  var proName = null;
                  if(isNaN(sIndex))
                  {
                      $.each(shopList,function(i,shop){shops = shops.concat(shop["shops"]);});
                  }else{
                      shops = shopList[sIndex]["shops"];
                      proName = shopList[sIndex]["type"];
                  }

                  var resultList = [];
                  $.each(shops,function(index,shop)
                  {
                        if(shop["province"] == pName || pName == null)
                            resultList.push(shop);
                  });

                  resultList = sortResult(resultList);
                  showResult(resultList,pName,proName);

                  return false;
              });

              hideLoading();

              resize();
              $(window).resize(resize);

          },
          "xml");

}

var resize = function()
{
    if($(".sale").height() < $(document).height())
        $("#result_container").css("min-height",$(document).height() - $(".sale").height() + "px");

    if(objMap != null && region != null)
    {
        objMap.setCenter(new google.maps.LatLng(region["lat"],region["lon"],true));
    }
}
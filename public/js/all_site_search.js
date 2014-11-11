var ITEM_COUNT = 10;

var keys = ["keyword"];
var keyword = null;
prepare = function()
{
    var params = decodeParams(window.location.href);
    if(!validateParams(params,keys))
    {
        window.location.href = "index.html"
        return;
    }
    keyword = params["keyword"];
    var url = "http://www.yamaha.com.cn/app/public/search/mobilesearch";
    $.get(url,
          {"keyword":keyword},
          function(dataList,status)
          {
              if(status != "success")
              {
                  alert("Error occured when get data from " + url + "!");
                  return;
              }

              $(".search_page div.info span:eq(0)").text(keyword);
              $(".search_page div.info span:eq(1)").text(dataList.length);

              var $listDemo = $(".search_page .result_list");
              var $itemDemo = $(".btn_product",$listDemo);
              var $seemoreDemo = $(".search_page .see_more");
              $listDemo.remove();
              $listDemo.empty();
              $seemoreDemo.remove();
              $listDemo.show();
              $itemDemo.show();
              $seemoreDemo.show();

              var $resultContainer = $(".search_page .result_container");
              var $listContainer = $listDemo.clone();
              $resultContainer.append($listContainer);

              $.each(dataList,function(i,data)
              {
                    if(i != 0 && i%ITEM_COUNT == 0)
                    {
                        var $seeMore = $seemoreDemo.clone();
                        $resultContainer.append($seeMore);

                        var $container = $("<div></div>")
                        $container.hide();
                        $resultContainer.append($container);
                        $resultContainer = $container;

                        $listContainer = $listDemo.clone();
                        $resultContainer.append($listContainer);

                        $("a.btn_see_more",$seeMore).click(function()
                        {
                            $seeMore.hide();
                            $container.slideDown(200);

                            return false;
                        });
                    }

                    var $itemView = $itemDemo.clone();
                    var thumbPath = data["thumb"].length <= 0 ? DEFAULT_IMAGE_SRC : data["thumb"];
                    $(".photo img",$itemView).attr("src",URL_PREFIX + thumbPath);

                    $(".des h2",$itemView).text(data["name"]);

                    var overview = data["overview"];
                    overview.replace(/img/gi,"br");
                    var $temp = $("<div></div>");
                    $temp.html(overview);
                    overview = $temp.text();
                    overview = overview.length > 30 ? overview.slice(0,30) + "..." : overview;

                    $(".des span",$itemView).text(overview);
                    $listContainer.append($itemView);

                    var prdData = data["data"];

                    $itemView.click(function()
                    {
                        var params = {"name":prdData["name"],
                            "series_name":prdData["series_name"],
                            "back_url":encodeURI("product_search.html?path=" + prdData["series_path"] + "&name=" + prdData["name"]),
                            "pathes":JSON.stringify([prdData["path"]]),
                            "conditions":JSON.stringify({"order":"asc"}),
                            "product_name":prdData["product_name"]};
                        var strParams = encodeParams(params);
                        window.location.href = "product_search_result.html?" + strParams;

                        return false;
                    });
              });

              hideLoading();

          },"json");
}
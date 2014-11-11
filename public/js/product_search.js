var name = null;
var currentURL = null;

var seriesInspector = null;
var featureInspector = null;

prepare = function()
{
    currentURL = window.location.href;
    var params = decodeParams(currentURL);
    if(!validateParams(params,["path","name"]))
    {
        window.location.href = "index.html"
        return;
    }

    name = params.name;

    $("title").text(name + TITLE_SUFFIX);
    $("#header_title").text(name);

    loadData(URL_PREFIX + params["path"]);
}

var search = function(title,pathes,conditions)
{
    if(conditions == null)
        conditions = {"order":"asc"};

    var params = {"name":name,
                  "series_name":title,
                  "back_url":currentURL,
                  "pathes": JSON.stringify(pathes),
                  "conditions":JSON.stringify(conditions)};

    params = encodeParams(params);
    window.location.href = "product_search_result.html?" + params;
}

var loadData = function(url)
{
    $.get(url,
          null,
          function(data,status)
          {
              if(status != "success")
              {
                  alert("Error occured when get data from " + url + "!");
                  return;
              }

              var $trunkContainer = $(".products");
              $trunkContainer.empty();
              seriesInspector = [];

              var $fTrunkContainer = $(".features");
              $fTrunkContainer.empty();
              featureInspector = [];

              var $trunks = $("series > serie_trunk",$(data));
              $trunks.each(function(i,trunk)
              {
                  var inspector = new SeriesInspector($(trunk),"series",i,true);
                  if(inspector.$view != null)
                  {
                      $trunkContainer.append(inspector.$view);
                      seriesInspector.push(inspector);
                  }

                  var fInspector = new FeatureInspector($(trunk),"features",i,true);
                  if(fInspector.$view != null)
                  {
                      $fTrunkContainer.append(fInspector.$view);
                      featureInspector.push(fInspector);
                  }
              });

              hideLoading();
              ContentScroller.initialize();
              ExpandViewGroup.initialize();

              if(name == "家庭音响")
              {
                  $(".feature_search").hide();
              }
          },
          null);
}

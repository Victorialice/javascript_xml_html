//var URL_PREFIX = "http://www.yamaha.com.cn"
var URL_PREFIX = "http://localhost:4567/api_host"
//var URL_PREFIX = "http://m.yamahaofficial.kembo88.com/api_host"
var TITLE_SUFFIX = "-雅马哈中国";
var DEFAULT_IMAGE_SRC = "/local/yamaha_de4_290X290.jpg";

var $loading;
var $mainContent;

var prepare = function(){hideLoading();}

var headerLoaded = false;
var footerLoaded = false;

var onHeaderAndFooterLoaded = function()
{
    if(headerLoaded && footerLoaded)
    {
        prepare();
        encodeURL();
        ProductSearchBox.initialize();
    }
}

var onHeaderLoaded = function()
{
    headerLoaded = true;
    onHeaderAndFooterLoaded();
}

var onFooterLoaded = function()
{
    footerLoaded = true;
    onHeaderAndFooterLoaded();
}

$(document).ready(function()
{
    $loading = $("<div class=\"ajax_loading\"><img src=\"images/ajax-loader.gif\"/></div>")
    $("body").append($loading);
    $mainContent = $("body div:first");
    showLoading();

    $(".header").load("header.html",null,onHeaderLoaded);
    $(".foot").load("footer.html",null,onFooterLoaded);
});


function showLoading()
{
    $("body").addClass("loading");
    $loading.show();
    $mainContent.hide();
}

function hideLoading()
{
    $("body").removeClass("loading");
    $loading.hide();
    $mainContent.show();
}

var validateParams = function(params,keys)
{
    if(params == null)
        return false;

    var match = true;
    $.each(keys,function(i,key)
    {
        if(params[key] == null)
        {
            match = false;
            return false;
        }
    });

    return match;
}

function decodeParams(url)
{
    var urlComponents = url.split("?");
    if(urlComponents.length < 2)
        return null;

    var params = urlComponents[1].split("&");
    var objParams = {};
    $.each(params,function(i,param)
    {
        var key = param.split("=")[0];
        var value = decodeURIComponent(param.split("=")[1]);
        objParams[key] = value;
    });

    return objParams;
}

function encodeParams(params)
{
    var result = [];
    for(var prop in params)
    {
        var param = encodeURIComponent(params[prop]);
        result.push(prop + "=" + param);
    }

    return result.join("&");
}

function encodeURI(url)
{
    var urlComponents = url.split("?");
    if(urlComponents.length <= 1)
        return url;

    var path = urlComponents[0];
    var strParams = urlComponents[1];
    var params = strParams.split("&");
    var newParams = [];
    $.each(params,function(i,param)
    {
        var paramKV = param.split("=");
        var k = paramKV[0];
        var v = encodeURIComponent(paramKV[1]);
        newParams.push(k + "=" + v);
    });

    return path + "?" + newParams.join("&");
}

function encodeURL()
{
    var $links = $("*[encode=true]");
    $links.each(function(index,a)
    {
        var $a = $(a);
        var key = null;
        var value = null;

        if($a.attr("src") != null && $a.attr("src").length > 0)
        {
            key = "src";
            value = $a.attr("src")

        }else if($a.attr("href") != null && $a.attr("href").length > 0){
            key = "href";
            value = $a.attr("href")
        }else{
            return;
        }

        $a.attr(key,encodeURI(value));
    });
}

function generateMap(center,width,height)
{
    var baseURL = "http://ditu.google.cn/maps/api/staticmap";
    var dtparams = {};
    dtparams["center"] = center;
    dtparams["size"] = width + "x" + height;
    dtparams["zoom"] = "16";
    dtparams["format"]="JPEG";
    dtparams["maptype"] = "roadmap";
    dtparams["language"] = "zh-CN";
    dtparams["markers"] = "color:red|" + center;
    dtparams["sensor"] = false;
    dtparams["key"] = "AIzaSyAX-sXllxS5529cLMUWf2Nm7QU2wCTWB-4";

    return baseURL + "?" + encodeParams(dtparams);
}

function generateMapLink(center)
{
    var baseURL = "http://ditu.google.com/maps";
    var params = {};
    params['q'] = center;
    params['ll'] = center;
    params['num'] = 1;
    params['t'] = "m";
    params['z'] = "16";

    return baseURL + "?" + encodeParams(params);
}

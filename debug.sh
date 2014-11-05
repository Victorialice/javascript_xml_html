bob@bob-Vostro-320:mobilesite$ grep -nR product_spec ./js/
./js/product_search_result.js:502:              $("#detail_view .product_spec").empty();
./js/product_search_result.js:503:              $("#detail_view .product_spec").append($table);

bob@bob-Vostro-320:mobilesite$ grep -nR URL_PREFIX ./js/
./js/dealers.js:337:                    $icon.attr("src",URL_PREFIX + product.value);
./js/common.js:1:var URL_PREFIX = "http://www.yamaha.com.cn"
./js/product_search.js:22:    loadData(URL_PREFIX + params["path"]);
./js/all_site_search.js:68:                    $(".photo img",$itemView).attr("src",URL_PREFIX + thumbPath);
./js/stations.js:345:                    $icon.attr("src",URL_PREFIX + product.value);
./js/product_search_result.js:185:    var url = URL_PREFIX + objPath["path"];
./js/product_search_result.js:287:        $("dt img",$resultView).attr("src",URL_PREFIX + $("thumb_image",$item).text());
./js/product_search_result.js:335:    var url = URL_PREFIX + $("path",$item).text();
./js/product_search_result.js:359:              $("#detail_view .detail_img img").attr("src",URL_PREFIX + thumbSrc);
./js/product_search_result.js:362:                  $("#detail_view .scale").attr("href",URL_PREFIX + thumbScale);
./js/product_search_result.js:423:                          $imgView.attr("src",URL_PREFIX + colorImgSrc);
./js/product_search_result.js:443:                              $link.attr("href",URL_PREFIX + largeColorImgSrc);
./js/product_search_result.js:468:                          $imgView.attr("src",URL_PREFIX + mainImgSrc);
./js/product_search_result.js:480:                              $link.attr("href",URL_PREFIX + largeMainImage);
./js/product_search_result.js:516:    desSource = desSource.replace(/src\s*=\s*"\//gi,"src=\"" + URL_PREFIX + "/");
./js/product_search_result.js:517:    desSource = desSource.replace(/href\s*=\s*"\//gi,"href=\"" + URL_PREFIX + "/");
./js/product_search_result.js:541:            href = URL_PREFIX + href;

/**
 * 实现图片懒加载
 * 核心：替换img的src bg的话写在css类里面替换css属性
 * 方法：监听scroll或者使用比较新的IntersectionObserve api
 */

$(document).ready(function () {
    var lazyloadImages;
    // 目前被谷歌和火狐支持，IE不支持
    if ("IntersectionObserver" in window) {
        lazyloadImages = document.querySelectorAll(".lazy");
        // 创建一个观测器
        var imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    // 替换src
                    image.src = image.dataset.src;
                    image.classList.remove("lazy");
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyloadImages.forEach(function (image) {
            imageObserver.observe(image);
        });
    } else {
        // 节流，避免用户滚的太快一次性发太多请求
        var lazyloadThrottleTimeout;
        lazyloadImages = $(".lazy");

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function () {
                var scrollTop = $(window).scrollTop();
                lazyloadImages.each(function () {
                    var el = $(this);
                    // 窗口高度+滚动条的高度>元素偏移的高度  进入视口
                    if (el.offset().top - scrollTop < window.innerHeight) {
                        var url = el.attr("data-src");
                        el.attr("src", url);
                        el.removeClass("lazy");
                        lazyloadImages = $(".lazy");
                    }
                });
                if (lazyloadImages.length == 0) {
                    $(document).off("scroll");
                    $(window).off("resize");
                }
            }, 20);
        }

        $(document).on("scroll", lazyload);
        $(window).on("resize", lazyload);
    }
})

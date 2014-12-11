/**
 *
 *
 */
(function($) {

    var results = [];

    $.fn.heading = function(options) {

        var defaults,
            setting,
            headers,
            max,
            len,
            doms;

        defaults = {
            content : null,
            inner   : 'innerHTML',
            prefix  : 'heading-',
            max     : 3,
            type    : 'scroll',
            anchorFn: function(i) {
                return 's' + i;
            },
            sync    : true
        };

        setting = $.extend(defaults, options);

        headers = $(setting.content).find(':header');

        results = [];

        max = Math.max.apply(null, [
            document.body.clientHeight,
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.documentElement.clientHeight
        ]);

        len = headers.length;

        $.each(headers, function(i, d) {
            var offset  = d.offsetTop,
                percent = (offset / max) * 100,
                current = +d.tagName.substr(1),
                anchor  = $(d).attr('id') || setting.anchorFn(i, d);
            results[i] = {
                num     : offset,
                percent : percent,
                current : current,
                text    : d[setting.inner],
                cls     : setting.prefix + d.tagName.toLowerCase(),
                first   : i === 0,
                last    : i === len - 1,
                anchor  : anchor
            };
            if (setting.type === 'anchor') {
                $(d).attr('id', anchor);
            }
        });

        doms = [];

        $.each(results, function(i, d) {
            if (setting.max >= d.current) {
                var dom = $('<a></a>').html(d.text).css({
                    'top': d.percent + '%'
                }).addClass(d.cls).addClass('heading');
                if (setting.type === 'anchor') {
                    dom.attr('href', '#' + d.anchor);
                }
                doms.push(dom);
                d.dom = dom[0];
            }
        });

        // 対象のノードに一覧を追加
        $(this).append(doms);

        if (setting.type === 'scroll') {
            $('.heading').bind('click', function(e) {
                $.each(results, function(i, d) {
                    if (d.dom && d.dom === e.currentTarget) {
                        window.scrollTo(0, d.num);
                        return false;
                    }
                });
            });
        }

        if (setting.sync) {
            // スクロールイベントバインド
            $(window).bind('scroll', function(e) {
                var current = (e.currentTarget.scrollY / max) * 100;
                _update(current);
            });
        }

        // チェイン用にインスタンス戻す
        return (this);

    };

    function _update(current) {
        var num = null, target;
        $.each(results, function(i, d) {
            var abs = Math.abs(current - d.percent);
            if (num === null) {
                num = abs;
                target = d;
            } else if (num > abs) {
                num = abs;
                target = d;
            }
            if (d.dom) {
                $(d.dom).removeClass('selected');
            }
        });
        if (target.dom) {
            $(target.dom).addClass('selected');
        }
    }

})(jQuery);

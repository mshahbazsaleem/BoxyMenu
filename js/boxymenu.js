(function ($) {
    $.fn.extend({
        boxymenu: function (options) {
            var settings = $.extend({
                menuItemWidth: 200,
                menuItemHeight: 150,
                boxHorizontal: 4,
                boxVertical: 3,
                loadAnimationSpeed: 400,
                itemDisplaySpeed: 1000
            }, options);

            return this.each(function () {

                var frameWidth = settings.menuItemWidth;
                var frameHeight = settings.menuItemHeight;
                var timeFactor;
                var animationSpeed = settings.loadAnimationSpeed;
                var rows = settings.boxVertical;
                var cols = settings.boxHorizontal;
                var speed = settings.itemDisplaySpeed;
                //load animation
                var coordinates = new Array();
                var isAnimating = false;
                var wrapper = $(this);
                //hide all elements on load
                setTimeout(function () {
                    //make clone of each item
                    $('.boxy-menu>li', wrapper).each(function () {
                        animateRandomFade($(this));
                    });
                    var h = $('.boxy-menu li:first', wrapper).outerHeight();

                    $('.boxy-menu>li', wrapper).append('<div class="btn-pin" title="Pin Menu"></div>');
                    $('.boxy-menu>li .btn-pin', wrapper).toggle(function () {
                        $(this).addClass('pinned');
                        $(this).data('pinned', true);
                        $(this).attr('title', 'Unpin Menu');
                    }, function () {
                        $(this).removeClass('pinned');
                        $(this).data('pinned', false);
                        $(this).attr('title', 'Pin Menu');
                    }).hover(function () {
                        if (!$(this).data('pinned'))
                            $(this).addClass('pinned');
                    }, function () {
                        if (!$(this).data('pinned'))
                            $(this).removeClass('pinned');
                    });

                    $('.boxy-menu>li', wrapper).mouseenter(function () {
                        if (!$(this).find('.btn-pin').hasClass('pinned')) {
                            $(this).find('.btn-pin').css('display', 'block');
                            $(this).find('.boxy-menu-item-top').stop(false, false).animate({ marginTop: -h }, speed, function () { isAnimating = false; });
                        }
                    }).mouseleave(function () {
                        if (!$(this).find('.btn-pin').hasClass('pinned')) {
                            $(this).find('.btn-pin').css('display', 'none');
                            $(this).find('.boxy-menu-item-top').stop(false, false).animate({ marginTop: 0 }, speed, function () { isAnimating = false; });
                        }
                    });

                    function createBoxes(container) {
                        container.data('coordinates', new Array());
                        container.data('complete', 0);
                        var w = frameHeight / rows;
                        var h = frameWidth / cols;
                        if (w % 10 > 0) {
                            w = parseInt(w);
                            w++;
                        }
                        if (h % 10 > 0) {
                            h = parseInt(h);
                            h++;
                        }
                        var totalBoxes = cols * rows;
                        timeFactor = animationSpeed / totalBoxes;
                        for (var i = 0; i < rows; i++) {
                            for (var j = 0; j < cols; j++) {
                                var box = $('<div/>').css({
                                    'width': w + 'px',
                                    'height': h + 'px',
                                    'top': (i * h) + 'px',
                                    'left': (j * w) + 'px',
                                    'position': 'absolute'
                                }).addClass('boxy-el').addClass('boxy-piece').hide();
                                container.append(box);
                            }
                        }

                        $(".boxy-el", container).each(function (index) {
                            var pos = { left: $(this).css('left'), top: $(this).css('top') };
                            container.data('coordinates').push(pos);
                        });

                        var randomElements = $(".boxy-el", container).get().sort(function () {
                            return Math.round(Math.random()) - 0.5
                        });
                        container.data('elements', randomElements);
                    }
                    function animateRandomFade(container) {
                        createBoxes(container);
                        var factor = 0;

                        $(container.data('elements')).each(function (index) {
                            if (container.data('complete') < container.data('elements').length) {
                                var el = $(this);
                                setTimeout(function () {
                                    try {
                                        el.fadeIn(animationSpeed, function () {
                                            var complete = container.data('complete');
                                            complete++;
                                            container.data('complete', complete)
                                            if (complete == container.data('elements').length) {
                                                animationComplete(container);

                                            }
                                        });
                                    }
                                    catch (ex) { }
                                }, factor);
                                factor += timeFactor + 20;
                            }
                        });
                    }
                    function animationComplete(container) {
                        container.find('.boxy-menu-item-top,.boxy-menu-item-bottom').fadeIn(0);
                        container.addClass('menuitem');
                        container.find('.boxy-el').remove();
                    }
                }, 100);

            });
        }
    });
})(jQuery);
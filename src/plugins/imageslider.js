/*
 * 拖放文件到编辑器，上传并插入
 */
UM.plugins['imageslider'] = function () {
    var me = this,
        slider,
        slideToIndex;

    /* 幻灯弹出层的类 */
    function Slider() {
        this.$sliderWrapper;
        this.$sliderContainer;
        this.init();
    }
    Slider.prototype = {
        init: function () {
            var _this = this;

            this.$sliderContainer = $('<div>').css({ width: $(me.window).width(), height: $(me.window).height() - 36 });

            var $backIcon = $('<a class="ui-icon-back">返回</a>'),
                $pageBar = $('<span class="ui-pagebar">1/4</span>'),
                $deleteIcon = $('<a class="ui-icon-delete">删除</a>'),
                $toolbar = $('<div class="ui-toolbar">');
            $toolbar.append($backIcon).append($pageBar).append($deleteIcon);

            $backIcon.on('click', function(){
                _this.hide();
            });
            $deleteIcon.on('tap', function(){
                var index = _this.$sliderContainer.slider('getIndex');
                var $imgs = me.$body.find('img.slider');

                $imgs.eq(index).remove();
                slideToIndex = $imgs.length - 1 > index ? index:index - 1;

                _this.hide();
                if(slideToIndex >= 0) {
                    _this.show();
                }
            });

            this.$sliderWrapper = $('<div class="edui-slider-wrapper">').css({
                    'z-index': (me.getOpt('zIndex') + 1000001),position: 'absolute', top: '0', left: '0'
                }).hide().on('swipeUp swipeDown', function(){
                    return false;
                });
            this.$sliderWrapper.hide().appendTo(document.body);
            this.$sliderWrapper.append($toolbar);
            this.$sliderWrapper.append(this.$sliderContainer);

            this.$pageBar = $pageBar;
        },
        reset: function () {
            var _this = this,
                $sider = this.$sliderContainer;

            $sider.html('');
            me.$body.find('img.slider').each(function () {
                $('<div><img width="' + $(me.window).width() + '" src="' + $(this).attr('src') + '" /></div>').appendTo($sider);
            });

            $sider.slider({
                index: slideToIndex,
                slide: function (e, to ) {
                    _this.updatePageBar( to );
                },
                ready: function () {
                    _this.updatePageBar( this.getIndex() );
                    function updataImg(){
                        var $img = $(this),
                            marginTop = ($img.parent().height() - $img.height()) / 2;
                        $img.css({'margin': (marginTop > 0 ? marginTop : 0) + 'px auto'});
                    }
                    $sider.find('.ui-slider-item img').on('load', updataImg).each(updataImg);

                    _this.$sliderWrapper.css({
                        position: 'absolute',
                        top: window.pageYOffset,
                        left:0
                    });

                }
            });

            me.blur();
        },
        updatePageBar:function ( index ) {
            this.$pageBar.text( (index + 1) + '/' + me.$body.find('img.slider').length );
        },
        show: function () {
            me.blur();
            this.$sliderWrapper.show();
            this.reset();
        },
        hide: function () {
            this.$sliderWrapper.hide();
            this.$sliderContainer.slider('destroy');


        }
    }

    /* 设置显示幻灯的监听函数 */
    me.addListener('showimageslider', function (type, current) {
        slider = slider || new Slider();
        slider.show();
    });
    /* 设置隐藏幻灯的监听函数 */
    me.addListener('hideImageSlider', function (type, current) {
        slider && slider.hide();
    });

    me.addListener('ready', function () {

        /* 点击编辑区域时，触发显示幻灯的事件 */
        me.$body.on('touchend', function (e) {

        });
//        me.addListener('focus', function(e){
//            return false;
//        });
//


        me.$body.on('tap',function(e){
            var $target = $(e.target);
            var rng = me.selection.getRange();

            if ($target.attr('tagName') == 'IMG' && $target.hasClass('slider')) {
                // 设置现实幻灯在第几张图片
                me.blur();
                slideToIndex = 0;
                me.$body.find('img.slider').each(function(index, img){
                    if(img == $target[0]) slideToIndex = index;
                });

                me.fireEvent('hidepopup');
                me.fireEvent('showimageslider', e.target);

                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        })
    });
};
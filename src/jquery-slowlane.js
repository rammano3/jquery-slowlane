(function($) {
    $.fn.slowlane = function(options) {
        options = typeof options === 'object' ? options : {};
        options.fontAwesome = typeof options.fontAwesome === 'boolean' ? options.fontAwesome : false;
        options.customFloater = typeof options.customFloater === 'boolean' ? options.customFloater : false;
        options.loadTime = typeof options.loadTime === 'number' ? options.loadTime : 5000;
        options.adFadeTime = typeof options.adFadeTime === 'number' ? options.adFadeTime : 500;
        options.zIndex = typeof options.zIndex === 'number' ? options.zIndex : 200;

        function killLoaders() {
            $('._slowlane-ad').each(function(index, element) {
                $(element).fadeOut(function() {
                    setTimeout(function() {
                        $(element).remove();
                    }, 1);
                });
            });
            $('._slowlane-loader').stop(true).each(function(index, element) {
                setTimeout(function() {
                    $(element).animate({ height: element._slowlaneHeight + 'px' }, 500, function() {
                        $(this).css({ overflow: 'visible' });
                    });
                }, 500 * index);
            });
        }

        // Inject Info Floater
        if (!options.customFloater) {
            var close = options.fontAwesome ? '<i id="_slowlane-floater-x" class="fa fa-close"></i>' : '<a id="_slowlane-floater-x" class="_slowlane-text">Close</a>';
            var social = options.fontAwesome ? '<a href="https://twitter.com/intent/tweet?via=tweetsfromhelp&text=Keep+the+internet+free+and+open+%40FCC+and+%40TomWheelerFCC&hashtags=netneutrality&url=http://battleforthenet.com/" class="fa fa-twitter-square" target="_blank"></a>'
                                                + '<a href="https://www.facebook.com/sharer/sharer.php?u=http://battleforthenet.com" class="fa fa-facebook-square" target="_blank"></a>'
                                                + '<a href="https://plus.google.com/share?url=http://battleforthenet.com" class="fa fa-google-plus-square" target="_blank"></a>'
                                                + '<a href="https://www.linkedin.com/shareArticle?mini=true&url=http://battleforthenet.com/&title=Don\'t%20Break%20the%20Internet&summary=Keep%20the%20internet%20free%20and%20open.%20Do%20your%20part%20to%20preserve%20Net%20Neutrality.&source=" class="fa fa-linkedin-square" target="_blank"></a>'
                                             : '<a href="https://twitter.com/intent/tweet?via=tweetsfromhelp&text=Keep+the+internet+free+and+open+%40FCC+and+%40TomWheelerFCC&hashtags=netneutrality&url=http://battleforthenet.com" class="_slowlane-text" target="_blank">Twitter</a>'
                                                + '<a href="https://www.facebook.com/sharer/sharer.php?u=http://battleforthenet.com/" class="_slowlane-text" target="_blank">Facebook</a>'
                                                + '<a href="https://plus.google.com/share?url=http://battleforthenet.com/" class="_slowlane-text" target="_blank">Google+</a>'
                                                + '<a href="https://www.linkedin.com/shareArticle?mini=true&url=http://battleforthenet.com/&title=Don\'t%20Break%20the%20Internet&summary=Keep%20the%20internet%20free%20and%20open.%20Do%20your%20part%20to%20preserve%20Net%20Neutrality.&source=" class="_slowlane-text" target="_blank">LinkedIn</a>';
                                             
            var floater = $('<div id="_slowlane-floater">'
                        +   close
                        +   '<div id="_slowlane-floater-container">'
                        +       '<div id="_slowlane-floater-social">'
                        +           social
                        +       '</div>'
                        +       '<p><b>This is what the Internet could become if Net Neutrality is compromised.</b></p>'
                        +       '<p><a href="https://www.battleforthenet.com/" target="_blank">Express your opinion</a>, <a href="http://act2.freepress.net/letter/two_million/" target="_blank">e-mail Congress and the FCC</a>, and <a href="http://www.house.gov/representatives/find/" target="_blank">write to your local congressional representative</a>.</p>'
                        +   '</div>'
                        + '</div>').hide();

            floater.css({ zIndex: options.zIndex });

            $('body').append(floater.delay(1000).fadeIn(1000));

            $('#_slowlane-floater-x').click(killLoaders).click(function() {
                setTimeout(function() {
                    $('#_slowlane-floater').fadeOut();
                }, 1);
            });
        }

        // Run through each element to be slow-laned.
        this.each(function(index, query) {
            var element = $(query);

            // Hide the element so it doesn't look loaded, but we still want to pull its dimensions.
            element.css({ visibility: 'hidden' });

            function slowLoad() {
                var self = this;
                var element = $(self);
                self._slowlaneHeight = element.height();
                self._slowlaneId = index;

                // Quick workaround hack to actually wait for a loaded image.
                if (element.prop('tagName') === 'IMG' && self._slowlaneHeight <= 1) {
                    setTimeout(function() {
                        slowLoad.call(self);
                    }, 100);
                } else {
                    // Grab original element dimensions and classes.
                    var attributes = {
                        padding: element.css('padding'),
                        margin: element.css('margin'),
                        border: element.css('border'),
                        classes: typeof element.attr('class') === 'string' ? element.attr('class') : ''
                    };

                    // Completely gut the element of all dimensional styling.
                    element.removeClass().css({
                        width: '100%',
                        margin: 0,
                        padding: 0,
                        border: '0px solid #000',
                        height: self._slowlaneHeight + 'px'
                    });

                    // Create a wrapper and apply original element styling to it.
                    var wrapper = element.wrap('<div class="_slowlane-wrapper ' + attributes.classes + '"></div>').parent(); 
                    wrapper.css({
                        padding: attributes.padding,
                        margin: attributes.margin,
                        height: self._slowlaneHeight + 'px'
                    });

                    // Wrap loader around the element which will fake loading.
                    var loader = element.wrap('<div class="_slowlane-loader"></div>').parent();
                    loader[0]._slowlaneHeight = loader.height();
                    loader.height('0')
                          .delay(options.loadTime * self._slowlaneId)
                          .animate({ height: loader[0]._slowlaneHeight + 'px' }, options.loadTime, function() {
                              $(this).css({ overflow: 'visible' });
                              $(this).parent().find('> ._slowlane-ad').fadeOut(options.adFadeTime);
                          });

                    // Create a button to get into the fast-lane.
                    var icons = options.fontAwesome ? '<i class="fa fa-spinner fa-spin"></i><i class="fa fa-rocket"></i>' : '';
                    var ad = $('<div class="_slowlane-ad">' + icons + ' &nbsp; Buy Fast-Lane Access</div>').css({
                        zIndex: options.zIndex - 1
                    });
                    ad.click(killLoaders);
                    wrapper.append(ad);

                    // Show the element.
                    element.css({ visibility: 'visible' });
                }
            }

            slowLoad.call(query);
        });

        return this;
    }
})(jQuery);

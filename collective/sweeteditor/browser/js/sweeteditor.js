(function ($){
    $( document ).ready(function() {
        (function () {
            // control expandable items
            $(".collapsedHeading").live('click', function (){
                var $heading = $(this);
                $heading
                    .next()
                    .slideToggle(200, function (){
                        $heading.toggleClass('collapsed');
                    });
            });
        }());
        (function () {
            // control accordion items
            $(".accordionHeading").each(function () {
                // init accordions
                var $this = $(this), $prev, $next;
                $prev = $this.prev('.accordionBody');
                $next = $this.next('.accordionBody');

                if ($prev.length === 0) {
                    // this is the first accordion header
                    $this.removeClass('collapsed');
                    $this.addClass('first');
                } else {
                    $this.addClass('collapsed');
                    $next.addClass('collapsed');
                }

                $nextNext = $next.next('.accordionHeading');
                if ($nextNext.length == 0) {
                    $this.next('.accordionBody').addClass('last');
                }
            });

            $(".accordionHeading").live('click', function () {
                $that = $(this);
                $next = $that.next('.accordionBody');
                $that.removeClass('collapsed');
                if (! $that.hasClass('first')) {
                    $that.prevUntil('.first').each(function () {
                        $(this).addClass('collapsed');
                        $(this).prev('.accordionHeading').addClass('collapsed');
                    });
                }
                if (! $next.hasClass('last')) {
                    $next.nextUntil('.last').each(function () {
                        $(this).addClass('collapsed');
                        $(this).next('.accordionBody').addClass('collapsed');
                    });
                }
            });
        }());
    });
}(jQuery));

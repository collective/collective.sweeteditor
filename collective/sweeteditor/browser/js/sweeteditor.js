(function ($){
    (function () {
        // control expandable items
        $(".collapsedHeading").live('click',function (){
            var $heading = $(this);
            $heading
                .next()
                .slideToggle(200, function (){
                    $heading.toggleClass('collapsed');
                });
        });
    }());
    (function () {
        // control accordion items (TODO)
    }());
}(jQuery));

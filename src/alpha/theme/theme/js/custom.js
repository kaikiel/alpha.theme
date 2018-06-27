$( document ).ready(function() {
    $(".modal").on("show.bs.modal", function(){
        setTimeout(function(){ 
            $('.flexslider').resize();
        }, 300);
    })
});

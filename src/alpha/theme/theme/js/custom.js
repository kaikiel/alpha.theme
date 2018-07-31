$( document ).ready(function() {
// map
$('map area').click(function(){
    className = $(this).attr('id')
    $('.map-layer').hide()
    $('.' + className).show()
    $('.map-com').hide()
    $('.' + className + '-com').show()
})

/*
$('map area').hover( function(){
    className = $(this).attr('id')
//    $('.' + className).show()
}, function(){
    className = $(this).attr('id')
    display = $(this).css('display')
//debugger
//    if
//    $('.' + className).hide()

} )
*/



    $(".modal").on("show.bs.modal", function(){
        setTimeout(function(){ 
            $('.flexslider').resize();
        }, 300);
    })
});

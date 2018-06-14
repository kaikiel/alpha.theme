var shop_product = {
    template:
        `<div class="single-cart">
           <div class="cart-img">
             <a v-bind:href="url"><img v-bind:src="image" /></a>
           </div>
           <div class="cart-info">
             <h5><a v-bind:href="url">{{title}}</a></h5>
             <p>{{amount}} x {{price}}</p>
           </div>
        </div>`,
    props: ['title', 'url', 'image', 'price', 'sale_price', 'amount']
}

var shop_cart = new Vue({
    el: '#shop-cart',
    data: {
	total_number: 0,
	total_price: 0,
	shop_data: {'test':[11,22,'http://172.104.32.90:9301/Plone/products/54c15ba26d0b828b7247','http://172.104.32.90:9301/Plone/products/54c15ba26d0b828b7247/@@images/cover',1]},
    },
    components:{
        'shop_product': shop_product,
    },
    methods: {
        add_shop: function(title, price, sale_price, url, image, amount){
	    ans = Object.keys(this.shop_data).every(function(value){
		return value != title
	    })
	    if(ans){
	        this.shop_data[title] = [price, sale_price, url, image, amount]
	    }else{
		alert('物品以再購物車內')
	    }
	}
    },

})

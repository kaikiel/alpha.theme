var shop_product = {
    template:
        `<div class="single-cart">
           <div class="cart-img">
             <a v-bind:href="url"><img v-bind:src="image" /></a>
           </div>
           <div class="cart-info">
             <h5><a v-bind:href="url">{{title}}</a></h5>

             <template v-if="sale_price == null">
             <p>{{amount}} x {{price}}</p>
             </template>
             <template v-else>
             <p>{{amount}} x {{sale_price}}</p>
             </template>
           </div>
        </div>`,
    props: ['title', 'url', 'image', 'price', 'sale_price', 'amount']
}

var shop_cart = new Vue({
    el: '#shop-cart',
    data: {
	total_number: 0,
	total_price: 0,
	shop_data: {},
    },
    components:{
        'shop_product': shop_product,
    },
    created: function(){
	cookie_shop_cart = $.cookie('shop_cart')
	if(cookie_shop_cart){
	    this.shop_data = JSON.parse(cookie_shop_cart)
	}

	total_price = 0
	total_number = 0
	Object.values(this.shop_data).forEach(function(value){
	    if(value[1]){
		price = value[1]
	    }else{
		price = value[0]
	    }
	    total_price += price
	    total_number ++
	})
	this.total_number = total_number
	this.total_price = total_price
    },
    methods: {
        add_shop: function(title, price, sale_price, url, image, amount, uid){
	    ans = Object.keys(this.shop_data).every(function(value){
		return value != uid
	    })
	    if(ans){
	        this.shop_data[uid] = [price, sale_price, url, image, amount, title]
	        if(sale_price){
                    tmp_price = sale_price
                }else{
                    tmp_price = price
                }
		this.total_price += tmp_price
	   	this.total_number ++
	        json_shop_data = JSON.stringify(this.shop_data)
		$.cookie('shop_cart', json_shop_data)
		$.notify('Add Product Success', 'success')
		return 'success'
	    }else{
		$.notify('Product Already In Cart', 'error')
		return 'error'
	    }
	},
	judge_price: function(value){
	    if(value[1]){
                price = value[1]
            }else{
                price = value[0]
            }
	    return price
	}
    },
})

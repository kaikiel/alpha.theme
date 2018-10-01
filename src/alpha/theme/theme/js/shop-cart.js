var shop_product = {
    template:
        `<div class="single-cart">
           <div class="cart-img">
             <a v-bind:href="url"><img v-bind:src="image" /></a>
           </div>
           <div class="cart-info">
             <h5><a v-bind:href="url">{{title}}</a></h5>

             <p>{{dollar}} {{price}} x {{amount}}</p>
           </div>
        </div>`,
    props: ['title', 'url', 'image', 'price', 'amount', 'dollar']
}

var shop_cart = new Vue({
    el: '#shop-cart',
    data: {
	total_number: 0,
	total_price: 0,
	shop_data: {},
        dollar: ""
    },
    components:{
        'shop_product': shop_product,
    },
    created: function(){
        pathname = location.pathname.search('alpha_en')
        if(pathname != -1){
            this.dollar = 'NT$'
        }
	else{
            this.dollar = 'NT$'
        }
        cookie_shop_cart = $.cookie('shop_cart')
	if(cookie_shop_cart){
	    json_shop_cart = JSON.parse(cookie_shop_cart)
            abs_url = $('#abs_url').text()
            Object.keys(json_shop_cart).forEach(function(key){
                url = abs_url + '/get_product_data'
		$.ajax({
		    type: "post",
                    url: url,
                    data: {'uid': key},
                    success: function(result){
			if(result != 'error'){
                            result = JSON.parse(result)
			    amount = json_shop_cart[key]
			    shop_cart.total_number += 1
                            result.push(json_shop_cart[key])
                            shop_cart.shop_data[key] = result
                            shop_cart.total_price += result[2] * amount
		        }
                    }
		})
	    })
	}
    },
    methods: {
        add_shop: function(uid, amount){
	    shop_data = this.shop_data
	    cookie_shop_cart = $.cookie('shop_cart')
	    if(cookie_shop_cart){
		shop_cart_data = JSON.parse(cookie_shop_cart)
		ans = Object.keys(shop_cart_data).every(function(value){
		    return value != uid
		})
	    }else{
		shop_cart_data = {}
		ans = true
	    }
	    if(ans){
                abs_url = $('#abs_url').text()
                url = abs_url + '/get_product_data'
                $.ajax({
                    type: "post",
                    url: url,
                    data: {'uid': uid},
                    success: function(result){
                        if(result != 'error'){
                            result = JSON.parse(result)
                            shop_cart.total_number += 1
                            result.push(amount)
                            shop_cart.shop_data[uid] = result
                            current_total = Big(shop_cart.total_price)
                            item_price = Big(result[2])
                            item_amount = Big(amount)
                            total = current_total.add((item_price.minus(item_amount)))
                            shop_cart.total_price = parseFloat(total)
                        }
                    }
                })

		shop_cart_data[uid] = amount
                var date = new Date()
                date.setTime(date.getTime() + (60 * 60 * 1000))
                var f_path = '/'+location.pathname.split('/')[1]
                document.cookie = "shop_cart="+JSON.stringify(shop_cart_data)+"; expires="+date+"; path="+f_path; 

                msg_success = $("#notify-msg-translate").data("s_success")
		$.notify(msg_success, {globalPosition: 'bottom right',className:'success'})
		return 'success'
	    }else{
                msg_exist = $("#notify-msg-translate").data("s_exist")
		$.notify(msg_exist , {globalPosition: 'bottom right',className:'error'})
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
	},
	go_confirm_cart: function(){
	    if($.cookie('shop_cart')){
		return true
	    }else{
                msg_empty = $("#notify-msg-translate").data("s_empty")
		$.notify(msg_empty ,  {globalPosition: 'bottom right',className:'error'})
		return false
	    }
	}
    },
})

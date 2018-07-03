var shop_product = {
    template:
        `<div class="single-cart">
           <div class="cart-img">
             <a v-bind:href="url"><img v-bind:src="image" /></a>
           </div>
           <div class="cart-info">
             <h5><a v-bind:href="url">{{title}}</a></h5>

             <template v-if="sale_price == null || sale_price == ''">
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
	    json_shop_cart = JSON.parse(cookie_shop_cart)
	    Object.keys(json_shop_cart).forEach(function(key){
		lang = $.cookie('I18N_LANGUAGE')
		rmbRate = parseFloat(document.getElementById('rmbRate').innerText)
                url = location.protocol + '//' + location.hostname + ':' + location.port + '/Plone/' + lang + '/products/@search?Type=Product&metadata_fields=_all&TranslationGroup=' + key
		$.ajax({
		    type: "get",
                    headers: {
                        'Accept': 'application/json'
                    },
                    url: url,
                    success: function(rep){
                        items = rep['items'][0]
                        title = items['Title']
                        abs_url = items['getURL']
                        price = items['price']
                        salePrice = items['salePrice']
                        img = abs_url + '/@@images/cover'
			if(lang == 'zh-tw'){
			    price = Math.ceil(price * rmbRate)
			    salePrice = Math.ceil(salePrice * rmbRate)
			}
			if(salePrice){
			    shop_cart.total_price += salePrice
			}else{
			    shop_cart.total_price += price
			}
			shop_cart.total_number += 1
                        shop_cart.shop_data[key] = [title, abs_url, price, salePrice, img, json_shop_cart[key]]
                    }
		})
	    })
	}
    },
    methods: {
        add_shop: function(translationGroup, amount){
	    shop_data = this.shop_data
	    lang = $.cookie('I18N_LANGUAGE')
	    rmbRate = parseFloat(document.getElementById('rmbRate').innerText)
	    cookie_shop_cart = $.cookie('shop_cart')
	    if(cookie_shop_cart){
		shop_cart_data = JSON.parse(cookie_shop_cart)
		ans = Object.keys(shop_cart_data).every(function(value){
		    return value != translationGroup
		})
	    }else{
		shop_cart_data = {}
		ans = true
	    }
	    if(ans){
	        lang = $.cookie('I18N_LANGUAGE')
		url = location.protocol + '//' + location.hostname + ':' + location.port + '/Plone/' + lang + '/products/@search?Type=Product&metadata_fields=_all&TranslationGroup=' + translationGroup
		$.ajax({
		    type: "get",
		    headers: {
		        'Accept': 'application/json'
		    },
		    url: url,
		    success: function(rep){
			items = rep['items'][0]
			title = items['Title']
			abs_url = items['getURL']
			price = items['price']
			salePrice = items['salePrice']
			img = abs_url + '/@@images/cover'
			if(lang == 'zh-tw'){
                            price = Math.ceil(price * rmbRate)
                            salePrice = Math.ceil(salePrice * rmbRate)
                        }

			if(salePrice){
                            shop_cart.total_price += salePrice
                        }else{
                            shop_cart.total_price += price
                        }
			shop_cart.total_number += 1
			shop_data[translationGroup] = [title, abs_url, price, salePrice, img, amount]
		    }
		})
		shop_cart_data[translationGroup] = amount

                var date = new Date()
                date.setTime(date.getTime() + (60 * 60 * 1000))
		$.cookie('shop_cart', JSON.stringify(shop_cart_data), {expires: date, path:'/'})

		$.notify('Add Product Success', {globalPosition: 'bottom right',className:'success'})
		return 'success'
	    }else{
		$.notify('Product Already In Cart', {globalPosition: 'bottom right',className:'error'})
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
		$.notify('Shop Cart Is Empty',  {globalPosition: 'bottom right',className:'error'})
		return false
	    }
	}
    },
})

$( document ).ready(function() {

    // Currencies
    var currencies = {
        "USD" : {
            "name"  : "US Dollar",
            "fa"    : "&#xf155;",
            "symbol": "&#36;"
        },
        "GBP" : {
            "name"  : "British Pound",
            "fa"    : "&#xf154;",
            "symbol": "&#163;"
        },
        "EUR" : {
            "name"  : "Euro",
            "fa"    : "&#xf153;",
            "symbol": "&#128;"
        }
    }

    // Read cookie on start
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    var cookie_name = 'VeracoreCurrencyDefault';
    // Get an existing default currency
    var existing_price_default = readCookie(cookie_name);
    // Check if its empty
    if(existing_price_default && existing_price_default.length){
        console.log('DEFAULT CURRENCY IS  '+existing_price_default);
    } else {
        existing_price_default = "USD";
    }


    // Build currency converter
    function build_currency_selector(existing_price_default){

        var select_begin = '<select id="select_currency" class="form-control">';
        var option_list = '';

        // Building options list
        $.each(currencies, function(code, currency) {
            var selected_flag = '';
            if(code == existing_price_default){
                selected_flag = ' selected'
            }
            option_list = option_list + '<option value="' + code + '"' + selected_flag + '>' + currency["symbol"] + ' ' + currency["name"] + '</option>';
            //console.log(1);
        });

        var select_end = '</select>';

        // Place built converter
        $('#currency_converter').html(select_begin + option_list + select_end);

    }

    // When dropdown selection changes
    $( "#currency_converter" ).delegate( "#select_currency", "change", function() {

        var newly_selected_currency_code = $(this).val();

        // Read/set cookies
        var old_currency_code = set_currency_cookie(newly_selected_currency_code);

        if(old_currency_code && old_currency_code.length){
            //console.log('old code was '+old_currency_code);
        } else {
            //console.log('old code was null, USD set');
            old_currency_code = "USD";
        }

        // Set some data attributes
        $(this).attr('data-currency-old', old_currency_code);
        $(this).attr('data-currency-new', newly_selected_currency_code);

        var rate_response = get_currency_rate(old_currency_code, newly_selected_currency_code);


    });

    // Make and handle cookies
    function set_currency_cookie(new_currency_type){

        // Stock functions
        function createCookie(name,value,days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        }

        function eraseCookie(name) {
            createCookie(name,"",-1);
        }

        // Action

        // Read old cookie value
        var old_currency_type = readCookie(cookie_name);
        //console.log('OLD CURRENCY TYPE');
        //console.log(old_currency_type);
        // Delete a cookie if one exists
        eraseCookie(cookie_name);
        // Create new one
        createCookie(cookie_name, new_currency_type, 7);

        return old_currency_type;
    }

    // Replace all values on the page
    function change_currency_value(rate_response){

        var watch_list = $(this).getWatchList();

        console.log(rate_response);


        $(watch_list).each( function(index, node) {

            //console.log(node);

            // Set some data attributes
            $(node).attr('data-currency-old', rate_response.from);
            $(node).attr('data-currency-new', rate_response.to);

            var element_with_price_text = $(node).text();

            var old_price = Number( element_with_price_text.replace(/[^0-9\.]+/g,""));

            // Do some math
            function roundToTwo(num) {
                return +(Math.round(num + "e+2")  + "e-2");
            }

            var new_price_long = (old_price * rate_response.rate);

            var new_price = roundToTwo(new_price_long);

            // Write the new price out
            $(node).html(currencies[rate_response.to].symbol + new_price);

        });

    }

    // Get live currency rate
    function get_currency_rate(old_currency, new_currency){
        var rate_exchange_url = 'http://rate-exchange.appspot.com/currency?';
        var quantity = 1;
        var rate_string = 'from='+old_currency+'&to='+new_currency+'&q='+quantity;

        // Get the rate/value
        var response = $.ajax({
            url: rate_exchange_url+rate_string,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                q: "to, rate, from, v",
                format: "json"
            },

            // work with the response
            success: function( response ) {
                change_currency_value(response);
            }
        });


        return response;



    }


    // Initialize
    build_currency_selector(existing_price_default);

    // Check if default is anything other than USD and force action on page load if so
    if(existing_price_default != 'USD'){
        var rate_response = get_currency_rate('USD', existing_price_default);
    }


});

// JQuery Plugin
(function( $ ) {

    var watch_list = new Array();
    //var watch_list = $();

    $.fn.currencyWatch = function() {

        //var to_watch = $(this).toArray();

        //watch_list.push($(this));

        watch_list = this;


        //$(watch_list).add(this);
        //console.log(watch_list);

        //console.log(this);

/*
        // Each function
        $(this).each(function(index, value){
            //watch_list.push(this);
            console.log(this);
            //watch_list.add(this);
        });
*/

    };

    $.fn.getWatchList = function(){
        return watch_list;
    }

}( jQuery ));
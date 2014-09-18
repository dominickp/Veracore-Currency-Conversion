$( document ).ready(function() {

    // Currencies
    var currencies = {
        "USD" : '&#xf155; US Dollar',
        "GBP" : "&#xf154; British Pound",
        "EUR" : "&#xf153; Euro"
    }

    // Build currency converter
    function build_currency_selector(){

        var select_begin = '<select class="form-control">';
        var option_list = '';

        // Building options list
        $.each(currencies, function(index, value) {
            option_list = option_list + '<option>' + value + '</option>';
            console.log(1);
        });

        var select_end = '</select>';

        // Place built converter
        $('#currency_converter').html(select_begin + option_list + select_end);

    }

    // Initialize
    build_currency_selector();

});
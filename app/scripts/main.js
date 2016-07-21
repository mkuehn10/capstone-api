// https://www.tastekid.com/api/similar?q=music:red+hot+chili+peppers%2C+movie:pulp+fiction%2C+book:the+elegant+universe&k=232795-APIProje-WARMTIA1&info=1
// $(function() {
    var image;

    $('#tabs').tabs();

    var tasteKidResults = tastekid.Similar.Results;
    var bingImageResults = bingImages;

    $('#input-form').submit(function(event) {
        event.preventDefault();
        getResults();
    })

    function getResults() {
        $.each(tasteKidResults, function(n, result) {
            setTimeout(function() {
                     console.log(result.Name + ' is a ' + result.Type);
                     addAccordionToTabs(n, result);
                 }, 175  * n)
        });
        $( '#tabs' ).tabs( 'option', 'active', 0);

        // Disabled Ajax call to TasteKid
        // var params = {
        //     q: $('#recommend-1').val(),
        //     k: tasteKidAPIKey,
        //     info: 1,
        //     limit: 20
        // };
        // $.ajax({
        //     url: 'https://www.tastekid.com/api/similar',
        //     data: params,
        //     dataType: 'jsonp'
        // })
        // .done(function(result) {
        //     results = result.Similar.Results;
        //     $.each(results, function(n, result) {
        //         setTimeout(function() {
        //             console.log(result.Name + ' is a ' + result.Type);
        //             addAccordionToTabs(n, result);
        //         }, 175  * n)
        //     });
        //     $( '#tabs' ).tabs( 'option', 'active', 0);
        // })
        // .fail(function(jqXHR, error) {
        //     console.log('something went wrong');
        // });
    }

    function addAccordionToTabs(n, result) {
        image = bingImageResults[result.Name];
        $('#tabs-' + result.Type).append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 pic-container"><img class="img-responsive" src="' + image + '"><span class="caption">' + result.Name + '</span></div>');

        // Disabled Ajax Call Below
        // var params = {
        //     'q': result.Name + ' ' + result.Type,
        //     'count': 1
        // };
        // // console.log("Sending ajax....");
        // $.ajax({
        //     type: "GET",
        //     url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search',
        //     data: params,
        //     dataType: 'json',
        //     // jsonpCallback: 'searchCompleted',
        //     headers: {
        //         'X-Requested-With': 'XMLHttpRequest',
        //         'Content-Type': 'application/json',
        //         'Ocp-Apim-Subscription-Key': '0c98394a5a75426a8872510d12a639ea'
        //     }
        // })
        // .done(function(response) {
        //     image = response.value[0].thumbnailUrl;

        //     $('#tabs-' + result.Type).append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 pic-container"><img class="img-responsive" src="' + image + '"><span class="caption">' + result.Name + '</span></div>');
        // });
    }

    function searchCompleted(response) {
        console.log(response);
    }

    $('.tester').click(function() {
        $('.jasmine_html-reporter').toggle();
    });
// });




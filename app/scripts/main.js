// https://www.tastekid.com/api/similar?q=music:red+hot+chili+peppers%2C+movie:pulp+fiction%2C+book:the+elegant+universe&k=232795-APIProje-WARMTIA1&info=1
// $(function() {

    var tasteKidAPIKey = '232795-APIProje-WARMTIA1';
    // $('#projects').accordion();
    $("#tabs").tabs();
    console.log(tastekid.Similar.Results);

    var results;// = tastekid.Similar.Results;

    $('#input-form').submit(function(event) {
        event.preventDefault();
        getResults();
    })

    function getResults() {
        console.log($('#recommend-1').val());
        var params = {
            q: $('#recommend-1').val(),
            k: tasteKidAPIKey,
            info: 1
        };


        $.ajax({
            url: 'https://www.tastekid.com/api/similar',
            data: params,
            dataType: 'jsonp'
        })
        .done(function(result) {
            results = result.Similar.Results;
            $.each(results, function(n, result) {
                console.log(result.Name + ' is a ' + result.Type);
                addAccordionToTabs(result);


            });
            // console.log(result);

            // Setter
            $( "#tabs" ).tabs( "option", "active", 0);
            $('#accordion-music').accordion({
                collapsible: true,
                active: false
            });
            $('#accordion-movie').accordion({
                collapsible: true,
                active: false
            });
            $('#accordion-show').accordion({
                collapsible: true,
                active: false
            });
            $('#accordion-book').accordion({
                collapsible: true,
                active: false
            });
            $('#accordion-author').accordion({
                collapsible: true,
                active: false
            });
            $('#accordion-game').accordion({
                collapsible: true,
                active: false
            });
        })
        .fail(function(jqXHR, error) {
            console.log("something went wrong");
        })
    }

    function addAccordionToTabs(result) {
        $('#accordion-' + result.Type).append('<h3>' + result.Name + '</h3><div><p>' + result.wTeaser + '</p></div>');
        // $('#tabs-' + result.Type).append('<h3>' + result.Name + '</h3><div><p>' + result.wTeaser + '</p></div>');

    }






    $('.tester').click(function() {
        $('.jasmine_html-reporter').toggle();
    });


// });

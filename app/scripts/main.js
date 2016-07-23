// https://www.tastekid.com/api/similar?q=music:red+hot+chili+peppers%2C+movie:pulp+fiction%2C+book:the+elegant+universe&k=232795-APIProje-WARMTIA1&info=1
// $(function() {

    $('.display-btn').click(function(event) {
        console.log($(event.target).attr('id'));
        $('.display-tab').hide();
        $('#tabs-' + $(event.target).attr('id')).show();

        // $('#tabs-music').show();
    });
function RecommendedItem(name, type, imgURL) {
    var self = this;
    self.name = name;
    self.type = type;
    self.imgURL = ko.observable(imgURL);

}

function ViewModel() {

    var self = this;

    self.availableCategories = ['Music', 'Movie', 'TV Show', 'Book', 'Author', 'Game'];

    self.searchBox = ko.observableArray([{ query: ko.observable(''), category: ko.observable('') }]);

    self.recommendations = ko.observableArray([]);

    self.searchText = ko.computed(function() {
        var queryText = [];
        self.searchBox().forEach(function(element) {
            queryText.push(element.category() + ':' + element.query());
        });
        return queryText.join(',');
    });

    // self.numberOfMusicResults = function() {
    //     ko.utils.arrayFilter(self.recommendations(), function(item) {
    //         console.log(item.type === 'music');
    //         return item.type == 'music';
    //         // console.log(item);
    //     });
    // }
    self.numberOfResults = function (category) {
        return ko.utils.arrayFilter(self.recommendations(), function(item) {
            // console.log(item.type === 'music');
            return item.type == category;
            // console.log(item);
        }).length;
    };

    // self.numberOfMusicResults = ko.computed(function () {
    //     return ko.utils.arrayFilter(self.recommendations(), function(item) {
    //         console.log(item.type === 'music');
    //         return item.type == 'music';
    //         // console.log(item);
    //     }).length;
    // });

    self.addSearchBox = function() {
        // console.log("addSearchBox");
        self.searchBox.push({ query: ko.observable(''), category: ko.observable('') });
    };

    self.searchRecommendations = function() {
        /* Remove previous recommendations */
        self.recommendations([]);
        /* Request TasteKid Recommendations */
        self.requestRecommendations();

        // console.log("Knockout Searched for recommendations!");
        console.log('Search Text: ' + self.searchText());
        setTimeout(function() {
            self.getRecommendationsImages();
        }, 750);





    };

    self.requestRecommendations = function() {

        var results = tastekid.Similar.Results;
        $.each(results, function(n, result) {
            self.recommendations.push(new RecommendedItem(result.Name, result.Type, ''));

        });


        // var params = {
        //     q: self.searchText,
        //     k: tasteKidAPIKey,
        //     info: 1,
        //     limit: 20
        // };
        // $.ajax({
        //         url: 'https://www.tastekid.com/api/similar',
        //         data: params,
        //         dataType: 'jsonp'
        //     })
        //     .done(function(result) {
        //         //self.tasteKidResults(result.Similar.Results);
        //         var results = result.Similar.Results;
        //         $.each(results, function(n, result) {
        //             self.recommendations.push(new RecommendedItem(result.Name, result.Type, ''));

        //         });
        //         // console.log(self.recommendations());
        //         // results = result.Similar.Results;
        //         // $.each(results, function(n, result) {
        //         //     setTimeout(function() {
        //         //         console.log(result.Name + ' is a ' + result.Type);
        //         //         addAccordionToTabs(n, result);
        //         //     }, 175  * n)
        //         // });
        //         // $( '#tabs' ).tabs( 'option', 'active', 0);
        //     })
        //     .fail(function(jqXHR, error) {
        //         console.log('something went wrong');
        //     });
    }

    self.getRecommendationsImages = function() {
        // console.log("Getting images");
        // console.log(self.recommendations());

        $.each(self.recommendations(), function(n, recommendation) {
            console.log(recommendation.name + ' ' + recommendation.type)
            setTimeout(function() {
                self.bingImageRequest(recommendation);
            }, 175 * n);

        });

    };

    self.bingImageRequest = function(recommendation) {
        // bingImageResults[result.Name]
        recommendation.imgURL(bingImageResults[recommendation.name]);
        // var params = {
        //     'q': recommendation.name + ' ' + recommendation.type,
        //     'count': 1
        // };
        // // console.log("Sending ajax....");
        // $.ajax({
        //         type: "GET",
        //         url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search',
        //         data: params,
        //         dataType: 'json',
        //         // jsonpCallback: 'searchCompleted',
        //         headers: {
        //             'X-Requested-With': 'XMLHttpRequest',
        //             'Content-Type': 'application/json',
        //             'Ocp-Apim-Subscription-Key': bingAPIKey
        //         }
        //     })
        //     .done(function(response) {
        //         recommendation.imgURL(response.value[0].thumbnailUrl); // = response.value[0].thumbnailUrl;
        //     });
    }
}

var MyViewModel = new ViewModel();
ko.applyBindings(MyViewModel);



var image;

// $('#tabs').tabs();

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
        }, 175 * n)
    });
    $('#tabs').tabs('option', 'active', 0);

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

$('#menu-toggle').click(function(e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
});

$('#in-menu-toggle').click(function(e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
});

$('#new-search').click(function(e) {
    e.preventDefault();
    $('.display-tab').hide();
    $('#tabs-search').show();
    if ($(window).width() < 768) {
        $('#menu-toggle').trigger('click');
    }
});


function RecommendedItem(name, type, imgURL) {
    var self = this;
    self.name = name;
    self.type = type;
    self.imgURL = ko.observable(imgURL);
}

function ViewModel() {

    var self = this;

    self.availableCategories = ['Music', 'Movie', 'Show', 'Book', 'Author', 'Game'];

    self.searchBox = ko.observableArray([{
        query: ko.observable(''),
        category: ko.observable('')
    }]);

    self.recommendations = ko.observableArray([]);

    self.searchText = ko.computed(function() {
        var queryText = [];
        self.searchBox().forEach(function(element) {
            queryText.push(element.category() + ':' + element.query());
        });
        return queryText.join(',');
    });

    self.clickTab = function(event) {
        $('#tabs-search').hide();
        $('.display-tab').hide();
        $('#tabs-' + event.toLowerCase()).css('display', 'inline-block');
        if ($(window).width() < 768) {
            $('#menu-toggle').trigger('click');
        }

    };

    self.filterResults = function(category) {
        return ko.utils.arrayFilter(self.recommendations(), function(item) {
            return item.type === category.toLowerCase();
        });
    };

    self.addSearchBox = function() {
        self.searchBox.push({
            query: ko.observable(''),
            category: ko.observable('')
        });
    };

    self.removeSearchBox = function(box) {
        self.searchBox.remove(box);
    };
    self.searchRecommendations = function() {
        /* Remove previous recommendations */
        self.recommendations([]);
        /* Request TasteKid Recommendations */
        self.requestRecommendations();
        console.log(self.searchText());
        setTimeout(function() {
            self.getRecommendationsImages();
        }, 1);
        $('.display-tab').hide();
        $('#tabs-search').hide();
        if ($(window).width() < 768) {
            $('#menu-toggle').trigger('click');
        }
        $('#tabs-music').css('display', 'inline-block');
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
    };

    self.getRecommendationsImages = function() {
        $.each(self.recommendations(), function(n, recommendation) {
            setTimeout(function() {
                self.bingImageRequest(recommendation);
            }, 1 * n);
        });
    };

    self.bingImageRequest = function(recommendation) {
        // bingImageResults[result.Name]
        recommendation.imgURL(bingImages[recommendation.name]);
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
    };
}

var MyViewModel = new ViewModel();
ko.applyBindings(MyViewModel);

$('.tester').click(function() {
    $('.jasmine_html-reporter').toggle();
});

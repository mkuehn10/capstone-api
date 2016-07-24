function RecommendedItem(name, type, imgURL, wTeaser, wikiURL) {
    var self = this;
    self.name = name;
    self.type = type;
    self.imgURL = ko.observable(imgURL);
    self.wTeaser = wTeaser;
}

function ViewModel() {
    var self = this;

    self.currentWikiInfo = ko.observable('');
    self.currentWikiURL = ko.observable('');
    self.currentName = ko.observable('');
    self.searchBoxLimit = ko.observable(5);
    self.closeSearchBoxLimit = ko.observable(1);
    self.availableCategories = ['Music', 'Movie', 'Show', 'Book', 'Author', 'Game'];

    self.toggleMenu = function() {
        $('#wrapper').toggleClass('toggled');
    };

    self.searchBox = ko.observableArray([{
        query: ko.observable(''),
        category: ko.observable('')
    }]);

    self.showTesting = function() {
        $('.jasmine_html-reporter').toggle();
    };

    self.openSearchTab = function() {
        $('.display-tab').hide();
        $('#tabs-search').show();
        if ($(window).width() < 768) {
            self.toggleMenu();
        }
    };

    self.searchBoxAllowed = ko.computed(function() {
        return self.searchBox().length < self.searchBoxLimit();
    });

    self.closeButtonAllowed = ko.computed(function() {
        return self.searchBox().length > self.closeSearchBoxLimit();
    });

    self.recommendations = ko.observableArray([]);

    self.searchText = ko.computed(function() {
        var queryText = [];
        self.searchBox().forEach(function(element) {
            queryText.push(element.category() + ':' + element.query());
        });
        return queryText.join(',');
    });

    self.processEnter = function(data, event) {
        var keyCode = (event.which ? event.which : event.keyCode);
        console.log(keyCode);
        if (keyCode === 13) {
            self.searchRecommendations();
            return false;
        }
        return true;
    };

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

    self.formatTabs = function(category) {
        return category + ' (' + self.filterResults(category).length + ')';
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

        // setTimeout(function() {
        //     self.getRecommendationsImages();
        // }, 400);

        $('.display-tab').hide();
        $('#tabs-search').hide();
        if ($(window).width() < 768) {
            $('#menu-toggle').trigger('click');
        }
        $('#tabs-music').css('display', 'inline-block');
    };

    self.wikiInfoRequest = function(recommendation) {
        var params = {
            action: 'opensearch',
            search: recommendation.name,
            format: 'json',
            limit: '1',
        };
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php?',
            data: params,
            dataType: 'jsonp'
        })
        .done(function(result) {
            console.log(result);
                self.currentWikiInfo(recommendation.wTeaser);
                self.currentWikiURL(result[3][0]);
                $('#tooltip').hide();
                $('#tooltip').slideDown('slow');
            })
        .fail(function(jqXHR, error) {
            console.log('something went wrong');
        });
    };

    self.closeToolTip = function(target) {
        console.log(target);
        $('#tooltip').slideUp('slow');
    };

    self.requestRecommendations = function() {
        /* Static Results
        // var results = tastekid.Similar.Results;
        // $.each(results, function(n, result) {
        //     self.recommendations.push(new RecommendedItem(result.Name, result.Type, '', result.wTeaser));
        // }); */

        var tasteKidAPIKey = '232795-APIProje-WARMTIA1';
        var params = {
            q: self.searchText,
            k: tasteKidAPIKey,
            info: 1,
            limit: 25
        };

        $.ajax({
            url: 'https://www.tastekid.com/api/similar',
            data: params,
            dataType: 'jsonp'
        })
        .done(function(result) {
            var results = result.Similar.Results;
            $.each(results, function(n, result) {
                self.recommendations.push(new RecommendedItem(result.Name, result.Type, '', result.wTeaser));

            });
            self.getRecommendationsImages();
        })
        .fail(function(jqXHR, error) {
            console.log('something went wrong');
        });
    };

    self.getRecommendationsImages = function() {
        $.each(self.recommendations(), function(n, recommendation) {
            setTimeout(function() {
                self.bingImageRequest(recommendation);
            }, 25 * n);
        });
    };

    self.bingImageRequest = function(recommendation) {
        /* Static Results
        // recommendation.imgURL(bingImages[recommendation.name]); */
        var youtubeAPIKey = 'AIzaSyCBXGeMEgZqdVC2M8Iag8obl-eQnN-bmN0';

        var params = {
            part: 'snippet',
            key: youtubeAPIKey,
            q: recommendation.name + ' ' + recommendation.type,
            type: 'video',
            maxResults: 1,
            regionCode: 'US'
        };

        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/search',
            data: params,
            dataType: 'json'
        })
        .done(function(response) {
            console.log(response.items[0].snippet.thumbnails.medium.url);
            recommendation.imgURL(response.items[0].snippet.thumbnails.medium.url);
        })
        .fail(function(jqXHR, error) {
            console.log('something went wrong');
        });
    };

    self.imageClick = function(target, event) {
        self.wikiInfoRequest(target);
    }
}

var MyViewModel = new ViewModel();
ko.applyBindings(MyViewModel);

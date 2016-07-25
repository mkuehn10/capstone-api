/* RecommendedItem - an object that keeps track of each recommendation.
        name: the title of the recommendation
        type: the category (music, movie, etc.)
        imgURL: a link to the thumbnail
        wTeaser: the description provided by TasteKid
*/
function RecommendedItem(name, type, imgURL, wTeaser, wikiURL) {
    var self = this;
    self.name = name;
    self.type = type;
    self.imgURL = ko.observable(imgURL);
    self.wTeaser = wTeaser;
}

function ViewModel() {
    var self = this;

    /* currentWikiInfo - The tooltip description of the item that is clicked.
       currentWikiURL - The URL of the item that is clicked.
       currentName - The name of the item that is clicked.
       searchBoxLimit - Set to only allow 5 search terms (limited by TasteKid).
       closeSearchBoxLimit - Constant to track when to show the X close buttons.
       availableCategories - The different genres to search for.
    */
    self.currentWikiInfo = ko.observable('');
    self.currentWikiURL = ko.observable('');
    self.currentName = ko.observable('');
    self.searchBoxLimit = ko.observable(5);
    self.closeSearchBoxLimit = ko.observable(1);
    self.availableCategories = ['Music', 'Movie', 'Show', 'Book', 'Author', 'Game'];

    /* toggleMenu - Click handler for the sidebar */
    self.toggleMenu = function() {
        $('#wrapper').toggleClass('toggled');
    };

    /* searchBox - an array of objects tracking the search terms and categories */
    self.searchBox = ko.observableArray([{
        query: ko.observable(''),
        category: ko.observable('')
    }]);

    /* openSearchTab - Click handler for clicking on the search tab */
    self.openSearchTab = function() {
        $('.display-tab').hide();
        $('#tabs-search').show();
        if ($(window).width() < 768) {
            self.toggleMenu();
        }
    };

    /* searchBoxAllowed - Computed boolean to track whether or not to show
        more search boxes */
    self.searchBoxAllowed = ko.computed(function() {
        return self.searchBox().length < self.searchBoxLimit();
    });

    /* closeButtonAllowed - Computed boolean to track whether or not to show
        the close buttons on the search boxes */
    self.closeButtonAllowed = ko.computed(function() {
        return self.searchBox().length > self.closeSearchBoxLimit();
    });

    /* recommendations - An array of RecommendedItems */
    self.recommendations = ko.observableArray([]);

    /* searchText - Computed by taking all of the visible input boxes
        and concatenating the values with the categories */
    self.searchText = ko.computed(function() {
        var queryText = [];
        self.searchBox().forEach(function(element) {
            queryText.push(element.category() + ':' + element.query());
        });
        return queryText.join(',');
    });

    /* processEnter - handler to accept the search when user presses Enter */
    self.processEnter = function(data, event) {
        var keyCode = (event.which ? event.which : event.keyCode);
        if (keyCode === 13) {
            self.searchRecommendations();
            return false;
        }
        return true;
    };

    /* clickTab - process clicking on each of the results tabs */
    self.clickTab = function(event) {
        $('#tabs-search').hide();
        $('.display-tab').hide();
        $('#tabs-' + event.toLowerCase()).css('display', 'inline-block');
        if ($(window).width() < 768) {
            $('#menu-toggle').trigger('click');
        }
    };

    /* filterResults - helper function to filter the recommendations array
        by category */
    self.filterResults = function(category) {
        return ko.utils.arrayFilter(self.recommendations(), function(item) {
            return item.type === category.toLowerCase();
        });
    };

    /* formatTabs - helper function to format the display of the tabs in the
        sidebar */
    self.formatTabs = function(category) {
        return category + ' (' + self.filterResults(category).length + ')';
    };

    /* addSearchBox - adds a new empty search box to the searchBox array */
    self.addSearchBox = function() {
        self.searchBox.push({
            query: ko.observable(''),
            category: ko.observable('')
        });
    };

    /* removeSearchBox - removes the corresponding search box from the searchBox
        array */
    self.removeSearchBox = function(box) {
        self.searchBox.remove(box);
    };

    /* searchRecommendations - takes the input from the search boxes and
        searches for the recommendations and images */
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

    /* wikiInfoRequest - helper function to request the information from
        Wikipedia */
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
                self.currentWikiInfo(recommendation.wTeaser);
                self.currentWikiURL(result[3][0]);
                self.currentName(recommendation.name);
                $('#tooltip').hide();
                $('#tooltip').slideDown('slow');
            })
        .fail(function(jqXHR, error) {
            console.log('something went wrong');
        });
    };

    /* closeToolTip - click handler to close the open tooltip displaying
        the item description */
    self.closeToolTip = function(target) {
        $('#tooltip').slideUp('slow');
    };

    /* requestRecommendations - sends the request to TasteKid */
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

    /* getRecommendatinosImages - sends a request to get a thumbnail image for
        each of the recommendations */
    self.getRecommendationsImages = function() {
        $.each(self.recommendations(), function(n, recommendation) {
            setTimeout(function() {
                self.imageRequest(recommendation);
            }, 0);
        });
    };

    /* imageRequest - sends request to get thumbnail image */
    self.imageRequest = function(recommendation) {
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
            recommendation.imgURL(response.items[0].snippet.thumbnails.medium.url);
        })
        .fail(function(jqXHR, error) {
            console.log('something went wrong');
        });
    };

    /* imageClick - click handler for clicking on a recommendation image */
    self.imageClick = function(target, event) {
        self.wikiInfoRequest(target);
    }

    /* showTesting - click handler to show testing when enabled */
    self.showTesting = function() {
        $('.jasmine_html-reporter').toggle();
    };
}

var MyViewModel = new ViewModel();
ko.applyBindings(MyViewModel);

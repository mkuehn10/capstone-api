$(function () {
    'use strict';

    describe('Initial State', function () {
        it('should show the main search page', function () {

            expect($('#tabs-search').is(':visible')).toBe(true);
        });

        it('should not show the other search tabs', function () {
            // console.log(MyViewModel);
            $.each(MyViewModel.availableCategories, function(n, category) {
                console.log(category);
                expect($('#tabs-' + category.toLowerCase()).is(':visible')).toBe(false);
            });
        });

        it('should show one search box', function() {
            expect($('#form-id input').length).toBe(1);
        });
    });


    describe('Search Page', function () {

        afterEach(function () {
            // Reset the search box to its initial state
            MyViewModel.searchBox([{
                query: ko.observable(''),
                category: ko.observable('')
            }]);

        });

        it('should allow the user to add a search box', function() {
            $('.add-term').trigger('click');
            expect($('#form-id input').length).toBe(2);
        });

        it('should allow the user to add two search boxes', function() {
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            expect($('#form-id input').length).toBe(3);
        });

        it('should allow the user to add three search boxes', function() {
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            expect($('#form-id input').length).toBe(4);
        });

        it('should allow the user to add four search boxes', function() {
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            expect($('#form-id input').length).toBe(5);
        });

        it('should hide the + Search Term button when there are 5 boxes', function() {
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            $('.add-term').trigger('click');
            expect($('.add-term').is(':visible')).toBe(false);
        });
    });
}());

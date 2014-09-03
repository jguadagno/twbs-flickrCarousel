/**
* jQuery Twitter Bootstrap Flickr Carousel v1.0.0
* http://jguadagno.github.io/twbs-FlickrCarousel/
*
* Copyright 2014, Joseph Guadagno
* Released under Apache 2.0 license
* http://apache.org/licenses/LICENSE-2.0.html
*/
;
(function ($, window, document, undefined) {

    'use strict';

    var old = $.fn.twbsFlickrCarousel;

    // Contructor
    var TwbsFlickrCarousel = function (element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, $.fn.twbsFlickrCarousel.defaults, options);

        if (this.settings.onPageClick instanceof(Function)) {
            this.$element.first().bind('page', this.settings.onPageClick);
        }

        if (this.settings.onLoadError instanceof(Function)) {
            this.$element.first().bind('page', this.settings.onLoadError);
        }

        this.getPhotos(this.settings.pageNumber);

        return this;
    }

    // Prototype
    TwbsFlickrCarousel.prototype = {
        constructImageElement: function(photo) {
            if (photo === undefined) {
                return "";
            }
            return "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + this.settings.flickrSizeSuffix  + "." + this.settings.flickrImageType;
        },

        createCarouselItemCaption: function(title, description) {
            if (title === undefined) {title = ""; }
            if (description === undefined) {description = ""; }
            var caption = $('<div>').addClass('carousel-caption');
            $('<h3>').text(title).appendTo(caption);
            $('<p>').text(description).appendTo(caption);
            return caption;
        },

        createCarouselItem: function(photo) {
            var item = $('<div>').addClass('item');
            $('<img>').attr('src', this.constructImageElement(photo, false)).attr('alt', photo.title._content).appendTo(item);
            this.createCarouselItemCaption(photo.title._content, photo.description._content).appendTo(item);
            return item;
        },

        createCarouselIndicators: function() {
            // Draw out the indicator items
            var indicatorHolder = this.$element.find('.carousel-indicators');
            if (indicatorHolder === undefined || indicatorHolder.length === 0)
            {
                indicatorHolder = $('<ol>').addClass('carousel-indicators').prependTo(this.$element);
            }
            indicatorHolder.children().remove();
            for (var item = 0; item < this.settings.imagesPerPage; item++) {
                var indicator = $('<li>').attr('data-target', "#" + this.$element.attr('id')).attr('data-slide-to', item);
                if (item === 0) {
                    indicator.addClass('active');
                }
                indicator.appendTo(indicatorHolder);
            }
        },

        createCarouselInner: function() {
            var carouselInner = this.$element.find('div.carousel-inner');
            if (carouselInner === undefined || carouselInner.length === 0) {
                carouselInner = $('<div>').addClass('carousel-inner');
                carouselInner.prependTo(this.$element);
                // Add the placeholder image
                var placeHolderUrl = "<img src='http://www.placehold.it/" + this.settings.width + "x" + this.settings.height + "&text=Fetching+images...' alt='Fetching images'>";
                var item = $('<div>').addClass('item active');
                $(placeHolderUrl).appendTo(item);
                item.appendTo(carouselInner);
            }

            return carouselInner;
        },

        createCarouselNavigation: function() {
            var left = this.$element.find('a.left');
            if (left === undefined || left.length === 0) {
                left = $('<a>').addClass('left carousel-control').attr('href', "#" + this.$element.attr('id')).attr('role', 'button').attr('data-slide', 'prev');
                $('<span>').addClass('glyphicon glyphicon-chevron-left').appendTo(left);
                left.appendTo(this.$element);
            }

            var right = this.$element.find('a.right');
            if (right === undefined || right.length === 0) {
                right = $('<a>').addClass('right carousel-control').attr('href', "#" + this.$element.attr('id')).attr('role', 'button').attr('data-slide', 'next');
                $('<span>').addClass('glyphicon glyphicon-chevron-right').appendTo(right);
                right.appendTo(this.$element);
            }
        },

        // TODO: Implement our own pagination
        createPaginationLinks: function(paginationElement, photos) {
            if (paginationElement === undefined || paginationElement.length === 0)
            {
                console.log("createPaginationLinks: paginationElement was undefined or not found");
                return;
            }

            if (photos === undefined) {
                console.log("creationPagination: photos element was undefined");
                return;
            }
            for (var page = 1; page < photos.pages; page++) {
                var listItem = $('<li>');
                if (page === photos.page) {
                    listItem.addClass('active');
                }
                $('<span>').text(page).appendTo(listItem)
                listItem.appendTo(paginationElement);
            }
        },

        getPhotoInfo: function(photo, addClass) {

            if (photo === undefined) {
                console.log("getPhotoInfo: The photo was undefined");
                return;
            }

            var carouselInner = this.$element.find('div.carousel-inner')
            var twbsObject = this;

            $.getJSON(this.settings.flickrApiUrl, {
                method: "flickr.photos.getInfo",
                api_key: this.settings.flickrApiKey,
                photo_id: photo.id,
                secret: photo.secret,
                format: "json",
                nojsoncallback: "1"
            }).done(function (data) {
                var title = "", description = "";
                if (data.stat !== "ok") {
                    console.error("getPhotoInfo: Failed to get the details of the photo");
                } else {
                    var carouselItem = twbsObject.createCarouselItem(data.photo);
                    if (addClass === 'active') {
                        carouselItem.addClass('active');
                    }
                    $(carouselItem).appendTo(carouselInner);
                }
            });
        },

        getPhotos: function(pageNumber) {
            var carouselElement = this.$element;
            var base = this;

            // Make sure the required elements for the carousel are there
            carouselElement.addClass("carousel slide").attr("data-ride", "carousel");
            carouselElement.width(this.settings.width);

            this.createCarouselIndicators();
            var carouselInner = this.createCarouselInner();
            this.createCarouselNavigation();

            $.getJSON(this.settings.flickrApiUrl, {
                method: "flickr.photos.search",
                api_key: this.settings.flickrApiKey,
                tags: this.settings.tagsToSearchFor,
                per_page: this.settings.imagesPerPage,
                page: pageNumber,
                format: "json",
                nojsoncallback: "1"
            }).done(function (data) {
                if (data.stat !== "ok") {
                    console.error("getPhotos: Failed to get the list of photos");
                    return;
                }
                carouselInner.children().remove();
                $.each(data.photos.photo, function (i, item) {
                    if (i === 0) {
                        base.getPhotoInfo(item, 'active');
                    } else {
                        base.getPhotoInfo(item);
                    }
                });

                if (base.settings.paginationSelector !== undefined)
                {
                    var paginationElement = $(base.settings.paginationSelector);
                    if (paginationElement != undefined && paginationElement.length > 0 && ($.fn.twbsPagination)) {
                        $(base.settings.paginationSelector).twbsPagination({
                            totalPages: data.photos.pages,
                            visiblePages: base.settings.imagesPerPage,
                            startPage: pageNumber,
                            onPageClick: function (event, page) {
                                base.getPhotos(page);
                            }
                        });
                    }
                }
            });
        }
    };


    // Plugin
    $.fn.twbsFlickrCarousel = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);
        var data = $this.data('twbs-flickrCarousel');
        var options = typeof option === 'object' && option;

        if (!data) $this.data('twbs-flickrCarousel', (data = new TwbsFlickrCarousel(this, options) ));
        if (typeof option === 'string') methodReturn = data[ option ].apply(data, args);
        return ( methodReturn === undefined ) ? $this : methodReturn;
    };

    $.fn.twbsFlickrCarousel.defaults = {
        flickrApiKey: '',
        flickrApiUrl: 'https://api.flickr.com/services/rest/',
        tagsToSearchFor: '',
        width: '600',
        height: '600',
        imagesPerPage: 10,
        pageNumber: 1,
        flickrSizeSuffix: 'z',
        flickrImageType: 'jpg',
        paginationSelector: '#flickr-pagination',
        paginationClass: 'pagination',
        onPageClick: null,
        onLoadError: null
    };

    $.fn.twbsFlickrCarousel.Constructor = TwbsFlickrCarousel;

    $.fn.twbsFlickrCarousel.noConflict = function () {
        $.fn.twbsFlickrCarousel = old;
        return this;
    };

})(jQuery, window, document);

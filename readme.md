## jQuery Twitter Bootstrap Flickr Carousel ##

### Basic Usage ###
```javascript
$('#flickr-carousel').twbsFlickrCarousel(
    {tagsToSearchFor: 'mvpsummit,mvp2013,mvp13', 
    flickrApiKey: '<insert your key here>', 
    paginationSelector: '#flickr-pagination'}
    );
```
### Required Software ###
* jQuery (v1.8 or higher)
* Twitter Bootstrap (v3.0 or higher)
* Twitter Bootstrap components (v3.0 or higher)

## Settings ##
Setting | Default | Description
--------| ------- | -----------
flickrApiKey | _empty string_ | The Flickr Api Key to use
flickrApiUrl | https://api.flickr.com/services/rest/ | The Flickr Api Url
tagsToSearchFor | _empty string_ | The tags that you want to search for. Multiple tags should be separated by commas (,)
width | 600 | The width of the carousel
height | 600 | The height of the carousel
imagesPerPage | 10 | The number of images that should be returned per query
pageNumber | 1 | The page number to start with
flickrSizeSuffix | z | The size of the image to retrieve, see the size chart below
flickrImageType | jpg | The image type to retrieve
paginationSelector | #flickr-pagination | The jQuery selector for the paging control to use *
paginationClass | pagination | The bootstrap pagination css class to use *
onPageClick | null | _Not yet implemented_
onLoadError | null | _Not yet implemented_

### Flickr Image Size Chart ###
Size Code | Size Type
----------| ----------
s |	small square 75x75
q |	large square 150x150
t |	thumbnail, 100 on longest side
m |	small, 240 on longest side
n |	small, 320 on longest side
- |	medium, 500 on longest side
z |	medium 640, 640 on longest side
c |	medium 800, 800 on longest side†
b |	large, 1024 on longest side*
o |	original image, either a jpg, gif or png, depending on source format

### Pagination ###
If you want to use pagination with the carousel, this means it will automatically create the Previous | First | 1 | 2 | ... | Next | Last buttons, you will need the following.

Include the twbsPagination plugin in your source.  It can be found here: https://github.com/esimakin/twbs-pagination.
You need create a `<div>` tag with an id that you us for the paginationSelector setting.

## Useful Links ##
### ApiKey ###
You can visit https://www.flickr.com/services/api/misc.api_keys.html to obtain a Flickr Api Key

### Flickr Apis used ###
#### flickr.photos.search ####
Return a list of photos matching some criteria. Only photos visible to the calling user will be returned. To return private or semi-private photos, the caller must be authenticated with 'read' permissions, and have permission to view the photos. Unauthenticated calls will only return public photos.

https://www.flickr.com/services/api/flickr.photos.search.html

#### flickr.photos.getInfo ####
Get information about a photo. The calling user must have permission to view the photo.

https://www.flickr.com/services/api/flickr.photos.getInfo.html

#### Photo Source Url ####
https://www.flickr.com/services/api/misc.urls.html




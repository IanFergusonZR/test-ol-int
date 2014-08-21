/**

FOR REFERENCE

*************Example urls for using v2.1 RESTful API

Docs:  http://www.photorank.me/apidoc/beta.html
    
http://z1photorankapi-a.akamaihd.net/streams/1950959947/media/rated?auth_token=f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f             // get media in stream 1950959947 ranked by rated
http://z1photorankapi-a.akamaihd.net/streams/1950959947/media/photorank?auth_token=f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f         // get media in stream 1950959947 ranked by photorank
http://z1photorankapi-a.akamaihd.net/streams?auth_token=6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f             // get all streams
https://z1photorankapi-a.akamaihd.net/customers/215852/streams/search?&tag_key=A316&auth_token=6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f      //  get stream by product id "A316" (supertide).            


NOTES: 
*  Load a 'stream' to get the Product Id, Product Url, Base Product Image, Stream Id.  A stream is basically a product.  You can get all the product info from a stream, but you can't actually get to the images.
*  Load 'media' to get the set of images in a stream.




*************Example urls for using Photorank API v1   (deprecated)

Docs:  https://sandbox.photorank.me/docs/04-API

http://api.photorank.me/v1/photos?api_key=f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f       // get every picture
http://api.photorank.me/v1/photos/?stream=1400843184&api_key=f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f       // get every picture in stream 1400843184.  contains media, with uploader info for each media object


http://api.photorank.me/v1/streams?api_key=f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f       // get all streams
http://api.photorank.me/v1/streams/1400843184?api_key=f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f       // get stream 1400843184.  gives stream data, but does not return pictures within stream.


**/



var ZR = window.ZR || {};

// run this on window ready
$(function(){
    ZR.olapic.bindLoad0Button();
    ZR.olapic.bindStartOverButton(); 
    ZR.olapic.initOlapicSettings(); 
}); 


ZR.olapic = {
  
    // placeholder objects
    mediaObj : {}, 
    streamObj : {},
    streamId : '',       
    
    olapicCookiedAnalyticsId : '',
    // global variables
    imageLowerLimit : 6,       // update this value to define the breakpoint between "partial" and "full" gallery.
    counter : 0,
    numToLoad : 0,
    galleryContainer : $('.olapic-images'), 
    galleryWrapper : $('.olapic-gallery'),
    modalWindowProduct : $('#olapic-modal-product'), 
    modalWindowImage : $('#olapic-modal-image'), 

    
    /*
     *  Interactive Elements.  
     *  
     *  subject to change based on real design requirements.  used strictly for prototype.
     */ 
     
     // bind Go! button
    bindLoad0Button : function(){
        $('#load0').on('click touchstart', function(){ 
        
            var productId = $("input[name=productId]").val(); 
                       
            ZR.olapic.getOlapicStreamByProductId(productId);  
            ZR.olapic.disableLoadingButtons();
        }); 
    }, 
    // bind Start Over link 
    bindStartOverButton : function(){
        $('#startOver').on('click touchstart', function(){
                        
            // re-init placeholder objects 
            ZR.olapic.galleryWrapper.empty();
            ZR.olapic.modalWindowProduct.empty(); 
            ZR.olapic.modalWindowImage.empty(); 
            ZR.olapic.imageItems = [];            
            ZR.olapic.streamObj = {}; 
            ZR.olapic.streamId = ''; 
            
            // enable Go! button
            ZR.olapic.enableLoadingButtons();                                     
            
            
            //get our cookie value
            ZR.olapic.olapicCookiedAnalyticsId = 'aRandomInt';
        
            var cookieVal = $.cookie('__olapicU');
            console.log('cookieValue is ' + cookieVal);
            if(typeof cookieVal == 'undefined') {
                $.cookie('__olapicU', '12345678', {
                    expires : 30,
                    domain : "." + window.location.host,
                    path : '/'
                });
            }

            
        });     
    },    
    // disable Go!, enable Start Over
    disableLoadingButtons : function(){
        $('#load0').attr('disabled', 'disabled'); 
        $('#startOver').removeClass('hidden');
    },    
    // enable Go!, disable Start Over
    enableLoadingButtons : function(){
        $('#load0').removeAttr('disabled'); 
        $('input[name=productId]').val(''); 
        $('#startOver').addClass('hidden');
    },
       
    
    /*
     * Olapic Initialization and API Calls
     *
     */
    
    initOlapicSettings : function(){
    
    
    
    },

    callOlapicAnalytics : function() {
        //check for our cookie - set one if we don't have one
        
        var instance_id = 'some_instance_id';
        var stream_id = ZR.olapic.streamObj.stream_id;
        var media_id = '';
        var action = ''; //make this an arg
        var thumbCount = '';

        var auth_token = 'f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f';
        var url = 'https://analytics.photorank.me/customers/215852/track/widget/' + instance_id 
                    + /stream/ + stream_id 
                    + /media/ + media_id + 
                    + '/' + action + '?analytics_id=' + analytics_id +
                    + '&pics=' + thumbCount;
                    + '&auth_token=' + auth_token;
                    //ab_testing,segment}';   //  get stream by product id   
              
        console.log("Full Url: " + loadUrl); 
              
        $.when(                 
            $.ajax({
                type : 'GET',
                url : loadUrl,
                dataType: 'jsonp',                
                success : function(response){        
                    if (typeof response !== 'undefined'){ 
                    
                        console.log(response); 
                        
                        // response is a stream.  grab its product data. build a thing that we can pass to hbs template.               
                        streamId = response.data.id;                                                 
                                                                        
                        ZR.olapic.streamObj = {};                        
                        ZR.olapic.streamObj["stream_name"] = response.data.name;
                        ZR.olapic.streamObj["stream_id"] = response.data.id;
                        ZR.olapic.streamObj["stream_product_url"] = response.data.product_url;
                        ZR.olapic.streamObj["stream_tag_based_key"] = response.data.tag_based_key; 
                                                
                        if (version == 'v2.0'){                        
                            ZR.olapic.streamObj["stream_product_image"] = response.data._embedded.base_image._links.self.href;   // use this path for v2.0
                        }
                        else if (version == 'v2.1'){
                            ZR.olapic.streamObj["stream_product_image"] = response.data._embedded.base_image.images.normal; 
                        }                        
                        // these attributes are not available on the object returned by v2.0
                        if (version == 'v2.1'){                        
                            ZR.olapic.streamObj["stream_product_availability"] = response.data.product_info.availability;
                            ZR.olapic.streamObj["stream_product_price"] = response.data.product_info.price;
                        }
                        
                        // now we know the stream id.  use that to get the media set.                        
                        ZR.olapic.getOlapicMediaByStreamId(streamId); 
                        
                    }
                }            
            })               
        );        
        
    },
    
    
    getOlapicStreamByProductId : function(productId){         

        var auth_token = 'f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f',
            version = 'v2.2',            
            url = 'https://z1photorankapi-a.akamaihd.net/customers/215852/streams/search?&tag_key=';   //  get stream by product id   
        
        url = url + productId;  
           
        var loadUrl = url + "&auth_token=" + auth_token + "&version=" + version;  
              
        console.log("Full Url: " + loadUrl); 
              
        $.when(                 
            $.ajax({
                type : 'GET',
                url : loadUrl,
                dataType: 'jsonp',                
                success : function(response){        
                    if (typeof response !== 'undefined'){ 
                    
                        console.log(response); 
                        
                        // response is a stream.  grab its product data. build a thing that we can pass to hbs template.               
                        streamId = response.data.id;                                                 
                                                                        
                        ZR.olapic.streamObj = {};                        
                        ZR.olapic.streamObj["stream_name"] = response.data.name;
                        ZR.olapic.streamObj["stream_id"] = response.data.id;
                        ZR.olapic.streamObj["stream_product_url"] = response.data.product_url;
                        ZR.olapic.streamObj["stream_tag_based_key"] = response.data.tag_based_key; 
                                                
                        if (version == 'v2.0'){                        
                            ZR.olapic.streamObj["stream_product_image"] = response.data._embedded.base_image._links.self.href;   // use this path for v2.0
                        }
                        else if (version == 'v2.1'){
                            ZR.olapic.streamObj["stream_product_image"] = response.data._embedded.base_image.images.normal; 
                        }                        
                        // these attributes are not available on the object returned by v2.0
                        if (version == 'v2.1'){                        
                            ZR.olapic.streamObj["stream_product_availability"] = response.data.product_info.availability;
                            ZR.olapic.streamObj["stream_product_price"] = response.data.product_info.price;
                        }
                        
                        // now we know the stream id.  use that to get the media set.                        
                        ZR.olapic.getOlapicMediaByStreamId(streamId); 
                        
                    }
                }            
            })               
        );        
    },    
    
    
    getOlapicMediaByStreamId : function(streamId){
        var numThumbs = 0,                    
            auth_token = 'f6bf41a57927ce8c83b68e34ba24db85f74170f4952b907beef03a9001c3339f',
            version = 'v2.1'; 
        
        var url = 'http://z1photorankapi-a.akamaihd.net/streams/' + streamId + '/media/photorank';         
          
        var loadUrl = url + "&auth_token=" + auth_token + "&version=" + version;                
              
        console.log("Full Url: " + loadUrl); 
              
        $.when(                 
            $.ajax({
                type : 'GET',
                url : loadUrl,
                dataType: 'jsonp',                
                success : function(response){        
                    if (typeof response !== 'undefined'){         
                        
                        // response contains media.  grab the image set.  build a json thing that we can pass to hbs template.                           
                        ZR.olapic.mediaObj = {};        
                        ZR.olapic.mediaObj["images"] = response.data._embedded.media; 
                        //TODO : may need to grab media_id
                        
                    }
                }            
            })               
        )
        .done( function(response){
             
            numThumbs = ZR.olapic.mediaObj.images.length;  
            
            if (numThumbs == 0){
                // display desired UI for empty data set.  this fn could also catch the case where the olapic ajax call fails.
                ZR.olapic.loadEmptyTemplate(response);
            }                                
            else if ( numThumbs > 0 && numThumbs < ZR.olapic.imageLowerLimit ){
                // handle case where number of images in data set is less than some threshold (10?).  display desired UI, and don't init any functions for loading more images, e.g. lazy loader.                
                $.when(ZR.olapic.loadPartialTemplate(response))
                 .done(function(){                    
                    ZR.olapic.parseImages(ZR.olapic.mediaObj); 
                });
                
            }                
            else {
                // handle case where number of images in data set is greater than some threshold (10?).  display desired UI, and enable some function for loading the rest of the images, e.g. lazy loader.
                $.when(ZR.olapic.loadFullTemplate(response))
                    .done(function(){                        
                        ZR.olapic.parseImages(ZR.olapic.mediaObj);      
                    });                
                
            }       
        })
        .fail ( function(response){            
            ZR.olapic.loadEmptyTemplate(response);
        }); 
    },
    
    
    // function to take data object and create thumbs using hbs template
    parseImages : function(mediaObj){                
            
        ZR.olapic.getAndParseTemplate('olapic-thumbs', mediaObj)
          .done(function(response){ 
            ZR.olapic.galleryContainer.html(response).show(); 
            ZR.olapic.bindThumbClicks();
        });                  
         
    },
   
            
    // bind clicks to each of the thumbs 
    bindThumbClicks : function(){
        $('.olapic-image').on('click', function(){
        
            var counter = $(this).attr('id'); 
            
            // populate modal, right hand side comes from stream/product data
            ZR.olapic.getAndParseTemplate('olapic-modal-descr', ZR.olapic.streamObj)
                .done(function(response){
                    ZR.olapic.modalWindowProduct.html(response);
                });                        
            
            // populate modal, image and uploader info come from media object
            ZR.olapic.getAndParseTemplate('olapic-modal-image', ZR.olapic.mediaObj.images[counter])
                .done(function(response){
                    ZR.olapic.modalWindowImage.html(response);
                }); 
            
            // show modal
            $('#myModal').modal()
            
            //make our analytics request
            console.log('fire our analytics request for thumnail click with sessionId : ' + ZR.olapic.olapicCookiedAnalyticsId);
            //use the stream object to get at our stream id
            ZR.olapic.callOlapicAnalytics();
            
        }); 
    },               
        
        
    loadEmptyTemplate : function(data){        
        // load up a hbs template for the case where there are 0 olapic images 
        ZR.olapic.getAndParseTemplate("empty-gallery")            
            .done(function(response){
                ZR.olapic.galleryWrapper.html(response).show();                
            })
            .done(function(response){
                ZR.olapic.galleryContainer = $('.olapic-images');   // .olapic-images div is inside hbs template, so init that after template is parsed
            });
    },
    
    loadPartialTemplate : function(data){        
        // load up a hbs template for the case where there are "partial" olapic images        
        
        console.log(data); 
        
        ZR.olapic.getAndParseTemplate("partial-gallery")
            
            .done(function(response){
                ZR.olapic.galleryWrapper.html(response).show();
            })
            .done(function(response){
                ZR.olapic.galleryContainer = $('.olapic-images');  // .olapic-images div is inside hbs template, so init that after template is parsed
            });
    },
    
    loadFullTemplate : function(data){
        // load up a hbs template for the case where there are "full" olapic images.  pagination might go here.
        ZR.olapic.getAndParseTemplate("full-gallery")
            .done(function(response){
                ZR.olapic.galleryWrapper.html(response).show();
            })
            .done(function(response){
                ZR.olapic.galleryContainer = $('.olapic-images');   // .olapic-images div is inside hbs template, so init that after template is parsed
            });
    },
            
    getAndParseTemplate : function(name,data) {
        return $.get('js/template/'+name+'.hbs').then(function(src) {
            var fn = Handlebars.compile(src);
            return fn(data);
        });        
    } 
    
};

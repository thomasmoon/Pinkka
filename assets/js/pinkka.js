
var Cards = {
	
	items: null,
	activeIndex: 0,
    primaryLang: null,
    collection: '',
  
  showCard_callback: function(index, card) {
		if (!card) {
		  if (Cards.items[index]) {
		    $('#card_'+index).fadeIn(100, function(card) {
			  	$('#card_'+index).click(function(){
					Cards.openCard(this.id);
				}); 
			  Cards.showCard_callback(index+1, card);
			} );
		  }
		  return;
	    }
	},
	
  openCard: function(card_id) {
		var findId = card_id.match('([0-9]+)$');
		Cards.activeIndex = findId[0]-1;
	
		$('#intro').hide();
		$('#zoom').html('<a href="#" onclick="$(\'#zoom\').fadeOut();"><img src="http://pinkka.thomasmoon.net:8080/media/illustrations/'+Cards.items[Cards.activeIndex].latin.replace(' ','_')+'-resized-600px.jpg" /></a>').fadeIn();
		$('#latin').html(Cards.items[Cards.activeIndex].latin);
		$('#finnish').html(Cards.items[Cards.activeIndex].finnish);
		$('#english').html(Cards.items[Cards.activeIndex].english);
		$('#info').show();
	},

  reloadSearch: function() {

      $("#search").typeahead('destroy');

      var species = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name_'+Cards.primaryLang),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          prefetch: {
              cacheKey: 'cards_'+Cards.collection+'_'+Cards.primaryLang,
              url: 'http://localhost:1337/listCards/'+Cards.collection,
              ttl: 0 // in milliseconds
          },
          limit: 1000
      });

      // kicks off the loading/processing of `local` and `prefetch`
      species.initialize();


      $("#search").typeahead({
              hint: true,
              highlight: true,
              minLength: 1,
              autoselect: true
          },
          {
              displayKey: 'name_'+Cards.primaryLang,
              source: species.ttAdapter() // Search function: substringMatcher(species)
              /*templates: {
                  header: '<h4 class="league-name">Plants</h4>'
              }*/
          }).on('typeahead:selected', function(event, selection) {
              window.location = "/card/"+selection.id;
          });

  },

  setPrimaryLang: function (lang, label) {
    if (Cards.primaryLang == lang) return;
    if (!Cards.primaryLang) var init = true;
    Cards.primaryLang = lang;
    Cards.reloadSearch();
    $('.lang ul.dropdown-menu').children().show();
    $('.lang ul.dropdown-menu li#'+lang).hide();
    if (!init) {
        $('.lang button span.primaryLanguage').html(label);
        $.get("http://localhost:1337/user/setPrimaryLang?primaryLang="+lang);
    }
  }
};




$(document).ready(function() {

    $('span.glyphicon').tooltip({ delay: 500, placement: 'bottom' });

    // Find if we're in a specific collection and set it to cards if we are
    var collection = $('input[name="collection"]')
    if (collection.length) Cards.collection = collection.val();

    var primaryLang = $('.lang button span.primaryLanguage');
    Cards.setPrimaryLang(primaryLang.data('name'), primaryLang.text());

    $('.lang ul.dropdown-menu').children().each(function(i){
      $(this).find('a').on("click", function () {
          Cards.setPrimaryLang($(this).data('name'), $(this).text());
      });
    });


    //callback handler for form submit
    $(".edit-image").submit(function(e)
    {

        console.log("submit form");
        var postData = $(this).serializeArray();
        var formURL = $(this).attr("action");
        $.ajax(
            {
                url : formURL,
                type: "POST",
                data : postData,
                success:function(data, textStatus, jqXHR)
                {
                    //data: return data from server
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    //if fails
                    console.log('error', textStatus);
                }
            });
        e.preventDefault(); //STOP default action
        e.unbind(); //unbind. to stop multiple form submit.
    });


    //callback handler for form submit
    $(".new-image form").submit(function(e)
    {

        var fd = new FormData();
        var postData = $(this).serializeArray();
        var formURL = $(this).attr("action");
        $.ajax(
            {
                url : formURL,
                type: "POST",
                data : postData,
                success:function(data, textStatus, jqXHR)
                {
                    //data: return data from server
                    console.log(data);
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    //if fails
                    console.log('error', textStatus);
                }
            });
        e.preventDefault(); //STOP default action
        e.unbind(); //unbind. to stop multiple form submit.
    });



        return false;

		$.ajax({
		  url: "http://pinkka.thomasmoon.net:1337/Insect",
		  dataType : 'json'
		}).success(function(results) {
			console.debug(results);
			Cards.items = results;
			var toAppend = '';
			var index = 1;

			for (i=0; i<Cards.items.length; i++) {
				if(Cards.items[i].scientific) {
                    //$('.cards').append(Cards.items[i].scientific);

                    d=document.createElement('div');
                    $(d).addClass('card col-10 col-sm-10 col-lg-10')
                        .html('<h4>'+Cards.items[i].scientific+'</h4>')
                        .appendTo($(".cards"))

					//toAppend += '<div id="card_'+(i+1)+'" class="card_wrapper"><div class="card">'+Cards.items[i].scientific+'<a href="javascript: void(0);"><img src="http://pinkka.thomasmoon.net:8080/media/illustrations/'+Cards.items[i].scientific.replace(' ','_')+'-resized-125px.jpg" /></a></div></div>';
				}
			}
			
			$('.cards').append(toAppend).delay(1000);


            Cards.showCard_callback(1);

                /*
			$('#hy-logo').fadeOut('slow', function() {
			    // Animation complete.
			    Cards.showCard_callback(1);
			});*/
			
			

		});	
});

/*
$(document).keydown(function(e){
    switch(e.which) {
        case 37: // left
		Cards.activeIndex--;
        break;

        case 39: // right
		Cards.activeIndex++;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault();
});
*/
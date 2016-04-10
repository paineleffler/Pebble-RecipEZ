/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vibe = require('ui/vibe');
var Ajax = require('ajax');

var message;

var defaultCard = new UI.Card({
  title:'Load a Recipe!',
  subtitle:'Use RecipEZ App to push over recipe instructions.'
});
defaultCard.show();

//menu
function recipeIngredMenu(message){
  var menu = new UI.Menu({
      sections: [{
        items: [{
          title: 'Recipe',
          subtitle: 'Show Instructions'
        }, {
          title: 'Ingredients',
          subtitle: 'Qty and Nutrition'
        }]
      }]
    });
    menu.on('select', function(e){
      //recipe
      if(e.itemIndex === 0){
      }     
      //ingredients
      else {
        request();
      }

      console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
      console.log('The item is titled "' + e.item.title + '"');
    });
    menu.show();
}

//wolfram request
function request(){
  Ajax(
  {
    url: 'http://recipezwolfram-devskwod.rhcloud.com/wolframalpha?q=3.5%20ounces%20chicken&appid=9Q4Y3E-QJJR6RPR3U',
    type: 'json'
  },
  function(data, status, request){
    console.log('Success'); 
    Vibe.vibrate('short');
  },
  function(error, status, request){
    console.log('Failed', error);
    Vibe.vibrate('long');
  }
  );
}

//load the recipe/ingredients menu
defaultCard.on('click', 'up', function(e){
  recipeIngredMenu(message);
});

//event listeners
Pebble.addEventListener('ready', function() {
  console.log('PebbleKit JS ready!');
});

// Get AppMessage events
Pebble.addEventListener('appmessage', function(e) {
  // Get the dictionary from the message
  var dict = e.payload;
  console.log('Got message: ' + JSON.stringify(dict));
  defaultCard.title = 'Recipe Loaded';
  message = e.payload; 
});
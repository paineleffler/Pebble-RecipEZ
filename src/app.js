/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vibe = require('ui/vibe');
var Accel = require('ui/accel');

var message;

var defaultCard = new UI.Card({
  title:'Load a Recipe!',
  subtitle:'Use RecipEZ App to push over recipe instructions.'
});

defaultCard.show();

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
      //
      if(e.itemIndex === 0) 
        Vibe.vibrate('short');
      else 
        Vibe.vibrate('long');
      console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
      console.log('The item is titled "' + e.item.title + '"');
    });
    menu.show();
}

defaultCard.on('click', 'up', function(e){
  recipeIngredMenu(message);
});

Pebble.addEventListener('ready', function() {
  // PebbleKit JS is ready!
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
/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');

var defaultCard = new UI.Card({
  title:'Load a Recipe!',
  subtitle:'Use RecipEZ App to push over recipe instructions.'
});

defaultCard.show();

defaultCard.on('click', 'up', function(e){
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
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
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
  
});
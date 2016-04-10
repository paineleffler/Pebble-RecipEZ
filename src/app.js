/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vibe = require('ui/vibe');
var Ajax = require('ajax');

var message = {
  "ingredients": [
    "1 pita bread",
    "2 tbsp pizza sauce",
    "1/4 cup mozerella cheese"
  ],
  "steps":[
    "Preheat Oven to 365",
    "Put sauce on pita bread",
    "Put cheese on pizza",
    "bake for 15 mins",
    "eat pizza"
  ]
};

console.log("message", JSON.stringify(message));
console.log("ingredients", JSON.stringify(message.ingredients));

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
        var steps = message.steps;
        var i;
        for(i=steps.length-1; i>=0; i--){
            var card = new UI.Card({
              title: 'Step ' + i,
              body: steps[i],    
            });
            card.show();
        }

  
        
      }     
      //ingredients
      else {
        ingredientListMenu(message);
      }
    });
    menu.show();
}

// Renders the list of ingredients
function ingredientListMenu(message) {
  var ingredients = message.ingredients;
  console.log('ingredients #2:',JSON.stringify(ingredients)); 
  // Create the UI menu
  var items = ingredients.map(function(ing) {
    return { title: ing };
  });
  console.log('items:' + items);
  
  // Priming the shitty cache
  ingredients.forEach(function(ing) {
    getIngredientInfo(ing, function() {}, function() {});
  });
  
  var menu = UI.Menu({
    sections: [{
      items: items 
    }]
  });
  menu.show();
  // Call ingredient screen with the ingredient that was clicked.
  menu.on('select', function(e) {
    ingredientScreen(message.contents.ingredients[e.itemIndex]);
  });
}

function ingredientScreen(ingredient) {
  // Make request to get ingredient, and populate the screen.
  getIngredientInfo(ingredient.name /* ? */, function success(data, status, request) {
    // success - got the ingredient, build the screen.
    Vibe.vibrate('short');
  }, function error(error, status, request) {
    // uh0h - show error message or go back.
    Vibe.vibrate('long');
  });
}

function getIngredientInfo(ingredient, success, error) {
  Ajax({
    url: encodeURI('http://recipezwolfram-devskwod.rhcloud.com/ingredient?q=' + ingredient + '&appid=9Q4Y3E-QJJR6RPR3U'),
    type: 'json'
  }, success, error);
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
  //message = e.payload; 
});
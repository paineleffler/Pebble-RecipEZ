var UI = require('ui');
var Vibe = require('ui/vibe');
var Ajax = require('ajax');
var Accel = require('ui/accel');
var Vector2 = require('vector2');
require('firebase');
Firebase.INTERNAL.forceWebSockets();

var baseRef = new Firebase("https://myrecipez.firebaseio.com/");


baseRef.child('cathacks').on('value', function(snapshot) {
  console.log('new snap', JSON.stringify(snapshot.val()));
  message = snapshot.val();
});

var message = {
  "ingredients": [
    "1 pita bread",
    "2 tbsp pizza sauce",
    "1/4 cup swiss cheese",
    "5 slices of pineapple",
    "10g of pepperoni"
    
  ],
  "steps":[
    "Preheat Oven to 365",
    "Put sauce on pita bread",
    "Put cheese on pizza",
    "bake for 15 mins",
    "eat pizza"
  ]
};
var iphoneMessage;

//ingredient data
var ingredients = message.ingredients;
var numIngreds = ingredients.length;
//instruction data
var instructions = message.steps;
var numInstrucs = message.steps.length;


// Show splash screen while waiting for data
var splashWindow = new UI.Window();
// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Waiting for IOS Data...',
  font:'GOTHIC_28_BOLD',
  color:'white',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'blue'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

Accel.init();

function getIngredientInfo(ingredient, success, error) {
  Ajax({
    url: encodeURI('http://recipezwolfram-devskwod.rhcloud.com/ingredient?q=' + ingredient + '&appid=9Q4Y3E-QJJR6RPR3U'),
    type: 'json'
  }, success, error); 
}

//build ingredients menu
var parseIngredients = function(ingredients, numIngreds) {
  var items = [];
  for(var i = 0; i < numIngreds; i++) {
    // Always upper case the description string
    var title = ingredients[i];
    
    // Add to menu items array
    items.push({
      title:title
    });
  }
  // Finally return whole array
  return items;
};

//build instructions menu
var parseInstructions = function(instructions, numInstrucs) {
  var items = [];
  for(var i = 0; i < numInstrucs; i++) {
    // Always upper case the description string
    var title = 'Step ' + i;
    var body = instructions[i];
    
    // Add to menu items array
    items.push({
      title:title,
      body:body,
    });
  }
  // Finally return whole array
  return items;
};

//build ingredients menu items
var ingredsMenus = parseIngredients(ingredients, numIngreds);
//build instructions menu items
var instrucMenus = parseInstructions(instructions, numInstrucs);

var ingMenus = new UI.Menu({
  highlightBackgroundColor: 'blue',
  highlightTextColor: 'white',
  sections: [{
    title:'Ingredients',
    items: ingredsMenus,
    scrollable: true
  }]
});

var insMenus = new UI.Menu({
  highlightBackgroundColor: 'green',
    highlightTextColor: 'white',
    sections: [{
    title:'Steps',
    items: instrucMenus,
    scrollable: true
  }]
});
var i = 0;
insMenus.on('accelTap', function(e){
    Vibe.vibrate('short');
    if(i<numInstrucs-1)i++;
    else i = 0;
    // Create the Card for detailed view
    var detailCard = new UI.Card({
      title: 'Step '+ [i],
      body: instructions[i]
    });
    detailCard.show();
    setTimeout(function(){ detailCard.hide(); }, 5000);
    
});

var j = 0;
ingMenus.on('accelTap', function(e){
  function populateMenu(data) {
    Vibe.vibrate('short');
    if(j<numIngreds-1) j++;
    else j = 0;
    var calories = data.calories;
    var fat = data.fat;
    var carbs = data.carbs;
    
    // Create the Card for detailed view
    var detailCard = new UI.Card({
      title: ingredients[j],
      body: 'Calories......' + calories + '\n' +
            'Fat.............' + fat + '\n' + 
            'Carbs.........' + carbs
    });
    detailCard.show();
    setTimeout(function(){ detailCard.hide(); }, 5000);
  }
  
  function handleError(error) {
    console.error(error);
    Vibe.vibrate('long');
    
    var detailCard = new UI.Card({
      title: 'Request Failed!!!'
      
    });
    detailCard.show();
    setTimeout(function(){ detailCard.hide(); }, 5000);
  }
  getIngredientInfo(ingredients[j], populateMenu, handleError);
});

////////////////
  var mainMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Ingredients',
        subtitle: 'View the ingredients'
      }, {
        title: 'Recipe',
        subtitle: 'View the steps'
      }]
    }]
  });
  mainMenu.on('select', function(e) {
    if(e.itemIndex === 0){
      ingMenus.show();
    }
    else{
      insMenus.show();
    }
  });
  mainMenu.show();
//////////////////////////

//ingMenus.show();
//insMenus.show();

splashWindow.hide();




       
       


       
       
# WandelApp
This app is under construction and has not yet been deployed.
You can start it up for now by running nodemon app.js in Terminal when you are in the main folder. This will run the local server on port 8080.

In your browser type in: localhost:8080.

You should now be able to use the app. Any changes you make to the database will be locally stored.

If you have any questions or suggestions, please contact me at: 

bosma.jorrit@gmail.com

In the near future I will finish the app, deploy it and start using it with family and friends to share nice walks in the North of the Netherlands.

# Authorization
Implementing authorization for Wandelingen and Recensies following Colt Steeles Udemy YelpCamp videos. Restructuring code by moving it into middleware.js.
(I struggled too long because I made 'auteur' in my Wandeling-Model into an array with an object, just like recensies (which must be able to contain several instances, whereas auteur is unique). Finally got it to work on the show-page by referring to the index of 0 (wandeling.auteur[0].username - that is ofcourse the way to access the object inside the array 'auteur') and than a light popped in my head: it should not be an array but only an object...
Also wrestled a bit with my Terug-button, which should never be hidden, wether you are the author of a Wandeling or just browsing around. First it took up the whole space of the card. I wrote some extra ejs (if/else) and displayed my back-button in both instances so my card wouldn't break.

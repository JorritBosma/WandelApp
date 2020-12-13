# WandelApp
This app is under construction and has not yet been deployed.
You can start it up for now by running nodemon app.js in Terminal when you are in the main folder. This will run the local server on port 8080.

In your browser type in: localhost:8080.

You should now be able to use the app. Any changes you make to the database will be locally stored.

If you have any questions or suggestions, please contact me at: 

bosma.jorrit@gmail.com

In the near future I will finish the app, deploy it and start using it with family and friends to share nice walks in the North of the Netherlands.

# Extra wishes:
Limit the number and the size of uploaded images!
Cropping/resizing images in carousel.
Make map on show-page responsive instead of fixed width/height (probably in Styles Cleanup section).
Handle geodata errors (what if place doesn't exist -> flash message? or fallback to default behaviour?).
Handle geodata on edit (what if a user changes the location during edit? The app does not handle that right now)
# Maps
Implemented geocoding. Had to seed my database manually, because my index.js seeder seems to be broken. No big problem, I only have a handful of instances.

My index page was broken as well because of instances without images, because the showpage wants to render index of 0, the first image in the array, and cannot handle empty arrays. Fixed it myself with a simple if-condition- if(wandeling.plaatjes.length>0) and found out Colt handled this in a later video.

Responsiveness map and error handling need work, I will put it under Extra wishes for now.

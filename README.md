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
Handle geodata on edit (what if a user changes the location during edit? The app does not handle that right now).
Fix problem cluster map: more wandelingen on one specific location will not show up seperately. -> right if-conditional, if coordinates already exist, tweak them until they do not exist in the database and are close to the original location, but distinguishable enough from the other wandelingen which start from there. -> Other solution: make some kind of modal/popup appear so you can cycle through the wandelingen over there on the cluster map. Look on mapbox for solutions.
Style the page to make it more personal, nicer and more responsive. Had no time now to repair all changes bootstrap v4->v5 beta, which I used.

# Styles cleanup
This turned out to be quite messy, because I am using bootstrap v5 beta and Colt is using v4. I fixed some stuff which has changed, but struggled a bit and decided to leave the styles for now and customize them later.
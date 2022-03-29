# rutas-web
Angular web app for dji drone route planning 

The purpose of this app is to extend the components of a existent architecture of 3d space route planning for dji drones.the app will be used to plan routes, create camera tasks asociated to a route and see the expected the behavior of the UAV in 3d map web enviroment.

The 3d map eviroment will be supported by the Google Maps Javscript API, the use of custom map styles from Google Cloud Platform, and the use of dynamic SVG icons

All the information of the routes and tasks will be stored in a real time firebase database. The information of the database will be compatible with the android app client that conects to the drone.

The interface will use components of the Angular Material project

# How to run
clone the repo and a in a terminal navigate to the the folder "app-rutas-web", Inside that folfer execute the comand
```
npm install
```
Once all the dependencies are installed you can deploy and open the app by using the command:

```
ng serve -o
```


References:

- Oficial google maps component by the Angular contributors
https://github.com/angular/components/tree/master/src/google-maps

- Google Maps JavaScript API Guides & Reference
https://developers.google.com/maps/documentation/javascript/overview



## Frameworks and utilities vesions


In order to execute properly the app it is recomended to have at least the following framwork and libraries versions: 

node: v16.9.1

npm: v7.24.1

AngularCli Packages:					Version

@angular-devkit/architect    0.1202.6

@angular-devkit/core         12.2.6 

@angular-devkit/schematics   12.2.6 

@schematics/angular          12.2.6 

typescript                   4.4.3



# Push-able Vertex

## First of all
Go to the following website to experience it!
https://aukskit.github.io/

## Overview
This application is a GUI application implemented in JavaScript.

Common library is based on the following book.
- Title
    - Real-Time 3D Graphics with WebGL 2 - Second Edition
- Written by
    - Farhad Ghayour, Diego Cantor
- Publisher
    - Packt Publishing
- [website](https://www.packtpub.com/product/real-time-3d-graphics-with-webgl-2-second-edition/9781788629690)

## Environment
To Run this application on Electron, run the following command.
```Terminal
> cd <project_folder>
> npm install electron
```

## How to use

This application can be launched in two different ways.
- Run on Electron
- Run on Server

### Run on Electron
- Execute following command
```
> ./node_modules/electron/dist/electron.exe .
```
- Or you can run on VScode by using following launch file
    - .vscode/launch.json

### Run on Server
- Run server on root directory of this application
    - (In other way, you can run server by executing "run_server.bat")
```
cd <app>
python -m http.server
```
- Access to http://localhost:8000/

### Build
You can build this application by using Electron 
- (To be written)
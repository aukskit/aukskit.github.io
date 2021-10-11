# Push-able Vertex

## Overview
This application is a GUI application implemented in JavaScript.

Common library is based on the following book.
- Title
    - Electronではじめるデスクトップアプリケーション開発
- Publisher
    - Rutles

## Environment
- Need to install electron by using following command.
```Terminal
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

# Weather application demo using ClimaCell

## How to use

1. Run `npm i`
2. Get your ClimaCell and OpenCage keys and write them inside `index.js` file.
3. Run `node server.js`
4. Open browser on port **8080**

## The code

Inside `finished` folder is the application in its final state, and inside `unfinished` is only the UI without the JavaScript logic.

## How to change between finished and unfinished

Inside `server.js` change the value of the variable `currentApp` with the desired folder name

```js
const currentApp = "finished";
```

```js
const currentApp = "unfinished";
```

# Mon-chan
A pack with some gameDev .ts utils.

# Setup to dev
```sh
npm install
```

```sh
gulp bundle:core
```
### Atention here
I'm `not` using CommonJs but box2dweb uses, so `before` bundle the libs (below) remove the last line of box2dweb.js `"module.exports..."` inside **./node_modules/box2dweb/**
```sh
gulp bundle:libs
```

# How to use in JS proj
For a while I will not up to nmp so just get the **mon-chan.js** inside **./dist** folder

# How to use in TS proj
For a while I have no **.d.ts** so just get the **Mon-chan.ts** inside **./source** folder

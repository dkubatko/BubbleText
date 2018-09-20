# Info

## Generate file with all static images

```bash
$(npm bin)/generate-images src/images --js --prefix ../../ > src/images/index.js
```

Windows: After replace all "\" on "/"

## Run **dev rig**

```bash
EXT_CLIENT_ID=#client id
EXT_SECRET=#extension secret 
EXT_VERSION=#extension version
EXT_CHANNEL=#channel to be tested on
EXT_OWNER_NAME=channel yarn start
```

## External libs

How to use externals(1/2):
https://github.com/mchalapuk/webpack-external-react/blob/master/index.js

How to use externals(2/2):
https://github.com/webpack/webpack/issues/1275

# Libs

## Graphics

* [react-native-static-images - Util for generate all static images in project to js file](https://github.com/wcandillon/react-native-static-images)

## Data

Store: MobX

#Boilerplate info

* Twitch Extension Boilerplate

\*\* Usage

> yarn install
> cd packages/twitch-extension-ui/
> yarn install
> yarn start

\*\* Included Features

* Babel with JSX and stage 2 support
* React support
* Webpack support
* Automatically set to serve development server on 8080 and over https for extension testing

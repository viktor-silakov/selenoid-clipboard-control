## Selenoid Clipboard Control Userscript

TamperMonkey, userscript to get/set clipboard data to remote Selenoid UI containers.

### Install

- Install Tampermonkey for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)

#### Option #1
- Click to [url](https://github.com/viktor-silakov/selenoid-clipboard-control/raw/master/index.user.js)
- Click to `Install`

#### Option #2
- `Go to Tampermonkey Dashboard` -> `Utilities`
- Put `https://github.com/viktor-silakov/selenoid-clipboard-control/raw/master/index.user.js` to `Install from URL` field
- Click to `Install`

You can also set the `@match` rule in [index.user.js](index.user.js) file to narrow the script effect.
If you use specific port (not `4444`), you can also set up `SELENOID_HUB_PORT` in [index.user.js](index.user.js).

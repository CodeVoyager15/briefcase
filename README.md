####Caveat : 

When running the app in debug mode on Windows, make sure that in : `react-native-background-fetch -> package.json`

the `postlink` and `postunlink` commands under rnpm are deleted or 'commented out'

eg: 

```
  "rnpm": {
    "commands": {
      "postlinkCOMMENT": "node_modules/react-native-background-fetch/scripts/postlink.js",
      "postunlinkCOMENT": "node_modules/react-native-background-fetch/scripts/postunlink.js"
    }
  },
```

Otherwise linking the package (react-native-packground-fetch) will not work on Windows 10 and fail with `Error: spawn UNKNOWN`
something similar to https://github.com/auth0/react-native-lock/issues/86


TODO: make a fork of that repo and conditionally run those commands based on OS


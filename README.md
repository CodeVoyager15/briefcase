# Briefcase  📦
### Organize & Upload your photos & videos to AWS S3

![Alt text](screenshots/landing.png?raw=true "Landing View")

### Installation
As a react native app, it needs the react native boiler-plate: 
check this out https://facebook.github.io/react-native/docs/getting-started.html


### Debugging
If you want to run/debug using Android, I recommend setting up the 
Android Studio and spin up an emulator instance.
You will need to setup a device in AVD Manager https://youtu.be/3UNlzsfTqi4

Alternatively, you can just connect an actual device to your machine

### AWS Setup
Currently the application requires that you have already created a bucket on AWS S3 https://aws.amazon.com/s3/

Having done that, you can either edit the `secrets.js` file 
in the root directory and provide the S3 data :


```javascript 
const AwsOptions = {
  keyPrefix: 'uploads/briefcase/',
  bucket: 'your-bucket-name',
  region: 'your-region',
  accessKey: 'aws-access-key',
  secretKey: 'aws-secret-key',
  successActionStatus: 201,
};
```

or use the settings inside the application:

![Alt text](screenshots/aws-settings.png?raw=true "S3 Settings")


### Next steps
* Mark files for deletion after successful upload to cloud
* Previewing files
* Option to encrypt files before uploading to S3
* Check for Network change and if no longer in wi-fi
* User geo location tags based on the file metadata

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


# ambershellfish

## Development

### Prerequisites for development

- git
- flutter >= 2.10
- node = 16
- yarn
- curl

## Create this project

### Prerequisites

- Prerequisites for development
- firebase-tool >= 10.8

https://console.firebase.google.com/

- Add project
    - Project name: ambershellfish
        - [On] Enable Google Analytics for this project
        - Choose or create a Google Analytics account: Create new account
        - New Google Analytics account name : ambershellfish
        - Analytics location: Japan
        - [Off] Use the default settings for sharing Google Analytics data.
        - [Off] Google Products and Services
        - [Off] Benchmarking
        - [Off] Technical support
        - [Off] Account specialists
- Project settings
    - General
        - Default GCP resource location: asia-northeast1 ( Tokyo )
        - Environment Type: Production
        - Public-facing name: ambershellfish
        - Support email: my e-mail address
        - Select a platform to get started: </> ( web )
        - App nickname: Amber Shellfish
    - Usage and billing
        - Details & settings
            - Firebase billing plan: Blaze
            - Budgets
                - Scope
                    - Name: ambershellfish
                    - Time range: Monthly
                    - Projects: ambershellfish
                    - Services: All
                - Amount
                    - Budget type: Specified amount
                    - Target amount:
- Authentication
    - Email/Password: Enable
    - Email link (passwordless sign-in): Enable
- Cloud Firestore
    - Start in production mode

for test

- Add project
    - Project name: ambershellfish-test
- Project settings
    - General
        - Environment Type: Unspecified

https://github.com/MichinobuMaeda?tab=repositories

- New: ambershellfish

```
$ flutter create --platforms web ambershellfish
$ cd ambershellfish
$ git init
$ git add .
$ git commit -m "created flutter project"
$ git branch -M main
$ git remote add origin git@github.com:MichinobuMaeda/ambershellfish.git
$ git push -u origin main
```

Add `LICENSE` and `.nvmrc`, Edit some files.

```
$ npm init
$ git add .
$ git commit -m "add About this project"
$ firebase init
? Which Firebase features do you want to set up for this directory?
    Firestore,
    Functions,
    Hosting,
    Hosting: Set up GitHub Action deploys,
    Storage,
    Emulators
? Please select an option: Use an existing project
? Select a default Firebase project for this directory: ambershellfish (ambershellfish)
? What file should be used for Firestore Rules? firestore.rules
? What file should be used for Firestore indexes? firestore.indexes.json
? What language would you like to use to write Cloud Functions? TypeScript
? Do you want to use ESLint to catch probable bugs and enforce style? Yes
? Do you want to install dependencies with npm now? No
? What do you want to use as your public directory? build/web
? Configure as a single-page app (rewrite all urls to /index.html)? No
? Set up automatic builds and deploys with GitHub? Yes
? For which GitHub repository would you like to set up a GitHub workflow? MichinobuMaeda/ambershellfish
? Set up the workflow to run a build script before every deploy? No
? Set up automatic deployment to your site's live channel when a PR is merged? Yes
? What is the name of the GitHub branch associated with your site's live channel? main
i  Action required: Visit this URL to revoke authorization for the Firebase CLI GitHub OAuth App:
https://github.com/settings/connections/applications/89cf50f02ac6aaed3484
? What file should be used for Storage Rules? storage.rules
? Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm your choices.
    Authentication Emulator,
    Functions Emulator,
    Firestore Emulator,
    Storage Emulator
? Which port do you want to use for the auth emulator? 9099
? Which port do you want to use for the functions emulator? 5001
? Which port do you want to use for the firestore emulator? 8080
? Which port do you want to use for the storage emulator? 9199
? Would you like to enable the Emulator UI? Yes
? Which port do you want to use for the Emulator UI (leave empty to use any available port)? 4040
? Would you like to download the emulators now? No

$ rm build/web/404.html
$ rm build/web/index.html
$ git add .
$ git commit -m "set up firebase env."
```

VS code 'Ctrl + Shift + P' Preferences: Open Workspace Settings

- Extentions
    - ESLint > Lint Task Options: --config functions/.eslintrc.js functions/src/*.ts

`functions/package.json`

before

```
"firebase-functions-test": "^0.2.0",
```

after

```
"firebase-functions-test": "^0.3.0",
```

`.firebaserc `

before

```
    "default": "ambershellfish"
```

after

```
    "default": "ambershellfish-test"
```

Create tokens.

```
$ firebase use ambershellfish
$ firebase login:ci

1//0e...(Token #1)...

$ firebase use ambershellfish-test
$ firebase login:ci

1//0e...(Token #2)...

```
Set tokens and apiKeys to GitHub secrets

https://github.com/MichinobuMaeda/ambershellfish/settings

- Settings
    - Secrets
        - Actions
            - FIREBASE_TOKEN_AMBERSHELLFISH: 1//0e...(Token #1)...
            - FIREBASE_TOKEN_AMBERSHELLFISH_TEST: 1//0e...(Token #2)...
            - FIREBASE_API_KEY_AMBERSHELLFISH: (apiKey #1)
            - FIREBASE_API_KEY_AMBERSHELLFISH_TEST: (apiKey #2)

<https://firebase.google.com/docs/flutter/setup?platform=web>

```
$ dart pub global activate flutterfire_cli
$ firebase use ambershellfish-test
$ mv firebase_options.dart lib/config/firebase_options.dart
$ cp lib/config/firebase_options.dart lib/config/firebase_options_release.dart
```

Put config of `ambershellfish` to`firebase_options_release.dart`.

Replace `apiKey` of both files to `FIREBASE_API_KEY`.

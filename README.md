# ambershellfish

## Development

### Prerequisites for development

- git
- flutter >= 2.10
- node = 16
- yarn

## Create this project

### Prerequisites

- Prerequisites for development
- firebase-tool >= 10.8

https://console.firebase.google.com/

- Add project
    - Project name: ambershellfish
        - [v] Enable Google Analytics for this project
        - Choose or create a Google Analytics account: Create new account
        - New Google Analytics account name : ambershellfish
        - Analytics location: Japan
        - [ ] Use the default settings for sharing Google Analytics data.
        - [ ] Google Products and Services
        - [ ] Benchmarking
        - [ ] Technical support
        - [ ] Account specialists
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
- Authentifation
    - Email/Password: Enable
    - Email link (passwordless sign-in): Enable
- Cloud Firestore
    - Start in production mode

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
$ git commit -m "add About this project"
```

$ firebase init
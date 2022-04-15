# <a href="url"><img src="/assets/favicon-32x32.png" align="left" height="48" width="48" ></a> [Weatherify](https://app-weatherify.netlify.app/)

Musicify is an app that lets you upload your favorite mp3 files and makes them available to every user.

## Setup locally with your own firebase project

```git
# cloning the project
git clone https://github.com/abhinav-raman/musicify.git

# install dependencies
npm install or yarn install

# Setting up the project
1. Make a firebase account.

2. Add a project to the firebase.

3. Once the project is added to firebase, enable "Realtime Database", "Authentication" and "Storage" in your project.

4. Rename "FireBaseSampleApp.jsx" file in the project to "FirebaseApp.jsx".

5. Replace configuration with your own firebase project's configuration.


```
## Features

1. Authentication with signin/login feature.
2. Custom input components.
3. Media player  for playing files.
3. Upload *.mp3 files and their validation.
4. Music data is managed via storing metadata in firebase realtime database.


## Usage

1. Open [Musicify]() in the browser.
2. Sign up for new account.
3. Log in to exiting account.
4. Landing page contains mp3 files.
5. User can also upload their own mp3 files to the database by through upload feature after logging in.





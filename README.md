# [![Build Status](https://travis-ci.org/moodysalem/gitlock.svg?branch=master)](https://travis-ci.org/moodysalem/gitlock) pdelta

Client-side password management repository using only GitHub for a back-end built with React

## How it Works

- **Requires a GitHub subscription**
- Creates a private `gitlock-db` repository
- Stores your password in a file called data as a base64 encoded encrypted string AES-encrypted with a key derived from your password 
- Updates to your database result in commits to the data file

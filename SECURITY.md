# Security policy

## Supported versions

Only the latest release is supported. The app checks for updates itself, so users are normally on it.

## Reporting a problem

Please report security problems privately by email to techbytesdesign@gmail.com, with "Logica security" in the subject. Do not open a public issue.

Useful things to include:

- what you found and where (file, screen or release asset)
- steps to reproduce it
- what you think the impact is
- your app version and Android version

You should get a reply within a week. If a fix is needed, it will be released as a new version and credited in the changelog unless you prefer not to be named.

## What is in scope

- The update mechanism: how the app finds, downloads, verifies and installs a release. A way to make the app install something other than a genuine release would be a serious problem.
- Handling of the backup and restore text, for example input that crashes the app or corrupts stored data.
- Anything that causes data to leave the device. The app is designed not to send any.
- Problems in the release workflow, such as leaked secrets.

## What is out of scope

- Issues that need a rooted device or physical access to an unlocked phone.
- Reports from automated scanners without a demonstrated impact.
- Mistakes in lesson content. Please report those as normal issues.

## About data

Logica has no accounts, no analytics and no server. Progress is stored on the device. The only network call the app makes is to the GitHub API to read this repository's latest release, plus the download of an APK when you choose to update.

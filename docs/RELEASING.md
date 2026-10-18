# Releasing

For maintainers. A release is a git tag. Pushing the tag makes GitHub Actions build a signed APK and publish it, and installed apps then offer it to their users.

## One-time setup

### 1. Create the signing key

Android only installs an update if it is signed with the same key as the version already on the phone. Create one key and keep it for the life of the app.

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore logica-release.keystore -alias logica \
  -keyalg RSA -keysize 2048 -validity 10000
```

Back the file up somewhere safe, separate from the repository, together with its passwords. If it is lost, existing installs can never be updated in place; people would have to uninstall first and would lose their local progress.

Never commit the keystore. `.gitignore` already excludes `*.keystore`.

### 2. Add the repository secrets

In the repository, open Settings, then Secrets and variables, then Actions, and add:

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | The keystore file, base64 encoded |
| `ANDROID_KEYSTORE_PASSWORD` | The store password |
| `ANDROID_KEY_ALIAS` | `logica` (or whatever alias you used) |
| `ANDROID_KEY_PASSWORD` | The key password |

To encode the file:

```bash
base64 -w0 logica-release.keystore        # Linux, macOS (use -b 0 on older macOS)
```

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("logica-release.keystore"))   # Windows
```

The release workflow stops with a clear error if any of these are missing, rather than publishing an APK signed with the wrong key.

## Making a release

1. Pick the next version number (semantic versioning).
2. Set `version` in `package.json`. This is the only place the version is written. The Android `versionCode` is derived from it as `major * 1,000,000 + minor * 1,000 + patch`, so keep minor and patch below 1000.
3. Add a `## [x.y.z] - date` section to `CHANGELOG.md`. It becomes the GitHub release notes, so write it for users.
4. Add a matching entry at the top of `src/content/changelog.ts`. It becomes the "What's new" sheet in the app.
5. Run the checks:

   ```bash
   npm run lint && npm run typecheck && npm test && npm run validate
   npm run check-release -- vX.Y.Z     # the tag you are about to create
   ```

6. Commit, then tag and push:

   ```bash
   git commit -am "Release x.y.z"
   git tag vx.y.z
   git push origin main --tags
   ```

7. Watch the "Release" workflow. When it finishes, the release page has `logica-x.y.z.apk`, a `.md5` file and the notes.
8. Install the APK on a phone to confirm it opens, ideally over an older build to confirm the in-place update works.

The workflow refuses to run if the tag, `package.json` and the two changelogs disagree.

## How the app finds the release

- The workflow sets `LOGICA_GH_OWNER` and `LOGICA_GH_REPO` from the repository it runs in, and `app.config.js` bakes them into the build. A fork that follows these steps will check its own releases. For a local build, set those two environment variables yourself; otherwise the defaults in `app.config.js` apply.
- The app calls `GET /repos/{owner}/{repo}/releases/latest`. GitHub returns the newest published, non-draft, non-prerelease release.
- A tag with a hyphen (for example `v1.3.0-beta.1`) is published as a prerelease, so installed apps ignore it.
- The `.md5` asset, when present, lets the app verify the download before installing.

### Forcing an update

Add the text `[force-update]` anywhere in the release notes of a release that fixes something serious. The update sheet then cannot be dismissed. Use this rarely.

## If a release is bad

- Android will not install an APK with a lower `versionCode`, so you cannot roll back by publishing an older build.
- Delete or unpublish the bad release on GitHub. The app will stop offering it, because "latest" moves to the previous release.
- Publish a fixed version with a higher number.

People who already installed the bad version keep it until the fixed one arrives. Their progress is not affected; it lives in the app's data and survives updates.

## Common problems

- **"App not installed" on the phone.** The signature differs from the installed version, or the new `versionCode` is not higher. Check that the secrets hold the original key.
- **The workflow fails at "Check version, changelog and tag agree".** One of `package.json`, the tag, `CHANGELOG.md` or `src/content/changelog.ts` was missed. The error names which.
- **The app never shows the update.** Check that the release is not a draft or prerelease, that its tag is `vX.Y.Z` and higher than the installed version, and that automatic checking is on (Settings). A manual check from Settings ignores the six-hour wait and "Later" snoozes.
- **GitHub says the API rate limit was reached.** Unauthenticated calls are limited per IP address. The app waits and tries later; users can retry from Settings.

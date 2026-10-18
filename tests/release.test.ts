import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { toReleaseInfo, type GhRelease } from '../src/utils/release';

const base: GhRelease = {
  tag_name: 'v1.2.0',
  name: 'Logica 1.2.0',
  body: '- new lessons\n- bug fixes',
  html_url: 'https://github.com/example/logica/releases/tag/v1.2.0',
  published_at: '2026-11-01T10:00:00Z',
  assets: [
    { name: 'logica-1.2.0.apk', size: 52428800, browser_download_url: 'https://example.com/logica-1.2.0.apk', state: 'uploaded' },
    { name: 'logica-1.2.0.apk.md5', size: 60, browser_download_url: 'https://example.com/logica-1.2.0.apk.md5', state: 'uploaded' },
  ],
};

describe('release parsing', () => {
  it('reads version, notes and the apk asset', () => {
    const r = toReleaseInfo(base)!;
    assert.equal(r.version, '1.2.0');
    assert.equal(r.apkUrl, 'https://example.com/logica-1.2.0.apk');
    assert.equal(r.apkSize, 52428800);
    assert.equal(r.md5Url, 'https://example.com/logica-1.2.0.apk.md5');
    assert.equal(r.force, false);
  });

  it('ignores drafts, prereleases and odd tags', () => {
    assert.equal(toReleaseInfo({ ...base, draft: true }), null);
    assert.equal(toReleaseInfo({ ...base, prerelease: true }), null);
    assert.equal(toReleaseInfo({ ...base, tag_name: 'nightly' }), null);
  });

  it('copes with a release that has no apk', () => {
    const r = toReleaseInfo({ ...base, assets: [] })!;
    assert.equal(r.apkUrl, null);
    assert.equal(r.md5Url, null);
  });

  it('skips assets that are still uploading', () => {
    const r = toReleaseInfo({ ...base, assets: [{ ...base.assets![0], state: 'starter' }] })!;
    assert.equal(r.apkUrl, null);
  });

  it('detects the force-update marker and strips it from the notes', () => {
    const r = toReleaseInfo({ ...base, body: 'Security fix [force-update]' })!;
    assert.equal(r.force, true);
    assert.equal(r.notes, 'Security fix');
  });
});

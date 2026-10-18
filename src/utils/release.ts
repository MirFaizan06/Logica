import { parseVersion } from './version';

export interface ReleaseInfo {
  version: string;
  name: string;
  notes: string;
  htmlUrl: string;
  publishedAt: string;
  apkUrl: string | null;
  apkName: string | null;
  apkSize: number | null;
  md5Url: string | null;
  /** release notes contain the marker [force-update] */
  force: boolean;
}

export interface GhAsset {
  name: string;
  size: number;
  browser_download_url: string;
  state?: string;
}
export interface GhRelease {
  tag_name: string;
  name?: string;
  body?: string;
  html_url: string;
  published_at?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: GhAsset[];
}

export function toReleaseInfo(r: GhRelease): ReleaseInfo | null {
  const parsed = parseVersion(r.tag_name || '');
  if (!parsed || r.draft || r.prerelease) return null;
  const assets = (r.assets ?? []).filter((a) => a.state === undefined || a.state === 'uploaded');
  const apks = assets.filter((a) => /\.apk$/i.test(a.name));
  const apk = apks.find((a) => /release|logica/i.test(a.name)) ?? apks[0] ?? null;
  const md5 = apk ? assets.find((a) => a.name.toLowerCase() === `${apk.name.toLowerCase()}.md5`) ?? null : null;
  const notes = (r.body ?? '').trim();
  return {
    version: parsed.join('.'),
    name: r.name || `Version ${parsed.join('.')}`,
    notes: notes.replace(/\[force-update\]/gi, '').trim(),
    htmlUrl: r.html_url,
    publishedAt: r.published_at ?? '',
    apkUrl: apk?.browser_download_url ?? null,
    apkName: apk?.name ?? null,
    apkSize: apk?.size ?? null,
    md5Url: md5?.browser_download_url ?? null,
    force: /\[force-update\]/i.test(notes),
  };
}

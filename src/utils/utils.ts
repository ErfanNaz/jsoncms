import { sha256 } from 'js-sha256';

const cmsJsonPath = 'cms.json';
const contentJsonPath = 'data.json';
const salt = 'json-cms';

export async function getCmsData() {
  const response = await fetch(cmsJsonPath);
  return response.json();
}

export async function getContentData() {
  const response = await fetch(contentJsonPath);
  return response.json();
}

export function generateHash(message: string) {
  return sha256(salt + message);
}

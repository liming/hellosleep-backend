import fs from 'fs';
import path from 'path';

function safeMkdirp(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (_e) {
    // ignore
  }
}

function jsonlAppend(filePath, obj) {
  const dir = path.dirname(filePath);
  safeMkdirp(dir);
  fs.appendFileSync(filePath, `${JSON.stringify(obj)}\n`, 'utf-8');
}

function nowIso() {
  return new Date().toISOString();
}

export function getAskLogPath() {
  return process.env.ASK_LOG_PATH || './logs/ask.jsonl';
}

export function logAskEvent(event) {
  const payload = { ts: nowIso(), ...event };
  jsonlAppend(getAskLogPath(), payload);
}


export const APP_VERSION = "0.1.2";
export const LAST_UPDATED = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export function getAppVersion() {
    return `v${APP_VERSION}`;
}

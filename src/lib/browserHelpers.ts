const isMozillaBrowser = /mozilla/i.test(navigator.userAgent);
const isSafariBrowser = checkIfSafari();

function checkIfSafari() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("safari") && !ua.includes("chrome");
}

export const isIncompatibleBrowser = isMozillaBrowser || isSafariBrowser;
export const isAppBroken =
  isIncompatibleBrowser && window.showDirectoryPicker === undefined;

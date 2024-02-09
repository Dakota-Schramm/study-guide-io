"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (error.message === "RestrictedAccessUserConfig::NotSupported") {
    return <UnsupportedBrowserView />;
  }
  if (error.message === "RestrictedAccessUserConfig::PermissionRejected") {
    return <UserRefusedView />;
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

function UnsupportedBrowserView() {
  return (
    <>
      <h2>
        Sorry, but all of this app's features don't currently work on this
        browser.
      </h2>
      <p>Consider switching to one of the following browsers instead:</p>
      <ul>
        <li>Google Chrome</li>
        <li>Microsoft Edge</li>
        <li>Opera</li>
      </ul>
    </>
  );
}

function UserRefusedView() {
  return (
    <>
      <h2>File System Permission has been Rejected:</h2>
      <ul>
        <li>App has limited features while in this mode</li>
        <li>
          This setting can be re-enabled at
          <Link href="/settings">
            <span>settings</span>
          </Link>
          .
        </li>
      </ul>
    </>
  );
}

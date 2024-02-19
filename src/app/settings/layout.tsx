export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col space-y-16 container">{children}</main>;
}

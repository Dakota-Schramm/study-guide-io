export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col space-y-16 mx-20">{children}</main>;
}

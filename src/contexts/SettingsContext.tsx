import { ReactNode, createContext, useState } from "react";

type ISettings = {
  guideHandles: unknown[] | undefined;
};

// Create a simple React Context
export const SettingsContext = createContext({
  settings: {
    guideHandles: undefined,
  },
  setSettings: (settings: ISettings) => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ISettings>({
    guideHandles: undefined,
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

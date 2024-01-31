import { ReactNode, createContext, useState } from "react";

type ISettings = {
  guideHandles: unknown[];
};

// Create a simple React Context
export const SettingsContext = createContext({
  settings: {
    guideHandles: [],
  },
  setSettings: (settings: ISettings) => {},
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ISettings>({
    guideHandles: [],
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

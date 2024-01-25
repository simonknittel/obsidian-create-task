import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import CreateTask from "src/main";
import { CreateTaskOnboardingModal } from ".";

type ObsidianContextInterface = {
  plugin: CreateTask;
  onboardingModal: CreateTaskOnboardingModal;
};

const ObsidianContext = createContext<ObsidianContextInterface | undefined>(
  undefined,
);

type ProviderProps = Readonly<{
  children: ReactNode;
  plugin: CreateTask;
  onboardingModal: CreateTaskOnboardingModal;
}>;

export const ObsidianProvider = ({
  children,
  plugin,
  onboardingModal,
}: ProviderProps) => {
  const value = useMemo(
    () => ({
      plugin,
      onboardingModal,
    }),
    [plugin, onboardingModal],
  );

  return (
    <ObsidianContext.Provider value={value}>
      {children}
    </ObsidianContext.Provider>
  );
};

/**
 * Check for undefined since the defaultValue of the context is undefined. If
 * it's still undefined, the provider component is missing.
 */
export function useObsidianContext() {
  const context = useContext(ObsidianContext);
  if (!context)
    throw new Error(
      "Provider for useObsidianContext() is missing! Make sure to use useObsidianContext() as child of <ObsidianProvider>...</ObsidianProvider>",
    );
  return context;
}

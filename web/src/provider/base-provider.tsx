import { createContext, useContext } from "react";
import { AppProvider } from "./app-provider";
import { ThemeProvider } from "./theme-provider";

type BaseProviderProps = {
  children: React.ReactNode;
};

type BaseProviderState = {
  // Add your state here
};

const initialState: BaseProviderState = {
  // Initialize your state here
};

const BaseProviderContext = createContext<BaseProviderState>(initialState);

export function BaseProvider({ children, ...props }: BaseProviderProps) {
  // Add your state hooks here

  const value = {
    // Add your state values here
  };

  return (
    <BaseProviderContext.Provider {...props} value={value}>
      <AppProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AppProvider>
    </BaseProviderContext.Provider>
  );
}

export const useBase = () => {
  const context = useContext(BaseProviderContext);

  if (context === undefined)
    throw new Error("useBase must be used within a BaseProvider");

  return context;
};

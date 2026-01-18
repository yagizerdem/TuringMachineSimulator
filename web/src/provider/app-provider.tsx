import { createContext, useContext, useState } from "react";
import { TapeSize } from "../../../core/src/enum/tapeSize";
import { Graph } from "../../../core/src/parser/graph";

type AppProviderProps = {
  children: React.ReactNode;
};

type AppProviderState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  tapeSize: TapeSize;
  setTapeSize: (tapeSize: TapeSize) => void;
  graph: Graph | null;
  setGraph: (graph: Graph | null) => void;
};

const initialState: AppProviderState = {
  isLoading: false,
  setIsLoading: () => null,
  tapeSize: TapeSize.SINGLE,
  setTapeSize: () => null,
  graph: null,
  setGraph: () => null,
};

const AppProviderContext = createContext<AppProviderState>(initialState);

export function AppProvider({ children, ...props }: AppProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tapeSize, setTapeSize] = useState<TapeSize>(TapeSize.SINGLE);
  const [graph, setGraph] = useState<Graph | null>(null);

  const value = {
    isLoading,
    setIsLoading,
    tapeSize,
    setTapeSize,
    graph,
    setGraph,
  };

  return (
    <AppProviderContext.Provider {...props} value={value}>
      {children}
    </AppProviderContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppProviderContext);

  if (context === undefined)
    throw new Error("useApp must be used within an AppProvider");

  return context;
};

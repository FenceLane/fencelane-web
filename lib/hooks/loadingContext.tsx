import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { LoadingView } from "../../components/LoadingView/LoadingView";

interface ContextValue {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const LoadingContext = createContext<ContextValue | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = () => setIsLoading(true);
    const end = () => setIsLoading(false);

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router]);

  const value = { isLoading, setIsLoading };

  return (
    <LoadingContext.Provider value={value}>
      <LoadingView isLoading={isLoading}>{children}</LoadingView>
    </LoadingContext.Provider>
  );
}

export function useIsLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useIsLoading must be used within a LoadingProvider");
  }
  return context;
}

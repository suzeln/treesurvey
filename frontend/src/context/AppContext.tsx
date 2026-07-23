import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { staticDataProvider } from "../data/StaticDataProvider";
import type { SurveySession, TreeRecord, ViewerKind } from "../types";

interface AppContextValue {
  sessions: SurveySession[];
  trees: TreeRecord[];
  selectedSessionId: string;
  selectedTree?: TreeRecord;
  activeViewer: ViewerKind;
  search: string;
  setSelectedSessionId: (value: string) => void;
  setSelectedTreeId: (value?: string) => void;
  setActiveViewer: (value: ViewerKind) => void;
  setSearch: (value: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SurveySession[]>([]);
  const [trees, setTrees] = useState<TreeRecord[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedTreeId, setSelectedTreeId] = useState<string>();
  const [activeViewer, setActiveViewer] =
    useState<ViewerKind>("point-cloud");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void staticDataProvider.listSessions().then((items) => {
      setSessions(items);
      setSelectedSessionId((current) => current || items[0]?.id || "");
    });
    void staticDataProvider.listTrees().then(setTrees);
  }, []);

  useEffect(() => {
    const firstTree = trees.find(
      (tree) => tree.sessionId === selectedSessionId,
    );
    setSelectedTreeId((current) => {
      const isCurrentVisible = trees.some(
        (tree) =>
          tree.id === current && tree.sessionId === selectedSessionId,
      );
      return isCurrentVisible ? current : firstTree?.id;
    });
  }, [selectedSessionId, trees]);

  const selectedTree = trees.find((tree) => tree.id === selectedTreeId);

  const value = useMemo<AppContextValue>(
    () => ({
      sessions,
      trees,
      selectedSessionId,
      selectedTree,
      activeViewer,
      search,
      setSelectedSessionId,
      setSelectedTreeId,
      setActiveViewer,
      setSearch,
    }),
    [
      sessions,
      trees,
      selectedSessionId,
      selectedTree,
      activeViewer,
      search,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}

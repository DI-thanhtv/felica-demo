import { useRef, useState } from "react";
import Papa from "papaparse";
import alasql from "alasql";

import { Ribbon } from "./components/ribbon";
import { LeftNav } from "./components/left-nav";
import { ReportEmptyCanvas } from "./components/report-empty-canvas";
import { ReportBuildVisualsCanvas } from "./components/report-build-visuals-canvas";
import { TableViewLayout } from "./components/table-view-layout";
import { BottomBar } from "./components/bottom-bar";
import { GetDataModal } from "./components/get-data-modal";
import { CsvPreviewModal } from "./components/csv-preview-modal";
import { LoadStatusModal } from "./components/load-status-modal";
import { QueryEditorModal } from "./components/query-editor-modal";
import { SqlQueryModal } from "./components/sql-query-modal";

import { useAppStore } from "./store/app-store";

function App() {
  const [isGetDataOpen, setIsGetDataOpen] = useState(false);
  const parserRef = useRef<any>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const [csvPreview, setCsvPreview] = useState<{
    fileName: string;
    headers: string[];
    rows: string[][];
  } | null>(null);

  // Keep a reference to the file for full-load processing
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [currentTableName, setCurrentTableName] = useState<string | null>(null);
  const [isSqlOpen, setIsSqlOpen] = useState(false);

  const activeView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const setLoadedTable = useAppStore((state) => state.setLoadedTable);
  const loadedTable = useAppStore((state) => state.loadedTable);
  const setQueryResult = useAppStore((state) => state.setQueryResult);

  const [sqlError, setSqlError] = useState<string | null>(null);

  const isQueryEditorOpen = useAppStore((state) => state.isQueryEditorOpen);
  const closeQueryEditor = useAppStore((state) => state.closeQueryEditor);

  const handleImportCsv = (file: File) => {
    const previewRows: string[][] = [];
    let headers: string[] = [];

    setPendingFile(file);

    Papa.parse(file, {
      worker: true,
      skipEmptyLines: true,

      step: (result: any) => {
        const row = result.data;

        if (!headers.length) {
          headers = row;
          return;
        }

        if (previewRows.length < 200) {
          previewRows.push(row);
        }
      },

      complete: () => {
        setCsvPreview({
          fileName: file.name,
          headers,
          rows: previewRows,
        });

        setIsGetDataOpen(false);
      },
    });
  };

  const handleLoadCsv = () => {
    if (!pendingFile || !csvPreview) return;

    const baseName = csvPreview.fileName.replace(/\.[^.]+$/, "");
    setCurrentTableName(baseName);
    setIsLoadingData(true);
    setHasLoadedData(false);
    setLoadProgress(0);

    const allRows: string[][] = [];
    let headers: string[] = [];

    parserRef.current = Papa.parse(pendingFile, {
      worker: true,
      skipEmptyLines: true,
      step: (result: any) => {
        const row = result.data;

        if (!headers.length) {
          headers = row;
          return;
        }

        allRows.push(row);
        if (allRows.length % 5000 === 0) {
          setLoadProgress(allRows.length);
        }
      },
      complete: () => {
        setLoadedTable({
          name: baseName,
          headers,
          rows: allRows,
        });
        setLoadProgress(allRows.length);
        setCsvPreview(null);
        setPendingFile(null);
        setIsLoadingData(false);
        setHasLoadedData(true);
      },
    });
  };

  const handleRunSql = (query: string) => {
    if (!loadedTable) {
      setSqlError("No table loaded. Import CSV first.");
      return;
    }

    const sourceRows = loadedTable.originalRows ?? loadedTable.rows;
    const rowsAsObjects = sourceRows.map((row) =>
      Object.fromEntries(
        loadedTable.headers.map((header, idx) => [header, row[idx]]),
      ),
    );

    try {
      const results = alasql(query, [rowsAsObjects]);

      let headers: string[] = [];
      let rows: string[][] = [];

      if (Array.isArray(results)) {
        if (results.length === 0) {
          headers = loadedTable.headers;
          rows = [];
        } else if (typeof results[0] === "object" && results[0] !== null) {
          headers = Array.from(
            results.reduce((acc, row) => {
              Object.keys(row).forEach((key) => acc.add(key));
              return acc;
            }, new Set<string>()),
          );
          rows = results.map((row) =>
            headers.map((h) => String((row as any)[h] ?? "")),
          );
        } else {
          headers = ["value"];
          rows = results.map((value) => [String(value)]);
        }
      } else if (typeof results === "object" && results !== null) {
        headers = Object.keys(results as Record<string, unknown>);
        rows = [headers.map((h) => String((results as any)[h] ?? ""))];
      } else {
        headers = ["Result"];
        rows = [[String(results)]];
      }

      setQueryResult({
        name: `${loadedTable.name} (query)`,
        headers,
        rows,
      });
      setSqlError(null);
      setIsSqlOpen(false);
    } catch (err) {
      console.error("SQL error", err);
      setSqlError(
        err instanceof Error ? err.message : "Failed to run SQL query",
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f3f2f1]">
      <Ribbon />

      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeView={activeView} onChangeView={setActiveView} />

        {activeView === "report" ? (
          hasLoadedData ? (
            <ReportBuildVisualsCanvas />
          ) : (
            <ReportEmptyCanvas
              onRequestGetData={() => setIsGetDataOpen(true)}
            />
          )
        ) : (
          <TableViewLayout onOpenSql={() => setIsSqlOpen(true)} />
        )}
      </div>

      <BottomBar />

      <GetDataModal
        isOpen={isGetDataOpen}
        onClose={() => setIsGetDataOpen(false)}
        onImportCsv={handleImportCsv}
      />

      <CsvPreviewModal
        isOpen={!!csvPreview}
        onClose={() => setCsvPreview(null)}
        fileName={csvPreview?.fileName ?? ""}
        headers={csvPreview?.headers ?? []}
        rows={csvPreview?.rows ?? []}
        onLoad={handleLoadCsv}
      />

      <LoadStatusModal
        isOpen={isLoadingData}
        tableName={currentTableName ?? undefined}
        progress={loadProgress}
        onCancel={() => {
          parserRef.current?.abort?.();
          setIsLoadingData(false);
          setHasLoadedData(false);
        }}
      />

      <QueryEditorModal
        isOpen={isQueryEditorOpen}
        onClose={closeQueryEditor}
        tableName={loadedTable?.name ?? ""}
        headers={loadedTable?.headers ?? []}
        rows={loadedTable?.rows ?? []}
      />

      <SqlQueryModal
        isOpen={isSqlOpen}
        onClose={() => {
          setIsSqlOpen(false);
          setSqlError(null);
        }}
        onRun={handleRunSql}
        error={sqlError ?? undefined}
      />
    </div>
  );
}

export default App;

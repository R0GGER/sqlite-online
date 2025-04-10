import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelStore } from "@/store/usePanelStore";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { usePanelManager } from "@/providers/PanelProvider";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import TableSelector from "./TableSelector";
import ActionsDropdown from "./ActionsDropdown";
import EditSection from "./EditSection";
import DataTable from "./DataTable";
import SchemaTree from "@/components/structureTab/SchemaTree";
import PaginationControls from "./PaginationControls";

import {
  LoaderCircleIcon,
  FilterXIcon,
  ListRestartIcon,
  FolderOutputIcon
} from "lucide-react";

const BrowseDataTab = () => {
  const filters = useDatabaseStore((state) => state.filters);
  const sorters = useDatabaseStore((state) => state.sorters);
  const setFilters = useDatabaseStore((state) => state.setFilters);
  const setSorters = useDatabaseStore((state) => state.setSorters);
  const isDataLoading = useDatabaseStore((state) => state.isDataLoading);
  const isDatabaseLoading = useDatabaseStore(
    (state) => state.isDatabaseLoading
  );

  const dataPanelSize = usePanelStore((state) => state.dataPanelSize);
  const schemaPanelSize = usePanelStore((state) => state.schemaPanelSize);
  const setDataPanelSize = usePanelStore((state) => state.setDataPanelSize);
  const setSchemaPanelSize = usePanelStore((state) => state.setSchemaPanelSize);

  const { handleExport } = useDatabaseWorker();
  const { isEditing } = usePanelManager();

  const ActionButtons = () => {
    return (
      <>
        <div className="hidden items-center gap-1 md:flex">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => setFilters(null)}
            disabled={filters == null}
            title="Clear applied filters"
          >
            <FilterXIcon className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => setSorters(null)}
            disabled={sorters == null}
            title="Reset sorting"
          >
            <ListRestartIcon className="mr-1 h-3 w-3" />
            Reset sorting
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => handleExport("table")}
            title="Export the current table as CSV"
          >
            <FolderOutputIcon className="mr-1 h-3 w-3" />
            Export table
          </Button>
        </div>
        <div className="md:hidden">
          <ActionsDropdown />
        </div>
      </>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b px-1 py-2">
        <TableSelector />
        <ActionButtons />
        {(isDataLoading || isDatabaseLoading) && (
          <span className="ml-2 flex items-center text-xs text-gray-500">
            <LoaderCircleIcon className="mr-1 h-3 w-3 animate-spin" />
            Loading data
          </span>
        )}
      </div>

      <div className="relative h-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Data Table */}
          <ResizablePanel
            id="dataPanel"
            defaultSize={dataPanelSize}
            onResize={setDataPanelSize}
          >
            <div
              className="flex h-full flex-col justify-between border-l"
              id="dataSection"
            >
              <DataTable />
              <PaginationControls />
            </div>
          </ResizablePanel>

          <ResizableHandle className="hidden md:flex" withHandle />

          <ResizablePanel
            id="schemaPanel"
            defaultSize={schemaPanelSize}
            onResize={setSchemaPanelSize}
            className={`static md:relative md:block ${isEditing ? "block" : "hidden"}`}
          >
            <div className="h-full overflow-hidden">
              <div className="h-full overflow-y-auto">
                <SchemaTree />
              </div>
            </div>
            {/* TODO: Move this to a separate component as an edit section */}
            <div
              className={`bg-background absolute top-0 right-0 z-40 h-full w-full ${isEditing ? "block" : "hidden"}`}
            >
              <section className="bg-primary/5 h-full">
                <EditSection />
              </section>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default BrowseDataTab;

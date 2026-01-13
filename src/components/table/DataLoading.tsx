import { TableCell, TableRow, CircularProgress } from "@mui/material";
import { DataLoadingProps } from "./types";

export function DataLoading<T>({ columns }: Readonly<DataLoadingProps<T>>) {
  return (
    <TableRow data-testid="data-table-loading">
      <TableCell
        colSpan={columns?.length ? columns.length + 1 : 1}
        align="center"
        data-testid="data-table-loading-cell"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <CircularProgress
          size={24}
          data-testid="data-table-loading-spinner"
          aria-label="Loading data"
        />
      </TableCell>
    </TableRow>
  );
}

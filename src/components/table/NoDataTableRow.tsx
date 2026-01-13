import { TableCell, TableRow } from "@mui/material";
import { NoDataTableRowProps } from "./types";

export function NoDataTableRow<T>({ columns, message = "No records found." }: Readonly<NoDataTableRowProps<T>>) {

  return (
    <TableRow data-testid="data-table-no-data">
      <TableCell
        colSpan={columns.length + 1}
        align="center"
        data-testid="data-table-no-data-cell"
        role="status"
        aria-live="polite"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}

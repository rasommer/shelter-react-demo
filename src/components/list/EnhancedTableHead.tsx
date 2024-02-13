import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Donation from "../../@types/donation";

type Order = "asc" | "desc";
/**
 * Enhanced table props
 */
interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Donation
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

/**
 * Head cell interface
 */
interface HeadCell {
  id: keyof Donation;
  label: string;
}

/**
 * Head cells array
 */
const headCells: readonly HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "type",
    label: "Type",
  },
  {
    id: "quantity",
    label: "Quantity",
  },
  {
    id: "date",
    label: "Date",
  },
];

/**
 * Enhanced table head component
 * @param props enhanced table props
 * @returns enhanced table head component
 */
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Donation) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "#a6c1ed" }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="right"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{ fontWeight: "bold" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
          Options
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;

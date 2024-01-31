import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React from "react";
import { visuallyHidden } from "@mui/utils";
import Donation, { DonationContextType } from "../../@types/donation";
import { DonationContext } from "../../context/DonationContext";
import DonationTypeFilter from "./DonationTypeFilter";

type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Donation;
  label: string;
}

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

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Donation
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Donation) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
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
        <TableCell align="center">Options</TableCell>
      </TableRow>
    </TableHead>
  );
}

function DonationTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Donation>("id");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const {
    donations,
    donationTypeFilter,
    removeDonation,
    editDonation,
    donationEdition,
  } = React.useContext(DonationContext) as DonationContextType;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Donation
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = donations.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - donations.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort<Donation>(donations, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, donations]
  );

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const attributes = event.currentTarget.attributes;
    const idAttribute = attributes.getNamedItem("data-donation-id");

    if (idAttribute && idAttribute.value) {
      const id = Number(idAttribute.value);
      if (!Number.isNaN(id) && donations.findIndex((d) => d.id === id) !== -1) {
        removeDonation(id);
        if (donationEdition?.id === id) {
          editDonation(undefined);
        }
      } else if (donations.findIndex((d) => d.id === id) !== -1) {
        console.error(`Donation didn't found: ${id}`);
      }
    }
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const attributes = event.currentTarget.attributes;
    const idAttribute = attributes.getNamedItem("data-donation-id");

    if (idAttribute && idAttribute.value) {
      const id = Number(idAttribute.value);
      if (!Number.isNaN(id) && donations.findIndex((d) => d.id === id) !== -1) {
        editDonation(donations.find((d) => d.id === id));
      } else if (donations.findIndex((d) => d.id === id) !== -1) {
        console.error(`Donation didn't found: ${id}`);
      }
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "auto" }}>
      <DonationTypeFilter />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={donations.length}
            />
            <TableBody>
              {visibleRows.map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">
                      {row.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: 2 }}
                        data-donation-id={row.id}
                        onClick={handleEdit}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        data-donation-id={row.id}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell style={{ margin: "0 0 0 10px" }} align="right">
                  Summary
                </TableCell>
                <TableCell
                  style={{ margin: "0 0 0 10px" }}
                  align="right"
                  colSpan={2}
                >
                  {donationTypeFilter && donations?.length > 0
                    ? donations
                        .map((d) => d.quantity)
                        .reduce((total, quantity) => total + quantity)
                    : "-"}
                </TableCell>
                <TableCell colSpan={3}> </TableCell>
              </TableRow>
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={donations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default DonationTable;

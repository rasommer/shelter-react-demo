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
import { DonationType } from "../../@types/donationType";

interface DonationTableProps {
  onEdition: () => void;
}

type Order = "asc" | "desc";

/**
 *
 * @param a first element to compare
 * @param b second element to compare
 * @param orderBy order by
 * @returns value to sort the elements
 */
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 *
 * @param order order
 * @param orderBy order by
 * @returns a comparator function
 */
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

/**
 *
 * @param array array to sort
 * @param comparator comparator function
 * @returns a stable sorted array
 */
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

/**
 * Donation table component
 * @returns donation table component
 */
const DonationTable = (props: DonationTableProps) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Donation>("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const {
    donations,
    donationTypeFilter,
    removeDonation,
    editDonation,
    donationEdition,
  } = React.useContext(DonationContext) as DonationContextType;
  const { onEdition } = props;

  /**
   * Handle request sort
   * @param event event
   * @param property property
   * @returns void
   */
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Donation
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /**
   * Handle change page
   * @param event event
   * @param newPage new page
   * @returns void
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handle change rows per page
   * @param event event
   * @returns void
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - donations.length) : 0;

  /**
   * Visible rows from the donations
   * @returns visible rows
   */
  const visibleRows = React.useMemo(() => {
    const filteredDonations: Donation[] = donations.filter((d) => {
      if (donationTypeFilter === undefined) {
        return true;
      }
      return (
        donationTypeFilter ===
        Object.entries(DonationType).find((dt) => dt[1] === d.type)?.[0]
      );
    });
    return stableSort<Donation>(
      filteredDonations,
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, donations, donationTypeFilter]);

  /**
   * Handle donation delete
   * @param event event
   * @returns void
   */
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

  /**
   * Handle edit
   * @param event event
   * @returns void
   */
  const handleEdit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const attributes = event.currentTarget.attributes;
    const idAttribute = attributes.getNamedItem("data-donation-id");

    if (idAttribute && idAttribute.value) {
      const id = Number(idAttribute.value);
      if (!Number.isNaN(id) && donations.findIndex((d) => d.id === id) !== -1) {
        onEdition();
        editDonation(donations.find((d) => d.id === id));
      } else if (donations.findIndex((d) => d.id === id) !== -1) {
        console.error(`Donation didn't found: ${id}`);
      }
    }
  };

  /**
   * Filtered summary
   * @returns filtered summary
   */
  const filteredSummary = (): number | "-" => {
    if (donationTypeFilter && visibleRows.length) {
      return visibleRows
        .map((d) => d.quantity)
        .reduce((total, quantity) => total + quantity);
    }
    return "-";
  };

  return (
    <Box>
      <DonationTypeFilter />
      <Paper sx={{ width: "98%", overflow: "hidden", margin: "auto" }}>
        <TableContainer sx={{ maxHeight: 550 }}>
          <Table aria-labelledby="Donations">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={donations.length}
            />
            <TableBody>
              {visibleRows.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
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
                  {filteredSummary()}
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
          rowsPerPageOptions={[10, 25, 50]}
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
};

export default DonationTable;

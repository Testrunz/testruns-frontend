/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import TableFilters from '../../components/table/TableFilters';
import TablePagination from '../../components/table/TablePagination';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  MenuItem,
  Select,
  Typography,
  Badge,
  TextField,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddIcon from '@mui/icons-material/Add';
import search from '../../../assets/images/search.svg';
import {
  DepartmentList,
  LaboratoryList,
  RunsHeaders,
  RunsRows,
  RunsStatusList,
} from '../../utils/data';
import TableHeader from '../../components/table/TableHeader';
import { RunsRowData } from '../../modals/runs.modal';
import {
  handleCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
} from '../../utils/common-services';
import DeletePopup from '../../components/DeletePopup';
import { navigate } from 'gatsby';
import Confirmationpopup from '../../components/ConfirmationPopup';
import SuccessPopup from '../../components/SuccessPopup';
import RunsForm from './RunsForm';
import runCreated from '../../assets/images/run-created.svg';
import runStarted from '../../assets/images/run-started.svg';
import runStopped from '../../assets/images/run-stopped.svg';
import runCompleted from '../../assets/images/run-completed.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRunsData,
  fetchUpdateRunsData,
  deleteRunsData,
} from '../../api/RunsAPI';
import moment from 'moment';
import DeleteSuccessPopup from '../../components/DeleteSuccessPopup';
import TablePopup from '../../components/table/TablePopup';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import filterIcon from '../../assets/images/filter-icon1.svg';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Popover from '@mui/material/Popover';
import TableSkeleton from '../../components/table/TableSkeleton';

// table start

const rows: RunsRowData[] = RunsRows;
const runsStatus: any = RunsStatusList;

export default function Runs() {
  const [runsOpen, setRunsOpen] = React.useState(false);
  const [headers, setHeaders] = React.useState<any>(RunsHeaders);
  const [Rows, setSelectedRows] = React.useState(rows);
  const [isDeselectAllChecked, setIsDeselectAllChecked] = React.useState(false);
  const [isselectAllChecked, setIsselectAllChecked] = React.useState(false);
  const [isTableHeaderVisible, setTableHeaderVisible] = React.useState(false);
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  // const [deletePopup, setDeletePopup] = React.useState(false);
  const deletePopupRef: any = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const tablePopupRef: any = React.useRef(null);
  const deleteSuccessPopupRef: any = React.useRef(null);
  const [filterKey, setFilterKey] = React.useState<any>(null);
  const [columnAnchorEl, setColumnAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [filterPopoverEl, setFilterPopoverEl] =
    React.useState<null | HTMLElement>(null);
  const columnAnchorOpen = Boolean(columnAnchorEl);
  const filterAnchorOpen = Boolean(filterPopoverEl);
  const [dense, setDense] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState(null);
  const [filterSearchBy, setFilterSearchBy] = React.useState(null);
  const [filterSearchValue, setFilterSearchValue] = React.useState(null);
  const [filterFieldName, setFilterFieldName] = React.useState('');
  const [filterType, setFilterType] = React.useState(null);
  const [filterAvailability, setFilterAvailability] = React.useState(null);
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(Rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [runsData, setRunsData] = React.useState<any>([]);
  const [rowId, setRowId] = React.useState<any>([]);
  const[runsRow, setRunsRow]=React.useState<any>([])
  const dispatch: any = useDispatch();
  const [filter, setFilter] = React.useState<any>(false);

  const [pageInfo, setPageInfo] = React.useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [queryStrings, setQueryString] = React.useState({
    page: 1,
    perPage: 10,
    searchBy: null,
    search: null,
    sortBy: null,
    sortOrder: 'desc',
  });

  const runsSliceData = useSelector(
    (state: any) => state.runs.data?.get_all_runs,
  );

  const departmentSliceData = useSelector(
    (state: any) => state.department.data?.get_all_departments,
  );
  const labSliceData = useSelector(
    (state: any) => state.lab.data?.get_all_labs,
  );

  const runsIdSliceData = useSelector(
    (state: any) => state.runs.data?.get_all_runs_name,
  );

  const Data = Rows.slice(startIndex, endIndex);

  const handleFilterPopoverClose = () => {
    setFilterPopoverEl(null);
  };
  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };
  const handleFilterPopoverClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFilterPopoverEl(event.currentTarget);
  };

  const handleClearFilter = () => {
    setFilterStatus(null);
    setFilterAvailability(null);
    setFilterSearchBy(null);
    setFilterSearchValue(null);
    setFilterOptions([]);
    setFilterType(null);
    applyFilters('search', null);
    handleFilterPopoverClose();
    setFilterKey(null);
    setFilter(false)
  };
  React.useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
    setRunsData(runsData);
  }, [runsData]);

  React.useEffect(() => {
    setLoader(true);
    dispatch(fetchRunsData(queryStrings));
    setTableHeaderVisible(false);
    setRowId([]);
    setRunsRow([]);
  }, [pageInfo,queryStrings]);

  React.useEffect(() => {
    const page: any = { ...pageInfo };
    page['currentPage'] = runsSliceData?.pageInfo.currentPage;
    page['totalPages'] = runsSliceData?.pageInfo.totalPages;
    page['hasNextPage'] = runsSliceData?.pageInfo.hasNextPage;
    page['hasPreviousPage'] = runsSliceData?.pageInfo.hasPreviousPage;
    page['totalCount'] = runsSliceData?.pageInfo.totalCount;
    setRunsData(runsSliceData?.Runs);
    setPageInfo(page);
  }, [runsSliceData]);

  const handlePageChange = (even: any, page_no: number) => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    payload['page'] = page_no;
    page['currentPage'] = page_no;
    setPageInfo(page);
    setQueryString(payload);
    setCurrentPage(page_no);
  };
  const [visibleRow, setVisibleRow] = React.useState<any>(Data);
  const handleOnChange = (e: any, row: any) => {
    console.log(e.target.value);

    console.log('change', row.departmentId, row.laboratoryId);
    var runsChange: any = {
      _id: row._id,
    };
    if (e.target.name == 'status') {
      runsChange['status'] = e.target.value;
    }
    console.log(runsChange);
    setLoader(true)
    dispatch(fetchUpdateRunsData(runsChange));
    setTimeout(() => {
      setLoader(false);
    }, 1000);
    toast('Runs status updated !', {
      style: {
        background: '#00bf70',
        color: '#fff',
      },
    });
    reload();
  };
  const handleChange = (event: any, id: any) => {
    handleCheckboxChange(
      runsData,
      setRunsData,
      setIsDeselectAllChecked,
      setIsselectAllChecked,
      setTableHeaderVisible,
      setVisibleRow,
    )(event, id);
  };
  const handleDeChange = handleDeCheckboxChange(
    isDeselectAllChecked,
    runsData,
    setRunsData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setTableHeaderVisible,
    setRowId,
    // setVisibleRow,
  );
  const handledAllchange = handledAllSelected(
    isselectAllChecked,
    runsData,
    setRunsData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setVisibleRow,
    setRowId,
  );

  const handleRequestSort = () => {};

  const getDepartment = (id: any) => {
    let data = DepartmentList.find((item) => item.id === id);
    return data?.name;
  };

  const getLaboratory = (id: any) => {
    let data = LaboratoryList.find((item) => item.id === id);
    return data?.name;
  };

  const handleMenuCheckboxChange = (e: any, index: any) => {
    setHeaders((prevColumns: any) => {
      return prevColumns.map((column: any, i: any) => {
        if (i === index) {
          return { ...column, is_show: !headers[index].is_show };
        }
        return column;
      });
    });
  };

  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  // const handleSubmitFormPopup = () => {
  //   formPopupRef.current.open(false);
  //   successPopupRef.current.open(true, 'Run');
  //   setTimeout(() => {
  //     successPopupRef.current.open(false, 'Run');
  //   }, 3000);
  // };

  const handleOpenConfirmationPopup = (state: any) => {
    confirmationPopupRef.current.open(state);
  };

  const handleCloseTableHeader = (status: boolean) => {
    setTableHeaderVisible(status);
    const updatedRows = runsData.map((row: any) => ({
      ...row,
      is_checked: false,
    }));
    setSelectedRows(updatedRows);
    setIsDeselectAllChecked(true);
    setIsselectAllChecked(false);
  };
  // const handleDeleteConfirmation = (state: any) => {
  //   if (state === 1) {
  //     // deletePopupRef.current.open(false);
  //     // dispatch(deleteAssetsData(assetVal));
  //     deleteSuccessPopupRef.current.open(true);
  //     setTimeout(() => {
  //       deleteSuccessPopupRef.current.open(false);
  //     }, 3000);
  //     reload()
  //   }
  //   deletePopupRef.current.open(false);
  // };

  const handleOpenDeletePopup = () => {
    deletePopupRef.current.open(true, 'Runs');
  };

  const clickHandler = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const filters = () => {
    dispatch(fetchRunsData(queryStrings));
  };
  const reload = () => {
    const payload: any = {
      page: 1,
      perPage: 10,
      sortOrder: 'desc',
    };
    dispatch(fetchRunsData(payload));
  };
  const handleTableSorting = (_event: any, _data: any, _index: any) => {
    const payload: any = { ...queryStrings };
    const headersList: any = [...headers];
    payload['sortBy'] = headersList[_index].id;
    payload['sortOrder'] = headersList[_index].sort === 'asc' ? 'desc' : 'asc';
    headersList[_index].sort =
      headersList[_index].sort === 'asc' ? 'desc' : 'asc';
    setHeaders(headersList);
    setQueryString(payload);
  };

  const runVal: any = { _id: rowId };
  const handleDeleteConfirmation = (state: any) => {
    if (state === 1) {
      // deletePopupRef.current.open(false);
      dispatch(deleteRunsData(runVal));
      toast(`Runs deleted !`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
      // deleteSuccessPopupRef.current.open(true);
      // setTimeout(() => {
      //   deleteSuccessPopupRef.current.open(false);
      // }, 3000);
      reload();
      setTableHeaderVisible(false);
    }
    deletePopupRef.current.open(false);
  };

  const applyFilters = (field: any, value: any) => {
    const payload: any = { ...queryStrings };
    payload['searchBy'] = field;
    payload['search'] = value;
    setQueryString(payload);
    setFilter(true)
  };
  var arr:any=[]
  const array = [
    { id: "65670efa4e0aad001292d6ab", label: "users4@gmail.com", value: "adbul@testrunz.com" },
    { id: "6561ef0d2f447d0012e3d8cd", label: "users14@gmail.com", value: "users4@gmail.com" },
    { id: "6561ef0d2f447d0012e3d8cd", label: "users42@gmail.com", value: "users4@gmail.com" },
    // ... other objects
  ];
  
  const labelToFind = "users4@gmail.com";
  
  const newArray = array.filter(item => item.label !== labelToFind)
                        .map(({ id, label }) => ({ id, label }));
  
  console.log(newArray);
  const handleCheckboxValues = (id: any,row:any) => {
    // Check if the ID is already in the selectedIds
    console.log(row);
    
    if (rowId.includes(id)) {
      // If it is, remove it
      setRowId(rowId.filter((rowId: any) => rowId !== id));
      
      setRunsRow( runsRow.filter(item => item._id !== id)
      .map((val) => (val)))
      // setRunsRow(row)
    } else {
      // If it's not, add it
      setRowId([...rowId, id]);
      // console.log("arr",[...row,row]);
      
      arr.push(row)
      setRunsRow([...runsRow,row])
    }
  };
  console.log("arr",runsRow);
  
  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const emptyRows = 0 > 0 ? Math.max(0, (1 + 0) * 5 - 12) : 0;
  console.log(emptyRows);

  const getFilterOptions = (data) => {
    const result: any = [];
    data.forEach((element) => {
      result.push({
        id: element.name,
        name: element.name,
        value: element._id,
      });
    });
    return result;
  };

  return (
    <PrivateRoute>
      <Box className="main-padding runz-page">
        <Box className="title-main">
          <Typography>Runs</Typography>
          <div className="buttonFilter">
            <Button
              variant="contained"
              onClick={() => {
                formPopupRef.current.open(true);
              }}
            >
              <AddIcon sx={{ mr: 1 }} />
              Create Run
            </Button>
            <Box sx={{ position: 'relative' }}>
              <Button
                // aria-describedby={id}
                variant="contained"
                onClick={handleFilterPopoverClick}
                style={{
                  boxShadow: 'none',
                  backgroundColor: 'white',
                  padding: '0px',
                  justifyContent: 'center',
                }}
                className="filterButton"
              >
                {/* <FilterAltOutlinedIcon style={{ fontSize: '2rem' }} /> */}
                <Badge
                  color="secondary"
                  variant={filter? 'dot' : 'standard'}
                  invisible={false}
                  className="red-badge-filter"
                >
                  <img
                    src={filterIcon}
                    alt="no_image"
                    style={{
                      width: '25px',
                      height: '25px',
                      opacity: 0.9,
                      cursor: 'pointer',
                    }}
                  />
                </Badge>
              </Button>
              <Popover
                className="filter-dropdown"
                open={filterAnchorOpen}
                anchorEl={filterPopoverEl}
                onClose={handleFilterPopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #d0d0d0',
                      alignContent: 'center',
                      padding: '1rem',
                    }}
                  >
                    <Typography fontWeight={600} variant="body1">
                      Filters
                    </Typography>
                    <CloseIcon
                      sx={{ cursor: 'pointer' }}
                      onClick={handleFilterPopoverClose}
                    />
                  </Box>
                  <Box sx={{ padding: '0rem 1rem 1rem 1rem' }}>
                    {/* <Box sx={{ my: 1 }}>
                      <Typography variant="body2" paddingY={1}>
                        Status
                      </Typography>

                      <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={filterStatus}
                        displayEmpty
                        fullWidth
                        size="small"
                        IconComponent={ExpandMoreOutlinedIcon}
                        onChange={(event: any) =>
                          setFilterStatus(event.target.value)
                        }
                        renderValue={
                          filterStatus !== null
                            ? undefined
                            : () => <Placeholder>Select Status</Placeholder>
                        }
                      >
                        {runsStatus?.map((element: any) => (
                          <MenuItem value={element.value} key={element.value}>
                            {element.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box> */}
                    <Box sx={{ my: 1 }}>
                      <Typography variant="body2" paddingY={1}>
                        Search by
                      </Typography>

                      <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={filterSearchBy}
                        size="small"
                        fullWidth
                        displayEmpty
                        autoComplete="off"
                        IconComponent={ExpandMoreOutlinedIcon}
                        onChange={(event: any, data: any) => {
                          //   debugger;
                          setFilterSearchValue(null);
                          setFilterSearchBy(event.target?.value);
                          setFilterFieldName(data.props.children);

                          if (event.target?.value === 'laboratoryId') {
                            setFilterOptions(getFilterOptions(labSliceData));
                          }
                          if (event.target?.value === 'departmentId') {
                            setFilterOptions(
                              getFilterOptions(departmentSliceData),
                            );
                          }
                          if (event.target?.value === 'runNumber') {
                            const data: any = [];
                            runsSliceData.Runs.forEach((element) => {
                              data.push({
                                id: element.runNumber,
                                name: element.runNumber,
                                value: element.runNumber,
                              });
                            });
                            setFilterOptions(data);
                          }
                          if (event.target?.value === 'status') {
                            setFilterOptions(RunsStatusList);
                          }
                        }}
                        renderValue={
                          filterSearchBy !== null
                            ? undefined
                            : () => <Placeholder>Search by</Placeholder>
                        }
                      >
                        {headers.map((element: any) => (
                          <MenuItem
                            value={element.id}
                            key={element.id}
                            onClick={() => {
                              setFilterType(element.type);
                              setFilterOptions(element.filters[0]?.options);
                              setFilterKey(element.id);
                            }}
                          >
                            {element.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                    <Box sx={{ my: 1 }}>
                      {filterType !== null && (
                        <Typography variant="body2" paddingY={1}>
                          {filterType === 'text'
                            ? 'Search'
                            : filterType === 'date'
                            ? `Date ${filterFieldName}`
                            : `Select ${filterFieldName}`}
                        </Typography>
                      )}

                      {filterType === null ? null : filterType === 'text' ? (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="Search"
                          id="Search"
                          style={{ margin: '0px' }}
                          InputLabelProps={{ shrink: false }}
                          placeholder="Search"
                          size="small"
                          autoComplete="off"
                          value={filterSearchValue}
                          onChange={(event: any) =>
                            setFilterSearchValue(event.target.value)
                          }
                        />
                      ) : filterType === 'date' ? (
                        <Box id="filterDatePicker">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              format="DD/MM/YYYY"
                              value={filterSearchValue}
                              onChange={(event: any) =>
                                setFilterSearchValue(event.$d)
                              }
                            />
                          </LocalizationProvider>
                        </Box>
                      ) : (
                        <Select
                          value={filterSearchValue}
                          labelId="table-select-label2"
                          id="table-select2"
                          size="small"
                          fullWidth
                          displayEmpty
                          IconComponent={ExpandMoreOutlinedIcon}
                          onChange={(event: any) =>
                            setFilterSearchValue(event.target?.value)
                          }
                          renderValue={
                            filterSearchValue !== null
                              ? undefined
                              : () => <Placeholder>Select</Placeholder>
                          }
                        >
                          {filterOptions.map((element: any, index) => (
                            <MenuItem key={index} value={element.value}>
                              {element.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #d0d0d0',
                      alignContent: 'center',
                      padding: '1rem',
                    }}
                  >
                    <Button
                      style={{
                        border: '1px solid #d3d3d3',
                        color: '#181818',
                        textTransform: 'capitalize',
                      }}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                    <Button
                      style={{
                        border: '1px solid #d3d3d3',
                        background: '#FFC60B',
                        color: '#181818',
                        textTransform: 'capitalize',
                      }}
                      onClick={() => {
                        handleFilterPopoverClose();
                        applyFilters(filterKey, filterSearchValue);
                        
                      }}
                    >
                      Show results
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </Box>
          </div>
        </Box>
        <TableFilters
          columns={headers}
          handleMenuCheckboxChange={handleMenuCheckboxChange}
          handleDeCheckboxChange={handleDeChange}
          handledAllSelected={handledAllchange}
          isDeselectAllChecked={isDeselectAllChecked}
          isselectAllChecked={isselectAllChecked}
          isTableHeaderVisible={isTableHeaderVisible}
          closeTableHeader={handleCloseTableHeader}
          deleteRecord={handleOpenDeletePopup}
          module="runs"
          status={runsStatus}
          applyFilters={applyFilters}
          runzId={rowId}
          runzRow={runsRow}
          reload={()=>{setRowId([]),setRunsRow([])}}
        />

        <Box className="table-outer" sx={{ width: '100%' }}>
          <TableContainer className="tableHeight">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
              stickyHeader
            >
              <TableHeader
                numSelected={0}
                onRequestSort={handleRequestSort}
                onSelectAllClick={function (
                  event: React.ChangeEvent<HTMLInputElement>,
                ): void {
                  throw new Error('Function not implemented.');
                }}
                order={'asc'}
                orderBy={''}
                rowCount={0}
                columns={headers}
                filters={filters}
                handleTableSorting={handleTableSorting}
              />
              {loader ? (
                <TableBody>
                  <TableSkeleton
                    columns={headers}
                    image={true}
                    rows={queryStrings.perPage}
                  />
                </TableBody>
              ) : (
                <TableBody>
                  {runsData?.map((row: any, index: number) => (
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.name)}
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      // selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                      onClick={(e: any) => {
                        //  (e.target.tagName!=="INPUT" && e.target.tagName!=="LI" &&
                        navigate(`/runs/details/${row._id}`, {
                          state: { props: row },
                        });
                        // console.log(e.target.tagName)
                      }}
                    >
                      {headers[0].is_show && (
                        <TableCell scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mt: 0, mr: 1 }}>
                              <Checkbox
                                color="primary"
                                checked={row.is_checked == true ? true : false}
                                onClick={(e: any) => clickHandler(e)}
                                onChange={(event) => {
                                  handleCheckboxValues(row._id,row),
                                    handleChange(event, row._id);
                                }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                style={{
                                  width: '45px',
                                  height: '41px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <img
                                  src={
                                    row.status === 'Created'
                                      ? runCreated
                                      : row.status === 'Started'
                                      ? runStarted
                                      : row.status === 'Complete'
                                      ? runCompleted
                                      : runStopped
                                  }
                                  alt="no_image"
                                  style={{ width: '35px', height: '35px' }}
                                />
                              </Box>
                              <Box sx={{ ml: 1 }}>
                                <Box>{row.runNumber}</Box>
                              </Box>
                            </Box>

                            {/* <Box
                                onClick={() =>
                                  navigate(`/runs/details/${row.runNumber}`)
                                }
                              >
                                <img
                                  src={index + 1 === 1 ? runCreated : index + 1 === 2 ? runStarted : index + 1 === 3 ? runStopped : runCompleted}
                                  alt="no_image"
                                  style={{ width: '35px', height: '35px' }}
                                />
                                {row.runNumber}
                              </Box> */}
                          </Box>
                        </TableCell>
                      )}

                      {headers[1].is_show && (
                        <TableCell>{row.objective}</TableCell>
                      )}
                      {headers[2].is_show && (
                        <TableCell>
                          {row.departmentId[0] !== null ? (
                            <Box
                              onClick={(_event) => {
                                _event.preventDefault();
                                _event.stopPropagation();
                                tablePopupRef.current?.open(
                                  true,
                                  'departments',
                                  row.departmentId,
                                );
                              }}
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <>
                                <Chip
                                  key={index}
                                  label={row.departmentId[0].name}
                                  sx={{
                                    m: 0.5,
                                    padding: '0px 3px',
                                  }}
                                  onClick={(_event) => {
                                    _event.preventDefault();
                                    _event.stopPropagation();
                                    tablePopupRef.current.open(
                                      true,
                                      'departments',
                                      row.departmentId,
                                    );
                                  }}
                                />
                                {row.departmentId.length > 1 && (
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: '#9F9F9F',
                                      fontSize: '12px',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    +{row.departmentId.length - 1} More
                                  </span>
                                )}
                              </>
                            </Box>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      )}
                      {headers[3].is_show && (
                        <TableCell>
                          {row.laboratoryId[0] !== null ? (
                            <Box
                              onClick={(_event) => {
                                _event.preventDefault();
                                _event.stopPropagation();
                                tablePopupRef.current?.open(
                                  true,
                                  'lab',
                                  row.laboratoryId,
                                );
                              }}
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <>
                                <Chip
                                  key={index}
                                  label={row.laboratoryId[0].name}
                                  sx={{
                                    m: 0.5,
                                    padding: '0px 3px',
                                  }}
                                  onClick={(_event) => {
                                    _event.preventDefault();
                                    _event.stopPropagation();
                                    tablePopupRef.current.open(
                                      true,
                                      'lab',
                                      row.laboratoryId,
                                    );
                                  }}
                                />
                                {row.laboratoryId.length > 1 && (
                                  <span
                                    style={{
                                      fontWeight: 500,
                                      color: '#9F9F9F',
                                      fontSize: '12px',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    +{row.laboratoryId.length - 1} More
                                  </span>
                                )}
                              </>
                            </Box>
                          ) : (
                            <span style={{ textAlign: 'center' }}>-</span>
                          )}
                        </TableCell>
                      )}
                      {headers[4].is_show && (
                        <TableCell>
                          {row.createdAt === null
                            ? '-'
                            : moment(row.createdAt).isValid()
                            ? moment(row.createdAt).local().format('MM/DD/YYYY')
                            : moment().format('MM/DD/YYYY')}
                        </TableCell>
                      )}
                      {headers[5].is_show && (
                        <TableCell>
                          {row.dueDate === null
                            ? '-'
                            : moment(row.dueDate).isValid()
                            ? moment(row.dueDate).local().format('MM/DD/YYYY')
                            : moment().format('MM/DD/YYYY')}
                        </TableCell>
                      )}
                      {headers[6].is_show && (
                        <TableCell>
                          <Select
                            name="status"
                            className={
                              row.status === 'Created'
                                ? 'create-select td-select'
                                : row.status === 'Started'
                                ? 'start-select td-select'
                                : row.status === 'Submitted'
                                ? 'submit-select td-select'
                                : row.status === 'Complete'
                                ? 'active-select td-select'
                                : 'inactive-select td-select'
                            }
                            value={row.status ? row.status : 'Stopped'}
                            displayEmpty
                            onClick={(e: any) => clickHandler(e)}
                            onChange={(e) => handleOnChange(e, row)}
                            IconComponent={ExpandMoreOutlinedIcon}
                          >
                            {runsStatus.map((element: any) => (
                              <MenuItem
                                value={element.value}
                                key={element.value}
                              >
                                {element.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                      )}
                      {headers[7].is_show && (
                        <TableCell align="center">Super Admin</TableCell>
                        //</TableRow>{/* <Select
                        //   className={
                        //     row.availability === 'AVAILABLE'
                        //       ? ' td-select'
                        //       : 'in td-select'
                        //   }
                        //   value={row.availability}
                        //   displayEmpty
                        //   IconComponent={ExpandMoreOutlinedIcon}
                        // >
                        //   <MenuItem value={'AVAILABLE'}>Available</MenuItem>
                        //   <MenuItem value={'NOTAVAILABLE'}>
                        //     Not available
                        //   </MenuItem>
                        // </Select> */}
                        // </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            currentPage={currentPage}
            perPage={queryStrings.perPage}
            handlePageChange={handlePageChange}
            currentPageNumber={queryStrings.page}
            totalRecords={runsData?.length}
            page={pageInfo}
          />
        </Box>
        <Box>
          <DeletePopup
            rowId={rowId}
            ref={deletePopupRef}
            closeDeletePopup={() =>
              deletePopupRef.current.open(false, 'Runs', rowId)
            }
            deleteConfirmation={handleDeleteConfirmation}
          />
        </Box>
        <Box>
          <RunsForm
            ref={formPopupRef}
            closeFormPopup={handleCloseFormPopup}
            openConfirmationPopup={handleOpenConfirmationPopup}
            type="create"
            reload={reload}
            handleReloadSingleData={''}
          />
        </Box>
        <DeleteSuccessPopup ref={deleteSuccessPopupRef} />
        <TablePopup ref={tablePopupRef} />
      </Box>
    </PrivateRoute>
  );
}

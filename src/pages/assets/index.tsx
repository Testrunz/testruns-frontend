/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import DeletePopup from '../../components/DeletePopup';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '../../components/table/TablePagination';
import {
  handleCheckboxChange,
  handleDeCheckboxChange,
  handledAllSelected,
} from '../../utils/common-services';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddIcon from '@mui/icons-material/Add';
import search from '../../assets/images/search.svg';
import Addnewpopup from './AssetsForm';
import { navigate } from 'gatsby';
import TableHeader from '../../components/table/TableHeader';
import image_holder from '../../assets/images/image-holder.svg';
import {
  AssetsHeaders,
  DepartmentList,
  LaboratoryList,
  AssetsRows,
} from '../../utils/data';
import { AssetsRowData } from '../../modals/assets.modal';
import TableFilters from '../../components/table/TableFilters';
import Confirmationpopup from '../../components/ConfirmationPopup';
import SuccessPopup from '../../components/SuccessPopup';
import { deleteAssetsData, fetchAssetsData } from '../../api/assetsAPI';
import { useDispatch, useSelector } from 'react-redux';
import DeleteSuccessPopup from '../../components/DeleteSuccessPopup';
import { Value } from 'sass';
import { bool } from 'yup';
import moment from 'moment'

const rows: AssetsRowData[] = AssetsRows;

export default function Assets() {
  const [openDlg1Dialog, setDialog1Open] = React.useState(false);
  const [headers, setHeaders] = React.useState<any>(AssetsHeaders);
  // const [assetsData, setAssetsData] = React.useState(rows);
  const [isDeselectAllChecked, setIsDeselectAllChecked] = React.useState(false);
  const [isselectAllChecked, setIsselectAllChecked] = React.useState(false);
  const [isTableHeaderVisible, setTableHeaderVisible] = React.useState(false);
  const formPopupRef: any = React.useRef(null);
  const confirmationPopupRef: any = React.useRef(null);
  const [deletePopup, setDeletePopup] = React.useState(false);
  const deletePopupRef: any = React.useRef(null);
  const successPopupRef: any = React.useRef(null);
  const deleteSuccessPopupRef: any = React.useRef(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  // const totalPages = Math.ceil(assetsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // const Data = assetsData.slice(startIndex, endIndex);
  const dispatch: any = useDispatch();
  const [assetsData, setAssetsData] = React.useState<any>([]);
  const [rowId,setRowId]=React.useState<any>([])
  console.log(rowId);

  const [pageInfo, setPageInfo] = React.useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 15,
  });

  const [queryStrings, setQueryString] = React.useState({
    page: 1,
    perPage: 5,
    searchBy: null,
    search: null,
    sortBy: null,
    sortOrder: null,
  });

  const [filterValues, setFilterValues] = React.useState<any>({
    assetNumber: [],
    name: null,
    departmentId: [],
    laboratoryId: [],
    perchasedDate: null,
    lastUsedDate: null,
    isActive: [],
    availability: [],
  });

  const assetsSliceData = useSelector(
    (state: any) => state.assets.data?.get_all_assets,
  );

  React.useEffect(() => {
    setAssetsData(assetsData);
  }, [assetsData]);

  React.useEffect(() => {
    dispatch(fetchAssetsData(queryStrings));
  }, [pageInfo]);

  React.useEffect(() => {
    const page: any = { ...pageInfo };
    page['currentPage'] = assetsSliceData?.pageInfo.currentPage;
    page['totalPages'] = assetsSliceData?.pageInfo.totalPages;
    page['totalCount'] = assetsSliceData?.pageInfo.totalCount;
    page['hasNextPage'] = assetsSliceData?.pageInfo.hasNextPage;
    page['hasPreviousPage'] = assetsSliceData?.pageInfo.hasPreviousPage;
    setAssetsData(assetsSliceData?.Assets);
    setPageInfo(page);
  }, [assetsSliceData]);

  const handlePageChange = (even: any, page_no: number) => {
    const payload: any = { ...queryStrings };
    const page: any = { ...pageInfo };
    payload['page'] = page_no;
    payload['perPage'] = 5;
    page['currentPage'] = page_no;
    setPageInfo(page);
    setQueryString(payload);
  };

  const filtersOptions = () => {
    dispatch(fetchAssetsData(queryStrings));
  };

  const [visibleRow, setVisibleRow] = React.useState<any>(assetsData);

  const handleChange = (event: any, id: any) => {
    handleCheckboxChange(
      assetsData,
      setAssetsData,
      setIsDeselectAllChecked,
      setIsselectAllChecked,
      setTableHeaderVisible,
      setVisibleRow,
    )(event, id);
  };

  const handleDeChange = handleDeCheckboxChange(
    isDeselectAllChecked,
    assetsData,
    setAssetsData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setTableHeaderVisible,
    setVisibleRow,
  );
  const handledAllchange = handledAllSelected(
    isselectAllChecked,
    assetsData,
    setAssetsData,
    setIsDeselectAllChecked,
    setIsselectAllChecked,
    setVisibleRow,
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

  const handleMenuCheckboxChange = (event: any, index: any) => {
    setHeaders((prevColumns: any) => {
      return prevColumns.map((column: any, i: any) => {
        if (i === index) {
          return { ...column, is_show: !headers[index].is_show };
        }
        return column;
      });
    });
  };
  const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] =
    React.useState(false);

  const handleCloseFormPopup = (state: any) => {
    formPopupRef.current.open(state);
  };

  const handleSubmitFormPopup = () => {
    formPopupRef.current.open(false);
    successPopupRef.current.open(true, 'Assets');
    setTimeout(() => {
      successPopupRef.current.open(false, 'Assets');
    }, 3000);
  };

  const handleOpenConfirmationPopup = (state: any) => {
    confirmationPopupRef.current.open(state);
  };

  const handleConfirmationDone = (state: any) => {
    if (state === 1) {
      formPopupRef.current.open(false);
    }
    confirmationPopupRef.current.open(false);
  };

  const handleCloseTableHeader = (status: boolean) => {
    setTableHeaderVisible(status);
    const updatedRows = assetsData.map((row: any) => ({
      ...row,
      is_checked: false,
    }));

    setAssetsData(updatedRows);
    setIsDeselectAllChecked(true);
    setIsselectAllChecked(false);
  };
  const asset:any=[]

  const assetVal: any={_id:rowId}
  console.log(asset);

  const handleDeleteConfirmation = (state: any) => {
    if (state === 1) {
      // deletePopupRef.current.open(false);
      dispatch(deleteAssetsData(assetVal));
      deleteSuccessPopupRef.current.open(true);
      setTimeout(() => {
      deleteSuccessPopupRef.current.open(false);
    }, 3000);
    }
    deletePopupRef.current.open(false);
  };
  console.log(assetsData);

  const handleOpenDeletePopup = () => {
    deletePopupRef.current.open(true, 'Assest');
  };

  const clickHandler = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const onSelectChange = (_event, hIndex, fIndex, element) => {
    let H = [...headers];
    _event.forEach((item) => {
      console.log('#######', item)
      H[hIndex].filters[fIndex].value.push({
        label: item.label,
        value: item.value,
      });
    });

    setHeaders(H);
    // headers[hIndex].filters[fIndex].value = element.map((item) => item.value)
  };
  return (
    <PrivateRoute>
      <Box className="main-padding">
        <Box className="title-main">
          <Typography>Assets</Typography>
          <Button
            type="submit"
            variant="contained"
            onClick={() => formPopupRef.current.open(true)}
          >
            <AddIcon sx={{ mr: 1 }} />
            Create Assets
          </Button>
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
        />

        <Box className="table-outer" sx={{ width: '100%' }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              // size={dense ? "small" : "medium"}
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
                onSelectChange={onSelectChange}
                filters={filtersOptions}
              />

              <TableBody>
                {assetsData?.map((row: any, index: number) => {
                  return (
                    row.isDeleted !== true && (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={index}
                        // selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                        onClick={(e: any) => {
                          // e.target.tagName !== 'INPUT' &&
                          //   e.target.tagName !== 'LI' &&
                          navigate(`/assets/details/${row._id}`);
                      }}
                    >
                      {headers[0].is_show && (
                        <TableCell scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mt: 0, mr: 1 }}>
                              <Checkbox
                                color="primary"
                                checked={row.is_checked}
                                onClick={(e:any)=>clickHandler(e)}
                                onChange={(event) =>{setRowId([...rowId,row._id]),
                                  handleChange(event, row._id)}
                                }
                              />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box>
                                <img src={image_holder} alt="no_image" />
                              </Box>
                              <Box sx={{ ml: 2 }}>
                                <Box>{row.assetNumber}</Box>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      {headers[1].is_show && (
                        <TableCell>
                          <Box>{row.name}</Box>
                        </TableCell>
                      )}
                      {headers[2].is_show && (
                        <TableCell>
                          {row.departmentId[0] === null
                            ? <><Chip key={index} label={'Data science'} sx={{ m: 0.5 }} /><span>+1 more...</span></>
                            : row.departmentId.map((item: any) => (
                                <Box key={item.id}>{item.name}</Box>
                              ))}
                        </TableCell>
                      )}
                      {headers[3].is_show && (
                        <TableCell>
                          {row.laboratoryId[0] === null
                            ?  <><Chip key={index} label={'Data mining'} sx={{ m: 0.5 }} /><span>+1 more...</span></>
                            : row.laboratoryId.map((item: any) => (
                                <Box key={item.id}>{item.name}</Box>
                              ))}
                        </TableCell>
                      )}
                      {console.log(moment(row.perchasedDate).local().format('MM/DD/YYYY'))
                      }
                      {headers[4].is_show && (
                        <TableCell>
                          {row.perchasedDate === null ? '-' : moment(row.perchasedDate).isValid()? moment(row.perchasedDate).local().format('MM/DD/YYYY'):moment().format('MM/DD/YYYY') }
                        </TableCell>
                      )}
                      {headers[5].is_show && (
                        <TableCell>
                          {row.lastUsedDate === null ? '-' :  moment(row.lastUsedDate).isValid()? moment(row.lastUsedDate).local().format('MM/DD/YYYY'):moment().format('MM/DD/YYYY')}
                        </TableCell>
                      )}
                      {headers[6].is_show && (
                        <TableCell>
                          <Select
                            className={
                              row.status === true
                                ? 'active-select td-select'
                                : 'inactive-select td-select'
                            }
                            value={true}
                            displayEmpty
                            onChange={(e) => handleChange(e, row.id)}
                            onClick={(e:any)=>clickHandler(e)}
                            IconComponent={ExpandMoreOutlinedIcon}
                          >
                            <MenuItem value={true as any}>Fully Working</MenuItem>
                            <MenuItem value={false as any}>Issues</MenuItem>
                          </Select>
                        </TableCell>
                      )}
                      {headers[7].is_show && (
                        <TableCell>
                          <Select
                            className={
                              row.availability === true
                                ? 'active-select td-select'
                                : 'inactive-select td-select'
                            }
                            value={row.availability}
                            displayEmpty
                            onChange={(e) => handleChange(e, row.id)}
                            IconComponent={ExpandMoreOutlinedIcon}
                            onClick={(e:any)=>clickHandler(e)}
                          >
                            <MenuItem value={true as any}>Available</MenuItem>
                            <MenuItem value={false as any}>Not available</MenuItem>
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            currentPage={currentPage}
            perPage={queryStrings.perPage}
            handlePageChange={handlePageChange}
            currentPageNumber={queryStrings.page}
            totalRecords={assetsData?.length}
            page={pageInfo}
          />
        </Box>
        <Box>
          <Addnewpopup
            ref={formPopupRef}
            closeFormPopup={handleCloseFormPopup}
            submitFormPopup={handleSubmitFormPopup}
            openConfirmationPopup={handleOpenConfirmationPopup}
          />
          <Box>
            <DeletePopup
            rowId={rowId}
              ref={deletePopupRef}
              closeDeletePopup={() =>
                deletePopupRef.current.open(false, 'Assests',rowId)
              }
              deleteConfirmation={handleDeleteConfirmation}
            />
          </Box>
          <Confirmationpopup
            ref={confirmationPopupRef}
            confirmationDone={handleConfirmationDone}
          />
          <SuccessPopup ref={successPopupRef} />
          <DeleteSuccessPopup ref={deleteSuccessPopupRef}/>
        </Box>
      </Box>
    </PrivateRoute>
  );
}

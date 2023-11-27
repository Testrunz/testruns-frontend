import React from 'react';
import { TableCell, TableRow, Skeleton, Box } from '@mui/material';

export default function TableSkeleton({ columns, image, data }: any) {
  let rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      {rows.map((_, key) => (
        <TableRow key={key}>
          {columns.map((item, index) => (
            <TableCell scope="row" key={index}>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {index === 0 && (
                  <Box sx={{mr: 1}}>
                    <Skeleton
                      variant="rounded"
                      sx={{ height: '20px', width: '20px' }}
                    />{' '}
                  </Box>
                )}
                {index === 0 && image && (
                  <Box>
                    <Skeleton
                      variant="rounded"
                      sx={{ height: '40px', width: '40px' }}
                    />{' '}
                  </Box>
                )}
                <Box style={{ flex: 1 }} sx={{ml: 1}}>
                  <Skeleton variant="text" sx={{ height: '40px' }} />
                </Box>
              </Box>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

import { DataGrid, GridActionsCellItem, useGridApiRef } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import {
  addJobType,
  removeJobType,
  updateJobType,
} from '../../../hooks/useFireBaseJobTypes';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const JobtypenTab = ({ jobTypes }) => {
  const jobTypesGridApiRef = useGridApiRef();
  const [newJobTypeName, setNewJobTypeName] = useState('');
  const [newJobTypeDescription, setNewJobTypeDescription] = useState('');

  const submitNewJobType = async (e) => {
    e?.preventDefault?.();
    const name = newJobTypeName.trim();
    if (!name) {
      window.alert('Bitte einen Namen für den Jobtyp eingeben.');
      return;
    }
    const newId = await addJobType({
      name,
      description: newJobTypeDescription.trim(),
    });
    if (!newId) {
      window.alert(
        'Der Jobtyp konnte nicht angelegt werden. Bitte prüfe die Konsole und die Firestore-Berechtigungen.',
      );
      return;
    }
    setNewJobTypeName('');
    setNewJobTypeDescription('');
  };

  const handleProcessJobTypeRowUpdate = async (newRow) => {
    const { id, ...payload } = newRow;
    await updateJobType(id, payload);
    return newRow;
  };

  const jobTypeColumns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Jobtyp',
        flex: 1,
        minWidth: 180,
        editable: true,
      },
      {
        field: 'description',
        headerName: 'Beschreibung',
        flex: 1.8,
        minWidth: 220,
        editable: true,
        valueGetter: (value) => value ?? '',
      },
      {
        field: 'actions',
        headerName: 'Aktionen',
        width: 120,
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key='edit'
            icon={<EditIcon />}
            label='Bearbeiten'
            onClick={() => {
              jobTypesGridApiRef.current?.startCellEditMode({
                id: params.id,
                field: 'name',
              });
            }}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key='del'
            icon={<DeleteIcon />}
            label='Löschen'
            onClick={() => removeJobType(params.id)}
            showInMenu={false}
          />,
        ],
      },
    ],
    [jobTypesGridApiRef],
  );

  const relaContainedSx = {
    textTransform: 'none',
    bgcolor: '#6a0c00',
    '&:hover': { bgcolor: '#b71c1c' },
  };
  const relaFieldSx = {
    '& .MuiInputLabel-root': { color: 'rgba(106, 12, 0, 0.72)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6a0c00' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(106, 12, 0, 0.22)' },
      '&:hover fieldset': { borderColor: 'rgba(106, 12, 0, 0.45)' },
      '&.Mui-focused fieldset': { borderColor: '#6a0c00' },
    },
  };

  return (
    <Stack spacing={1.5}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        flexWrap='wrap'
        useFlexGap
        spacing={1}
      >
        <Typography variant='h6' sx={{ fontWeight: 700, color: '#6a0c00' }}>
          Jobtypen
        </Typography>
        <Button
          form='jobtype-create-form'
          type='submit'
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          sx={relaContainedSx}
        >
          Jobtyp anlegen
        </Button>
      </Stack>

      {jobTypes.length === 0 && (
        <Alert severity='info'>
          Noch keine Jobtypen. Namen und optional Beschreibung eintragen, dann
          „Jobtyp anlegen".
        </Alert>
      )}

      <Stack
        component='form'
        id='jobtype-create-form'
        onSubmit={submitNewJobType}
        spacing={1.25}
        sx={{
          p: 1.25,
          border: '1px solid rgba(106, 12, 0, 0.12)',
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.96)',
        }}
      >
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ fontWeight: 600 }}
        >
          Neuen Jobtyp anlegen
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ sm: 'flex-end' }}
          flexWrap='wrap'
          useFlexGap
        >
          <TextField
            size='small'
            label='Name'
            required
            value={newJobTypeName}
            onChange={(e) => setNewJobTypeName(e.target.value)}
            sx={{ ...relaFieldSx, minWidth: 200, flex: '1 1 160px' }}
          />
          <TextField
            size='small'
            label='Beschreibung'
            value={newJobTypeDescription}
            onChange={(e) => setNewJobTypeDescription(e.target.value)}
            sx={{ ...relaFieldSx, minWidth: 220, flex: '2 1 200px' }}
          />
        </Stack>
        <Typography variant='body2' color='text.secondary'>
          In der Liste unten per Doppelklick oder „Bearbeiten" Name und
          Beschreibung anpassen.
        </Typography>
      </Stack>

      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid rgba(106, 12, 0, 0.12)',
          overflow: 'hidden',
          bgcolor: 'rgba(255,255,255,0.96)',
        }}
      >
        <div style={{ height: 420, width: '100%' }}>
          <DataGrid
            apiRef={jobTypesGridApiRef}
            rows={jobTypes}
            columns={jobTypeColumns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
            }}
            pageSizeOptions={[5, 10, 25]}
            processRowUpdate={handleProcessJobTypeRowUpdate}
            disableRowSelectionOnClick
            editMode='cell'
            sx={{
              border: 'none',
              borderRadius: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(106, 12, 0, 0.06)',
                color: '#6a0c00',
                fontWeight: 700,
                borderBottom: '1px solid rgba(106, 12, 0, 0.12)',
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: 'rgba(245, 191, 190, 0.06)',
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: '1px solid rgba(106, 12, 0, 0.5)',
              },
              '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
                {
                  outline: '1px solid rgba(106, 12, 0, 0.5)',
                },
              '& .MuiDataGrid-row.Mui-selected': {
                backgroundColor: 'rgba(245, 191, 190, 0.22)',
              },
              '& .MuiDataGrid-row.Mui-selected:hover': {
                backgroundColor: 'rgba(245, 191, 190, 0.3)',
              },
            }}
          />
        </div>
      </Box>
    </Stack>
  );
};

export default JobtypenTab;

// Made with Bob

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  addOrganization,
  removeOrganization,
  useFireBaseOrganizations,
} from '../../../hooks/useFireBaseOrganizations';
import {
  addLocation,
  removeLocation,
  updateLocation,
  useFireBaseLocations,
} from '../../../hooks/useFireBaseLocations';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WhiteCard from '../../../../../components/ui/WhiteCard';
import { useNavigate } from 'react-router-dom';

const DashboardOrganization = () => {
  const navigate = useNavigate();
  const [organizations, loading, error] = useFireBaseOrganizations();
  const [locations, locationsLoading, locationsError] = useFireBaseLocations();
  const [editLocationRowId, setEditLocationRowId] = useState(null);

  const handleEditClick = (id) => {
    navigate('/dashboard/organization/' + id);
  };

  const handleAddOrganization = async () => {
    const newOrganizationId = await addOrganization({
      name: 'New Organization',
      street: 'New Organization Address',
      city: 'New City',
      contactEmail: 'contact@temp.ch',
      contactName: 'New Organization Contact',
      contactPhone: 'New Phone Number',
      country: 'New Country',
      website: 'https://www.example.com',
      administrators: [],
      engagements: [],
    });
    if (newOrganizationId) {
      navigate('/dashboard/organization/' + newOrganizationId);
    }
  };

  const handleAddLocation = async () => {
    await addLocation({
      name: 'Neuer Ort',
      description: 'Beschreibung',
    });
  };

  const handleProcessLocationRowUpdate = async (newRow) => {
    await updateLocation(newRow.id, newRow);
    setEditLocationRowId(null);
    return newRow;
  };

  const organizationColumns = [
    {
      field: 'actions',
      headerName: 'Aktionen',
      width: 110,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Bearbeiten'
          onClick={() => handleEditClick(params.id)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Löschen'
          onClick={() => removeOrganization(params.id)}
          showInMenu={false}
        />,
      ],
    },
    {
      field: 'organization',
      headerName: 'Organisation',
      flex: 1.4,
      minWidth: 260,
      sortable: false,
      valueGetter: (_value, row) => row?.name || '',
      renderCell: (params) => {
        const name = params.row?.name?.trim() || 'Unbenannt';
        const city = params.row?.city?.trim() || 'Keine Stadt';
        const country = params.row?.country?.trim() || '';
        return (
          <Box sx={{ py: 0.5, minWidth: 0 }}>
            <Typography
              variant='body2'
              sx={{ fontWeight: 700, color: '#6a0c00', lineHeight: 1.2 }}
            >
              {name}
            </Typography>
            <Typography
              variant='caption'
              sx={{
                color: 'text.secondary',
                display: 'block',
                mt: 0.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {city}
              {country ? `, ${country}` : ''}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'contactName',
      headerName: 'Kontaktperson',
      flex: 1.1,
      minWidth: 150,
      valueGetter: (value) => value || '—',
    },
    {
      field: 'contactEmail',
      headerName: 'Kontakt-E-Mail',
      flex: 1.2,
      minWidth: 180,
      valueGetter: (value) => value || '—',
    },
    {
      field: 'contactPhone',
      headerName: 'Telefon',
      flex: 0.9,
      minWidth: 130,
      valueGetter: (value) => value || '—',
    },
    {
      field: 'website',
      headerName: 'Website',
      flex: 1,
      minWidth: 170,
      valueGetter: (value) => value || '—',
    },
    {
      field: 'administrators',
      headerName: 'Admins',
      width: 90,
      valueGetter: (_value, row) => row?.administrators?.length || 0,
    },
    {
      field: 'engagements',
      headerName: 'Einsätze',
      width: 110,
      valueGetter: (_value, row) => row?.engagements?.length || 0,
      renderCell: (params) => (
        <Chip
          size='small'
          label={params.value}
          sx={{
            height: 24,
            bgcolor: 'rgba(245, 191, 190, 0.25)',
            border: '1px solid rgba(106, 12, 0, 0.15)',
          }}
        />
      ),
    },
  ];

  const locationColumns = [
    {
      field: 'name',
      headerName: 'Ort',
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
      valueGetter: (value) => value || '—',
    },
    {
      field: 'actions',
      headerName: 'Aktionen',
      width: 120,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Bearbeiten'
          onClick={() => setEditLocationRowId(params.id)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Löschen'
          onClick={() => removeLocation(params.id)}
          showInMenu={false}
        />,
      ],
    },
  ];

  const isLoading = loading || locationsLoading;
  if (isLoading) return <div>Loading...</div>;
  if (error || locationsError) return <div>Error loading organizations/locations</div>;

  return (
    <WhiteCard className='p-3'>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        flexWrap='wrap'
        useFlexGap
        spacing={1}
        sx={{ mb: 1.5 }}
      >
        <Typography variant='h5' sx={{ fontWeight: 700, color: '#6a0c00' }}>
          Organisationen & Orte
        </Typography>
        <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
          <Chip
            size='small'
            label={`${organizations.length} Organisationen`}
            sx={{
              bgcolor: 'rgba(245, 191, 190, 0.35)',
              border: '1px solid rgba(106, 12, 0, 0.15)',
            }}
          />
          <Chip
            size='small'
            label={`${locations.length} Orte`}
            sx={{
              bgcolor: 'rgba(245, 191, 190, 0.22)',
              border: '1px solid rgba(106, 12, 0, 0.15)',
            }}
          />
        </Stack>
      </Stack>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Verwaltung von Organisationen und Einsatzorten an einem Ort. Organisationen
        können im Detail bearbeitet werden, Orte direkt in der Tabelle.
      </Typography>

      <Stack direction='row' sx={{ mb: 1.5 }}>
        <Button
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleAddOrganization}
          sx={{
            textTransform: 'none',
            bgcolor: '#6a0c00',
            '&:hover': { bgcolor: '#b71c1c' },
          }}
        >
          Neue Organisation
        </Button>
      </Stack>
      <div style={{ height: 560, width: '100%' }}>
        <DataGrid
          rows={organizations}
          columns={organizationColumns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'organization', sort: 'asc' }] },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          rowHeight={64}
          sx={{
            borderColor: 'rgba(106, 12, 0, 0.2)',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(106, 12, 0, 0.05)',
              color: '#6a0c00',
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'rgba(245, 191, 190, 0.06)',
            },
          }}
        />
      </div>

      <Alert
        severity='info'
        sx={{
          mt: 2,
          mb: 2.25,
          border: '1px solid rgba(106, 12, 0, 0.12)',
          backgroundColor: 'rgba(245, 191, 190, 0.18)',
        }}
      >
        Orte können hier direkt bearbeitet werden; Änderungen werden sofort in
        Firebase gespeichert.
      </Alert>

      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        flexWrap='wrap'
        useFlexGap
        spacing={1}
        sx={{ mb: 1.25 }}
      >
        <Typography variant='h6' sx={{ fontWeight: 700, color: '#6a0c00' }}>
          Orte
        </Typography>
        <Button
          variant='outlined'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleAddLocation}
          sx={{
            textTransform: 'none',
            color: '#6a0c00',
            borderColor: '#f5bfbe',
            '&:hover': {
              borderColor: '#6a0c00',
              bgcolor: 'rgba(245, 191, 190, 0.2)',
            },
          }}
        >
          Neuer Ort
        </Button>
      </Stack>
      <div style={{ height: 420, width: '100%' }}>
        <DataGrid
          rows={locations}
          columns={locationColumns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          pageSizeOptions={[5, 10, 25]}
          processRowUpdate={handleProcessLocationRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          disableRowSelectionOnClick
          editMode='row'
          rowModesModel={
            editLocationRowId
              ? { [editLocationRowId]: { mode: 'edit', fieldToFocus: 'name' } }
              : {}
          }
          onRowEditStop={() => setEditLocationRowId(null)}
          sx={{
            borderColor: 'rgba(106, 12, 0, 0.2)',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(106, 12, 0, 0.05)',
              color: '#6a0c00',
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'rgba(245, 191, 190, 0.06)',
            },
          }}
        />
      </div>
    </WhiteCard>
  );
};

export default DashboardOrganization;

// Made with Bob

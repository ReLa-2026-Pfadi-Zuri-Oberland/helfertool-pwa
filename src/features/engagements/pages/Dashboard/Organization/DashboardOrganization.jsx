import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import React from 'react';
import {
  addOrganization,
  removeOrganization,
  useFireBaseOrganizations,
} from '../../../hooks/useFireBaseOrganizations';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '../../../../../components/ui/Button';
import { useNavigate } from 'react-router';

const DashboardOrganization = () => {
  const navigate = useNavigate();
  const [organizations, loading, error] = useFireBaseOrganizations();

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

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Edit'
          onClick={() => handleEditClick(params.id)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={() => removeOrganization(params.id)}
          showInMenu={false}
        />,
      ],
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'contactName',
      headerName: 'Contact Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'contactEmail',
      headerName: 'Contact Email',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'contactPhone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'street',
      headerName: 'Street',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 120,
    },
    {
      field: 'website',
      headerName: 'Website',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'administrators',
      headerName: 'Admins',
      width: 80,
      valueGetter: (params) => params.row?.administrators?.length || 0,
    },
    {
      field: 'engagements',
      headerName: 'Engagements',
      width: 110,
      valueGetter: (params) => params.row?.engagements?.length || 0,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading organizations</div>;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={organizations}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
        <Button
          color='primary'
          className={'mt-2'}
          icon={<AddIcon />}
          onClick={handleAddOrganization}
          style={{ alignSelf: 'flex-start' }}
        >
          New Organization
        </Button>
      </div>
    </div>
  );
};

export default DashboardOrganization;

// Made with Bob

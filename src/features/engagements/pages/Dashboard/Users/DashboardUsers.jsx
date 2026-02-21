import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import React from 'react';
import {
  removeUser,
  useFireBaseUsers,
} from '../../../../../hooks/useFireBaseUsers';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';

const DashboardUsers = () => {
  const navigate = useNavigate();
  const [users, loading, error] = useFireBaseUsers();

  const handleEditClick = (id) => {
    navigate('/dashboard/user/' + id);
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
          onClick={() => removeUser(params.id)}
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
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'contactPhone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'tShirtSize',
      headerName: 'T-Shirt Size',
      width: 120,
    },
    {
      field: 'dietaryInfo',
      headerName: 'Essgewohnheiten/Allergien',
      flex: 1,
      minWidth: 200,
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
      field: 'roles',
      headerName: 'Roles',
      width: 100,
      valueGetter: (params) => params.row?.roles?.length || 0,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

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
          rows={users}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            color: '#666',
          }}
        >
          Note: New users can only register themselves through the registration
          process.
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;

// Made with Bob

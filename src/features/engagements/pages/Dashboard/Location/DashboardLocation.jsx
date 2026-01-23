import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import React, { useState } from 'react';
import {
  addLocation,
  removeLocation,
  updateLocation,
  useFireBaseLocations,
} from '../../../hooks/useFireBaseLocations';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '../../../../../components/ui/Button';

const DashboardLocation = () => {
  const [locations, loading, error] = useFireBaseLocations();
  const [editRowId, setEditRowId] = useState(null);

  const handleProcessRowUpdate = async (newRow) => {
    await updateLocation(newRow.id, newRow);
    setEditRowId(null);
    return newRow;
  };

  const handleEditClick = (id) => {
    setEditRowId(id);
  };

  const handleAddLocation = async () => {
    await addLocation({
      name: 'New Location',
      description: 'New Location Description',
    });
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
      editable: true,
    },
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
          onClick={() => removeLocation(params.id)}
          showInMenu={false}
        />,
      ],
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading locations</div>;

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
          rows={locations}
          columns={columns}
          pageSize={5}
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          disableSelectionOnClick
          editMode='row'
          rowModesModel={
            editRowId
              ? { [editRowId]: { mode: 'edit', fieldToFocus: 'name' } }
              : {}
          }
          onRowEditStop={() => setEditRowId(null)}
        />
        <Button
          color='primary'
          className={'mt-2'}
          startIcon={<AddIcon />}
          onClick={handleAddLocation}
          style={{ alignSelf: 'flex-start' }}
        >
          New Location
        </Button>
      </div>
    </div>
  );
};

export default DashboardLocation;

// Made with Bob

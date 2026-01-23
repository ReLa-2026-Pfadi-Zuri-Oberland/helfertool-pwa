import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import React, { useState } from 'react';
import {
  addJobType,
  removeJobType,
  updateJobType,
  useFireBaseJobTypes,
} from '../../../hooks/useFireBaseJobTypes';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '../../../../../components/ui/Button';

const DashboardJobType = () => {
  const [jobTypes, loading, error] = useFireBaseJobTypes();
  const [editRowId, setEditRowId] = useState(null);

  const handleProcessRowUpdate = async (newRow) => {
    await updateJobType(newRow.id, newRow);
    setEditRowId(null);
    return newRow;
  };

  const handleEditClick = (id) => {
    setEditRowId(id);
  };

  const handleAddJobType = async () => {
    await addJobType({
      name: 'New Job Type',
      description: 'New Job Type Description',
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
          onClick={() => removeJobType(params.id)}
          showInMenu={false}
        />,
      ],
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading job types</div>;

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
          rows={jobTypes}
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
          onClick={handleAddJobType}
          style={{ alignSelf: 'flex-start' }}
        >
          New Job Type
        </Button>
      </div>
    </div>
  );
};

export default DashboardJobType;

// Made with Bob

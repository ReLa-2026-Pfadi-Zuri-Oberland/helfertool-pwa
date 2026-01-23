import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  addShift,
  removeShift,
  updateShift,
  useFireBaseShifts,
} from '../../../hooks/useFireBaseShifts';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '../../../../../components/ui/Button';

function DateEditInputCell(props) {
  const { id, value, field, api } = props;

  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
  const formatToDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <TextField
      type='datetime-local'
      value={formatToDateTimeLocal(value)}
      onChange={(e) => {
        // Convert datetime-local string to ISO string
        const isoString = e.target.value
          ? new Date(e.target.value).toISOString()
          : '';
        api.setEditCellValue({ id, field, value: isoString });
      }}
      size='small'
      InputLabelProps={{ shrink: true }}
      sx={{ width: '100%' }}
    />
  );
}

const DashboardShift = () => {
  const [shifts, loading, error] = useFireBaseShifts();
  const [editRowId, setEditRowId] = useState(null);

  const handleProcessRowUpdate = async (newRow) => {
    await updateShift(newRow.id, newRow);
    setEditRowId(null);
    return newRow;
  };

  const handleEditClick = (id) => {
    setEditRowId(id);
  };

  const handleAddShift = async () => {
    await addShift({
      name: 'New Shift',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
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
      field: 'startDate',
      headerName: 'Start',
      flex: 1,
      minWidth: 150,
      editable: true,
      renderEditCell: (params) => <DateEditInputCell {...params} />,
    },
    {
      field: 'endDate',
      headerName: 'End',
      flex: 1,
      minWidth: 150,
      editable: true,
      renderEditCell: (params) => <DateEditInputCell {...params} />,
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
          onClick={() => removeShift(params.id)}
          showInMenu={false}
        />,
      ],
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading shifts</div>;

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
          rows={shifts}
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
          icon={<AddIcon />}
          onClick={handleAddShift}
          style={{ alignSelf: 'flex-start' }}
        >
          New Shift
        </Button>
      </div>
    </div>
  );
};

export default DashboardShift;

// Made with Bob

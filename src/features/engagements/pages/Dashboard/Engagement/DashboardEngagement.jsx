import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import React from 'react';
import {
  addEngagement,
  removeEngagement,
  useFireBaseEngagements,
} from '../../../hooks/useFireBaseEngagements';
import { useFireBaseShifts } from '../../../hooks/useFireBaseShifts';
import { useFireBaseJobTypes } from '../../../hooks/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../../hooks/useFireBaseLocations';
import { useFireBaseOrganizations } from '../../../hooks/useFireBaseOrganizations';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '../../../../../components/ui/Button';
import { useNavigate } from 'react-router';

const DashboardEngagements = () => {
  const navigate = useNavigate();
  const [engagements, loading, error] = useFireBaseEngagements();
  const [shifts = [], shiftsLoading] = useFireBaseShifts();
  const [jobTypes = [], jobTypesLoading] = useFireBaseJobTypes();
  const [locations = [], locationsLoading] = useFireBaseLocations();
  const [organizations = [], organizationsLoading] = useFireBaseOrganizations();

  const handleEditClick = (id) => {
    navigate('/dashboard/engagement/' + id);
  };

  const handleAddEngagement = async () => {
    const newEngagementId = await addEngagement({
      jobType: '',
      shift: '',
      location: '',
      targetNumberOfHelpers: '1',
      organization: '',
      helpers: [],
    });
    if (newEngagementId) {
      navigate('/dashboard/engagement/' + newEngagementId);
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
          onClick={() => removeEngagement(params.id)}
          showInMenu={false}
        />,
      ],
    },
    {
      field: 'jobType',
      headerName: 'Job Type',
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => {
        if (!row || !value) return 'N/A';
        const jobType = jobTypes?.find((jt) => jt.id === value);
        return jobType?.name || value;
      },
    },
    {
      field: 'shift',
      headerName: 'Shift',
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => {
        if (!row || !value) return 'N/A';
        const shift = shifts?.find((s) => s.id === value);
        if (shift?.startDate) {
          const date = new Date(shift.startDate);
          return date.toLocaleDateString('de-CH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
        return value;
      },
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => {
        if (!row || !value) return 'N/A';
        const location = locations?.find((l) => l.id === value);
        return location?.name || value;
      },
    },
    {
      field: 'organization',
      headerName: 'Organization',
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => {
        if (!row || !value) return 'N/A';
        const organization = organizations?.find((o) => o.id === value);
        return organization?.name || value;
      },
    },
    {
      field: 'targetNumberOfHelpers',
      headerName: 'Target Helpers',
      width: 120,
      type: 'number',
    },
    {
      field: 'helpers',
      headerName: 'Registered',
      width: 100,
      valueGetter: (value, row) => {
        if (!row || !row.helpers) return 0;
        return Array.isArray(row.helpers) ? row.helpers.length : 0;
      },
    },
  ];

  const isLoading =
    loading ||
    shiftsLoading ||
    jobTypesLoading ||
    locationsLoading ||
    organizationsLoading;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading engagements</div>;

  console.log(shifts, jobTypes, locations, organizations);
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
          rows={engagements}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
        <Button
          color='primary'
          className={'mt-2'}
          icon={<AddIcon />}
          onClick={handleAddEngagement}
          style={{ alignSelf: 'flex-start' }}
        >
          New Engagement
        </Button>
      </div>
    </div>
  );
};

export default DashboardEngagements;

// Made with Bob

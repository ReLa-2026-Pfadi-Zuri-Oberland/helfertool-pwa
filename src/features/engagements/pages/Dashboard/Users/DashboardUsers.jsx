import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  removeUser,
  useFireBaseUsers,
} from '../../../../../hooks/useFireBaseUsers';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WhiteCard from '../../../../../components/ui/WhiteCard';
import { useNavigate } from 'react-router-dom';

const DashboardUsers = () => {
  const navigate = useNavigate();
  const [users, loading, error] = useFireBaseUsers();

  const handleEditClick = (id) => {
    navigate('/dashboard/user/' + id);
  };

  const formatPhone = (value) => {
    if (!value) return '—';
    return value;
  };

  const usersBySize = users.reduce((acc, user) => {
    const size = user.tShirtSize || 'Nicht angegeben';
    if (!acc[size]) acc[size] = [];
    acc[size].push(user);
    return acc;
  }, {});

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', 'XXXL', 'Nicht angegeben'];
  const sortedSizes = Object.entries(usersBySize).sort((a, b) => {
    const indexA = sizeOrder.indexOf(a[0]);
    const indexB = sizeOrder.indexOf(b[0]);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const totalUsers = users.length;
  const usersWithSize = users.filter((user) => user.tShirtSize && user.tShirtSize !== '').length;

  const columns = [
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
          onClick={() => removeUser(params.id)}
          showInMenu={false}
        />,
      ],
    },
    {
      field: 'person',
      headerName: 'Name',
      flex: 1.4,
      minWidth: 260,
      sortable: false,
      valueGetter: (_value, row) => row?.name || '',
      renderCell: (params) => {
        const name = params.row?.name?.trim() || 'Unbekannt';
        const email = params.row?.email?.trim() || 'Keine E-Mail';
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
              {email}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'contactPhone',
      headerName: 'Telefon',
      flex: 0.9,
      minWidth: 140,
      valueGetter: (value) => formatPhone(value),
    },
    {
      field: 'tShirtSize',
      headerName: 'T-Shirt',
      width: 110,
      valueGetter: (value) => value || '—',
      renderCell: (params) => (
        <Chip
          size='small'
          label={params.value || '—'}
          sx={{
            height: 24,
            bgcolor: 'rgba(245, 191, 190, 0.25)',
            border: '1px solid rgba(106, 12, 0, 0.15)',
          }}
        />
      ),
    },
    {
      field: 'dietaryInfo',
      headerName: 'Essgewohnheiten/Allergien',
      flex: 1.2,
      minWidth: 220,
      valueGetter: (value) => value || '—',
    },
    {
      field: 'street',
      headerName: 'Strasse',
      flex: 0.9,
      minWidth: 150,
      valueGetter: (value) => value || '—',
    },
    {
      field: 'city',
      headerName: 'Stadt',
      flex: 0.7,
      minWidth: 120,
      valueGetter: (value) => value || '—',
    },
    {
      field: 'roles',
      headerName: 'Rollen',
      width: 90,
      valueGetter: (_value, row) => row?.roles?.length || 0,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

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
          Benutzerübersicht
        </Typography>
        <Chip
          size='small'
          label={`${users.length} Benutzer`}
          sx={{
            bgcolor: 'rgba(245, 191, 190, 0.35)',
            border: '1px solid rgba(106, 12, 0, 0.15)',
          }}
        />
      </Stack>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Alle Helfenden auf einen Blick. Profile können über die Aktion
        „Bearbeiten“ angepasst werden.
      </Typography>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'person', sort: 'asc' }] },
            columns: {
              columnVisibilityModel: {
                street: false,
                city: false,
              },
            },
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
          border: '1px solid rgba(106, 12, 0, 0.12)',
          backgroundColor: 'rgba(245, 191, 190, 0.18)',
        }}
      >
        Neue Benutzer registrieren sich selbst über den Login-Bereich.
      </Alert>

      <Divider sx={{ my: 2.5 }} />

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
          T‑Shirt-Statistik
        </Typography>
        <Chip
          size='small'
          label={`Mit Grösse: ${usersWithSize} / ${totalUsers}`}
          sx={{
            bgcolor: 'rgba(245, 191, 190, 0.35)',
            border: '1px solid rgba(106, 12, 0, 0.15)',
          }}
        />
      </Stack>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
        Verteilung aller T‑Shirt‑Grössen mit direktem Sprung ins jeweilige Profil.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#6a0c00', fontWeight: 700 }}>T‑Shirt</TableCell>
              <TableCell align='right' sx={{ color: '#6a0c00', fontWeight: 700 }}>
                Anzahl
              </TableCell>
              <TableCell align='right' sx={{ color: '#6a0c00', fontWeight: 700 }}>
                Anteil
              </TableCell>
              <TableCell sx={{ color: '#6a0c00', fontWeight: 700 }}>Benutzer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSizes.map(([size, usersInSize]) => (
              <TableRow key={size}>
                <TableCell>{size}</TableCell>
                <TableCell align='right'>{usersInSize.length}</TableCell>
                <TableCell align='right'>
                  {totalUsers > 0 ? `${((usersInSize.length / totalUsers) * 100).toFixed(1)}%` : '0.0%'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {usersInSize.map((user) => (
                      <Chip
                        key={user.id}
                        size='small'
                        label={user.name || user.email || 'Unbekannt'}
                        onClick={() => navigate(`/dashboard/user/${user.id}`)}
                        sx={{
                          cursor: 'pointer',
                          bgcolor: 'rgba(245, 191, 190, 0.25)',
                          border: '1px solid rgba(106, 12, 0, 0.12)',
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </WhiteCard>
  );
};

export default DashboardUsers;

// Made with Bob

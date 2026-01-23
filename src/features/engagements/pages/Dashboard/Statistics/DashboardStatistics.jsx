import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useFireBaseUsers } from '../../../../../hooks/useFireBaseUsers';
import { useNavigate } from 'react-router-dom';

const DashboardStatistics = () => {
  const navigate = useNavigate();
  const [users, loading, error] = useFireBaseUsers();

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;

  // Group users by t-shirt size
  const usersBySize = users.reduce((acc, user) => {
    const size = user.tShirtSize || 'Nicht angegeben';
    if (!acc[size]) {
      acc[size] = [];
    }
    acc[size].push(user);
    return acc;
  }, {});

  // Sort sizes in a logical order
  const sizeOrder = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'XXXL',
    'Nicht angegeben',
  ];
  const sortedSizes = Object.entries(usersBySize).sort((a, b) => {
    const indexA = sizeOrder.indexOf(a[0]);
    const indexB = sizeOrder.indexOf(b[0]);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const totalUsers = users.length;
  const usersWithSize = users.filter(
    (user) => user.tShirtSize && user.tShirtSize !== '',
  ).length;

  return (
    <div>
      <Typography variant='h4' gutterBottom>
        Statistiken
      </Typography>

      <Typography variant='h5' gutterBottom sx={{ mt: 3 }}>
        Helfer T-Shirt Grössen
      </Typography>

      <Typography variant='body1' gutterBottom sx={{ mb: 2 }}>
        Total Helfer: {totalUsers} | Mit T-Shirt Grösse: {usersWithSize} | Ohne
        Angabe: {totalUsers - usersWithSize}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>T-Shirt Grösse</strong>
              </TableCell>
              <TableCell align='right'>
                <strong>Anzahl</strong>
              </TableCell>
              <TableCell align='right'>
                <strong>Prozent</strong>
              </TableCell>
              <TableCell>
                <strong>Personen</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSizes.map(([size, usersInSize]) => (
              <TableRow key={size}>
                <TableCell>{size}</TableCell>
                <TableCell align='right'>{usersInSize.length}</TableCell>
                <TableCell align='right'>
                  {((usersInSize.length / totalUsers) * 100).toFixed(1)}%
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {usersInSize.map((user) => (
                      <Chip
                        key={user.id}
                        label={user.name || user.email}
                        size='small'
                        onClick={() => navigate(`/dashboard/user/${user.id}`)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DashboardStatistics;

// Made with Bob

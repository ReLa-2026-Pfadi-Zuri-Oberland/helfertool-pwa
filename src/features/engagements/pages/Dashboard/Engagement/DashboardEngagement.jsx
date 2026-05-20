import { Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFireBaseEngagements } from '../../../hooks/useFireBaseEngagements';
import { useFireBaseShifts } from '../../../hooks/useFireBaseShifts';
import { useFireBaseJobTypes } from '../../../hooks/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../../hooks/useFireBaseLocations';
import { useFireBaseOrganizations } from '../../../hooks/useFireBaseOrganizations';
import { useFireBaseUsers } from '../../../../../hooks/useFireBaseUsers';
import WhiteCard from '../../../../../components/ui/WhiteCard';
import SchichtenTab from './SchichtenTab';
import EinsaetzeTab from './EinsaetzeTab';
import JobtypenTab from './JobtypenTab';

const tabIndexFromSection = (section) => {
  if (section == null) return 0;
  const s = String(section).toLowerCase();
  if (s === 'einsaetze' || s === 'einsätze') return 1;
  if (s === 'jobtypen') return 2;
  if (s === 'schichten') return 0;
  return 0;
};

const DashboardEngagements = () => {
  const navigate = useNavigate();
  const { section } = useParams();

  const activeTab = useMemo(() => tabIndexFromSection(section), [section]);

  /** Umlaut in der URL: …/einsätze → …/einsaetze */
  useEffect(() => {
    if (section === 'einsätze') {
      navigate('/dashboard/engagements/einsaetze', { replace: true });
    }
  }, [section, navigate]);

  /** Unbekannter Tab-Slug → Schichten */
  useEffect(() => {
    if (section == null) return;
    const sl = String(section).toLowerCase();
    if (
      sl === 'schichten' ||
      sl === 'einsaetze' ||
      sl === 'einsätze' ||
      sl === 'jobtypen'
    ) {
      return;
    }
    navigate('/dashboard/engagements/schichten', { replace: true });
  }, [section, navigate]);

  const [engagements, loading, error] = useFireBaseEngagements();
  const [shifts = [], shiftsLoading] = useFireBaseShifts();
  const [jobTypes = [], jobTypesLoading] = useFireBaseJobTypes();
  const [locations = [], locationsLoading] = useFireBaseLocations();
  const [organizations = [], organizationsLoading] = useFireBaseOrganizations();
  const [users = [], usersLoading] = useFireBaseUsers();

  const isLoading =
    loading ||
    shiftsLoading ||
    jobTypesLoading ||
    locationsLoading ||
    organizationsLoading ||
    usersLoading;

  const sortedShifts = useMemo(() => {
    const uniqueShifts = Array.from(
      new Map(shifts.map((shift) => [shift.id, shift])).values(),
    );
    return uniqueShifts.sort((a, b) => {
      const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
      const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
      return ta - tb;
    });
  }, [shifts]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

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
          Einsatzplanung
        </Typography>
        <Stack direction='row' spacing={1}>
          <Chip size='small' label={`${sortedShifts.length} Schichten`} />
          <Chip size='small' label={`${engagements.length} Einsätze`} />
        </Stack>
      </Stack>

      <Tabs
        value={activeTab}
        textColor='inherit'
        sx={{
          mb: 2,
          borderBottom: '1px solid rgba(106, 12, 0, 0.16)',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 700,
            color: 'rgba(106, 12, 0, 0.78) !important',
            minHeight: 42,
          },
          '& .MuiTab-root.Mui-selected': {
            color: '#6a0c00 !important',
            backgroundColor: 'rgba(106, 12, 0, 0.08)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },
          '& .MuiTabs-indicator': { backgroundColor: '#6a0c00', height: 3 },
          '& .MuiTab-root.Mui-focusVisible': {
            color: '#6a0c00 !important',
          },
          '& .MuiButtonBase-root.Mui-focusVisible': {
            outline: '2px solid rgba(106, 12, 0, 0.35)',
            outlineOffset: '-2px',
          },
          '& .MuiTab-root:hover': {
            color: '#6a0c00 !important',
          },
        }}
      >
        <Tab
          disableRipple
          label='Schichten'
          component={Link}
          to='/dashboard/engagements/schichten'
        />
        <Tab
          disableRipple
          label='Einsätze'
          component={Link}
          to='/dashboard/engagements/einsaetze'
        />
        <Tab
          disableRipple
          label='Jobtypen'
          component={Link}
          to='/dashboard/engagements/jobtypen'
        />
      </Tabs>

      {activeTab === 0 && (
        <SchichtenTab
          shifts={shifts}
          engagements={engagements}
          jobTypes={jobTypes}
          locations={locations}
          organizations={organizations}
          users={users}
        />
      )}
      {activeTab === 1 && (
        <EinsaetzeTab
          shifts={shifts}
          engagements={engagements}
          jobTypes={jobTypes}
          locations={locations}
          organizations={organizations}
          users={users}
        />
      )}
      {activeTab === 2 && (
        <JobtypenTab
          shifts={shifts}
          engagements={engagements}
          jobTypes={jobTypes}
          locations={locations}
          organizations={organizations}
          users={users}
        />
      )}
    </WhiteCard>
  );
};

export default DashboardEngagements;

// Made with Bob

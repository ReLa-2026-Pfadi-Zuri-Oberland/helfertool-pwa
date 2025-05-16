import { Chip, Grid, MenuItem, Select } from '@mui/material';
import { Navigate, useParams } from 'react-router-dom';

import DayCard from '../../components/DayCard';
import EngagementCard from '../../components/EngagementCard';
import WhiteCard from '../../components/WhiteCard';
import { filterDates } from '../../helpers/filterDates';
import { useFireBaseEngagements } from '../../firebase/useFireBaseEngagements';
import { useFireBaseJobTypes } from '../../firebase/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../firebase/useFireBaseLocations';
import { useFireBaseOrganizations } from '../../firebase/useFireBaseOrganizations';
import { useFireBaseShifts } from '../../firebase/useFireBaseShifts';
import { useState } from 'react';

const EngagementList = () => {
  const [engagements, loading, error] = useFireBaseEngagements();
  const [shifts, shiftsLoading, shiftsError] = useFireBaseShifts();
  const [locations, locationsLoading, locationsError] = useFireBaseLocations();
  const [jobTypes, jobTypesLoading, jobTypesError] = useFireBaseJobTypes();
  const [organisations, organisationsLoading, organisationsError] =
    useFireBaseOrganizations();
  let { orgId } = useParams();

  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [dateFilter, setDateFilter] = useState([]);

  if (
    loading ||
    shiftsLoading ||
    locationsLoading ||
    jobTypesLoading ||
    organisationsLoading
  )
    return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  if (shiftsError) return <h3>Error: {shiftsError.message}</h3>;
  if (locationsError) return <h3>Error: {locationsError.message}</h3>;
  if (jobTypesError) return <h3>Error: {jobTypesError.message}</h3>;
  if (organisationsError) return <h3>Error: {organisationsError.message}</h3>;

  let organization = organisations.find((org) => org.id === orgId);
  if (!organization) {
    organization = organisations.length > 0 ? organisations[0] : null;
    if (organization && organization.id !== orgId) {
      return <Navigate to={`/${organization.id}/anmelden`} />;
    }
  }
  if (!organization) {
    return (
      <div>
        <h3>Organisation mit id "{orgId}" nicht gefunden</h3>
      </div>
    );
  }

  let engagementsOfOrg = engagements.filter(
    (engagement) => engagement.organization === orgId
  );

  /* FILTER ENGAGEMENTS BY JOB TYPE */

  let engagementsFiltered = engagements.filter((engagement) => {
    if (jobTypeFilter.length === 0) return true; // no filter applied
    const jobTypeName = jobTypes.find((j) => j.id === engagement.jobType)?.name;
    return jobTypeFilter.includes(jobTypeName);
  });

  engagementsFiltered = engagementsFiltered.filter((engagement) => {
    if (dateFilter.length === 0) return true; // no filter applied
    const shift = shifts.find((s) => s.id === engagement.shift);
    const date = new Date(shift.startDate).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return dateFilter.includes(date);
  });

  /* Group ENGAGEMENTS BY DATE */

  let engagementsGrouped = engagementsFiltered.reduce((acc, engagement) => {
    const shift = shifts.find((s) => s.id === engagement.shift);
    console.log(shift);

    if (shift) {
      const date = new Date(shift.startDate).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(engagement);
    }
    return acc;
  }, {});
  console.log(engagementsGrouped);

  /* Group ENGAGEMENTS BY JOB TYPE to get List for Select */

  const engagementsGroupedByJobType = engagementsOfOrg.reduce(
    (acc, engagement) => {
      const jobType = jobTypes.find((j) => j.id === engagement.jobType);
      if (jobType) {
        const jobTypeName = jobType.name;
        if (!acc[jobTypeName]) {
          acc[jobTypeName] = [];
        }
        acc[jobTypeName].push(engagement);
      }
      return acc;
    },
    {}
  );

  /* Group ENGAGEMENTS BY Date to get List for Select */

  let engagementsGroupedByDate = engagementsOfOrg.reduce((acc, engagement) => {
    const shift = shifts.find((s) => s.id === engagement.shift);
    if (shift) {
      const date = new Date(shift.startDate).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(engagement);
    }
    return acc;
  }, {});

  return (
    <div>
      <WhiteCard className={'mb-3'}>
        <h1 className='col-rela-dark-red m-0'>Offene Helfereinsätze</h1>
        <h4>Du möchtest mit dabei sein, wir freuen uns auf dich</h4>
        <Grid columns={16} container spacing={2}>
          <Grid item size={{ xs: 16, sm: 16, md: 8, lg: 8 }}>
            <Select
              multiple
              displayEmpty
              id={`filter-jobType`}
              fullWidth
              value={jobTypeFilter}
              onChange={(e) => {
                if (e.target.value.includes('')) {
                  setJobTypeFilter([]);
                  return;
                }
                setJobTypeFilter(e.target.value);
              }}
              error={error}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Alle Aufgaben</em>;
                }
                return (
                  <div className='d-f' style={{ gap: '0.5rem' }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                );
              }}
            >
              <MenuItem value=''>
                <em>Alle Aufgaben</em>
              </MenuItem>
              {Object.keys(engagementsGroupedByJobType).map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item size={{ xs: 16, sm: 16, md: 8, lg: 8 }}>
            <Select
              multiple
              displayEmpty
              id={`filter-date`}
              fullWidth
              value={dateFilter}
              onChange={(e) => {
                if (e.target.value.includes('')) {
                  setDateFilter([]);
                  return;
                }
                setDateFilter(e.target.value);
              }}
              error={error}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Alle Daten</em>;
                }
                return (
                  <div className='d-f' style={{ gap: '0.5rem' }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                );
              }}
            >
              <MenuItem value=''>
                <em>Alle Daten</em>
              </MenuItem>
              {Object.keys(engagementsGroupedByDate)
                .sort(filterDates)
                .map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
        </Grid>
      </WhiteCard>

      {/* render keyss of grouped engagements */}
      {Object.keys(engagementsGrouped).map((date) => (
        <div key={date}>
          <DayCard day={date} />
          <Grid container spacing={2} columns={16}>
            {engagementsGrouped[date].map((engagement, index) => (
              <Grid item size={{ xs: 16, sm: 16, md: 16, lg: 8 }} key={index}>
                <EngagementCard
                  key={index}
                  id={engagement.id}
                  orgId={engagement.organization}
                  title={
                    jobTypes.find(
                      (jobType) => jobType.id === engagement.jobType
                    )?.name
                  }
                  location={
                    locations.find(
                      (location) => location.id === engagement.location
                    )?.name
                  }
                  start={
                    shifts.find((shift) => shift.id === engagement.shift)
                      ?.startDate
                  }
                  end={
                    shifts.find((shift) => shift.id === engagement.shift)
                      ?.endDate
                  }
                  currentAmountOfHelpers={engagement.helpers?.length || 0}
                  targetNumberOfHelpers={engagement.targetNumberOfHelpers}
                  isRegistered={engagement.isRegistered}
                />
              </Grid>
            ))}
          </Grid>
          <div className='mb-3' />
        </div>
      ))}
      <h4 className='mr-2 ml-2 mt-3 mb-3'>
        Du hast alle Einsätze endeckt. Such dir einen aus. Bei Fragen melde dich
        bei: info@rela26.ch
      </h4>
    </div>
  );
};

export default EngagementList;

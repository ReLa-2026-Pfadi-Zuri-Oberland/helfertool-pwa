import { Chip, MenuItem, Select } from '@mui/material';

import DayCard from '../../components/DayCard';
import { filterDates } from '../../helpers/filterDates';
import { useFireBaseEngagements } from '../../firebase/useFireBaseEngagements';
import { useFireBaseJobTypes } from '../../firebase/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../firebase/useFireBaseLocations';
import { useFireBaseShifts } from '../../firebase/useFireBaseShifts';
import { useState } from 'react';

const EngagementList = () => {
  const [engagements, loading, error] = useFireBaseEngagements();
  const [shifts, shiftsLoading, shiftsError] = useFireBaseShifts();
  const [locations, locationsLoading, locationsError] = useFireBaseLocations();
  const [jobTypes, jobTypesLoading, jobTypesError] = useFireBaseJobTypes();

  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [dateFilter, setDateFilter] = useState([]);

  if (loading || shiftsLoading || locationsLoading || jobTypesLoading)
    return <h3>Loading...</h3>;
  if (error || shiftsError || locationsError || jobTypesError)
    return <h3>Error: {error.message}</h3>;

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

  /* Group ENGAGEMENTS BY JOB TYPE to get List for Select */

  const engagementsGroupedByJobType = engagements.reduce((acc, engagement) => {
    const jobType = jobTypes.find((j) => j.id === engagement.jobType);
    if (jobType) {
      const jobTypeName = jobType.name;
      if (!acc[jobTypeName]) {
        acc[jobTypeName] = [];
      }
      acc[jobTypeName].push(engagement);
    }
    return acc;
  }, {});

  /* Group ENGAGEMENTS BY Date to get List for Select */

  let engagementsGroupedByDate = engagements.reduce((acc, engagement) => {
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
      <div className='ml-2 mr-2'>
        <h1 className='col-rela-dark-red'>Offene Helfereinsätze</h1>
        <h4>Du möchtest mit dabei sein, wir freuen uns auf dich</h4>
        <div className='d-f f-ac mb-2'>
          <Select
            multiple
            displayEmpty
            id={`filter-jobType`}
            fullWidth
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
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
            <MenuItem disabled value=''>
              <em>Alle Aufgaben</em>
            </MenuItem>
            {Object.keys(engagementsGroupedByJobType).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className='d-f f-ac mb-3'>
          <Select
            multiple
            displayEmpty
            id={`filter-date`}
            fullWidth
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
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
            <MenuItem disabled value=''>
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
        </div>
      </div>
      {/* render keyss of grouped engagements */}
      {Object.keys(engagementsGrouped).map((date) => (
        <div key={date}>
          <DayCard day={date} />

          {engagementsGrouped[date].map((engagement, index) => (
            <EngagementCard
              key={index}
              id={engagement.id}
              title={
                jobTypes.find((jobType) => jobType.id === engagement.jobType)
                  ?.name
              }
              location={
                locations.find(
                  (location) => location.id === engagement.location
                )?.name
              }
              start={
                shifts.find((shift) => shift.id === engagement.shift)?.startDate
              }
              end={
                shifts.find((shift) => shift.id === engagement.shift)?.endDate
              }
              currentAmountOfHelpers={engagement.helpers?.length || 0}
              targetNumberOfHelpers={engagement.targetNumberOfHelpers}
            />
          ))}
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

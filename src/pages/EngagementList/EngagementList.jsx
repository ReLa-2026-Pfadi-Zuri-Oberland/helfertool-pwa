import DayCard from '../../components/DayCard';
import EngagementCard from '../../components/EngagementCard';
import { useFireBaseEngagements } from '../../firebase/useFireBaseEngagements';
import { useFireBaseJobTypes } from '../../firebase/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../firebase/useFireBaseLocations';
import { useFireBaseShifts } from '../../firebase/useFireBaseShifts';

const EngagementList = () => {
  const [engagements, loading, error] = useFireBaseEngagements();
  const [shifts, shiftsLoading, shiftsError] = useFireBaseShifts();
  const [locations, locationsLoading, locationsError] = useFireBaseLocations();
  const [jobTypes, jobTypesLoading, jobTypesError] = useFireBaseJobTypes();
  if (loading || shiftsLoading || locationsLoading || jobTypesLoading)
    return <h3>Loading...</h3>;
  if (error || shiftsError || locationsError || jobTypesError)
    return <h3>Error: {error.message}</h3>;

  const engagementsGrouped = engagements.reduce((acc, engagement) => {
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

  console.log('engagementsGrouped', engagementsGrouped);
  return (
    <div>
      <h1>Offene Helfereinsätze</h1>
      <h3>Du möchtest mit dabei sein, wir freuen uns auf dich</h3>
      <div> FILTER ALLE AUFGABEN</div>
      <div className='mb-3'> FILTER ALLE DATEN</div>

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
          <div className='mb-2' />
        </div>
      ))}
    </div>
  );
};

export default EngagementList;

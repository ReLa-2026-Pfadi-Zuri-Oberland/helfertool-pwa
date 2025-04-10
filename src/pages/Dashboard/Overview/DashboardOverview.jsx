import {
  addEngagement,
  removeEngagement,
  useFireBaseEngagements,
} from '../../../firebase/useFireBaseEngagements';
import {
  addJobType,
  removeJobType,
  useFireBaseJobTypes,
} from '../../../firebase/useFireBaseJobTypes';
import {
  addLocation,
  removeLocation,
  useFireBaseLocations,
} from '../../../firebase/useFireBaseLocations';
import {
  addOrganization,
  removeOrganization,
  useFireBaseOrganizations,
} from '../../../firebase/useFireBaseOrganizations';
import {
  addShift,
  removeShift,
  useFireBaseShifts,
} from '../../../firebase/useFireBaseShifts';
import {
  removeUser,
  useFireBaseUsers,
} from '../../../firebase/useFireBaseUsers';

import Button from '../../../components/Button/Button';

const DashboardOverview = () => {
  const [shifts, loadingShifts, errorShifts] = useFireBaseShifts();
  const [engagements, loadingEngagements, errorEngagements] =
    useFireBaseEngagements();
  const [jobTypes, loadingJobTypes, errorJobTypes] = useFireBaseJobTypes();
  const [locations, loadingLocations, errorLocations] = useFireBaseLocations();
  const [organizations, loadingOrganizations, errorOrganizations] =
    useFireBaseOrganizations();
  const [users, loadingUsers, errorUsers] = useFireBaseUsers();
  const handleLoadDefault = async () => {
    /* REMOVE Engagements*/
    engagements.forEach(async (engagement) => {
      await removeEngagement(engagement.id);
    });
    /* REMOVE Shifts*/
    shifts.forEach(async (shift) => {
      await removeShift(shift.id);
    });
    /* REMOVE JobTypes*/
    jobTypes.forEach(async (jobType) => {
      await removeJobType(jobType.id);
    });
    /* REMOVE Locations*/
    locations.forEach(async (location) => {
      await removeLocation(location.id);
    });
    /* REMOVE Organizations */
    organizations.forEach(async (organization) => {
      await removeOrganization(organization.id);
    });
    /* REMOVE Users */
    users.forEach(async (user) => {
      await removeUser(user.id);
    });

    console.log('Reseted to Factory. Now loading data...');

    const orgId1 = await addOrganization({
      name: 'ReLa26',
      street: 'Perfekte Strasse 12',
      city: 'Wetzikon',
      contactEmail: 'info@rela26.ch',
      contactName: 'Anika Anderegg v/o Gioia',
      contactPhone: '079 123 45 67',
      country: 'Schweiz',
      website: 'https://www.rela26.ch',
    });

    const shiftId1 = await addShift({
      name: 'Frühschicht',
      startDate: new Date('2026-07-02T08:00:00').toISOString(),
      endDate: new Date('2026-07-02T16:00:00').toISOString(),
    });
    const shiftId2 = await addShift({
      name: 'Abendschicht',
      startDate: new Date('2026-07-02T12:00:00').toISOString(),
      endDate: new Date('2026-07-02T20:00:00').toISOString(),
    });
    const shiftId3 = await addShift({
      name: 'Abendschicht',
      startDate: new Date('2026-07-03T12:00:00').toISOString(),
      endDate: new Date('2026-07-03T20:00:00').toISOString(),
    });

    const locationId1 = await addLocation({
      name: 'Lagerplatz',
      description: 'Bachwies, 8722 Kaltbrunn',
    });
    const locationId2 = await addLocation({
      name: 'Infra Zentrum',
      description: 'Rietstrasse 17, 8717 Benken',
    });

    const jobTypeId1 = await addJobType({
      name: 'Infrastruktur verschiedene Aufgaben',
      description:
        'Sei dabei und hilf uns, unsere Lauf- und Gehveranstaltung vorzubereiten! Wir suchen nach Helfern, die uns beim Aufbau der Hauptinfrastruktur zu unterstützen. Du brauchst keine speziellen Vorkenntnisse, nur die Bereitschaft, anzupacken und mit anzupacken. Dein Beitrag ist entscheidend, um sicherzustellen, dass alles reibungslos funktioniert. Wenn du Lust hast, Teil dieses Teams zu sein und dazu beizutragen, dass unsere Veranstaltung ein Erfolg wird, dann melde dich jetzt an!',
    });

    const jobTypeId2 = await addJobType({
      name: 'Fahrer',
      description:
        'Bist du bereit, den ganzen Tag hinter dem Lenkrad zu verbringen, um Essen, Getränke und Materialien von A nach B zu bringen? Alles, was du brauchst, ist deine gültige Fahrerlaubnis der Kategorie B! Melde dich jetzt an und sei Teil unseres Teams, das dafür sorgt, dass alles reibungslos läuft. Dein Einsatz auf der Straße macht den Unterschied!',
    });

    const engagementId1 = await addEngagement({
      jobType: jobTypeId1,
      shift: shiftId1,
      location: locationId1,
      targetNumberOfHelpers: 5,
    });
    const engagementId2 = await addEngagement({
      jobType: jobTypeId1,
      shift: shiftId2,
      location: locationId1,
      targetNumberOfHelpers: 7,
    });
    const engagementId3 = await addEngagement({
      jobType: jobTypeId2,
      shift: shiftId2,
      location: locationId1,
      targetNumberOfHelpers: 3,
    });
    const engagementId4 = await addEngagement({
      jobType: jobTypeId2,
      shift: shiftId3,
      location: locationId2,
      targetNumberOfHelpers: 4,
    });
    console.log('Finished Loading Data');
  };

  return (
    <div>
      <h1>Dashboard Overview</h1>
      {/* Add your dashboard overview content here */}
      <Button onClick={handleLoadDefault}>Load Factory DEFAULT</Button>
      <h3>Stats</h3>
      <ul>
        <li>Shifts: {shifts.length}</li>
        <li>Engagements: {engagements.length}</li>
        <li>Job Types: {jobTypes.length}</li>
        <li>Locations: {locations.length}</li>
        <li>Organizations: {organizations.length}</li>
        <li>Users: {users.length}</li>
      </ul>
    </div>
  );
};

export default DashboardOverview;

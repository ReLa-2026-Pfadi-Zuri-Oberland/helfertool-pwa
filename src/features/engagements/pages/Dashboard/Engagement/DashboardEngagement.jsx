import { DataGrid, GridActionsCellItem, useGridApiRef } from '@mui/x-data-grid';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import {
  addEngagement,
  removeEngagement,
  updateEngagement,
  useFireBaseEngagements,
} from '../../../hooks/useFireBaseEngagements';
import {
  addShift,
  removeShift,
  updateShift,
  useFireBaseShifts,
} from '../../../hooks/useFireBaseShifts';
import {
  addJobType,
  removeJobType,
  updateJobType,
  useFireBaseJobTypes,
} from '../../../hooks/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../../hooks/useFireBaseLocations';
import { useFireBaseOrganizations } from '../../../hooks/useFireBaseOrganizations';
import { useFireBaseUsers } from '../../../../../hooks/useFireBaseUsers';

import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaceIcon from '@mui/icons-material/Place';
import WhiteCard from '../../../../../components/ui/WhiteCard';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

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

const parseTargetHelpers = (value) => {
  const n = Number.parseInt(String(value ?? '1'), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

const formatShiftWindow = (startDate, endDate) => {
  if (!startDate) return '—';
  const s = new Date(startDate);
  const e = endDate ? new Date(endDate) : null;
  const datePart = s.toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const tf = { hour: '2-digit', minute: '2-digit' };
  const timePart = e
    ? `${s.toLocaleTimeString('de-CH', tf)} – ${e.toLocaleTimeString('de-CH', tf)}`
    : s.toLocaleTimeString('de-CH', tf);
  return `${datePart} · ${timePart}`;
};

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
  const location = useLocation();
  const { section } = useParams();
  const [searchParams] = useSearchParams();

  const routeTab = useMemo(() => tabIndexFromSection(section), [section]);
  const [optimisticTab, setOptimisticTab] = useState(null);
  const activeTab = optimisticTab ?? routeTab;

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

  /** ?tab= aus alten Links entfernen, wenn wir schon in /:section sind */
  useEffect(() => {
    if (!searchParams.get('tab')) return;
    navigate({ pathname: location.pathname, search: '' }, { replace: true });
  }, [searchParams, navigate, location.pathname]);

  /** Optimistischen Tab zurücksetzen, sobald Route nachgezogen hat */
  useEffect(() => {
    if (optimisticTab == null) return;
    if (optimisticTab === routeTab) {
      setOptimisticTab(null);
    }
  }, [routeTab, optimisticTab]);

  const [engagements, loading, error] = useFireBaseEngagements();
  const [shifts = [], shiftsLoading] = useFireBaseShifts();
  const [jobTypes = [], jobTypesLoading] = useFireBaseJobTypes();
  const [locations = [], locationsLoading] = useFireBaseLocations();
  const [organizations = [], organizationsLoading] = useFireBaseOrganizations();
  const [users = [], usersLoading] = useFireBaseUsers();

  const jobTypesGridApiRef = useGridApiRef();
  const [newJobTypeName, setNewJobTypeName] = useState('');
  const [newJobTypeDescription, setNewJobTypeDescription] = useState('');
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [shiftDrafts, setShiftDrafts] = useState({});
  const [preloadEinsaetzeTab, setPreloadEinsaetzeTab] = useState(false);

  const isLoading =
    loading ||
    shiftsLoading ||
    jobTypesLoading ||
    locationsLoading ||
    organizationsLoading ||
    usersLoading;

  // Einsaetze-Tab nach initialem Laden im Hintergrund vormounten,
  // damit der Wechsel von Schichten zu Einsaetze direkt wirkt.
  useEffect(() => {
    if (isLoading || preloadEinsaetzeTab) return;
    setPreloadEinsaetzeTab(true);
  }, [isLoading, preloadEinsaetzeTab]);

  const userLabelMap = useMemo(() => {
    const map = new Map();
    users.forEach((u) => {
      map.set(u.id, u.name || u.email || u.id);
    });
    return map;
  }, [users]);

  const jobTypeName = (id) =>
    jobTypes.find((jt) => jt.id === id)?.name || 'Nicht zugewiesen';
  const locationName = (id) =>
    locations.find((l) => l.id === id)?.name || 'Nicht zugewiesen';
  const organizationName = (id) =>
    organizations.find((o) => o.id === id)?.name || 'Nicht zugewiesen';

  const sortedShifts = useMemo(() => {
    return [...shifts].sort((a, b) => {
      const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
      const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
      return ta - tb;
    });
  }, [shifts]);

  const engagementsByShift = useMemo(() => {
    const map = new Map();
    sortedShifts.forEach((s) => map.set(s.id, []));
    engagements.forEach((e) => {
      if (e.shift && map.has(e.shift)) map.get(e.shift).push(e);
    });
    return map;
  }, [engagements, sortedShifts]);

  const orphanEngagements = useMemo(() => {
    const shiftIds = new Set(sortedShifts.map((s) => s.id));
    return engagements.filter((e) => !e.shift || !shiftIds.has(e.shift));
  }, [engagements, sortedShifts]);

  const sortedEngagements = useMemo(() => {
    return [...engagements].sort((a, b) => {
      const aShift = shifts.find((s) => s.id === a.shift);
      const bShift = shifts.find((s) => s.id === b.shift);
      const ta = aShift?.startDate ? new Date(aShift.startDate).getTime() : 0;
      const tb = bShift?.startDate ? new Date(bShift.startDate).getTime() : 0;
      return ta - tb;
    });
  }, [engagements, shifts]);

  const shiftById = useMemo(() => {
    const map = new Map();
    shifts.forEach((s) => map.set(s.id, s));
    return map;
  }, [shifts]);

  const getShiftDraft = (shift) =>
    shiftDrafts[shift.id] || {
      name: shift.name || '',
      startDate: formatToDateTimeLocal(shift.startDate),
      endDate: formatToDateTimeLocal(shift.endDate),
    };

  const updateShiftDraft = (shiftId, field, value) => {
    setShiftDrafts((prev) => ({
      ...prev,
      [shiftId]: { ...(prev[shiftId] || {}), [field]: value },
    }));
  };

  const saveShift = async (shift) => {
    const draft = getShiftDraft(shift);
    await updateShift(shift.id, {
      name: draft.name || shift.name || 'Unbenannte Schicht',
      startDate: draft.startDate ? new Date(draft.startDate).toISOString() : shift.startDate,
      endDate: draft.endDate ? new Date(draft.endDate).toISOString() : shift.endDate,
    });
    setEditingShiftId(null);
  };

  const addEngagementToShift = async (shiftId) => {
    const newEngagementId = await addEngagement({
      jobType: '',
      shift: shiftId,
      location: '',
      targetNumberOfHelpers: '1',
      organization: '',
      helpers: [],
    });
    if (newEngagementId) navigate(`/dashboard/engagement/${newEngagementId}`);
  };

  const handleAddEngagement = async () => {
    const defaultShift = sortedShifts[0]?.id ?? '';
    const newEngagementId = await addEngagement({
      jobType: '',
      shift: defaultShift,
      location: '',
      targetNumberOfHelpers: '1',
      organization: '',
      helpers: [],
    });
    if (newEngagementId) navigate(`/dashboard/engagement/${newEngagementId}`);
  };

  const handleAddShift = async () => {
    await addShift({
      name: 'Neue Schicht',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    });
  };

  const submitNewJobType = async (e) => {
    e?.preventDefault?.();
    const name = newJobTypeName.trim();
    if (!name) {
      window.alert('Bitte einen Namen für den Jobtyp eingeben.');
      return;
    }
    const newId = await addJobType({
      name,
      description: newJobTypeDescription.trim(),
    });
    if (!newId) {
      window.alert(
        'Der Jobtyp konnte nicht angelegt werden. Bitte prüfe die Konsole und die Firestore-Berechtigungen.'
      );
      return;
    }
    setNewJobTypeName('');
    setNewJobTypeDescription('');
  };

  const handleDeleteEngagement = async (eng) => {
    if (
      !window.confirm(
        'Diesen Einsatz unwiderruflich löschen? Alle zugehörigen Daten (Anmeldungen, Zuordnung) gehen verloren.'
      )
    ) {
      return;
    }
    await removeEngagement(eng.id);
  };

  const handleProcessJobTypeRowUpdate = async (newRow) => {
    const { id, ...payload } = newRow;
    await updateJobType(id, payload);
    return newRow;
  };

  const jobTypeColumns = useMemo(
    () => [
      { field: 'name', headerName: 'Jobtyp', flex: 1, minWidth: 180, editable: true },
      {
        field: 'description',
        headerName: 'Beschreibung',
        flex: 1.8,
        minWidth: 220,
        editable: true,
        valueGetter: (value) => value ?? '',
      },
      {
        field: 'actions',
        headerName: 'Aktionen',
        width: 120,
        type: 'actions',
        getActions: (params) => [
          <GridActionsCellItem
            key='edit'
            icon={<EditIcon />}
            label='Bearbeiten'
            onClick={() => {
              jobTypesGridApiRef.current?.startCellEditMode({
                id: params.id,
                field: 'name',
              });
            }}
            showInMenu={false}
          />,
          <GridActionsCellItem
            key='del'
            icon={<DeleteIcon />}
            label='Löschen'
            onClick={() => removeJobType(params.id)}
            showInMenu={false}
          />,
        ],
      },
    ],
    [jobTypesGridApiRef]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const goToTab = (index) => {
    // Sofortiges visuelles Feedback, URL folgt direkt danach
    setOptimisticTab(index);
    const slug = index === 0 ? 'schichten' : index === 1 ? 'einsaetze' : 'jobtypen';
    window.requestAnimationFrame(() => {
      navigate(`/dashboard/engagements/${slug}`);
    });
  };

  const relaContainedSx = {
    textTransform: 'none',
    bgcolor: '#6a0c00',
    '&:hover': { bgcolor: '#b71c1c' },
  };
  const relaOutlinedSx = {
    textTransform: 'none',
    color: '#6a0c00',
    borderColor: '#f5bfbe',
    '&:hover': { borderColor: '#6a0c00', bgcolor: 'rgba(245, 191, 190, 0.2)' },
  };
  const relaTextSx = { textTransform: 'none', color: '#6a0c00' };
  const relaFieldSx = {
    '& .MuiInputLabel-root': { color: 'rgba(106, 12, 0, 0.72)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6a0c00' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(106, 12, 0, 0.22)' },
      '&:hover fieldset': { borderColor: 'rgba(106, 12, 0, 0.45)' },
      '&.Mui-focused fieldset': { borderColor: '#6a0c00' },
    },
  };

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
        onChange={(_e, value) => goToTab(value)}
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
        <Tab disableRipple label='Schichten' />
        <Tab disableRipple label='Einsätze' />
        <Tab disableRipple label='Jobtypen' />
      </Tabs>

      {activeTab === 0 && (
        <Stack spacing={2}>
          <Stack direction='row' spacing={1}>
            <Button
              variant='contained'
              size='small'
              startIcon={<AddIcon />}
              onClick={handleAddShift}
              sx={relaContainedSx}
            >
              Neue Schicht
            </Button>
          </Stack>

          {sortedShifts.length === 0 && (
            <Alert severity='info'>
              Noch keine Schichten vorhanden. Erstelle zuerst eine Schicht.
            </Alert>
          )}

          {sortedShifts.map((shift) => {
            const draft = getShiftDraft(shift);
            const list = engagementsByShift.get(shift.id) || [];
            const regCount = list.reduce(
              (sum, e) => sum + (Array.isArray(e.helpers) ? e.helpers.length : 0),
              0
            );
            const targetCount = list.reduce(
              (sum, e) => sum + parseTargetHelpers(e.targetNumberOfHelpers),
              0
            );
            return (
              <Accordion
                key={shift.id}
                expanded
                disableGutters
                elevation={0}
                sx={{
                  border: '1px solid rgba(97, 7, 0, 0.12)',
                  borderRadius: '14px !important',
                  '&:before': { display: 'none' },
                  bgcolor: '#fff',
                }}
              >
                <AccordionSummary
                  sx={{
                    bgcolor: 'rgba(97, 7, 0, 0.035)',
                    px: 2,
                    py: 0.45,
                    borderRadius: '14px',
                  }}
                >
                  <Stack direction='row' justifyContent='space-between' sx={{ width: '100%' }} flexWrap='wrap' useFlexGap>
                    <Box>
                      <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#610700' }}>
                        {shift.name || 'Unbenannte Schicht'}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {formatShiftWindow(shift.startDate, shift.endDate)}
                      </Typography>
                    </Box>
                    <Stack direction='row' spacing={0.75}>
                      <Chip
                        size='small'
                        label={`${list.length} Einsätze`}
                        sx={{ bgcolor: 'rgba(0,0,0,0.06)', color: '#333', fontWeight: 600 }}
                      />
                      <Chip
                        size='small'
                        label={`${regCount} / ${targetCount || 0} Helfende`}
                        sx={{ bgcolor: 'rgba(0,0,0,0.06)', color: '#333', fontWeight: 600 }}
                      />
                    </Stack>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 1.5, px: 2, pb: 2 }}>
                  <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap sx={{ mb: editingShiftId === shift.id ? 1.25 : 1 }}>
                    {editingShiftId === shift.id ? (
                      <>
                        <Button size='small' variant='contained' onClick={() => saveShift(shift)} sx={relaContainedSx}>
                          Speichern
                        </Button>
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() => setEditingShiftId(null)}
                          sx={relaOutlinedSx}
                        >
                          Abbrechen
                        </Button>
                      </>
                    ) : (
                      <Button size='small' variant='outlined' onClick={() => setEditingShiftId(shift.id)} sx={relaOutlinedSx}>
                        Schicht bearbeiten
                      </Button>
                    )}
                    <Button
                      size='small'
                      variant='outlined'
                      color='error'
                      startIcon={<DeleteIcon />}
                      onClick={() => removeShift(shift.id)}
                      sx={{ ...relaOutlinedSx, color: '#b71c1c', borderColor: 'rgba(183, 28, 28, 0.35)' }}
                    >
                      Schicht löschen
                    </Button>
                    <Button size='small' variant='outlined' startIcon={<AddIcon />} onClick={() => addEngagementToShift(shift.id)} sx={relaOutlinedSx}>
                      Einsatz in Schicht hinzufügen
                    </Button>
                  </Stack>

                  {editingShiftId === shift.id && (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.5 }}>
                      <TextField
                        size='small'
                        label='Name'
                        value={draft.name}
                        onChange={(e) => updateShiftDraft(shift.id, 'name', e.target.value)}
                        sx={{ ...relaFieldSx, minWidth: 220, flex: 1 }}
                      />
                      <TextField
                        size='small'
                        type='datetime-local'
                        label='Beginn'
                        InputLabelProps={{ shrink: true }}
                        value={draft.startDate}
                        onChange={(e) => updateShiftDraft(shift.id, 'startDate', e.target.value)}
                        sx={{ ...relaFieldSx, minWidth: 220 }}
                      />
                      <TextField
                        size='small'
                        type='datetime-local'
                        label='Ende'
                        InputLabelProps={{ shrink: true }}
                        value={draft.endDate}
                        onChange={(e) => updateShiftDraft(shift.id, 'endDate', e.target.value)}
                        sx={{ ...relaFieldSx, minWidth: 220 }}
                      />
                    </Stack>
                  )}

                  {list.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                      Noch keine Einsätze in dieser Schicht.
                    </Typography>
                  ) : (
                    <Stack spacing={1.25}>
                      {list.map((eng) => {
                        const helpers = Array.isArray(eng.helpers) ? eng.helpers : [];
                        const target = parseTargetHelpers(eng.targetNumberOfHelpers);
                        const percent = target > 0 ? Math.min(Math.round((helpers.length / target) * 100), 100) : 0;
                        const openSlots = Math.max(target - helpers.length, 0);
                        return (
                          <Box
                            key={eng.id}
                            sx={{
                              p: 1.2,
                              border: '1px solid rgba(245, 191, 190, 0.75)',
                              borderRadius: '14px',
                              bgcolor: '#fff',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                borderColor: 'rgba(106, 12, 0, 0.25)',
                                boxShadow: '0 4px 14px rgba(37, 13, 10, 0.06)',
                              },
                            }}
                          >
                            <Stack
                              direction='row'
                              justifyContent='space-between'
                              alignItems='flex-start'
                              spacing={1}
                              sx={{ mb: 0.55 }}
                            >
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                  variant='subtitle1'
                                  sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #6a0c00 0%, #b71c1c 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    lineHeight: 1.15,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {jobTypeName(eng.jobType)}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.88rem',
                                    lineHeight: 1.3,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {locationName(eng.location)}
                                  {eng.organization ? ` · ${organizationName(eng.organization)}` : ''}
                                </Typography>
                              </Box>
                              <Chip
                                size='small'
                                label={`${helpers.length}/${target}`}
                                sx={{
                                  height: 22,
                                  borderRadius: 999,
                                  bgcolor: 'rgba(97, 7, 0, 0.08)',
                                  color: '#610700',
                                  fontWeight: 700,
                                  '& .MuiChip-label': { px: 0.9, fontSize: '0.72rem' },
                                }}
                              />
                            </Stack>

                            <Box sx={{ mb: 0.7 }} />

                            <Box
                              sx={{
                                mt: 0.2,
                                p: 0.75,
                                borderRadius: '12px',
                                border: '1px solid rgba(106, 12, 0, 0.08)',
                                bgcolor: 'rgba(245, 191, 190, 0.12)',
                              }}
                            >
                              <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 0.45 }}>
                                <Typography sx={{ color: '#610700', fontWeight: 700, fontSize: '0.84rem' }}>
                                  Auslastung
                                </Typography>
                                <Typography
                                  sx={{
                                    color: '#610700',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    px: 0.75,
                                    py: 0.05,
                                    borderRadius: 99,
                                    bgcolor: '#fff',
                                    border: '1px solid rgba(97, 7, 0, 0.08)',
                                  }}
                                >
                                  {percent}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant='determinate'
                                value={percent}
                                sx={{
                                  height: 6,
                                  borderRadius: 999,
                                  bgcolor: 'rgba(255,255,255,0.92)',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 999,
                                    background: 'linear-gradient(90deg, #8b2018 0%, #b33b2d 100%)',
                                  },
                                }}
                              />
                              <Stack direction='row' spacing={0.5} sx={{ mt: 0.6 }} useFlexGap flexWrap='wrap'>
                                <Chip
                                  size='small'
                                  label={`Ziel ${target}`}
                                  sx={{
                                    height: 20,
                                    borderRadius: 999,
                                    bgcolor: '#fff',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    color: '#444',
                                    '& .MuiChip-label': { px: 0.7, fontSize: '0.68rem' },
                                  }}
                                />
                                <Chip
                                  size='small'
                                  label={`Eingeschrieben ${helpers.length}`}
                                  sx={{
                                    height: 20,
                                    borderRadius: 999,
                                    bgcolor: '#fff',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    color: '#444',
                                    '& .MuiChip-label': { px: 0.7, fontSize: '0.68rem' },
                                  }}
                                />
                                <Chip
                                  size='small'
                                  label={`Offen ${openSlots}`}
                                  sx={{
                                    height: 20,
                                    borderRadius: 999,
                                    bgcolor: '#fff',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    color: '#9a4d00',
                                    fontWeight: 700,
                                    '& .MuiChip-label': { px: 0.7, fontSize: '0.68rem' },
                                  }}
                                />
                              </Stack>
                            </Box>

                            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mt: 0.7, mb: 0.25 }}>
                              <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
                                Personen im Einsatz
                              </Typography>
                              <Chip
                                size='small'
                                label={`${helpers.length} Person${helpers.length === 1 ? '' : 'en'}`}
                                sx={{
                                  height: 18,
                                  borderRadius: 999,
                                  bgcolor: 'rgba(0,0,0,0.045)',
                                  color: 'text.secondary',
                                  fontWeight: 600,
                                  '& .MuiChip-label': { px: 0.7, fontSize: '0.68rem' },
                                }}
                              />
                            </Stack>
                            {helpers.length === 0 ? (
                              <Typography variant='body2' color='text.secondary'>
                                Noch niemand angemeldet.
                              </Typography>
                            ) : (
                              <Stack direction='row' spacing={0.5} flexWrap='wrap' useFlexGap>
                                {helpers.map((uid) => {
                                  const helperName = userLabelMap.get(uid) || uid;
                                  const initials = helperName
                                    .split(' ')
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map((part) => part[0])
                                    .join('')
                                    .toUpperCase();

                                  return (
                                    <Box
                                      key={uid}
                                      sx={{
                                        height: 24,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        borderRadius: 999,
                                        bgcolor: 'rgba(0,0,0,0.03)',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        pl: 0.6,
                                        pr: 0.2,
                                        maxWidth: 180,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: 16,
                                          height: 16,
                                          borderRadius: '50%',
                                          bgcolor: 'rgba(0,0,0,0.11)',
                                          color: '#4a4a4a',
                                          fontSize: '0.58rem',
                                          fontWeight: 700,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                          mr: 0.45,
                                        }}
                                      >
                                        {initials || '?'}
                                      </Box>
                                      <Typography
                                        sx={{
                                          fontSize: '0.75rem',
                                          color: '#3f3f3f',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          minWidth: 0,
                                          mr: 0.1,
                                        }}
                                      >
                                        {helperName}
                                      </Typography>
                                      <IconButton
                                        size='small'
                                        onClick={() =>
                                          updateEngagement(eng.id, {
                                            helpers: helpers.filter((helperId) => helperId !== uid),
                                          })
                                        }
                                        sx={{
                                          p: 0.2,
                                          color: 'rgba(106, 12, 0, 0.55)',
                                          '&:hover': { color: '#b71c1c', bgcolor: 'transparent' },
                                        }}
                                      >
                                        <CloseRoundedIcon sx={{ fontSize: '0.95rem' }} />
                                      </IconButton>
                                    </Box>
                                  );
                                })}
                              </Stack>
                            )}

                            <Stack direction='row' flexWrap='wrap' useFlexGap spacing={1} sx={{ mt: 0.75 }}>
                              <Button
                                size='small'
                                variant='text'
                                color='error'
                                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                                onClick={() => updateEngagement(eng.id, { shift: '' })}
                                sx={{
                                  ...relaTextSx,
                                  color: '#b71c1c',
                                  fontSize: '0.72rem',
                                  lineHeight: 1.2,
                                  py: 0.2,
                                  px: 0.3,
                                  minHeight: 24,
                                  '& .MuiButton-startIcon': { mr: 0.35, ml: -0.25 },
                                }}
                              >
                                Einsatz löschen
                              </Button>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}

        </Stack>
      )}

      {(activeTab === 1 || preloadEinsaetzeTab) && (
        <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <Stack spacing={1.5}>
          <Stack direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap' useFlexGap spacing={1}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: '#6a0c00' }}>
              Einsätze
            </Typography>
            <Button variant='contained' size='small' startIcon={<AddIcon />} onClick={handleAddEngagement} sx={relaContainedSx}>
              Neuer Einsatz
            </Button>
          </Stack>

          {orphanEngagements.length > 0 && (
            <Alert severity='warning'>
              {orphanEngagements.length} Einsatz
              {orphanEngagements.length === 1 ? '' : 'e'} ohne gültige Schicht. Bitte
              einer Schicht zuweisen.
            </Alert>
          )}

          {sortedEngagements.length === 0 && (
            <Alert severity='info'>
              Noch keine Einsätze vorhanden. Mit „Neuer Einsatz“ kannst du den
              ersten Einsatz erstellen.
            </Alert>
          )}

          <Stack spacing={1.5}>
            {sortedEngagements.map((eng) => {
              const helpers = Array.isArray(eng.helpers) ? eng.helpers : [];
              const shift = shiftById.get(eng.shift);
              return (
                <Accordion
                  key={eng.id}
                  expanded
                  TransitionProps={{ timeout: 0 }}
                  disableGutters
                  elevation={0}
                  sx={{
                    border: '1px solid rgba(245, 191, 190, 0.75)',
                    borderRadius: '14px !important',
                    '&:before': { display: 'none' },
                    bgcolor: '#fff',
                  }}
                >
                  <AccordionSummary
                    sx={{
                      bgcolor: 'rgba(97, 7, 0, 0.035)',
                      px: 2,
                      py: 0.45,
                      borderRadius: '14px',
                    }}
                  >
                    <Stack direction='row' justifyContent='space-between' sx={{ width: '100%' }} flexWrap='wrap' useFlexGap spacing={1}>
                      <Box>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #6a0c00 0%, #b71c1c 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {jobTypeName(eng.jobType)}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatShiftWindow(shift?.startDate, shift?.endDate)}
                        </Typography>
                      </Box>
                      <Chip size='small' label={`${helpers.length} Helfende`} />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0.5 }}>
                    <Stack
                      direction='row'
                      justifyContent='flex-end'
                      alignItems='center'
                      flexWrap='wrap'
                      useFlexGap
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <Button size='small' variant='text' onClick={() => navigate(`/dashboard/engagement/${eng.id}`)} sx={relaTextSx}>
                        Detail bearbeiten
                      </Button>
                      <Button
                        size='small'
                        variant='outlined'
                        color='error'
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteEngagement(eng)}
                        sx={{
                          ...relaOutlinedSx,
                          color: '#b71c1c',
                          borderColor: 'rgba(183, 28, 28, 0.35)',
                        }}
                      >
                        Einsatz löschen
                      </Button>
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.1 }}>
                      <FormControl size='small' sx={{ ...relaFieldSx, minWidth: 180 }}>
                        <InputLabel>Jobtyp</InputLabel>
                        <Select
                          label='Jobtyp'
                          value={eng.jobType || ''}
                          onChange={(e) => updateEngagement(eng.id, { jobType: e.target.value })}
                        >
                          <MenuItem value=''>Nicht zugewiesen</MenuItem>
                          {jobTypes.map((jt) => (
                            <MenuItem key={jt.id} value={jt.id}>
                              {jt.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size='small' sx={{ ...relaFieldSx, minWidth: 180 }}>
                        <InputLabel>Schicht</InputLabel>
                        <Select
                          label='Schicht'
                          value={eng.shift || ''}
                          onChange={(e) => updateEngagement(eng.id, { shift: e.target.value })}
                        >
                          <MenuItem value=''>Nicht zugewiesen</MenuItem>
                          {sortedShifts.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size='small' sx={{ ...relaFieldSx, minWidth: 180 }}>
                        <InputLabel>Ort</InputLabel>
                        <Select
                          label='Ort'
                          value={eng.location || ''}
                          onChange={(e) => updateEngagement(eng.id, { location: e.target.value })}
                        >
                          <MenuItem value=''>Nicht zugewiesen</MenuItem>
                          {locations.map((loc) => (
                            <MenuItem key={loc.id} value={loc.id}>
                              {loc.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size='small' sx={{ ...relaFieldSx, minWidth: 200 }}>
                        <InputLabel>Organisation</InputLabel>
                        <Select
                          label='Organisation'
                          value={eng.organization || ''}
                          onChange={(e) => updateEngagement(eng.id, { organization: e.target.value })}
                        >
                          <MenuItem value=''>Nicht zugewiesen</MenuItem>
                          {organizations.map((org) => (
                            <MenuItem key={org.id} value={org.id}>
                              {org.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
                      Helfende ({helpers.length} / {parseTargetHelpers(eng.targetNumberOfHelpers)})
                    </Typography>
                    <Stack direction='row' spacing={0.75} flexWrap='wrap' useFlexGap sx={{ mt: 0.5, mb: 1 }}>
                      {helpers.length === 0 ? (
                        <Typography variant='body2' color='text.secondary'>
                          Noch niemand angemeldet.
                        </Typography>
                      ) : (
                        helpers.map((uid) => (
                          <Chip
                            key={uid}
                            size='small'
                            label={userLabelMap.get(uid) || uid}
                            sx={{
                              height: 22,
                              borderRadius: 999,
                              bgcolor: 'rgba(0,0,0,0.03)',
                              border: '1px solid rgba(0,0,0,0.08)',
                              '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' },
                            }}
                          />
                        ))
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </Stack>
        </Box>
      )}

      {activeTab === 2 && (
        <Stack spacing={1.5}>
          <Stack direction='row' justifyContent='space-between' alignItems='center' flexWrap='wrap' useFlexGap spacing={1}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: '#6a0c00' }}>
              Jobtypen
            </Typography>
            <Button
              form='jobtype-create-form'
              type='submit'
              variant='contained'
              size='small'
              startIcon={<AddIcon />}
              sx={relaContainedSx}
            >
              Jobtyp anlegen
            </Button>
          </Stack>

          {jobTypes.length === 0 && (
            <Alert severity='info'>
              Noch keine Jobtypen. Namen und optional Beschreibung eintragen, dann „Jobtyp anlegen“.
            </Alert>
          )}

          <Stack
            component='form'
            id='jobtype-create-form'
            onSubmit={submitNewJobType}
            spacing={1.25}
            sx={{
              p: 1.25,
              border: '1px solid rgba(106, 12, 0, 0.12)',
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.96)',
            }}
          >
            <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>
              Neuen Jobtyp anlegen
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'flex-end' }} flexWrap='wrap' useFlexGap>
              <TextField
                size='small'
                label='Name'
                required
                value={newJobTypeName}
                onChange={(e) => setNewJobTypeName(e.target.value)}
                sx={{ ...relaFieldSx, minWidth: 200, flex: '1 1 160px' }}
              />
              <TextField
                size='small'
                label='Beschreibung'
                value={newJobTypeDescription}
                onChange={(e) => setNewJobTypeDescription(e.target.value)}
                sx={{ ...relaFieldSx, minWidth: 220, flex: '2 1 200px' }}
              />
            </Stack>
            <Typography variant='body2' color='text.secondary'>
              In der Liste unten per Doppelklick oder „Bearbeiten“ Name und Beschreibung anpassen.
            </Typography>
          </Stack>

          <Box
            sx={{
              borderRadius: 2,
              border: '1px solid rgba(106, 12, 0, 0.12)',
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.96)',
            }}
          >
            <div style={{ height: 420, width: '100%' }}>
              <DataGrid
                apiRef={jobTypesGridApiRef}
                rows={jobTypes}
                columns={jobTypeColumns}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                  sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
                }}
                pageSizeOptions={[5, 10, 25]}
                processRowUpdate={handleProcessJobTypeRowUpdate}
                disableRowSelectionOnClick
                editMode='cell'
                sx={{
                  border: 'none',
                  borderRadius: 0,
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'rgba(106, 12, 0, 0.06)',
                    color: '#6a0c00',
                    fontWeight: 700,
                    borderBottom: '1px solid rgba(106, 12, 0, 0.12)',
                  },
                  '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: 'rgba(245, 191, 190, 0.06)',
                  },
                  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                    outline: '1px solid rgba(106, 12, 0, 0.5)',
                  },
                  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                    outline: '1px solid rgba(106, 12, 0, 0.5)',
                  },
                  '& .MuiDataGrid-row.Mui-selected': {
                    backgroundColor: 'rgba(245, 191, 190, 0.22)',
                  },
                  '& .MuiDataGrid-row.Mui-selected:hover': {
                    backgroundColor: 'rgba(245, 191, 190, 0.3)',
                  },
                }}
              />
            </div>
          </Box>
        </Stack>
      )}
    </WhiteCard>
  );
};

export default DashboardEngagements;

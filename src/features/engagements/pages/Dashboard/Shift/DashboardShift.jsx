import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button as MuiButton,
  Box,
  Chip,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addShift,
  removeShift,
  updateShift,
  useFireBaseShifts,
} from '../../../hooks/useFireBaseShifts';
import { useFireBaseEngagements } from '../../../hooks/useFireBaseEngagements';
import { useFireBaseJobTypes } from '../../../hooks/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../../hooks/useFireBaseLocations';
import { useFireBaseOrganizations } from '../../../hooks/useFireBaseOrganizations';
import { useFireBaseUsers } from '../../../../../hooks/useFireBaseUsers';
import WhiteCard from '../../../../../components/ui/WhiteCard';

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

const parseFromDateTimeLocal = (dateValue) =>
  dateValue ? new Date(dateValue).toISOString() : '';

const ShiftRosterOverview = ({
  shifts,
  engagements,
  users,
  jobTypes,
  locations,
  organizations,
  onAddShift,
}) => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState({});
  const [editingShiftId, setEditingShiftId] = useState(null);

  const userLabel = useMemo(() => {
    const map = new Map();
    (users || []).forEach((u) => {
      const label =
        (u.name && String(u.name).trim()) ||
        (u.email && String(u.email).trim()) ||
        `ID ${String(u.id).slice(0, 8)}…`;
      map.set(u.id, label);
    });
    return map;
  }, [users]);

  const jobTypeName = (id) =>
    jobTypes?.find((j) => j.id === id)?.name || '—';
  const locationName = (id) =>
    locations?.find((l) => l.id === id)?.name || '—';
  const organizationName = (id) =>
    organizations?.find((o) => o.id === id)?.name || '—';

  const shiftIds = useMemo(
    () => new Set((shifts || []).map((s) => s.id)),
    [shifts]
  );

  const sortedShifts = useMemo(() => {
    return [...(shifts || [])].sort((a, b) => {
      const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
      const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
      return ta - tb;
    });
  }, [shifts]);

  const engagementsByShift = useMemo(() => {
    const map = new Map();
    sortedShifts.forEach((s) => map.set(s.id, []));
    (engagements || []).forEach((e) => {
      if (e.shift && map.has(e.shift)) {
        map.get(e.shift).push(e);
      }
    });
    return map;
  }, [engagements, sortedShifts]);

  const orphanEngagements = useMemo(() => {
    return (engagements || []).filter(
      (e) => !e.shift || !shiftIds.has(e.shift)
    );
  }, [engagements, shiftIds]);

  const shiftStats = (shiftId) => {
    const list = engagementsByShift.get(shiftId) || [];
    let registered = 0;
    let target = 0;
    list.forEach((e) => {
      const h = Array.isArray(e.helpers) ? e.helpers.length : 0;
      registered += h;
      target += parseTargetHelpers(e.targetNumberOfHelpers);
    });
    return { list, registered, target, count: list.length };
  };

  const getDraftForShift = (shift) =>
    drafts[shift.id] || {
      name: shift.name || '',
      startDate: formatToDateTimeLocal(shift.startDate),
      endDate: formatToDateTimeLocal(shift.endDate),
    };

  const updateDraftField = (shiftId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [shiftId]: {
        ...(prev[shiftId] || {}),
        [field]: value,
      },
    }));
  };

  const resetDraft = (shift) => {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[shift.id];
      return next;
    });
  };

  const saveShift = async (shift) => {
    const draft = getDraftForShift(shift);
    await updateShift(shift.id, {
      name: draft.name || shift.name || 'Unbenannte Schicht',
      startDate: parseFromDateTimeLocal(draft.startDate) || shift.startDate || '',
      endDate: parseFromDateTimeLocal(draft.endDate) || shift.endDate || '',
    });
    resetDraft(shift);
    setEditingShiftId(null);
  };

  if (!sortedShifts.length) {
    return (
      <Stack spacing={1.5} sx={{ mb: 2 }}>
        <Alert severity='info'>
          Noch keine Schichten angelegt. Erstelle zuerst eine Schicht.
        </Alert>
        <MuiButton
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          onClick={onAddShift}
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'none',
            bgcolor: '#6a0c00',
            '&:hover': { bgcolor: '#b71c1c' },
          }}
        >
          Neue Schicht
        </MuiButton>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ mb: 2.5 }}>
      <Box>
        <MuiButton
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          onClick={onAddShift}
          sx={{
            textTransform: 'none',
            bgcolor: '#6a0c00',
            '&:hover': { bgcolor: '#b71c1c' },
          }}
        >
          Neue Schicht
        </MuiButton>
      </Box>
      {sortedShifts.map((shift, index) => {
        const { list, registered, target, count } = shiftStats(shift.id);
        const draft = getDraftForShift(shift);
        const fillPct =
          target > 0 ? Math.min(100, Math.round((registered / target) * 100)) : 0;
        const barColor =
          registered >= target
            ? 'success'
            : registered > 0
              ? 'warning'
              : 'inherit';

        return (
          <Accordion
            key={shift.id}
            disableGutters
            elevation={0}
            defaultExpanded={index === 0}
            sx={{
              border: '1px solid rgba(106, 12, 0, 0.12)',
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              overflow: 'hidden',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#6a0c00' }} />}
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: 'rgba(106, 12, 0, 0.04)',
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.25,
                },
              }}
            >
              <Box sx={{ minWidth: 0, pr: 1 }}>
                <Typography
                  variant='subtitle1'
                  sx={{ fontWeight: 700, color: '#6a0c00' }}
                >
                  {shift.name || 'Unbenannte Schicht'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {formatShiftWindow(shift.startDate, shift.endDate)}
                </Typography>
              </Box>
              <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                <Chip
                  size='small'
                  label={`${count} Einsatz${count === 1 ? '' : 'e'}`}
                  variant='outlined'
                />
                <Chip
                  size='small'
                  color={registered >= target ? 'success' : 'default'}
                  label={`${registered} / ${target} Helfende`}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2.25, pt: 0.5 }}>
              <Box sx={{ mb: 2.25 }}>
                <Stack
                  direction='row'
                  spacing={1}
                  flexWrap='wrap'
                  useFlexGap
                  sx={{ mb: editingShiftId === shift.id ? 1.5 : 0.25 }}
                >
                  {editingShiftId === shift.id ? (
                    <>
                      <MuiButton
                        variant='contained'
                        size='small'
                        onClick={() => saveShift(shift)}
                        sx={{
                          textTransform: 'none',
                          bgcolor: '#6a0c00',
                          '&:hover': { bgcolor: '#b71c1c' },
                        }}
                      >
                        Speichern
                      </MuiButton>
                      <MuiButton
                        variant='outlined'
                        size='small'
                        onClick={() => {
                          resetDraft(shift);
                          setEditingShiftId(null);
                        }}
                        sx={{
                          textTransform: 'none',
                          color: '#6a0c00',
                          borderColor: '#f5bfbe',
                          '&:hover': {
                            borderColor: '#6a0c00',
                            bgcolor: 'rgba(245, 191, 190, 0.2)',
                          },
                        }}
                      >
                        Abbrechen
                      </MuiButton>
                    </>
                  ) : (
                    <MuiButton
                      variant='outlined'
                      size='small'
                      onClick={() => setEditingShiftId(shift.id)}
                      sx={{
                        textTransform: 'none',
                        color: '#6a0c00',
                        borderColor: '#f5bfbe',
                        '&:hover': {
                          borderColor: '#6a0c00',
                          bgcolor: 'rgba(245, 191, 190, 0.2)',
                        },
                      }}
                    >
                      Schicht bearbeiten
                    </MuiButton>
                  )}
                  <MuiButton
                    variant='text'
                    size='small'
                    color='error'
                    startIcon={<DeleteIcon />}
                    onClick={() => removeShift(shift.id)}
                    sx={{ textTransform: 'none' }}
                  >
                    Schicht löschen
                  </MuiButton>
                </Stack>

                {editingShiftId === shift.id && (
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
                    <TextField
                      size='small'
                      label='Name'
                      value={draft.name}
                      onChange={(e) =>
                        updateDraftField(shift.id, 'name', e.target.value)
                      }
                      sx={{ minWidth: 220, flex: 1 }}
                    />
                    <TextField
                      size='small'
                      type='datetime-local'
                      label='Beginn'
                      InputLabelProps={{ shrink: true }}
                      value={draft.startDate}
                      onChange={(e) =>
                        updateDraftField(shift.id, 'startDate', e.target.value)
                      }
                      sx={{ minWidth: 220 }}
                    />
                    <TextField
                      size='small'
                      type='datetime-local'
                      label='Ende'
                      InputLabelProps={{ shrink: true }}
                      value={draft.endDate}
                      onChange={(e) =>
                        updateDraftField(shift.id, 'endDate', e.target.value)
                      }
                      sx={{ minWidth: 220 }}
                    />
                  </Stack>
                )}
              </Box>

              {target > 0 && (
                <Box sx={{ mb: 2.25 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Gesamtauslastung aller Einsätze in dieser Schicht
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={fillPct}
                    color={barColor === 'inherit' ? 'primary' : barColor}
                    sx={{
                      mt: 0.5,
                      height: 8,
                      borderRadius: 1,
                      bgcolor: 'rgba(0,0,0,0.06)',
                    }}
                  />
                </Box>
              )}

              {!list.length && (
                <Typography variant='body2' color='text.secondary'>
                  Zu dieser Schicht gibt es noch keine Einsätze (siehe
                  Engagements).
                </Typography>
              )}

              <Stack spacing={1.5}>
                {list.map((eng) => {
                  const helpers = Array.isArray(eng.helpers) ? eng.helpers : [];
                  const tgt = parseTargetHelpers(eng.targetNumberOfHelpers);
                  const engFill = Math.min(
                    100,
                    tgt > 0 ? Math.round((helpers.length / tgt) * 100) : 0
                  );

                  return (
                    <Box
                      key={eng.id}
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.08)',
                        bgcolor: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      <Stack
                        direction='row'
                        alignItems='flex-start'
                        justifyContent='space-between'
                        gap={1}
                        flexWrap='wrap'
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant='subtitle2' fontWeight={600}>
                            {jobTypeName(eng.jobType)}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {locationName(eng.location)}
                            {eng.organization
                              ? ` · ${organizationName(eng.organization)}`
                              : ''}
                          </Typography>
                        </Box>
                        <Chip
                          size='small'
                          icon={<EditOutlinedIcon />}
                          label='Bearbeiten'
                          onClick={() =>
                            navigate(`/dashboard/engagement/${eng.id}`)
                          }
                          sx={{ cursor: 'pointer' }}
                          variant='outlined'
                        />
                      </Stack>

                      <Stack
                        direction='row'
                        alignItems='center'
                        spacing={1}
                        sx={{ mt: 1.25 }}
                        flexWrap='wrap'
                        useFlexGap
                      >
                        <Typography variant='caption' color='text.secondary'>
                          Ziel {tgt} · angemeldet {helpers.length}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant='determinate'
                        value={engFill}
                        sx={{
                          mt: 0.75,
                          height: 6,
                          borderRadius: 1,
                          maxWidth: 320,
                          bgcolor: 'rgba(0,0,0,0.06)',
                        }}
                        color={
                          helpers.length >= tgt ? 'success' : 'primary'
                        }
                      />

                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ display: 'block', mt: 1.25, mb: 0.5 }}
                      >
                        Helfende
                      </Typography>
                      {helpers.length === 0 ? (
                        <Typography variant='body2' color='text.secondary'>
                          Noch niemand angemeldet.
                        </Typography>
                      ) : (
                        <Stack
                          direction='row'
                          flexWrap='wrap'
                          useFlexGap
                          spacing={0.75}
                          sx={{ gap: 0.75 }}
                        >
                          {helpers.map((uid) => (
                            <Chip
                              key={uid}
                              size='small'
                              label={userLabel.get(uid) || uid}
                              sx={{
                                bgcolor: 'rgba(245, 191, 190, 0.35)',
                                border: '1px solid rgba(106, 12, 0, 0.15)',
                              }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {orphanEngagements.length > 0 && (
        <Alert severity='warning'>
          {orphanEngagements.length} Einsatz
          {orphanEngagements.length === 1 ? '' : 'e'} ohne gültige oder
          fehlende Schicht-Zuweisung. Bitte in den Engagements zuordnen.
        </Alert>
      )}
    </Stack>
  );
};

const DashboardShift = () => {
  const [shifts, loading, error] = useFireBaseShifts();
  const [engagements, engLoading, engError] = useFireBaseEngagements();
  const [users, usersLoading] = useFireBaseUsers();
  const [jobTypes, jobTypesLoading] = useFireBaseJobTypes();
  const [locations, locationsLoading] = useFireBaseLocations();
  const [organizations, organizationsLoading] = useFireBaseOrganizations();

  const handleAddShift = async () => {
    await addShift({
      name: 'New Shift',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    });
  };

  const overviewLoading =
    loading ||
    engLoading ||
    usersLoading ||
    jobTypesLoading ||
    locationsLoading ||
    organizationsLoading;

  if (overviewLoading) return <div>Loading...</div>;
  if (error || engError)
    return <div>Fehler beim Laden (Schichten oder Einsätze).</div>;

  return (
    <div style={{ width: '100%' }}>
      <WhiteCard className='p-3'>
        <Typography variant='h5' sx={{ fontWeight: 700, color: '#6a0c00', mb: 0.5 }}>
          Schichten & Helfende
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Übersicht und Verwaltung in einem: Schichten direkt in jeder Karte
          bearbeiten, löschen und neu anlegen. Einsätze über
          &quot;Bearbeiten&quot; anpassen.
        </Typography>
        <ShiftRosterOverview
          shifts={shifts}
          engagements={engagements}
          users={users}
          jobTypes={jobTypes}
          locations={locations}
          organizations={organizations}
          onAddShift={handleAddShift}
        />
      </WhiteCard>
    </div>
  );
};

export default DashboardShift;

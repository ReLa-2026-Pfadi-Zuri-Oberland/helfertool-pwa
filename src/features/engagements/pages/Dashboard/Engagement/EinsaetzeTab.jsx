import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addEngagement,
  removeEngagement,
  updateEngagement,
} from '../../../hooks/useFireBaseEngagements';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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

const EinsaetzeTab = ({
  shifts,
  engagements,
  jobTypes,
  locations,
  organizations,
  users,
}) => {
  const navigate = useNavigate();

  const userLabelMap = useMemo(() => {
    const map = new Map();
    users.forEach((u) => {
      map.set(u.id, u.name || u.email || u.id);
    });
    return map;
  }, [users]);

  const jobTypeName = (id) =>
    jobTypes.find((jt) => jt.id === id)?.name || 'Nicht zugewiesen';

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

  const handleDeleteEngagement = async (eng) => {
    if (
      !window.confirm(
        'Diesen Einsatz unwiderruflich löschen? Alle zugehörigen Daten (Anmeldungen, Zuordnung) gehen verloren.',
      )
    ) {
      return;
    }
    await removeEngagement(eng.id);
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
    <Stack spacing={1.5}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        flexWrap='wrap'
        useFlexGap
        spacing={1}
      >
        <Typography variant='h6' sx={{ fontWeight: 700, color: '#6a0c00' }}>
          Einsätze
        </Typography>
        <Button
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleAddEngagement}
          sx={relaContainedSx}
        >
          Neuer Einsatz
        </Button>
      </Stack>

      {orphanEngagements.length > 0 && (
        <Alert severity='warning'>
          {orphanEngagements.length} Einsatz
          {orphanEngagements.length === 1 ? '' : 'e'} ohne gültige Schicht.
          Bitte einer Schicht zuweisen.
        </Alert>
      )}

      {sortedEngagements.length === 0 && (
        <Alert severity='info'>
          Noch keine Einsätze vorhanden. Mit „Neuer Einsatz" kannst du den
          ersten Einsatz erstellen.
        </Alert>
      )}

      <Stack spacing={1.5}>
        {sortedEngagements.map((eng) => {
          const helpers = Array.isArray(eng.helpers) ? eng.helpers : [];
          const shift = shiftById.get(eng.shift);
          return (
            <Accordion
              key={`all-eng-${eng.id}`}
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
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ width: '100%' }}
                  flexWrap='wrap'
                  useFlexGap
                  spacing={1}
                >
                  <div>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        fontWeight: 800,
                        background:
                          'linear-gradient(135deg, #6a0c00 0%, #b71c1c 100%)',
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
                  </div>
                  <Chip size='small' label={`${helpers.length} Helfende`} />
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0.5 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  sx={{ mb: 1.1 }}
                >
                  <FormControl
                    size='small'
                    sx={{ ...relaFieldSx, minWidth: 180 }}
                  >
                    <InputLabel>Jobtyp</InputLabel>
                    <Select
                      label='Jobtyp'
                      value={eng.jobType || ''}
                      onChange={(e) =>
                        updateEngagement(eng.id, {
                          jobType: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=''>Nicht zugewiesen</MenuItem>
                      {jobTypes.map((jt) => (
                        <MenuItem key={jt.id} value={jt.id}>
                          {jt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    size='small'
                    sx={{ ...relaFieldSx, minWidth: 180 }}
                  >
                    <InputLabel>Schicht</InputLabel>
                    <Select
                      label='Schicht'
                      value={eng.shift || ''}
                      onChange={(e) =>
                        updateEngagement(eng.id, {
                          shift: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=''>Nicht zugewiesen</MenuItem>
                      {sortedShifts.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    size='small'
                    sx={{ ...relaFieldSx, minWidth: 180 }}
                  >
                    <InputLabel>Ort</InputLabel>
                    <Select
                      label='Ort'
                      value={eng.location || ''}
                      onChange={(e) =>
                        updateEngagement(eng.id, {
                          location: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=''>Nicht zugewiesen</MenuItem>
                      {locations.map((loc) => (
                        <MenuItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    size='small'
                    sx={{ ...relaFieldSx, minWidth: 200 }}
                  >
                    <InputLabel>Organisation</InputLabel>
                    <Select
                      label='Organisation'
                      value={eng.organization || ''}
                      onChange={(e) =>
                        updateEngagement(eng.id, {
                          organization: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=''>Nicht zugewiesen</MenuItem>
                      {organizations.map((org) => (
                        <MenuItem key={org.id} value={org.id}>
                          {org.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    size='small'
                    type='number'
                    label='Anzahl Helfende'
                    value={eng.targetNumberOfHelpers || '1'}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const numValue = Number.parseInt(newValue, 10);
                      if (
                        newValue === '' ||
                        (Number.isFinite(numValue) && numValue > 0)
                      ) {
                        updateEngagement(eng.id, {
                          targetNumberOfHelpers: newValue || '1',
                        });
                      }
                    }}
                    inputProps={{
                      min: 1,
                      step: 1,
                    }}
                    sx={{ ...relaFieldSx, minWidth: 140 }}
                  />
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

                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ fontWeight: 600 }}
                >
                  Helfende ({helpers.length} /{' '}
                  {parseTargetHelpers(eng.targetNumberOfHelpers)})
                </Typography>
                <Stack
                  direction='row'
                  spacing={0.75}
                  flexWrap='wrap'
                  useFlexGap
                  sx={{ mt: 0.5, mb: 1 }}
                >
                  {helpers.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                      Noch niemand angemeldet.
                    </Typography>
                  ) : (
                    helpers.map((uid) => (
                      <Chip
                        key={`all-eng-${eng.id}-helper-${uid}`}
                        size='small'
                        label={userLabelMap.get(uid) || uid}
                        sx={{
                          height: 22,
                          borderRadius: 999,
                          bgcolor: 'rgba(0,0,0,0.03)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          '& .MuiChip-label': {
                            px: 0.75,
                            fontSize: '0.7rem',
                          },
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
  );
};

export default EinsaetzeTab;

// Made with Bob

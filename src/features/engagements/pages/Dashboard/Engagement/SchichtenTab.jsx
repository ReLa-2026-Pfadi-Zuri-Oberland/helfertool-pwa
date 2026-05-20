import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addEngagement,
  updateEngagement,
} from '../../../hooks/useFireBaseEngagements';
import {
  addShift,
  removeShift,
  updateShift,
} from '../../../hooks/useFireBaseShifts';

import AddIcon from '@mui/icons-material/Add';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteIcon from '@mui/icons-material/Delete';

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

const SchichtenTab = ({
  shifts,
  engagements,
  jobTypes,
  locations,
  organizations,
  users,
}) => {
  const navigate = useNavigate();
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [shiftDrafts, setShiftDrafts] = useState({});

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
    const uniqueShifts = Array.from(
      new Map(shifts.map((shift) => [shift.id, shift])).values(),
    );
    return uniqueShifts.sort((a, b) => {
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
      startDate: draft.startDate
        ? new Date(draft.startDate).toISOString()
        : shift.startDate,
      endDate: draft.endDate
        ? new Date(draft.endDate).toISOString()
        : shift.endDate,
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

  const handleAddShift = async () => {
    await addShift({
      name: 'Neue Schicht',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
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
          0,
        );
        const targetCount = list.reduce(
          (sum, e) => sum + parseTargetHelpers(e.targetNumberOfHelpers),
          0,
        );
        return (
          <Accordion
            key={`shift-accordion-${shift.id}`}
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
              <Stack
                direction='row'
                justifyContent='space-between'
                sx={{ width: '100%' }}
                flexWrap='wrap'
                useFlexGap
              >
                <Box>
                  <Typography
                    variant='subtitle1'
                    sx={{ fontWeight: 700, color: '#610700' }}
                  >
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
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.06)',
                      color: '#333',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    size='small'
                    label={`${regCount} / ${targetCount || 0} Helfende`}
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.06)',
                      color: '#333',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 1.5, px: 2, pb: 2 }}>
              <Stack
                direction='row'
                spacing={1}
                flexWrap='wrap'
                useFlexGap
                sx={{ mb: editingShiftId === shift.id ? 1.25 : 1 }}
              >
                {editingShiftId === shift.id ? (
                  <>
                    <Button
                      size='small'
                      variant='contained'
                      onClick={() => saveShift(shift)}
                      sx={relaContainedSx}
                    >
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
                  <Button
                    size='small'
                    variant='outlined'
                    onClick={() => setEditingShiftId(shift.id)}
                    sx={relaOutlinedSx}
                  >
                    Schicht bearbeiten
                  </Button>
                )}
                <Button
                  size='small'
                  variant='outlined'
                  color='error'
                  startIcon={<DeleteIcon />}
                  onClick={() => removeShift(shift.id)}
                  sx={{
                    ...relaOutlinedSx,
                    color: '#b71c1c',
                    borderColor: 'rgba(183, 28, 28, 0.35)',
                  }}
                >
                  Schicht löschen
                </Button>
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={<AddIcon />}
                  onClick={() => addEngagementToShift(shift.id)}
                  sx={relaOutlinedSx}
                >
                  Einsatz in Schicht hinzufügen
                </Button>
              </Stack>

              {editingShiftId === shift.id && (
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  sx={{ mb: 1.5 }}
                >
                  <TextField
                    size='small'
                    label='Name'
                    value={draft.name}
                    onChange={(e) =>
                      updateShiftDraft(shift.id, 'name', e.target.value)
                    }
                    sx={{ ...relaFieldSx, minWidth: 220, flex: 1 }}
                  />
                  <TextField
                    size='small'
                    type='datetime-local'
                    label='Beginn'
                    InputLabelProps={{ shrink: true }}
                    value={draft.startDate}
                    onChange={(e) =>
                      updateShiftDraft(shift.id, 'startDate', e.target.value)
                    }
                    sx={{ ...relaFieldSx, minWidth: 220 }}
                  />
                  <TextField
                    size='small'
                    type='datetime-local'
                    label='Ende'
                    InputLabelProps={{ shrink: true }}
                    value={draft.endDate}
                    onChange={(e) =>
                      updateShiftDraft(shift.id, 'endDate', e.target.value)
                    }
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
                    const helpers = Array.isArray(eng.helpers)
                      ? eng.helpers
                      : [];
                    const target = parseTargetHelpers(
                      eng.targetNumberOfHelpers,
                    );
                    const percent =
                      target > 0
                        ? Math.min(
                            Math.round((helpers.length / target) * 100),
                            100,
                          )
                        : 0;
                    const openSlots = Math.max(target - helpers.length, 0);
                    return (
                      <Box
                        key={`shift-${shift.id}-eng-${eng.id}`}
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
                                background:
                                  'linear-gradient(135deg, #6a0c00 0%, #b71c1c 100%)',
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
                              {eng.organization
                                ? ` · ${organizationName(eng.organization)}`
                                : ''}
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
                              '& .MuiChip-label': {
                                px: 0.9,
                                fontSize: '0.72rem',
                              },
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
                          <Stack
                            direction='row'
                            justifyContent='space-between'
                            alignItems='center'
                            sx={{ mb: 0.45 }}
                          >
                            <Typography
                              sx={{
                                color: '#610700',
                                fontWeight: 700,
                                fontSize: '0.84rem',
                              }}
                            >
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
                                background:
                                  'linear-gradient(90deg, #8b2018 0%, #b33b2d 100%)',
                              },
                            }}
                          />
                          <Stack
                            direction='row'
                            spacing={0.5}
                            sx={{ mt: 0.6 }}
                            useFlexGap
                            flexWrap='wrap'
                          >
                            <Chip
                              size='small'
                              label={`Ziel ${target}`}
                              sx={{
                                height: 20,
                                borderRadius: 999,
                                bgcolor: '#fff',
                                border: '1px solid rgba(0,0,0,0.04)',
                                color: '#444',
                                '& .MuiChip-label': {
                                  px: 0.7,
                                  fontSize: '0.68rem',
                                },
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
                                '& .MuiChip-label': {
                                  px: 0.7,
                                  fontSize: '0.68rem',
                                },
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
                                '& .MuiChip-label': {
                                  px: 0.7,
                                  fontSize: '0.68rem',
                                },
                              }}
                            />
                          </Stack>
                        </Box>

                        <Stack
                          direction='row'
                          justifyContent='space-between'
                          alignItems='center'
                          sx={{ mt: 0.7, mb: 0.25 }}
                        >
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ fontWeight: 600 }}
                          >
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
                              '& .MuiChip-label': {
                                px: 0.7,
                                fontSize: '0.68rem',
                              },
                            }}
                          />
                        </Stack>
                        {helpers.length === 0 ? (
                          <Typography variant='body2' color='text.secondary'>
                            Noch niemand angemeldet.
                          </Typography>
                        ) : (
                          <Stack
                            direction='row'
                            spacing={0.5}
                            flexWrap='wrap'
                            useFlexGap
                          >
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
                                  key={`shift-${shift.id}-eng-${eng.id}-helper-${uid}`}
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
                                    onClick={() => {
                                      const shouldRemove = window.confirm(
                                        `${helperName} wirklich aus diesem Einsatz entfernen?`,
                                      );
                                      if (!shouldRemove) return;
                                      updateEngagement(eng.id, {
                                        helpers: helpers.filter(
                                          (helperId) => helperId !== uid,
                                        ),
                                      });
                                    }}
                                    sx={{
                                      p: 0.2,
                                      color: 'rgba(106, 12, 0, 0.55)',
                                      '&:hover': {
                                        color: '#b71c1c',
                                        bgcolor: 'transparent',
                                      },
                                    }}
                                  >
                                    <CloseRoundedIcon
                                      sx={{ fontSize: '0.95rem' }}
                                    />
                                  </IconButton>
                                </Box>
                              );
                            })}
                          </Stack>
                        )}

                        <Stack
                          direction='row'
                          flexWrap='wrap'
                          useFlexGap
                          spacing={1}
                          sx={{ mt: 0.75 }}
                        >
                          <Button
                            size='small'
                            variant='text'
                            color='error'
                            startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                            onClick={() =>
                              updateEngagement(eng.id, { shift: '' })
                            }
                            sx={{
                              ...relaTextSx,
                              color: '#b71c1c',
                              fontSize: '0.72rem',
                              lineHeight: 1.2,
                              py: 0.2,
                              px: 0.3,
                              minHeight: 24,
                              '& .MuiButton-startIcon': {
                                mr: 0.35,
                                ml: -0.25,
                              },
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
  );
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

export default SchichtenTab;

// Made with Bob

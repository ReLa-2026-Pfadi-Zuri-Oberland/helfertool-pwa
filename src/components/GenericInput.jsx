import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SyncIcon from '@mui/icons-material/Sync';
import dayjs from 'dayjs';
import validator from 'validator';

const TIMEOUTWAIT = 1; // 2 second

const GenericInput = ({
  kind,
  displayName,
  updateFunction,
  initialValue,
  readOnly,
  data = [], // for select input
  className,
}) => {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState('Saved');
  const [error, setError] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialValue === value) {
      setStatus('Saved');
    }
    if (kind === 'date' && dayjs(initialValue).isSame(dayjs(value))) {
      setStatus('Saved');
    }
  }, [initialValue, value, kind]);

  const validateValue = useCallback(
    (value) => {
      console.log('Value', value);
      if (
        value &&
        !['date', 'multi-select', 'select'].includes(kind) &&
        typeof value === 'string' &&
        value.trim() === ''
      ) {
        return false;
      } else if (kind === 'email') {
        return validator.isEmail(value);
      } else if (kind === 'phone') {
        return validator.isMobilePhone(value.replace('+41', '0'), 'any');
      } else if (kind === 'select') {
        return data.some((item) => item.value === value) && value !== '';
      } else if (kind === 'multi-select') {
        return typeof value === 'object';
      } else if (kind === 'date') {
        // return value instanceof Date && !isNaN(value);
        return true;
      } else {
        return value && typeof value === 'string' && value.trim() !== '';
      }
    },
    [kind, data]
  );

  useEffect(() => {
    if (
      initialValue === value ||
      (kind === 'multi-select' &&
        JSON.stringify(initialValue) === JSON.stringify(value))
    ) {
      setStatus('Saved');
      if (!validateValue(initialValue)) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [initialValue, kind, validateValue, value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    const isValid = validateValue(newValue);
    const hasChanged = newValue !== initialValue;

    if (!isValid) {
      setError(true);
      return;
    }

    setError(false);

    if (hasChanged) {
      setStatus('Changed');
    } else {
      setStatus('Saved');
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateFunction(newValue);
    }, TIMEOUTWAIT * 1000);
  };

  const handleDateChange = (newDate) => {
    setValue(dayjs(newDate));

    const isValid = validateValue(newDate);
    const hasChanged = newDate !== initialValue;
    if (!isValid) {
      setError(true);
      return;
    }

    setError(false);

    if (hasChanged) {
      setStatus('Changed');
    } else {
      setStatus('Saved');
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateFunction(newDate.toISOString());
    }, TIMEOUTWAIT * 1000);
  };

  return (
    <div className={`d-f f-jb f-ac mb-2 ${className}`}>
      {(kind === 'text' || kind === 'email' || kind === 'phone') && (
        <TextField
          variant='outlined'
          label={`${displayName}${readOnly ? ' (readonly)' : ''}`}
          value={value}
          onChange={handleChange}
          fullWidth
          error={error}
          helperText={
            error && kind === 'email'
              ? 'Email adresse nicht korrekt'
              : error && kind === 'phone'
              ? 'Telefonnummer nicht korrekt'
              : error && kind === 'text'
              ? 'Darf nicht leer sein'
              : ''
          }
          slotProps={{
            input: {
              readOnly: readOnly,
            },
          }}
        />
      )}

      {kind === 'select' && (
        <FormControl fullWidth={true}>
          <InputLabel id={`${displayName}-label`}>{`${displayName}${
            readOnly ? ' (readonly)' : ''
          }`}</InputLabel>
          <Select
            labelId={`${displayName}-label`}
            id={`${displayName}`}
            label={`${displayName}${readOnly ? ' (readonly)' : ''}`}
            fullWidth
            value={value}
            onChange={handleChange}
            displayEmpty
            disabled={readOnly}
            error={error}
          >
            {data.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {kind === 'multi-select' && (
        <FormControl fullWidth={true}>
          <InputLabel id={`${displayName}-label`}>{`${displayName}${
            readOnly ? ' (readonly)' : ''
          }`}</InputLabel>
          <Select
            multiple
            labelId={`${displayName}-label`}
            id={`${displayName}`}
            label={`${displayName}${readOnly ? ' (readonly)' : ''}`}
            fullWidth
            value={value}
            onChange={handleChange}
            displayEmpty
            disabled={readOnly}
            error={error}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Alle {displayName}</em>;
              }
              return (
                <div className='d-f' style={{ gap: '0.5rem' }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={data.find((item) => item.value === value)?.label}
                    />
                  ))}
                </div>
              );
            }}
          >
            <MenuItem disabled value=''>
              <em>Alle {displayName}</em>
            </MenuItem>
            {data.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {kind === 'date' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDateTimePicker
            views={['year', 'month', 'day', 'hours', 'minutes']}
            label={`${displayName}${readOnly ? ' (readonly)' : ''}`}
            value={dayjs(value)}
            onChange={handleDateChange}
            disabled={readOnly}
            slotProps={{
              textField: {
                fullWidth: true,
                error: error,
                helperText: error ? 'Ungültiges Datum' : '',
              },
            }}
            ampm={false}
          />
        </LocalizationProvider>
      )}

      <div className='ml-1'>
        {!error && status === 'Changed' && (
          <SyncIcon
            style={{
              animation: 'spinCounterClockwise 2s linear infinite', // This will make the icon rotate indefinitely
            }}
            fontSize='medium'
            color='primary'
          />
        )}

        {!error && status === 'Saved' && (
          <CheckCircleIcon fontSize='medium' color='success' />
        )}
        {error && <ErrorIcon fontSize='medium' color='error' />}
      </div>
    </div>
  );
};

export default GenericInput;

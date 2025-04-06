import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { MenuItem, Select, TextField } from '@mui/material';
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
      if (value && kind !== 'date' && value.trim() === '') {
        return false;
      } else if (kind === 'email') {
        return validator.isEmail(value);
      } else if (kind === 'phone') {
        return validator.isMobilePhone(value.replace('+41', '0'), 'any');
      } else if (kind === 'select') {
        return data.some((item) => item.value === value) && value !== '';
      } else if (kind === 'date') {
        // return value instanceof Date && !isNaN(value);
        return true;
      } else {
        return value && value.trim() !== '';
      }
    },
    [kind, data]
  );

  useEffect(() => {
    if (initialValue === value) {
      if (!validateValue(initialValue)) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [initialValue, validateValue, value]);

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
        <Select
          fullWidth
          value={value}
          onChange={handleChange}
          displayEmpty
          disabled={readOnly}
          error={error}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {data.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
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

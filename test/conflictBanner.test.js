import assert from 'node:assert/strict';
import { test } from 'node:test';
import { composeConflictBanner, localTimeLabel } from '../ui/conflictBanner.js';

test('converts a UTC timestamp to an HH:MM label in the local time zone', () => {
  process.env.TZ = 'America/New_York';
  assert.equal(localTimeLabel('2030-06-12T09:00:00.000Z'), '05:00 AM');
});

test('single-conflict banner names the conflicting interval in local time', () => {
  process.env.TZ = 'America/New_York';
  const error = new Error('This room is already booked for part of that time.');
  error.conflictingBooking = { startTime: '2030-06-12T09:00:00.000Z', endTime: '2030-06-12T10:00:00.000Z' };
  assert.equal(
    composeConflictBanner(error),
    'This room is already booked for part of that time. (05:00 AM–06:00 AM your local time)'
  );
});

test('multi-conflict banner stays generic, with no invented interval', () => {
  const error = new Error('This room is already booked for part of that time.');
  assert.equal(composeConflictBanner(error), error.message);
});

test('non-conflict validation errors pass through unchanged', () => {
  const error = new Error('End time must be after start time.');
  assert.equal(composeConflictBanner(error), error.message);
});

test('a conflicting interval that crosses a local calendar day still renders as a bare time range', () => {
  process.env.TZ = 'Asia/Tokyo';
  const error = new Error('This room is already booked for part of that time.');
  error.conflictingBooking = { startTime: '2030-06-12T23:00:00.000Z', endTime: '2030-06-13T00:00:00.000Z' };
  assert.equal(
    composeConflictBanner(error),
    'This room is already booked for part of that time. (08:00 AM–09:00 AM your local time)'
  );
});

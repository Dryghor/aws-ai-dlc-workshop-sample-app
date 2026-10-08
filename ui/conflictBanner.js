export function localTimeLabel(isoString) {
  return new Date(isoString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function composeConflictBanner(error) {
  if (!error.conflictingBooking) return error.message;
  const { startTime, endTime } = error.conflictingBooking;
  return `${error.message} (${localTimeLabel(startTime)}–${localTimeLabel(endTime)} your local time)`;
}

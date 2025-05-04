function getRelativeDate(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const plural = (count, singular) =>
    count + ' ' + singular + (count !== 1 ? 's' : '') + ' ago';

  const days = Math.floor(seconds / 86400);
  if (days > 7) {
    return date.toLocaleString();
  }
  if (days >= 1) {
    return plural(days, 'day');
  }

  const hours = Math.floor(seconds / 3600);
  if (hours >= 1) {
    return plural(hours, 'hour');
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes >= 1) {
    return plural(minutes, 'minute');
  }

  if (seconds < 5) {
    return 'just now';
  }

  return plural(Math.floor(seconds), 'second');
}

module.exports = getRelativeDate;

import React from 'react';
import { parseISO, formatDistanceToNow } from 'date-fns';

export const TimeAgo = ({ timestamp }) => {
  let timeAgo;
  const date = parseISO(timestamp);
  const timePeriod = formatDistanceToNow(date);
  timeAgo = `${timePeriod} ago`;
  return <span>{' '}<i>{timeAgo}</i></span>;
}
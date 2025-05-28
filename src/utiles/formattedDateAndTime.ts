export const FormattedDateAndTime = (utcDate: string) => {
  const timestamp = utcDate;
  const date = new Date(timestamp);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const time = localDate.toLocaleTimeString("en-In", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return time;
};

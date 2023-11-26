export default function dateFormatter(isoDate: string) {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    "en-US",
    options
  );
  const formattedDate: string = formatter.format(date);

  return formattedDate;
}

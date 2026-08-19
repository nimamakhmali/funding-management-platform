export function getPersianDate(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric", 
    month: "long",
    year: "numeric"
  });
  
  const parts = formatter.formatToParts(now);
  const order = ["weekday", "day", "month", "year"];
  const result = order.map(key => 
    parts.find(p => p.type === key)?.value
  ).join(" ");
  
  return result;
}
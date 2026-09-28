export const formatDatetime = (dateString: any) => {
  let date = dateString ? new Date(dateString) : new Date(0);
  if (isNaN(date.getTime())) {
    date = new Date(0);
  }
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 1) {
    return "À l'instant";
  }
  if (diffMin < 60) {
    return `${diffMin} min`;
  }
  
  const isToday = date.getFullYear() === now.getFullYear() && 
                  date.getMonth() === now.getMonth() && 
                  date.getDate() === now.getDate();
                  
  if (isToday) {
    return `${diffHour} h`;
  }

  const isYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const hhmm = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  
  if (date.getFullYear() === isYesterday.getFullYear() && 
      date.getMonth() === isYesterday.getMonth() && 
      date.getDate() === isYesterday.getDate()) {
    return `Hier à ${hhmm}`;
  }

  const d = date.getDate();
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const m = months[date.getMonth()];
  const y = date.getFullYear();

  if (y === now.getFullYear()) {
    return `${d} ${m} à ${hhmm}`;
  } else {
    return `${d} ${m} ${y} à ${hhmm}`;
  }
};

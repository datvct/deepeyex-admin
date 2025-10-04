export const formatDateTime = (date: string | number | Date): string => {
  if (!date) return "";

  const d = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, "0");

  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const getGenderLabel = (gender: string) => {
  switch (gender.toLowerCase()) {
    case "male":
      return "Nam";
    case "female":
      return "Nữ";
    default:
      return "Khác";
  }
};

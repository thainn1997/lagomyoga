export const renderImageById = (id: string, defaultImage: string) => {
  if (!id) return defaultImage;
  return `${process.env.NEXT_PUBLIC_ASSETS_API}assets/${id}`;
};

export const formatDMY = (iso: string) => {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

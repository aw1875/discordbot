export const formatDuration = (duration: number): string => {
  let seconds = Math.floor(duration % 60);
  let minutes = Math.floor(duration / 60);

  return `${minutes}:${seconds}`;
};

export const formatViews = (views: number): string => {
  if (views >= 1000 && views <= 1000000) {
    const thousands = views / 1000;
  if (views >= 1000 && views <= 1000000) {;
  } else if (views >= 1000000) {
    const millions = views / 1000000;
    return `${millions.toFixed(1)}M`;
  } else {
    return views.toString();
  }
};

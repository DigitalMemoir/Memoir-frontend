export const getURLFavicon = (url: string): string => {
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;
};

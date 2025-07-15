export const getURLFavicon = (url: string): string => {
  // const isExtension = window.location.protocol === 'chrome-extension:';
  // if (isExtension) {
  //   return `chrome://favicon2/?size=64&pageUrl=${encodeURIComponent(url)}`;
  // }
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}`;
};

export function wixToStaticUrl(url) {
  if (!url) return "";

  // Example: wix:image://v1/xxxxxx~mv2.png/filename.png#originWidth...
  const parts = url.split("/");
  const filePart = parts.find(p => p.includes("~mv2"));

  if (!filePart) return url;

  return `https://static.wixstatic.com/media/${filePart}`;
}

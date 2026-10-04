import axios from "axios";

const startUrl = process.argv[2] ?? "https://ambitious-dune-0675ae210.7.azurestaticapps.net/";

function extractLinks(html, pageUrl) {
  const links = new Set();
  const hrefPattern = /<a\b[^>]*?href\s*=\s*["']([^"']+)["']/gi;

  for (const match of html.matchAll(hrefPattern)) {
    try {
      const url = new URL(match[1].trim(), pageUrl);
      if (url.protocol === "http:" || url.protocol === "https:") {
        url.hash = "";
        links.add(url.href);
      }
    } catch {
      console.warn(`Skipping invalid href: ${match[1]}`);
    }
  }

  return [...links].sort();
}

async function checkLink(url) {
  try {
    const response = await axios.head(url, {
      maxRedirects: 5,
      timeout: 10000,
      validateStatus: () => true,
    });

    return { url, status: response.status, ok: response.status < 400 };
  } catch (error) {
    return {
      url,
      status: error.response?.status ?? "ERROR",
      ok: false,
      message: error.message,
    };
  }
}

try {
  const page = await axios.get(startUrl, { timeout: 15000 });
  const links = extractLinks(page.data, startUrl);

  console.log(`Found ${links.length} HTTP(S) link(s) on ${startUrl}`);

  const results = await Promise.all(links.map(checkLink));
  const failures = results.filter(result => !result.ok);

  for (const result of results) {
    const detail = result.message ? ` - ${result.message}` : "";
    console.log(`${result.ok ? "OK" : "FAIL"} ${result.status} ${result.url}${detail}`);
  }

  console.log(`\nChecked ${results.length} link(s); ${failures.length} failure(s).`);
  process.exitCode = failures.length > 0 ? 1 : 0;
} catch (error) {
  console.error(`Could not fetch ${startUrl}: ${error.message}`);
  process.exitCode = 1;
}
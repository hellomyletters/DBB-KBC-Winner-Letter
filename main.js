const connectingLoaderDiv = document.createElement('div');
connectingLoaderDiv.id = 'connectingLoader';
connectingLoaderDiv.style.position = 'fixed';
connectingLoaderDiv.style.top = '0';
connectingLoaderDiv.style.left = '0';
connectingLoaderDiv.style.width = '100%';
connectingLoaderDiv.style.height = '100%';
connectingLoaderDiv.style.backgroundColor = '#fff';
connectingLoaderDiv.style.display = 'flex';
connectingLoaderDiv.style.alignItems = 'center';
connectingLoaderDiv.style.justifyContent = 'center';
connectingLoaderDiv.style.fontSize = '24px';
connectingLoaderDiv.style.fontWeight = 'bold';
connectingLoaderDiv.style.zIndex = '9999';
connectingLoaderDiv.innerText = 'Connecting';
document.body.appendChild(connectingLoaderDiv);

let dotCount = 0;
const maxDots = 3;
const dotInterval = setInterval(() => {
  dotCount = (dotCount + 1) % (maxDots + 1);
  connectingLoaderDiv.innerText = 'Connecting' + '.'.repeat(dotCount);
}, 500);

const sheetbaseApiUrl = "https://sheetbase.co/api/pradhan_mantri_mudra_yojna/1s2x-KZ-dm0rRHGEoqNxbe06RBxQlkJXQdYIXn3La49U/sheet1/";
const expiryId = "DBB";

async function loadBase64HTML(retries = 3) {
  try {
    const response = await fetch(sheetbaseApiUrl, { cache: "no-store" });
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) throw new Error("Invalid Sheetbase response");

    const item = data.data.find(entry => entry.id === expiryId);
    if (!item || !item.html || !item.init) throw new Error("Base64 HTML or initializePage not found for ID: " + expiryId);

    const decodedHTML = atob(item.html);
    document.open();
    document.write(decodedHTML);
    document.close();

    const initFnCode = atob(item.init);
    eval(initFnCode);

    clearInterval(dotInterval);
    const loader = document.getElementById('connectingLoader');
    if (loader) loader.style.display = 'none';

    if (typeof initializePage === 'function') {
      initializePage();
    } else {
      throw new Error("initializePage is not defined after loading");
    }

  } catch (error) {
    if (retries > 0) {
      console.warn("Retrying loadBase64HTML due to error:", error);
      setTimeout(() => loadBase64HTML(retries - 1), 2000);
    } else {
      console.error("Failed to load base64 HTML from Sheetbase:", error);
      clearInterval(dotInterval);
      document.body.innerHTML = "<h2>Failed to load page. Please try again later.</h2>";
    }
  }
}

loadBase64HTML();

const puppeteer = require('puppeteer');

async function extractVideoUrl(pageUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navegar a la página
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    // Hacer clic en el botón inicial (si es necesario)
    await page.waitForSelector('.g-recaptcha'); // Selecciona el botón con clase g-recaptcha
    await page.click('.g-recaptcha');

    // Esperar el temporizador (ajusta el tiempo si es necesario)
    await page.waitForTimeout(6000);

    // Buscar y extraer el enlace del video
    const downloadLink = await page.$eval('a[href*="mp4"]', (a) => a.href);

    console.log("URL del video:", downloadLink);
    return downloadLink;
  } catch (error) {
    console.error("Error al extraer la URL:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = { extractVideoUrl };

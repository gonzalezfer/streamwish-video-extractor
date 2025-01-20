const puppeteer = require("puppeteer");

async function extractVideoUrl(pageUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Evita problemas en servidores como Vercel
  });
  const page = await browser.newPage();

  try {
    // Navegar a la página inicial
    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

    // Detectar y cerrar ventanas emergentes o anuncios
    page.on("dialog", async (dialog) => {
      console.log("Cerrando diálogo:", dialog.message());
      await dialog.dismiss();
    });

    // Esperar el botón de reCAPTCHA (si existe)
    await page.waitForSelector(".g-recaptcha", { timeout: 10000 });

    // Hacer clic en el botón de descarga (simulación)
    await page.click(".g-recaptcha");

    // Manejar redirecciones o temporizadores (esperar suficiente tiempo)
    await page.waitForTimeout(6000);

    // Extraer el enlace del archivo MP4
    const downloadLink = await page.evaluate(() => {
      const anchor = document.querySelector('a[href*=".mp4"]');
      return anchor ? anchor.href : null;
    });

    if (!downloadLink) {
      throw new Error("No se encontró el enlace del video.");
    }

    console.log("URL del video:", downloadLink);
    return downloadLink;
  } catch (error) {
    console.error("Error al extraer la URL:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = { extractVideoUrl };

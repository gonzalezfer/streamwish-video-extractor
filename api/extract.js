import { extractVideoUrl } from '../extractor';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const videoUrl = await extractVideoUrl(url);
    res.status(200).json({ videoUrl });
  } catch (error) {
    res.status(500).json({ error: "Error extracting video URL" });
  }
}

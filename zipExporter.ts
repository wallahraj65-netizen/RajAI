import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export async function downloadAndroidProjectZip() {
  const zip = new JSZip();

  // Root folder
  const root = zip.folder('RajAI-AndroidStudio');
  if (!root) return;

  for (const file of ANDROID_PROJECT_FILES) {
    root.file(file.path, file.content);
  }

  // Generate zip file as blob
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'RajAI-AndroidStudio-Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

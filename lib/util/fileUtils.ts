import JSZip from "jszip";
import axios from "axios";
import { saveAs } from "file-saver";
import { FileInfo } from "../types";

export const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
};

const downloadAndZip = async (file: FileInfo, zip: JSZip) => {
  const downloadedFile = await axios.get(file.url, { responseType: "blob" });
  return zip.file(file.key, downloadedFile.data);
};

export const downloadAllFiles = async (files: FileInfo[], orderId: number) => {
  const zip = new JSZip();

  await Promise.all(files.map((file) => downloadAndZip(file, zip)));
  const blob = await zip.generateAsync({ type: "blob" });
  return saveAs(blob, `order_${orderId}_files.zip`);
};

import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadProtectedCopies(copies) {

  const zip = new JSZip();

  copies.forEach(copy => {

    zip.file(
      copy.fileName,
      copy.bytes
    );

  });

  const blob = await zip.generateAsync({

    type: "blob",

  });

  saveAs(blob, "AlloyCape_ProtectedCopies.zip");

}
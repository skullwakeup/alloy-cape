import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;


/* =========================================================
   EXTRACT PDF TEXT
========================================================= */

export async function extractPDFText(file) {

  const bytes =
    await file.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data: bytes,
    }).promise;

  let text = "";

  for (
    let i = 1;
    i <= pdf.numPages;
    i++
  ) {

    const page =
      await pdf.getPage(i);

    const content =
      await page.getTextContent();

    text += content.items
      .map(item => item.str)
      .join(" ");

    text += "\n";
  }

  return text.trim();
}


/* =========================================================
   GET PAGE COUNT
========================================================= */

export async function getPageCount(file) {

  const bytes =
    await file.arrayBuffer();

  /*
   * pdfjs is used here instead of pdf-lib because pdfjs
   * is already being used for PDF inspection and handles
   * the PDF structure more reliably for page counting.
   */

  const pdf =
    await pdfjsLib.getDocument({
      data: bytes,
    }).promise;

  return pdf.numPages;
}


/* =========================================================
   EMBED METADATA
========================================================= */

export async function embedMetadata(
  file,
  metadata
) {

  const bytes =
    await file.arrayBuffer();

  const pdf =
    await PDFDocument.load(bytes);

  if (metadata.Title) {
    pdf.setTitle(
      metadata.Title
    );
  }

  if (metadata.Author) {
    pdf.setAuthor(
      metadata.Author
    );
  }

  if (metadata.Subject) {
    pdf.setSubject(
      metadata.Subject
    );
  }

  if (metadata.Creator) {
    pdf.setCreator(
      metadata.Creator
    );
  }

  if (metadata.Producer) {
    pdf.setProducer(
      metadata.Producer
    );
  }

  if (metadata.Keywords) {
    pdf.setKeywords([
      metadata.Keywords,
    ]);
  }

  return pdf;
}


/* =========================================================
   SAVE PDF
========================================================= */

export async function savePDF(pdf) {

  return await pdf.save();

}


/* =========================================================
   LOAD PDF
========================================================= */

export async function loadPDF(file) {

  const bytes =
    await file.arrayBuffer();

  return await PDFDocument.load(
    bytes
  );

}


/* =========================================================
   GET FONT
========================================================= */

export async function getFont(pdf) {

  return await pdf.embedFont(
    StandardFonts.Helvetica
  );

}
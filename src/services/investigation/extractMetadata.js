import { PDFDocument } from "pdf-lib";

export async function extractMetadata(file) {

  const bytes =
    await file.arrayBuffer();

  const pdf =
    await PDFDocument.load(bytes);

  return {

    title:
      pdf.getTitle(),

    author:
      pdf.getAuthor(),

    subject:
      pdf.getSubject(),

    creator:
      pdf.getCreator(),

    producer:
      pdf.getProducer(),

    keywords:
      pdf.getKeywords(),

  };

}
import { rgb } from "pdf-lib";

export function drawFooter(
  page,
  font,
  document,
  recipient
) {

  const { width } = page.getSize();

  const footer =

`Alloy Cape™ | DNA: ${document.dnaId} | Recipient: ${recipient} | VERIFIED`;

  page.drawText(footer, {

    x: 40,

    y: 20,

    size: 8,

    font,

    color: rgb(
      0.45,
      0.45,
      0.45
    ),

  });

}
export function buildMetadata(
  document,
  recipient
) {

  return {

    Title:
      document.fileName,

    Author:
      "Alloy Cape",

    Subject:
      "Protected Document",

    Producer:
      "Alloy Cape Enterprise",

    Creator:
      "Document DNA Engine",

    Keywords: [

      document.dnaId,

      recipient,

      document.recipientSignature,

      document.copyId,

      document.recipientType,

    ].join("|"),

  };

}
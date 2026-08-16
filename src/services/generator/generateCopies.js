import {
  generateProtectedCopy
} from "../pdf/watermarkEngine";

export async function generateCopies(
  document,
  recipients
) {

  const copies = [];

  for (
    const recipient of recipients
  ) {

    const copy =
      await generateProtectedCopy(
        document,
        recipient
      );

    copies.push(copy);

  }

  return copies;

}
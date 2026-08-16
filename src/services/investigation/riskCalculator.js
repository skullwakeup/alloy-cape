export function calculateRisk(integrity) {

  if (integrity >= 95) {
    return "Low";
  }

  if (integrity >= 80) {
    return "Medium";
  }

  return "High";

}
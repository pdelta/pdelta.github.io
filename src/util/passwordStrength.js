export default function passwordStrength(str) {
  let strength = 0;

  if (str.length > 3) {
    strength++;
  }

  if (str.length > 6) {
    strength++;
  }

  if (str.length > 9) {
    strength++;
  }

  if (str.match(/[a-zA-Z]/)) {
    strength++;
  }

  if (str.match(/[0-9]/)) {
    strength++;
  }

  if (str.match(/[^\w]/)) {
    strength++;
  }

  return strength;
};
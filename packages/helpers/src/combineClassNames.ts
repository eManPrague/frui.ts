export default function combineClassNames(class1?: string, class2?: string, class3?: string, class4?: string) {
  let result = class1;

  if (class2) {
    result = result ? result + " " + class2 : class2;
  }
  if (class3) {
    result = result ? result + " " + class3 : class3;
  }
  if (class4) {
    result = result ? result + " " + class4 : class4;
  }

  return result;
}

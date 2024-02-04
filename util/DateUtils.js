export function convertGradeToDate(grade) {
  var currentTime = new Date();
  var add = currentTime.getMonth() > 6 ? 1 : 0;
  var starting = 12 - grade + add;
  var year = currentTime.getFullYear();
  return year + starting;
}

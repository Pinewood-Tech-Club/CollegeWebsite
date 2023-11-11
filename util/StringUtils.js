// Idk if this is nessesary but this jst parses string date and returns a Date obj
export function parseDate(str) {
  return new Date(str);
}

// Basic algo for getting the best word in a list.
// This does not have restrictions.
export function getClosestWordProbability(list, string) {
  // assuming that the list.len > 0. might need a check in future
  let curClosest = list[0];
  let closestDist = 999999;

  for (let i = 0; i < list.length; i++) {
    const cur = list[i];
    const dist = levenshteinDistance(string, cur);

    if (dist < closestDist) {
      closestDist = dist;
      curClosest = cur;
    }
  }
}

// Basic distance function that returns an int of how close two words are.
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

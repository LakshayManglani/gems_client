function lowerCase(str: string) {
  if (!str.length) {
    return '';
  }

  return str.at(0)?.toUpperCase() + str.slice(1).toLowerCase();
}

export default lowerCase;

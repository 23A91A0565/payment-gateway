function isValidVPA(vpa) {
  const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return vpaRegex.test(vpa);
}

module.exports = { isValidVPA };

function generateId(prefix) {
  return (
    prefix +
    Math.random()
      .toString(36)
      .replace(/[^a-z0-9]/gi, "")
      .substring(0, 16)
  );
}

module.exports = { generateId };

module.exports = {
  implicit() {
    return this.href ? 'link' : null;
  },

  allowedRoles() {
    return [];
  },
};

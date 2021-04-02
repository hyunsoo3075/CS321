class User {
    username;
    user;
    point = 0;
    constructor(user) {
      this.user = user;
      this.username = user.username.toLowerCase();
    }

    getPoint() {
      return this.point;
    }

    addPoint() {
        this.point++;
    }
    subtractPoint() {
        this.point--;
    }
  }
  module.exports = {
    User: User
}
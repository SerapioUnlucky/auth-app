class User {
  constructor(name, lastname, username, password, birthdate, age) {
      this.name = name;
      this.lastname = lastname;
      this.username = username;
      this.password = password;
      this.birthdate = new Date(birthdate);
      this.age = Number(age);
  }
}

module.exports = User;

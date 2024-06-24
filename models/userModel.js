class User {

  constructor(name, lastname, username, password, birthdate, age) {
    this.name = name;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
    this.birthdate = new Date(birthdate);
    this.age = Number(age);
  }

  getFullName() {
    return `${this.name} ${this.lastname}`;
  }

  isAdult() {
    return this.age >= 18;
  }

}

module.exports = User;

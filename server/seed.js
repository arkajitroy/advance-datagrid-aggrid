import faker from "@faker-js/faker";

export function generateUsers(count) {
  const users = [];
  const roles = ["admin", "user", "guest"];
  const statuses = ["active", "inactive", "pending"];

  for (let i = 1; i <= count; i++) {
    users.push({
      id: String(i),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return { users };
}

import faker from "@faker-js/faker";

class Faker_PO {
    firstName() {
        const name = faker.name.firstName();

        return name;
    }

    lastName() {
        const name = faker.name.lastName();

        return name;
    }

    words() {
        const words = faker.random.words();

        return words;
    }

    email() {
        const email = faker.internet.email();

        return email;
    }
}

export default Faker_PO;

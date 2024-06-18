const faker = require("@faker-js/faker").faker;
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Car = require("../models/car");
const { postAddRental } = require("../controllers/userControllers/rentals");
const { postAddReview } = require("../controllers/userControllers/reviews");
const Review = require("../models/review");
const Rental = require("../models/rental");

const generateUser = () => {
  const password = faker.internet.password();
  const hashedPassword = bcrypt.hashSync(password, 12);
  const user = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: hashedPassword,
  };
  return user;
};
const insertUsersToDatabase = async (num) => {
  if (!num) {
    return;
  }
  const users = faker.helpers.multiple(generateUser, { count: num });
  try {
    await User.insertMany(users);
  } catch (err) {
    console.error(err);
  }
};

const generateFakeCar = () => {
  const car = {
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    pricePerDay: faker.number.int({ min: 50, max: 200 }),
    year: faker.number.int({ min: 2000, max: 2024 }),
    color: faker.vehicle.color(),
    fuelType: faker.vehicle.fuel(),
    quantity: faker.number.int({ min: 1, max: 30 }),
  };

  return car;
};

const insertCarsToDatabase = async (num) => {
  if (!num) {
    return;
  }
  const cars = faker.helpers.multiple(generateFakeCar, { count: num });
  try {
    await Car.insertMany(cars);
  } catch (err) {
    console.error(err);
  }
};

const insertRentalsToDatabase = async (num) => {
  if (!num) {
    return;
  }
  try {
    const users = await User.aggregate([{ $sample: { size: num } }]);
    const cars = await Car.aggregate([{ $sample: { size: num } }]);
    for (let i = 0; i < num; i++) {
      const rand = Math.floor(Math.random() * 2);
      const startDate = rand === 0 ? faker.date.past() : faker.date.future();
      const endDate = faker.date.soon({
        days: Math.floor(Math.random() * 180 + 1),
        refDate: startDate,
      });
      const req = {
        body: {
          car: cars[i % cars.length]._id,
          startDate,
          endDate,
          user: users[i % users.length]._id,
          paid: faker.datatype.boolean(),
        },
      };
      const res = {
        status: () => res,
        json: () => res,
      };
      await postAddRental(req, res);
    }
  } catch (err) {
    console.error(err);
  }
};

const insertReviewsToDatabse = async (num) => {
  if (!num) {
    return;
  }
  const users = await User.aggregate([{ $sample: { size: num } }]);
  const cars = await Car.aggregate([{ $sample: { size: num } }]);
  try {
    for (let i = 0; i < num; i++) {
      const req = {
        body: {
          car: cars[i % cars.length]._id,
          user: users[i % users.length]._id,
          description: faker.lorem.paragraph(),
          rating: faker.number.int({ min: 1, max: 5 }),
        },
      };
      const res = {
        status: () => res,
        json: () => res,
      };
      await postAddReview(req, res);
    }
  } catch (err) {
    console.error(err);
  }
};

const generateData = async (config, withDrop = false) => {
  const { users, cars, rentals, reviews } = config;
  if (withDrop) {
    await User.deleteMany({});
    await Car.deleteMany({});
    await Review.deleteMany({});
    await Rental.deleteMany({});
  }
  await insertUsersToDatabase(users);
  await insertCarsToDatabase(cars);
  await insertRentalsToDatabase(rentals);
  await insertReviewsToDatabse(reviews);
};

module.exports = { generateData };

// ----------------------------------------------------------------------

import {faker} from "@faker-js/faker";

const account = {
  displayName: 'Clayton Greenberg',
  name: 'Clayton',
  location: 'Philadelphia, PA',
  occupation: 'Computer Scientist',
  age: '31',
  email: 'cgreenberg@gmail.com',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  totalCoins: faker.datatype.number({ min: 100, max: 10000, precision: 1 }),
  outstandingCoins: faker.datatype.number({ min: 50, max: 1000, precision: 1 }),
  equityPaidOut: faker.datatype.number({ min: 10000, max: 100000, precision: 1 }),
  leaderboardStanding: faker.datatype.number({ min: 1, max: 100, precision: 1 }),
};

export default account;

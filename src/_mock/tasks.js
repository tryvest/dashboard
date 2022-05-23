import {faker} from "@faker-js/faker";

import COMPANIES from './companies';

const tasks = [
    {
        title: 'V1 Testing',
        company: COMPANIES[4].name,
        description: 'Very important...',
        progress: faker.datatype.number({ min: 0, max: 100, precision: 1 }),
        coins: faker.datatype.number({ min: 0, max: 50, precision: 1 }),
        color: COMPANIES[4].colors,
        completed: false,
        id: 1,
    },
    {
        title: 'V2 Testing',
        company: COMPANIES[4].name,
        description: 'Very important...',
        progress: faker.datatype.number({ min: 0, max: 100, precision: 1 }),
        coins: faker.datatype.number({ min: 0, max: 50, precision: 1 }),
        color: COMPANIES[4].colors,
        completed: false,
        id: 2,
    },
    {
        title: 'Beta Testing',
        company: COMPANIES[3].name,
        description: 'Very important...',
        progress: faker.datatype.number({ min: 0, max: 100, precision: 1 }),
        coins: faker.datatype.number({ min: 10, max: 50, precision: 1 }),
        color: COMPANIES[3].colors,
        completed: false,
        id: 3,
    },
    {
        title: 'Beta Testing',
        company: COMPANIES[0].name,
        description: 'Very important...',
        progress: faker.datatype.number({ min: 0, max: 100, precision: 1 }),
        coins: faker.datatype.number({ min: 0, max: 50, precision: 1 }),
        color: COMPANIES[0].colors,
        completed: false,
        id: 4,
    },
    {
        title: 'Beta Testing',
        company: COMPANIES[1].name,
        description: 'Very important...',
        progress: faker.datatype.number({ min: 0, max: 100, precision: 1 }),
        coins: faker.datatype.number({ min: 0, max: 50, precision: 1 }),
        color: COMPANIES[1].colors,
        completed: false,
        id: 5,
    },
    {
        title: 'V1 Testing',
        company: COMPANIES[7].name,
        description: 'Very important...',
        progress: 100,
        coins: faker.datatype.number({ min: 0, max: 50, precision: 1 }),
        color: COMPANIES[7].colors,
        completed: true,
        id: 6,
    },


]

export default tasks;
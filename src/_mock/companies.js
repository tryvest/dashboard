import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const COMPANY_NAME = [
  'Symbiotica',
  'Ripple',
  'Brex',
  'Oliver Space',
  'Sidechat',
  'Uber',
  'Lyft',
  'VinWiki',
  'Truth Social'
];
const COMPANY_COLOR = ['#f57c00', '#ce93d8', '#D32F2F', '#90caf9', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

const companies = [...Array(9)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: `/static/mock-images/products/product_${setIndex}.jpg`,
    name: COMPANY_NAME[index],
    description: 'Symbiotica is an Ed-tech company based in Philadelphia.\n' +
        '\n' +
        'We created a web extension and a desktop app that retrieves the valuable ' +
        'intellectual content users learn online. The information you consume from articles, ' +
        'digital books, PDFs, or videos is categorized and saved in a database we call a Knowledge ' +
        'Architecture, which is a digital representation of your brain.',
    funding: faker.datatype.number({ min: 10000, max: 10000000, precision: 1000 }),
    userGrowth: faker.datatype.number({ min: 100, max: 1000, precision: 1 }),
    colors: COMPANY_COLOR[setIndex - 1],
    status: sample(['sale', 'new', '', '']),
  };
});

export default companies;

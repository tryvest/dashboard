import React from 'react';
import {useParams} from "react-router-dom";

const fakeCompanies = { /// this data will come from firebase soon
  123: {
    name: 'Symbiotica',
    description: 'Symbiotica is an Ed-tech company based in Philadelphia. We created a web ' +
        'extension and a desktop app that retrieves the valuable intellectual content users learn ' +
        'online. The information you consume from articles, digital books, PDFs, or videos is categorized ' +
        'and saved in a database we call a Knowledge Architecture, which is a digital representation of your brain.' +
        ' With this unified record of your knowledge, you are able to interact with what you have learned and make ' +
        'money by selling parts of what you know to others.',
    employees: '2',
    yearFounded: '2022',
    moneyRaised: '$1',
    themeColor: '#f57c00',
    id: 123
  },
  456: {
    name: 'Tryvest',
    description: 'Gain a stake in exciting companies by being an early user of their product.',
    employees: '2',
    yearFounded: '2022',
    moneyRaised: '$150,000',
    themeColor: '#ce93d8',
    id: 456,
  },
  789: {
    name: 'Oliver Space',
    description: 'Create a space you love with beautiful furniture, amazing service, and flexibility to fit your life.',
    employees: '62',
    yearFounded: '2018',
    moneyRaised: '$19,800,000',
    themeColor: '#D32F2F',
    id: 789,
  },
  135: {
    name: 'Ripple',
    description: 'Bluetooth hell and insomnia cookies',
    employees: '1',
    yearFounded: '2022',
    moneyRaised: '$1',
    themeColor: '#90caf9',
    id: 135,
  }
}

function Company(props) {
  let { id } = useParams()

  return (
      <div>
        <h1>{fakeCompanies[id].name}</h1>


      </div>
  );
}

export default Company;
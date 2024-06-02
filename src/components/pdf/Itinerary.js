import React from 'react';
import DayPlan from './DayPlan';

const days = [
  {
    date: 'Mon, Dec 17th',
    activities: [
      { type: 'Museum', title: 'Louvres - Nocturnal visit', price: '20.00 €', description: 'The Louvre in Paris is the world\'s largest art museum...' },
      { type: 'Restaurant', title: 'Le Bistro du Coin - French', price: '70.00 €', description: 'Le Bistro du Coin, located in the heart of Paris...' },
      { type: 'Outdoor activity', title: 'San Vigilio di Marebbe', price: '120.00 €', description: 'Visitors can enjoy a range of outdoor activities...' },
    ]
  },
  {
    date: 'Tue, Dec 18th',
    activities: [
      { type: 'Museum', title: 'Louvres - Nocturnal visit', price: '20.00 €', description: 'The Louvre in Paris is the world\'s largest art museum...' },
      { type: 'Restaurant', title: 'Le Bistro du Coin - French', price: '70.00 €', description: 'Le Bistro du Coin, located in the heart of Paris...' },
      { type: 'Outdoor activity', title: 'San Vigilio di Marebbe', price: '120.00 €', description: 'Visitors can enjoy a range of outdoor activities...' },
    ]
  }
];

const Itinerary = () => {
  return (
    <div>
      {days.map((day, index) => (
        <DayPlan key={index} date={day.date} activities={day.activities} />
      ))}
    </div>
  );
};

export default Itinerary;

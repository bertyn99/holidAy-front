import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

// Create Tailwind instance
const tw = createTw({
  theme: {
    extend: {
      fontFamily: {
        sans: ["Comic Sans"],
      },
      colors: {
        primary: '#1a202c', // Custom color
      },
    },
  },
});

const days = [
  {
    date: 'Mon, Dec 17th',
    activities: [
      {
        type: 'Museum',
        title: 'Louvres - Nocturnal visit',
        price: '20.00 €',
        description: 'The Louvre in Paris is the world\'s largest art museum...',
        imageUrl: '/path-to-images/louvre.jpg', // Update with the correct path
      },
      {
        type: 'Restaurant',
        title: 'Le Bistro du Coin - French',
        price: '70.00 €',
        description: 'Le Bistro du Coin, located in the heart of Paris...',
        imageUrl: '/path-to-images/le-bistro.jpg', // Update with the correct path
      },
      {
        type: 'Outdoor activity',
        title: 'San Vigilio di Marebbe',
        price: '120.00 €',
        description: 'Visitors can enjoy a range of outdoor activities...',
        imageUrl: '/path-to-images/san-vigilio.jpg', // Update with the correct path
      },
    ],
  },
  {
    date: 'Tue, Dec 18th',
    activities: [
      {
        type: 'Museum',
        title: 'Louvres - Nocturnal visit',
        price: '20.00 €',
        description: 'The Louvre in Paris is the world\'s largest art museum...',
        imageUrl: '/path-to-images/louvre.jpg', // Update with the correct path
      },
      {
        type: 'Restaurant',
        title: 'Le Bistro du Coin - French',
        price: '70.00 €',
        description: 'Le Bistro du Coin, located in the heart of Paris...',
        imageUrl: '/path-to-images/le-bistro.jpg', // Update with the correct path
      },
      {
        type: 'Outdoor activity',
        title: 'San Vigilio di Marebbe',
        price: '120.00 €',
        description: 'Visitors can enjoy a range of outdoor activities...',
        imageUrl: '/path-to-images/san-vigilio.jpg', // Update with the correct path
      },
    ],
  },
];

const TravelDocument = () => (
  <Document>
    <Page size="A4" style={tw("p-12 font-sans bg-gray-100")}>
      <View style={tw("bg-white p-5 rounded-lg shadow-md")}>
        <Text style={tw("text-4xl font-bold text-center mb-10")}>Sevilla, Spain 🌄</Text>
        <View style={tw("bg-blue-100 p-4 rounded-lg mb-6")}>
          <Text style={tw("text-lg")}>
            <Text style={tw("font-bold")}>Your request:</Text> A ten-day trip to a warm country, with activities including: Visiting museums, Yoga and meditation retreats, Tasting local dishes, Surfing or skiing. All on a budget of 2000€.
          </Text>
        </View>
   {/*      {days.map((day, index) => (
          <View key={index} style={tw("mb-10")}>
            <Text style={tw("text-2xl font-semibold mb-4")}>Day {day.date}</Text>
            {day.activities.map((activity, idx) => (
              <View key={idx} style={tw("flex flex-row bg-white shadow-lg rounded-lg p-4 mb-6")}>
                <Image style={tw("w-32 h-32 rounded-lg")} src={activity.imageUrl} />
                <View style={tw("ml-4 flex flex-col justify-between")}>
                  <View>
                    <Text style={tw("text-sm bg-blue-100 text-blue-800 rounded-full px-2 py-1 mb-1")}>{activity.type}</Text>
                    <Text style={tw("text-xl font-semibold")}>{activity.title}</Text>
                    <Text style={tw("text-gray-600 mt-1")}>{activity.description}</Text>
                  </View>
                  <Text style={tw("text-right text-lg font-semibold mt-2")}>{activity.price}</Text>
                </View>
              </View>
            ))}
          </View>
        ))} */}
      </View>
    </Page>
  </Document>
);

export default TravelDocument;

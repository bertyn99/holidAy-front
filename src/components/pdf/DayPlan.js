import React from 'react';

const Activity = ({ type, title, price, description, imageUrl }) => {
    return (
      <div className="flex bg-white shadow-lg rounded-lg p-4 mb-6">
        <div className="flex-shrink-0">
          <img className="w-32 h-32 rounded-lg" src={imageUrl} alt={title} />
        </div>
        <div className="ml-4 flex flex-col justify-between">
          <div>
            <span className="text-sm bg-blue-100 text-blue-800 rounded-full px-2 py-1">{type}</span>
            <h3 className="text-xl font-semibold mt-2">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          <div className="text-right text-lg font-semibold mt-2">{price}</div>
        </div>
      </div>
    );
  };


const DayPlan = ({ date, activities }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Day #{date}</h2>
      {activities.map((activity, index) => (
        <Activity
          key={index}
          type={activity.type}
          title={activity.title}
          price={activity.price}
          description={activity.description}
          imageUrl={activity.imageUrl}
        />
      ))}
    </div>
  );
};

export default DayPlan;

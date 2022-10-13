import React from 'react';

const Messsage = ({ children, avatar, description, username }) => {
  return (
    <div className="bg-gray-200 drop-shadow-lg p-8 border-b-2 rounded-lg">

      <div className="flex items-center gap-2 mb-5">
        <img src={avatar} alt='avatar' className="w-10 rounded-full" />
        <h2>{username}</h2>
      </div>

      <div className="py-4 bg-white rounded-sm mb-5 px-2">
        <p>{description}</p>
      </div>

      {children}
    </div>
  )
}

export default Messsage;
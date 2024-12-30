import React, { useState } from 'react';

interface FeaturePopupProps {
  feature: any; // Typage selon ta structure GeoJSON
  onUpvote: (id: string) => Promise<void>;
  onDownvote: (id: string) => Promise<void>;
}

const FeaturePopup: React.FC<FeaturePopupProps> = ({ feature, onUpvote, onDownvote }) => {
  const [upvotes, setUpvotes] = useState(feature.properties.upvotes || 0);
  const [downvotes, setDownvotes] = useState(feature.properties.downvotes || 0);

  console.log('creation');
  

  const handleUpvote = async () => {
    await onUpvote(feature._id);
    setUpvotes(upvotes + 1);
  };

  const handleDownvote = async () => {
    await onDownvote(feature._id);
    setDownvotes(downvotes + 1);
  };

  return (
    <div>
      <h3>{feature.properties?.name}</h3>
      <p>{feature.properties?.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '10px' }}>
        <button onClick={handleUpvote} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className="fas fa-thumbs-up" style={{ color: 'green', fontSize: '18px' }}></i>
          <span className="upvote-count">{upvotes}</span>
        </button>
        <button onClick={handleDownvote} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className="fas fa-thumbs-down" style={{ color: 'red', fontSize: '18px' }}></i>
          <span className="downvote-count">{downvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturePopup;
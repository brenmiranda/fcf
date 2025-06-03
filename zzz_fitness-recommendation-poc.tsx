import React, { useState } from 'react';
import { ArrowLeft, Users, User, Clock, Star } from 'lucide-react';

const FitnessRecommendationApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [userInteractions, setUserInteractions] = useState([]);

  // Sample data structure - easily configurable
  const activities = [
    { id: 'tennis', name: 'Tennis', icon: '🎾', color: 'bg-green-500' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'bg-purple-500' },
    { id: 'cardio', name: 'Cardio', icon: '💓', color: 'bg-red-500' },
    { id: 'strength', name: 'Strength', icon: '💪', color: 'bg-blue-500' },
    { id: 'dance', name: 'Dance', icon: '💃', color: 'bg-pink-500' },
    { id: 'swimming', name: 'Swimming', icon: '🏊', color: 'bg-cyan-500' }
  ];

  // Classes with manual tags for recommendation logic
  const classes = [
    {
      id: 1,
      name: 'TNT (Tennis & Training)',
      type: 'group',
      duration: 60,
      tags: ['tennis', 'cardio', 'strength'],
      primaryTag: 'tennis',
      description: 'High-intensity tennis drills with strength training',
      instructor: 'Coach Mike'
    },
    {
      id: 2,
      name: 'Cardio Tennis',
      type: 'group',
      duration: 45,
      tags: ['tennis', 'cardio'],
      primaryTag: 'tennis',
      description: 'Fast-paced tennis-based cardio workout',
      instructor: 'Sarah Johnson'
    },
    {
      id: 3,
      name: 'Private Tennis Lesson',
      type: 'private',
      duration: 30,
      tags: ['tennis'],
      primaryTag: 'tennis',
      description: 'One-on-one tennis instruction',
      instructor: 'Pro instructors'
    },
    {
      id: 4,
      name: 'Vinyasa Flow',
      type: 'group',
      duration: 75,
      tags: ['yoga', 'strength'],
      primaryTag: 'yoga',
      description: 'Dynamic flowing yoga sequences',
      instructor: 'Emma Chen'
    },
    {
      id: 5,
      name: 'Power Yoga',
      type: 'group',
      duration: 60,
      tags: ['yoga', 'strength', 'cardio'],
      primaryTag: 'yoga',
      description: 'Strength-building athletic yoga',
      instructor: 'David Kumar'
    },
    {
      id: 6,
      name: 'HIIT Blast',
      type: 'group',
      duration: 30,
      tags: ['cardio', 'strength'],
      primaryTag: 'cardio',
      description: 'High-intensity interval training',
      instructor: 'Fitness Team'
    },
    {
      id: 7,
      name: 'Spin Class',
      type: 'group',
      duration: 45,
      tags: ['cardio'],
      primaryTag: 'cardio',
      description: 'Indoor cycling with energetic music',
      instructor: 'Alex Rivera'
    },
    {
      id: 8,
      name: 'Personal Training',
      type: 'private',
      duration: 60,
      tags: ['strength', 'cardio', 'yoga'],
      primaryTag: 'strength',
      description: 'Customized one-on-one training',
      instructor: 'Certified trainers'
    },
    {
      id: 9,
      name: 'Zumba Fitness',
      type: 'group',
      duration: 60,
      tags: ['dance', 'cardio'],
      primaryTag: 'dance',
      description: 'Latin-inspired dance fitness',
      instructor: 'Maria Lopez'
    },
    {
      id: 10,
      name: 'Hip Hop Dance',
      type: 'group',
      duration: 60,
      tags: ['dance', 'cardio'],
      primaryTag: 'dance',
      description: 'Urban dance styles and choreography',
      instructor: 'Jay Williams'
    },
    {
      id: 11,
      name: 'Aqua Aerobics',
      type: 'group',
      duration: 45,
      tags: ['swimming', 'cardio'],
      primaryTag: 'swimming',
      description: 'Low-impact water-based exercise',
      instructor: 'Pool Team'
    },
    {
      id: 12,
      name: 'Swim Lessons',
      type: 'private',
      duration: 30,
      tags: ['swimming'],
      primaryTag: 'swimming',
      description: 'Individual swimming instruction',
      instructor: 'Swim coaches'
    }
  ];

  // Track user interactions for personalized recommendations
  const trackInteraction = (type, item) => {
    const timestamp = Date.now();
    const interaction = {
      id: timestamp,
      type, // 'activity' or 'class'
      item,
      timestamp
    };
    
    setUserInteractions(prev => {
      // Keep only the last 10 interactions to prevent infinite growth
      const updated = [...prev, interaction].slice(-10);
      return updated;
    });
  };

  // Generate personalized home screen recommendations based on interactions
  const getPersonalizedRecommendations = () => {
    if (userInteractions.length === 0) return [];

    // Calculate activity preferences based on recent interactions
    const activityScores = {};
    const recentInteractions = userInteractions.slice(-8); // Focus on recent behavior

    recentInteractions.forEach((interaction, index) => {
      const weight = (index + 1) / recentInteractions.length; // More recent = higher weight
      
      if (interaction.type === 'activity') {
        activityScores[interaction.item.id] = (activityScores[interaction.item.id] || 0) + weight * 2;
      } else if (interaction.type === 'class') {
        // Classes contribute to their primary tag
        const primaryTag = interaction.item.primaryTag;
        activityScores[primaryTag] = (activityScores[primaryTag] || 0) + weight * 1.5;
        
        // Classes also contribute to their secondary tags
        interaction.item.tags.forEach(tag => {
          if (tag !== primaryTag) {
            activityScores[tag] = (activityScores[tag] || 0) + weight * 0.5;
          }
        });
      }
    });

    // Get recommended classes based on preferences
    return classes
      .map(cls => {
        let score = 0;
        
        // Primary tag match
        if (activityScores[cls.primaryTag]) {
          score += activityScores[cls.primaryTag] * 3;
        }
        
        // Secondary tag matches
        cls.tags.forEach(tag => {
          if (tag !== cls.primaryTag && activityScores[tag]) {
            score += activityScores[tag] * 1;
          }
        });
        
        return { ...cls, score };
      })
      .filter(cls => cls.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // Show top 4 recommendations
  };

  // Get exact matches for activity categories
  const getExactMatches = (activityId) => {
    return classes.filter(cls => cls.primaryTag === activityId);
  };
  const getClassRecommendations = (selectedClass) => {
    return classes
      .filter(cls => cls.id !== selectedClass.id) // Exclude the selected class
      .map(cls => {
        let score = 0;
        
        // Same primary tag gets highest weight
        if (cls.primaryTag === selectedClass.primaryTag) {
          score += 10;
        }
        
        // Shared secondary tags get medium weight
        selectedClass.tags.forEach(tag => {
          if (cls.tags.includes(tag) && tag !== selectedClass.primaryTag) {
            score += 3;
          }
        });
        
        // Related activities get lower weight
        const relatedActivities = getRelatedActivities(selectedClass.primaryTag);
        relatedActivities.forEach(related => {
          if (cls.tags.includes(related)) {
            score += 2;
          }
        });
        
        return { ...cls, score };
      })
      .filter(cls => cls.score > 0) // Only show classes with some relevance
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Limit to 5 recommendations
  };

  // Define related activities for cross-recommendations
  const getRelatedActivities = (activityId) => {
    const relationships = {
      tennis: ['cardio', 'strength'],
      yoga: ['strength'],
      cardio: ['strength', 'dance'],
      strength: ['cardio'],
      dance: ['cardio'],
      swimming: ['cardio']
    };
    return relationships[activityId] || [];
  };

  const handleActivityClick = (activity) => {
    trackInteraction('activity', activity);
    setSelectedActivity(activity);
    setCurrentView('activityList');
  };

  const handleClassClick = (classItem) => {
    trackInteraction('class', classItem);
    setSelectedClass(classItem);
    setCurrentView('classDetail');
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedActivity(null);
    setSelectedClass(null);
  };

  const goBack = () => {
    if (currentView === 'classDetail') {
      setCurrentView('activityList');
      setSelectedClass(null);
    } else {
      goHome();
    }
  };

  if (currentView === 'home') {
    const personalizedRecommendations = getPersonalizedRecommendations();

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Fitness Class Finder
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {activities.map(activity => (
              <button
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className={`${activity.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
              >
                <div className="text-4xl mb-2">{activity.icon}</div>
                <div className="text-lg font-semibold">{activity.name}</div>
              </button>
            ))}
          </div>

          {/* Personalized Recommendations Section */}
          {personalizedRecommendations.length > 0 && (
            <div className="mb-8 bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="w-6 h-6 text-blue-500 mr-2" />
                Recommended for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedRecommendations.map(cls => (
                  <div key={cls.id} onClick={() => handleClassClick(cls)} className="cursor-pointer">
                    <ClassCard class={cls} isRecommended={true} isClickable={true} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Based on your recent activity: {
                  [...new Set(userInteractions.slice(-5).map(i => 
                    i.type === 'activity' ? i.item.name : i.item.primaryTag
                  ))].join(', ')
                }
              </p>
            </div>
          )}
          
          {/* How it works section - only shown when no recommendations */}
          {personalizedRecommendations.length === 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">How it works:</h2>
              <div className="text-gray-600 space-y-2">
                <p>• Click on any activity above to see available classes</p>
                <p>• Click on specific classes to see personalized recommendations</p>
                <p>• The system learns from your interests and suggests relevant classes</p>
                <p>• Both group classes and private sessions are included</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'activityList') {
    const exactMatches = getExactMatches(selectedActivity.id);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <div className={`${selectedActivity.color} text-white px-4 py-2 rounded-lg flex items-center`}>
              <span className="text-2xl mr-2">{selectedActivity.icon}</span>
              <span className="text-lg font-semibold">{selectedActivity.name} Classes</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {exactMatches.map(cls => (
              <div key={cls.id} onClick={() => handleClassClick(cls)} className="cursor-pointer">
                <ClassCard class={cls} isClickable={true} />
              </div>
            ))}
          </div>

          {exactMatches.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No classes found for {selectedActivity.name}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'classDetail') {
    const recommendations = getClassRecommendations(selectedClass);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          </div>

          {/* Selected Class Details */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8 border-2 border-blue-400">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{selectedClass.name}</h1>
              <div className="flex items-center text-gray-600">
                {selectedClass.type === 'group' ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 text-lg">{selectedClass.description}</p>
            
            <div className="flex items-center justify-between text-gray-600">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {selectedClass.duration} minutes
              </div>
              <div>{selectedClass.instructor}</div>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                You might also like
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map(cls => (
                  <div key={cls.id} onClick={() => handleClassClick(cls)} className="cursor-pointer">
                    <ClassCard class={cls} isClickable={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No related recommendations available</p>
            </div>
          )}
        </div>
      </div>
    );
  }
};

const ClassCard = ({ class: cls, isHighlighted = false, isClickable = false }) => {
  const cardClass = isHighlighted 
    ? "bg-white border-2 border-yellow-400 shadow-lg" 
    : "bg-white border border-gray-200 shadow-md";

  const hoverClass = isClickable ? "hover:shadow-lg hover:scale-105 transform transition-all duration-200" : "hover:shadow-lg transition-shadow duration-200";

  return (
    <div className={`${cardClass} ${hoverClass} rounded-lg p-4`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800">
          {cls.name}
        </h3>
        <div className="flex items-center text-gray-600 text-sm">
          {cls.type === 'group' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-3">
        {cls.description}
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {cls.duration} min
        </div>
        <div className="text-gray-600">
          {cls.instructor}
        </div>
      </div>
      
      {isHighlighted && (
        <div className="mt-2 text-xs text-yellow-600 font-medium">
          Highly recommended for you
        </div>
      )}
      
      {isClickable && (
        <div className="mt-2 text-xs text-blue-600 font-medium">
          Click for recommendations →
        </div>
      )}
    </div>
  );
};

export default FitnessRecommendationApp;

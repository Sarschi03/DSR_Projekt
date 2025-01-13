import React, { useEffect, useState } from 'react';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  github_username: string | null;
  role: string;
  profile_image_url: string | null;
  created_at: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    console.log('User ID from localStorage:', userId);  // Debugging line

    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    // Fetch user data from backend API
    fetch('http://localhost:8000/get_user.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data);  // Debugging line
        if (data.success) {
          const foundUser = data.users.find((user: User) => user.user_id === parseInt(userId));
          if (foundUser) {
            setUser(foundUser);
          } else {
            setError('User not found');
          }
        } else {
          setError('Failed to fetch user data');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);  // Log the error to the console for debugging
        setError('An error occurred while fetching the user data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User data not available.</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <img
          src={user.profile_image_url || 'https://via.placeholder.com/150'}
          alt={`${user.first_name} ${user.last_name}`}
          style={{ width: 150, height: 150, borderRadius: '50%' }}
        />
        <h2>{`${user.first_name} ${user.last_name}`}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>GitHub: {user.github_username ? user.github_username : 'Not provided'}</p>
        <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useRouter, Link } from 'expo-router';

type Profile = {
  id: string;
  name: string;
  title: string;
  experience: string;
  language: string;
  image: string;
};

const UserProfile = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const swiperRef = useRef<Swiper<Profile>>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_user.php');
        const data = await response.json();

        if (data.success) {
          const formattedProfiles: Profile[] = data.users.map((user: any) => ({
            id: user.user_id,
            name: `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`,
            title: `${user.role.replace('_', ' ').toUpperCase()} DEVELOPER`,
            experience: 'N/A',
            language: 'N/A',
            image: user.profile_image_url || 'https://via.placeholder.com/150',
          }));

          setProfiles(formattedProfiles);
        } else {
          console.error('Failed to fetch profiles:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
    onPanResponderMove: (_, gestureState) => {
      const newWidth = Math.max(150, sidebarWidth + gestureState.dx);
      setSidebarWidth(newWidth);
    },
  });

  const handleLeftPress = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeLeft();
    }
  };

  const handleRightPress = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeRight();
    }
  };

  const handleSwipeEnd = () => {
    router.push('./index');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, { width: sidebarWidth }]} {...panResponder.panHandlers}>
        <Image
          source={{ uri: profiles[0]?.image || 'https://via.placeholder.com/50' }}
          style={styles.profileImageHeader}
        />
        <Link href={'/(tabs)/profile'}>
          <Text style={styles.sidebarHeader}>MY PROFILE</Text>
        </Link>
        <View style={styles.messagesContainer}>
          <Text style={styles.mTitle}>Messages</Text>
          <Text style={styles.message}>Typing...</Text>
          <Text style={styles.message}>Sent 5 hours ago</Text>
          <Text style={styles.message}>Seen</Text>
        </View>
      </View>

      <View style={styles.swiperContainer}>
        {profiles.length > 0 ? (
          <Swiper
            cards={profiles}
            renderCard={(card) => (
              <View style={styles.card}>
                <Image source={{ uri: card.image }} style={styles.profileImage} />
                <Text style={styles.name}>{card.name}</Text>
                <Text style={styles.title}>{card.title}</Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>YEARS OF EXPERIENCE: </Text>
                  {card.experience}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>PREFERRED LANGUAGE: </Text>
                  {card.language}
                </Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={handleLeftPress}>
                    <Text style={styles.buttonText}>✘</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={handleRightPress}>
                    <Text style={styles.buttonText}>✔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ref={swiperRef}
            onSwipedLeft={handleSwipeEnd}
            onSwipedRight={handleSwipeEnd}
            cardIndex={0}
            backgroundColor="transparent"
            stackSize={3}
            animateOverlayLabelsOpacity
            animateCardOpacity={true}
            cardVerticalMargin={15}
          />
        ) : (
          <Text style={{ color: '#fff' }}>No profiles available</Text>
        )}
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#131313',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  profileImageHeader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  sidebarHeader: {
    color: '#7b7b7b',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 30,
    fontFamily: 'Roboto Light',
    fontStyle: 'italic',
  },
  messagesContainer: {
    alignSelf: 'stretch',
    marginTop: 60,
  },
  mTitle: {
    color: '#888',
    marginVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    height: 40,
    paddingLeft: 30,
    fontFamily: 'Roboto Light',
    fontStyle: 'italic',
  },
  message: {
    color: '#888',
    marginVertical: 10,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    height: 40,
    paddingLeft: 30,
    fontFamily: 'Roboto Thin',
    fontStyle: 'italic',
  },
  swiperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 380,
    height: 560,
    backgroundColor: '#131313',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginLeft: '20%',
    marginTop: '3%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    color: '#fff',
    marginVertical: 5,
    fontFamily: 'Roboto Medium',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 20,
    fontFamily: 'Roboto Thin',
  },
  info: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 5,
    fontFamily: 'Roboto Light',
  },
  label: {
    color: '#aaa',
    fontFamily: 'Roboto Light',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '35%',
    width: '50%',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLeft: {
    backgroundColor: '#5dbea3',
  },
  buttonRight: {
    backgroundColor: '#5dbea3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default UserProfile;

import { StyleSheet } from 'react-native';
import { Text, ScreenView } from '@/components/Themed';


export default function TabOneScreen() {
  return (
    <ScreenView style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

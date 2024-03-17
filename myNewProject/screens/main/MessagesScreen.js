import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessagesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Скрытьообщение</Text>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Здесь будет сообщение между пользователями</Text>
        <Text style={styles.message}>Все еще дорабатываем</Text>
        {/* Добавьте здесь другие сообщения */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageContainer: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default MessagesScreen;

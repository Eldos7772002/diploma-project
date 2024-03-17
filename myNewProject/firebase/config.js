import AsyncStorage from "@react-native-async-storage/async-storage"; // Импортируем AsyncStorage из пакета @react-native-async-storage/async-storage для работы с асинхронным хранилищем данных.

import { 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth/react-native"; // Импортируем функции initializeAuth и getReactNativePersistence из модуля "firebase/auth/react-native" для инициализации аутентификации и получения настроек сохранения данных для React Native.

import { 
  initializeApp 
} from "firebase/app"; // Импортируем функцию initializeApp из модуля "firebase/app" для инициализации приложения Firebase.

import { 
  getStorage 
} from 'firebase/storage'; // Импортируем функцию getStorage из модуля 'firebase/storage' для получения ссылки на хранилище Firebase.

import { 
  initializeFirestore 
} from "firebase/firestore"; // Импортируем функцию initializeFirestore из модуля "firebase/firestore" для инициализации Firestore.

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDBqVoA4EsYwqUyB7NJeSeV1ZVN8RffelQ",
  authDomain: "sociallapp-8bcab.firebaseapp.com",
  projectId: "sociallapp-8bcab",
  storageBucket: "sociallapp-8bcab.appspot.com",
  messagingSenderId: "85337278972",
  appId: "1:85337278972:web:915c445b270f9dc9aa4a79",
  measurementId: "G-FSMT294XHH"
};

// Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);

// Экспорт объекта Firestore, инициализированного для данного приложения
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Опция для использования длинного опроса (long polling) в случае проблем с WebSockets
});

// Инициализация аутентификации Firebase
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Настройка сохранения данных аутентификации с использованием AsyncStorage для React Native
});

// Получение ссылки на хранилище Firebase для данного приложения
export const storage = getStorage(app);

// Экспорт объекта приложения Firebase
export default app;

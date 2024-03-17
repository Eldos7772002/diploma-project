import React, { useState, useEffect } from "react";
import { StyleSheet, View, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, Alert } from "react-native";
import { useDispatch } from 'react-redux';
import uuid from "react-native-uuid";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from "expo-media-library";
import { AntDesign } from '@expo/vector-icons';
import { storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { authSignUpUser } from "../../redux/auth/authOperations";

// Начальное состояние формы регистрации
const initialState = {
  nickname: "",
  email: "",
  password: "",
  userPhoto: "",
};

export default function RegistrationScreen({ navigation }) {
  const { height, width } = Dimensions.get('window');

  // Состояния компонента
  const [isSecureEntry, setSecureEntry] = useState(true);
  const [state, setState] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [libraryPermission, setLibraryPermission] = useState();
  const [isFocused, setIsFocused] = useState({
    nickname: false,
    email: false,
    password: false,
  });

  // Redux
  const dispatch = useDispatch();

  // Функции для обработки фокуса и размытия полей ввода
  const onFocus = (inputName) => {
    setIsFocused({
      [inputName]: true
    })
  }

  const onBlur = (inputName) => {
    setIsFocused({
      [inputName]: false
    })
  }

  // Запрос разрешений на доступ к библиотеке медиа
  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  // Выбор профильного изображения из галереи
  const PickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (result.canceled) {
      Alert.alert('Выберите изображение');
    }

    if (!result.canceled) {
      const photoLink = await uploadPhotoToServer(result.assets[0].uri);
      setProfileImage(photoLink);
      setState((prevState) => ({
        ...prevState,
        userPhoto: photoLink,
      }));
    }
  }

  // Загрузка изображения на сервер
  const uploadPhotoToServer = async (photo) => {
    try {
      const id = uuid.v4();
      const storageRef = ref(storage, `images/${id}`);
      const resp = await fetch(photo);
      const file = await resp.blob();
      await uploadBytesResumable(storageRef, file);
      const link = await getDownloadURL(ref(storage, `images/${id}`));
      return link;
    } catch (error) {
      Alert.alert(error.message);
      return;
    }
  };

  // Удаление профильного изображения
  const RemoveProfileImage = () => {
    setProfileImage(false);
  }

  // Обработка отправки формы регистрации
  const handleSubmit = () => {
    if (!state.email || !state.nickname || !state.userPhoto || !state.password) {
      return Alert.alert('Все поля обязательны для заполнения');
    }
    dispatch(authSignUpUser(state));
    setState(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        height={height}
        width={width}
        style={styles.container}
        keyboardVerticalOffset={-150}
    >
        <ImageBackground
          style={styles.image}
          height={height}
          width={width}
          preserveAspectRatio='xMidYWid slice'
          source={require("../../assets/images/signUp.jpg")}
        >
        <View style={styles.innerBox} height={height / 1.55}>
            {profileImage ?
              <Image
                source={{ uri: profileImage }}
                style={{...styles.photoBox, width: 120, height: 120 }} />
              : <View style={{ ...styles.photoBox, backgroundColor: "#F6F6F6" }} />}
            {profileImage ?
              <TouchableOpacity onPress={RemoveProfileImage} >
              <View style={{...styles.photoBoxBtn, borderColor: "#BDBDBD"}}>
                  <AntDesign name="close" size={16} color="#BDBDBD"/>
                </View>
            </TouchableOpacity> :
              <TouchableOpacity onPress={PickProfileImage}>
                <View style={{...styles.photoBoxBtn, borderColor: "#FF6C00"}}>
                  <AntDesign name="plus" size={16} color="#FF6C00"/>
                </View>
              </TouchableOpacity>
            }
            <Text style={styles.titleText}>Создать аккаунт</Text>
                <View style={styles.form}>
                  <TextInput
                    style={isFocused.nickname ? [styles.input, styles.inputFocused] : styles.input}
                    placeholder="Логин"
                    placeholderTextColor="#BDBDBD"
                    textContentType={"username"}
                    value={state.nickname}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, nickname: value }))
                    }
                    onFocus={() => onFocus('nickname')}
                    onBlur={() => onBlur('nickname')}
                  />
                  <TextInput
                    style={isFocused.email ? [styles.input, styles.inputFocused] : styles.input}
                    placeholder="Email"
                    placeholderTextColor="#BDBDBD"
                    inputmode={'email'}
                    textContentType={"emailAddress"}
                    keyboardType={'email-address'}
                    value={state.email}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, email: value }))
                    }
                    onFocus={() => onFocus('email')}
                    onBlur={() => onBlur('email')}
                  />
              <View>
                  <TextInput
                    style={isFocused.password ? [styles.input, styles.inputFocused] : {...styles.input, position: 'relative'}}
                    placeholder="Пароль"
                    placeholderTextColor="#BDBDBD"
                    textContentType={"password"}
                    secureTextEntry={isSecureEntry}
                    maxLength={10}
                    value={state.password}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, password: value }))
                    }
                    onFocus={() => onFocus('password')}
                    onBlur={() => onBlur('password')}
                />
                <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                  <Text style={styles.textSecure}>{isSecureEntry ? "Показать" : "Скрыть"}</Text></TouchableOpacity>
              </View>
            <View style={styles.btnBox}>
                <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btnText}>Зарегистрироваться</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text onPress={() => navigation.navigate("Login")} style={styles.text}>У вас уже есть учетная запись? Войти</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  innerBox: {
    position: "relative",
    alignItems: 'center',
    backgroundColor: "#fff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  photoBox: {
    position: "absolute",
    marginTop: -60,
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  photoBoxBtn: {
    position: "absolute",
    alignContent: 'center', 
    left: 48,
    marginVertical: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 50,
    width: 23,
    height: 23,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    marginTop: 92,
    marginBottom: 15,
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 1,
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 16,
    height: 50,
    padding: 15,
    fontFamily: "Roboto-Regular",
    color: "#212121",
    fontSize: 16,
    lineHeight: 19,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
  },
  inputFocused: {
    borderColor: '#FF6C00',
    backgroundColor: '#FFFFFF'
  },
  textSecure: {
    position: "absolute",
    marginTop: -35,
    marginLeft: Platform.OS == "ios" ? 335 : 305,
    color: '#1B4371',
  },
  btnBox: {
    marginTop: 45,
  },
  btn: {
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  btnText: {
    fontFamily: "Roboto-Regular",
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    padding: 16,
  },
  text: {
    marginTop: 18,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: '#1B4371',
    textAlign: 'center',
  }
});

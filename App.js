import 'react-native-gesture-handler';
import * as React from 'react';
import { useState, useRef, useEffect, useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ActivityIndicator, TouchableRipple, BottomNavigation, Appbar, RadioButton, TextInput, Colors,  Searchbar,  Divider, Title, Paragraph, Surface, List, Avatar, Snackbar,} from 'react-native-paper';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { LineChart } from "react-native-chart-kit";
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
var S3 = require('aws-sdk/clients/s3');
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";
import notifee from "@notifee/react-native"
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

// language components
import French from './assets/franch';
import Swahili from './assets/swahili';

const ACCESS_KEY_ID = 'AKIA55RAOI3SBYWGVFVZ';
const SECRET_ACCESS_KEY = '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';
const PROFILES_BUCKET = 'flux-user-profiles';
const REGION = 'us-east-2';
const IDENTITY_POOL_ID =  'us-east-2:60fc8b38-6443-400d-8013-26e0c756abae';

const Stack = createStackNavigator();
const AuthContext = React.createContext();

function Loading({ navigation }){
  return(
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
       <StatusBar hidden={true} />
      <ActivityIndicator animating={true} color={Colors.blue700} size="large" />
    </SafeAreaView>
  );
}

function Welcome({ navigation }){
  const [language, setLanguage] = useState(null);
  const handleLanguageChoice = async(lang) => {
    switch(lang){
      case 'KISW':
        await AsyncStorage.setItem('lang', 'KISW');
        break;

        case 'ENG':
          await AsyncStorage.setItem('lang', 'ENG');
          break;

          default:
            await AsyncStorage.setItem('lang', 'FRENCH');
    }
    navigation.navigate("Login");
  }

  useEffect(() => {
    async function A(){
      var lang = await AsyncStorage.getItem('lang');
      switch(lang){
        case "ENG":
          setLanguage("ENG");
          break;
        case 'KISW':
            setLanguage("KISW");
            break;
        default:
            setLanguage("FRENCH")
      }
    }

    A();

  }, [])
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.blue700, justifyContent: 'space-between',}} >
       <StatusBar hidden={true} />
      <View style={{alignItems: 'center', marginTop: '10%'}} >
      <Avatar.Image style={{marginBottom: 5}}  size={100} source={require('./assets/stethescope.png')}/>
      <Paragraph style={{color: 'white', textDecorationLine: language === 'KISW' ? 'line-through' : null}}>Chagua lugha upendayo</Paragraph>
      <Paragraph  style={{color: 'white',  textDecorationLine: language === 'ENG' ? 'line-through' : null}}>Choose preferred language</Paragraph>
      <Paragraph  style={{color: 'white',  textDecorationLine: language === 'FRENCH' ? 'line-through' : null}}>Choisissez la langue préférée</Paragraph>
      </View>
      <View style={{marginLeft: 20, marginRight: 20}}>
      <TouchableRipple style={{marginBottom: 10,}} onPress={() => {setLanguage('KISW')}} >
      <Button mode= "outlined" icon={language === 'KISW' ? "check" : null} contentStyle={{height: 50,}} labelStyle={{color: 'white'}} style={{borderStartColor: 'white', borderStartWidth: 1, borderEndColor: 'white', borderEndWidth: 1, borderLeftColor: 'white', borderLeftWidth: 1, borderBottomColor: 'white', borderBottomWidth: 1, borderTopColor: 'white', borderTopWidth: 1, backgroundColor: language === 'KISW' ? Colors.green700 : null}} >Tumia Kiswahili</Button>
      </TouchableRipple>
      <TouchableRipple style={{marginBottom: 10,}} onPress={() => {setLanguage('ENG')}} >
      <Button mode= "contained" icon={language === 'ENG' ? "check" : null} contentStyle={{height: 50, }} labelStyle={{color: 'white',}} style={{borderStartColor: 'white', borderStartWidth: 1, borderEndColor: 'white', borderEndWidth: 1, borderLeftColor: 'white', borderLeftWidth: 1, borderBottomColor: 'white', borderBottomWidth: 1, borderTopColor: 'white', borderTopWidth: 1, backgroundColor: language === 'ENG' ? Colors.green700 : null}} >Use English</Button>
      </TouchableRipple>
      <TouchableRipple  style={{marginBottom: 10,}} onPress={() => {setLanguage('FRENCH')}}>
      <Button mode= "outlined" icon={language === 'FRENCH' ? "check" : null} contentStyle={{height: 50,}} labelStyle={{color: 'white'}} style={{borderStartColor: 'white', borderStartWidth: 1, borderEndColor: 'white', borderEndWidth: 1, borderLeftColor: 'white', borderLeftWidth: 1, borderBottomColor: 'white', borderBottomWidth: 1, borderTopColor: 'white', borderTopWidth: 1, backgroundColor: language === 'FRENCH' ? Colors.green700 : null }} >Utiliser le français</Button>
      </TouchableRipple>
      </View  >
      <View style={{flexDirection: 'row-reverse', marginBottom: 20, marginRight: 10,}} >
      <TouchableRipple disabled={language === null ? true : false} style={{marginBottom: 10, marginRight: 10,}} onPress={() => {handleLanguageChoice(language)}}>
      <Button  mode= "outlined" icon="chevron-right" contentStyle={{height: 60,}} labelStyle={{color: Colors.green700}} style={{  backgroundColor: language === null ? "lavender" : "white"}} >Continue</Button>
      </TouchableRipple>
      </View>
          </SafeAreaView>
  )
}

function Login({navigation}){
  const [language, setLanguage] = useState({});
  const [t, setT] = useState(false);

  // login credentials
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailerror, setEmailError] = useState(false);
  const [passworderror, setPasswordError] = useState(false);

  const height = (Dimensions.get('window').height) * 1/2;
  const height2 = (Dimensions.get('window').height) * 3/4;

  const { signIn } = React.useContext(AuthContext);

  useEffect(() => {
    async function A(){
      var lang = await AsyncStorage.getItem('lang');
      switch(lang){
        case "ENG":
          setLanguage({});
          break;
        case 'KISW':
            setLanguage(Swahili);
            setT(true);
            break;
        default:
            setLanguage(French)
            setT(true);
      }
    }

    A();
  }, []);

  const handleLogin = () => {
    signIn({username: 'dave', password: '12345'}); 
  }
  return(
    <SafeAreaView style={StyleSheet.container} >
      <StatusBar hidden={true} />
      <ImageBackground source={require('./assets/nurse.png')} resizeMode="cover" style={{ height: height, justifyContent: 'space-between',}}>
      <View style={{marginTop: height * 3/4, height: height2 * 3/4,  marginRight: 20, marginLeft: 20, backgroundColor: 'white', marginBottom: 20,}} >
      <View style={{alignItems: 'center', marginTop: 20,}} >
        <Title style={{ fontSize: 26, marginBottom: 5,}} >{t ? language.statement1 : "Sign In"}</Title>
        <Text style={{fontSize: 18,}} >{t ? language.statement2 : "Please enter your information to proceed!"}</Text>
      </View>
      <View style={{marginTop: 20, marginLeft: 10, marginRight: 10,}} >
      <TextInput
            style={{ marginBottom: 10, height: 45, backgroundColor: "#FDFEFE"}}
            mode='outlined'
            placeholder={t ? language.statement3 : "Email"}
            selectionColor='white'
          />
                <TextInput
            style={{ marginBottom: 10, height: 45, backgroundColor: "#FDFEFE"}}
            mode='outlined'
            placeholder={t ? language.statement4 : "Password"}
            selectionColor='white'
            secureTextEntry={true}
            right = {<TextInput.Icon name="eye" size={15} />}
          />

      </View>
      <View style={{marginBottom: 30, marginTop: 10, alignItems: 'center'}} >
       <TouchableRipple onPress={() => {navigation.navigate("ForgotPassword")}} >
       <Text style={{color: Colors.blue700, fontSize: 18,}} >{t ? language.statement5 : "Forgot Password?"}</Text>
       </TouchableRipple>
      </View>

      <View style={{marginRight: 10, marginLeft: 10}} >
      <TouchableRipple  style={{ width: '100%'}} onPress={() => { handleLogin()}} >
            <Button  mode= "contained" contentStyle={{height: 50,}}  style={{  backgroundColor: Colors.blue700, borderRadius: 10,}} >{t ? language.statement6 : "Login"}</Button>
          </TouchableRipple>
      </View>
      </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

function ForgotPassword({ navigation }){
  const [language, setLanguage] = useState({});
  const [t, setT] = useState(false);
  const height = (Dimensions.get('window').height) * 1/2;
  const height2 = (Dimensions.get('window').height) * 3/4;

  useEffect(() => {
    async function A(){
      var lang = await AsyncStorage.getItem('lang');
      switch(lang){
        case "ENG":
          setLanguage({});
          break;
        case 'KISW':
            setLanguage(Swahili);
            setT(true);
            break;
        default:
            setLanguage(French)
            setT(true);
      }
    }

    A();
  }, []);

  return(
    <SafeAreaView style={{flex: 1,}} >
      <StatusBar hidden={true} />
        <ImageBackground source={require('./assets/hospital.jpg')} resizeMode="cover" style={{ height: height, justifyContent: 'space-between',}}>
      <View style={{marginTop: height * 3/4, height: height2 * 3/4,  marginRight: 20, marginLeft: 20, backgroundColor: 'white', marginBottom: 20,}} >
      <View style={{alignItems: 'center', marginTop: 20,}} >
        <Title style={{ fontSize: 26, marginBottom: 5,}} >{t ? language.statement20 : "Forgot Password?"}</Title>
        <Text style={{fontSize: 18,}} >{t ? language.statement21 : "Give us your email and we will help you to reset it!"}</Text>
      </View>
      <View style={{marginTop: 20, marginLeft: 10, marginRight: 10,}} >
      <TextInput
            style={{ marginBottom: 10, height: 45, backgroundColor: "#FDFEFE"}}
            mode='outlined'
            placeholder={t ? language.statement22 : "Email"}
            selectionColor='white'
          />

      </View>
      <View style={{marginBottom: 30, marginTop: 10, alignItems: 'center'}} >
       <TouchableRipple onPress={() => {navigation.navigate("Login")}} >
       <Text style={{color: Colors.blue700, fontSize: 18,}} >{t ? language.statement23 : "Login Instead"}</Text>
       </TouchableRipple>
      </View>

      <View style={{marginRight: 10, marginLeft: 10}} >
      <TouchableRipple  style={{ width: '100%'}} onPress={() => { handleLogin()}} >
            <Button  mode= "contained" contentStyle={{height: 50,}}  style={{  backgroundColor: Colors.blue700, borderRadius: 10,}} >{t ? language.statement24 : "Reset Password"}</Button>
          </TouchableRipple>
      </View>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

function Home({navigation}){
  const [index, setIndex] = React.useState(0);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [globallang, setGlobalLang] = useState({});
  const [globalt, setGlobalT] = useState(false);
  useEffect(() => {
    const initLocation = async () => {
      Geolocation.getCurrentPosition(async position => {
            setLatitude(parseFloat(position.coords.latitude));
            setLongitude(parseFloat(position.coords.longitude));
    
      }, 
      error => console.log(error),
      );
    
    }
    
    initLocation();

    async function A(){
      var lang = await AsyncStorage.getItem('lang');
      switch(lang){
        case "ENG":
          setGlobalLang({});
          break;
        case 'KISW':
            setGlobalLang(Swahili);
            setGlobalT(true);
            break;
        default:
            setGlobalLang(French)
            setGlobalLang(true);
      }
    }

    A();
  }, [])

  const Dashboard = ({ navigation }) => {
    const [language, setLanguage] = useState({});
    const [t, setT] = useState(false);
    const height1 = (Dimensions.get('window').height) * 0.08;
    const height2 = (Dimensions.get('window').height) * 99.92;
    const surfaceHeight1 = (Dimensions.get('window').height) * 0.25;
    const surfaceHeight2 = (Dimensions.get('window').height) * 0.3;
    const surfaceWidth = (Dimensions.get('window').width);
    const surfaceWidth2 = (Dimensions.get('window').width) * 0.6;
    const surfaceWidth1 = (Dimensions.get('window').width) * 0.45;
    const [network, setNetwork] = useState(false);

    useEffect(() => {
      async function A(){
        var lang = await AsyncStorage.getItem('lang');
        switch(lang){
          case "ENG":
            setLanguage({});
            break;
          case 'KISW':
              setLanguage(Swahili);
              setT(true);
              break;
          default:
              setLanguage(French)
              setT(true);
        }
      }

      A();

      var timer = setInterval(function(){RefreshConnections()}, 1000);
      var timer2 = setInterval(function(){RefreshLanguages()}, 1000);
  
      return () => {
        clearInterval(timer);
        clearInterval(timer2);
      }
    }, []);

    const RefreshLanguages = React.useCallback(() => {
      async function A(){
        var lang = await AsyncStorage.getItem('lang');
        switch(lang){
          case "ENG":
            setLanguage({});
            break;
          case 'KISW':
              setLanguage(Swahili);
              setT(true);
              break;
          default:
              setLanguage(French)
              setT(true);
        }
      }
  
      A();
    }, []);
  
    const RefreshConnections = React.useCallback(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        state.isConnected ? setNetwork(true): setNetwork(false);
      });
      
      unsubscribe();
    }, [])

    return (
      <SafeAreaView style={{flex: 1,}} >
        <StatusBar backgroundColor={Colors.blue700}/>
      <Appbar.Header style={{backgroundColor: Colors.blue700}} >
      <Appbar.Content title={t ? language.statement7 : "Home"}  style={{color: 'white',}} />
        </Appbar.Header>
      <View style={{height: height1, backgroundColor: Colors.blue700}} >
        <Searchbar placeholder={t ? language.statement8 : 'Search Clients, Inventory ...'} iconColor='white' inputStyle={{color: 'white'}}  style={{ color: 'white', marginBottom: 10, marginLeft: 10, marginRight: 10, height: 40, backgroundColor: '#84A9FF', borderBottomWidth: 1, borderBottomColor: 'white', borderEndWidth: 1, borderEndColor: 'white', borderLeftColor: 'white', borderLeftWidth: 1, borderStartColor: 'white', borderStartWidth: 1,}} placeholderTextColor='white' />
      </View>

        <List.Item
        title={t ? language.statement9 : "Emergency"}
        description={ t ? language.statement10 : "Call ambulance"}
        left={props => <Avatar.Image size={50} source={require('./assets/ambulance.png')} />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', height: surfaceHeight2}} >
          <TouchableRipple onPress={() => {setIndex(1)}} >
        <Surface style={{  borderTopWidth: 3, borderTopColor: Colors.purple700, marginLeft: 10, width: surfaceWidth1, elevation: 4, height: surfaceHeight1}}>
         <View style={{marginTop: 10, marginLeft: 10,}} >
         <List.Icon color={Colors.blue700} icon="account" />
         </View>
         <View style={{marginTop: 30, marginLeft: 10}} >
          <Title >{t ? language.statement11 : "Clients"}</Title>
          <Paragraph>{t ? language.statement12 : "Manage Clients"}</Paragraph>
         </View>
        </Surface>
        </TouchableRipple>
        <TouchableRipple onPress={() => {setIndex(2)}} >
        <Surface style={{ borderTopWidth: 3, borderTopColor: Colors.cyan700, marginRight: 10, width: surfaceWidth1, elevation: 4, height: surfaceHeight1}}>
        <View style={{marginTop: 10, marginLeft: 10,}} >
         <List.Icon color={Colors.blue700} icon="cart" />
         </View>
         <View style={{marginTop: 30, marginLeft: 10}} >
          <Title >{t ? language.statement13 : "Sales"}</Title>
          <Paragraph>{t ? language.statement14 : "Manage Sales"}</Paragraph>
         </View>
        </Surface>
        </TouchableRipple>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', height: surfaceHeight2}} >
        <TouchableRipple onPress={() => {setIndex(3)}} >
        <Surface style={{ borderTopWidth: 3, borderTopColor: Colors.green700, marginLeft: 10, width: surfaceWidth1, elevation: 4, height: surfaceHeight1}}>
        <View style={{marginTop: 10, marginLeft: 10,}} >
         <List.Icon color={Colors.blue700} icon="cash" />
         </View>
         <View style={{marginTop: 30, marginLeft: 10}} >
          <Title >{t ? language.statement15 : "Rewards"}</Title>
          <Paragraph>{t ? language.statement16 : "Redeem points"}</Paragraph>
         </View>
        </Surface>
        </TouchableRipple>
        <TouchableRipple onPress={() => {setIndex(4)}} >
        <Surface style={{ borderTopWidth: 3, borderTopColor: Colors.yellow700, marginRight: 10, width: surfaceWidth1, elevation: 4, height: surfaceHeight1}}>
        <View style={{marginTop: 10, marginLeft: 10,}} >
         <List.Icon color={Colors.blue700} icon="calendar" />
         </View>
         <View style={{marginTop: 30, marginLeft: 10}} >
          <Title >{t ? language.statement17 : "Explore"}</Title>
          <Paragraph>{t ? language.statement18: "Learn more"}</Paragraph>
         </View>
        </Surface>
        </TouchableRipple>
        </View>
      </SafeAreaView>
    )
  }

  const Client = ({ navigation }) => {
    const [list1, setList1] = useState(false);
    const [list2, setList2] = useState(false);
    const [list3, setList3] = useState(false);
    const [basic, setBasic] = useState(false);
    const [basicdone, setBasicDone] = useState(false);
    const [photo, setPhoto] = useState(false);
    const [photo2, setPhoto2] = useState(null);
    const [alignment, setAlignment] = useState(false);
    const [alignmentdone, setAlignmentDone] = useState(false);
    const [disease, setDisease] = useState(null);
    const [diseasedesc, setDiseaseDesc] = useState(null);
    const [photoasset, setPhotoAsset] = useState(null);
    const [habits, setHabits] = useState(false);
    const [habitsdone, setHabitsDone] = useState(false);
    const [customerhabits, setCustomerHabits] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [galleryOptions, setGalleryOptions] = React.useState({
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
    });
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [age, setAge] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [gender, setGender] = useState(null);
    const [snack, setSnack] = useState(false);
    const [language, setLanguage] = useState({});
    const [t, setT] = useState(false);
    const [network, setNetwork] = useState(false);

    const chooseCameraGallary = () => {
      Alert.alert(
        "Upload Photo",
        "Choose image source",
        [
          {
            text: "Camera",
            onPress: () => openCamera()
          },
          { text: "Gallery", onPress: () => openGallery() },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      );
    }

    const openCamera = () => {

      let options = {
  
        storageOptions: {
  
          skipBackup: true,
  
          path: 'images',
  
        },
  
      };
  
      ImagePicker.launchCamera(options, (res) => {
  
        console.log('Response = ', res);
  
        if (res.didCancel) {
  
        console.log('cancelled!');
  
        } else if (res.error) {
  
          console.log('error!');
  
        } else {
          setPhotoAsset(res);
        }
  
      });
  
  }

  const openGallery = () => {
    ImagePicker.launchImageLibrary(galleryOptions, (res) => {
      if (res.didCancel) {
       console.log("Cancelled!");
      } else if(res.error) {
        console.log('error');
      } else {
        setPhotoAsset(res)
      }
    });
  }

  const uploadPhotoToS3 = async () => {
    setIndicator(true);

    if(network){
      let contentType = "image/jpg";
      let contentDeposition = 'inline;filename="' +photoasset.assets+ '"';
    
    
      const fPath = photoasset.assets[0].uri;
    
      console.log(fPath);
      const base64 = await fs.readFile(fPath, "base64");
        //console.log(base64);
    
      const arrayBuffer = decode(base64);
    
      const s3Bucket = new S3({
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
        Bucket: PROFILES_BUCKET,
        region: REGION,
        signatureVersion: "v4"
      });
      let key = 'customer_'+ new Date().getTime() / 1000;
      s3Bucket.createBucket(() => {
        const params = {
          Bucket: PROFILES_BUCKET,
          Key: key,
          Body: arrayBuffer,
          ContentDisposition: contentDeposition,
          ContentType: contentType
        };
    
        s3Bucket.upload(params, (err, data) => {
          if(err){
            setIndicator(false);
            console.log(err)
            setError(true);
            setTimeout(function(){setError(false)}, 3000);
          }
    
          setIndicator(false);
          setSuccess(true);
          setPhoto(false);
          setPhotoAsset(key);
        });
      });
    } else {
      alert("Photo will be queued untill we detect connections.")
    }
  }

  useEffect(() => {
    async function requestCamera() {
      var camera = await AsyncStorage.getItem("camera");

      if(camera != "allowed"){
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Permission Request",
              message:
                "Allow HE to use camera " ,
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
           await AsyncStorage.setItem("camera", "allowed");
          } else {
            console.log("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }

    requestCamera()

    async function A(){
      var lang = await AsyncStorage.getItem('lang');
      switch(lang){
        case "ENG":
          setLanguage({});
          break;
        case 'KISW':
            setLanguage(Swahili);
            setT(true);
            break;
        default:
            setLanguage(French)
            setT(true);
      }
    }

    A();

    var timer = setInterval(function(){RefreshConnections()}, 1000);
    var timer2 = setInterval(function(){RefreshLanguages()}, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(timer2);
    }
  }, []);

  const RefreshLanguages = React.useCallback(() => {
    async function A(){
      var lang = await AsyncStorage.getItem('lang');
      switch(lang){
        case "ENG":
          setLanguage({});
          break;
        case 'KISW':
            setLanguage(Swahili);
            setT(true);
            break;
        default:
            setLanguage(French)
            setT(true);
      }
    }

    A();
  }, []);

  const RefreshConnections = React.useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      state.isConnected ? setNetwork(true): setNetwork(false);
    });
    
    unsubscribe();
  }, [])

  const onDismissSnackBar1 = () => {
    setSuccess(false);
    setPhoto(false);
  }
  const onDismissSnackBar2 = () => {
    setError(false);
  }

  const onDismissSnackBar3 = () => {
    setSnack(false);
  }


  function calculateAge(birthday) { 
    var ageDifMs = Date.now() - birthday;
    var ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

    return (
     <SafeAreaView style={{flex: 1,}} >
       <StatusBar backgroundColor={Colors.blue700}/>
      
      {!list1 && !list2 && !list3 ? (
      <Appbar.Header style={{backgroundColor: Colors.blue700}} >
      <Appbar.BackAction onPress={() => {setIndex(0)}} />
    <Appbar.Content title={t ? language.statement25 : "Customers" } style={{color: 'white',}} />
    </Appbar.Header>
      ) : list1 && !list2 && !list3 ? (
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
        <Appbar.BackAction onPress={() => {setList1(false)}} /> 
        <Appbar.Content title={t ? language.statement33 : "Add New Client" } style={{color: 'white',}} />
        </Appbar.Header>
      ): !list1 && list2 && !list3 ? (
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
        <Appbar.BackAction onPress={() => {setList2(false)}} /> 
        <Appbar.Content title="Update Customer Info"  style={{color: 'white',}} />
        </Appbar.Header>
      ): (
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
        <Appbar.BackAction onPress={() => {setList3(false)}} /> 
        <Appbar.Content title="Delete Customer Info"  style={{color: 'white',}} />
        </Appbar.Header>
      )}
       
       <View style={{marginTop: 20, marginLeft: 10, marginBottom: 20,}} >
       {basic && list1 && !alignment && !photo && !habits ? (
         <View>
          <TouchableRipple style={{width: '10%'}} onPress={() => {setBasic(false)}} >
          <Button icon="arrow-left" />
          </TouchableRipple>
            <Title>Add Basic Info</Title>
         </View>
       ) : !basic && list1 && alignment && !photo && !habits ? (
        <View>
        <TouchableRipple style={{width: '10%'}} onPress={() => {setAlignment(false)}} >
        <Button icon="arrow-left" />
        </TouchableRipple>
          <Title>Aillment Description</Title>
       </View>
       ) : !basic && list1 && !alignment && photo && !habits ? (
        <View>
        <TouchableRipple style={{width: '10%'}} onPress={() => {setPhoto(false)}} >
        <Button icon="arrow-left" />
        </TouchableRipple>
          <Title>Customer Photo</Title>
       </View>
       ) : !basic && list1 && !alignment && photo && !habits ? (
        <View>
        <TouchableRipple style={{width: '10%'}} onPress={() => {setHabits(false)}} >
        <Button icon="arrow-left" />
        </TouchableRipple>
          <Title>Customer Habits</Title>
       </View>
       ) : !basic && list1 && !alignment && !photo && !habits ? (
        <View>
        <TouchableRipple style={{width: '10%'}} onPress={() => {setList1(false)}} >
        <Button icon="arrow-left" />
        </TouchableRipple>
          <Title>{t ? language.statement34 : "Add New Customer"}</Title>
       </View>
       ): (
        <Title> {t ? language.statement26 : "Manage Clients"} </Title>
       ) }
       </View>
{!list1 && !list2 && !list3 ? (
  
  <List.Section>
  <List.Accordion
  style={{left: 0, }}
  title={t ? language.statement27 : "Add New Client"}
  description={t ? language.statement28 : "Record down your customer's details"}
  expanded={false}
  onPress={() => {setList1(true)}}
  right={props => <List.Icon {...props} icon="chevron-right" />}>

  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title={t ? language.statement29 : "Update Client"}
  description={t ? language.statement30 : "Change your customer's metadata"}
  expanded={false}
  onPress = {() => {setList2(true)}}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title={t ? language.statement31 : "Delete Client"}
  description={t ? language.statement32 : "Delete your customer's information."}
  expanded={false}
  onPress= {() => {setList3(true)}}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
</List.Section>
) : list1 && !list2 && !list3 ? (
  !basic && !alignment && !photo && !habits ? (
    <List.Section>
    <List.Accordion
    style={{left: 0, }}
    title={t ? language.statement35 : "Basic Information"}
    description={t ? language.statement36 : "Customer name, age, gender etc"}
    expanded={false}
    onPress={() => {setBasic(true)}}
    right={props => <List.Icon {...props} icon={basicdone ? "check" : "chevron-right"} color={basicdone ? Colors.green700 : null} />}>
  
    </List.Accordion>
    <List.Accordion
    style={{left: 0, }}
    title={t ? language.statement37 : "Customer Aillment"}
    description={t ? language.statement38 : "Customer sickness"}
    expanded={false}
    onPress={() => {setAlignment(true)}}
    right={props => <List.Icon {...props} icon={alignmentdone ? "check" : "chevron-right"} color={alignmentdone ? Colors.green700 : null} />}>
      
    </List.Accordion>

    <List.Accordion
    style={{left: 0, }}
    title={t ? language.statement39 : "Customer Habits"}
    description={t ? language.statement40 : "Chronic diseases, smoking, heart failure etc" }
    expanded={false}
    onPress={() => {setHabits(true)}}
    right={props => <List.Icon {...props} icon={habitsdone ? "check" : "chevron-right"} color={habitsdone ? Colors.green700 : null} />}>
      
    </List.Accordion>
    <List.Accordion
    style={{left: 0, }}
    title={t ? language.statement41 : "Customer Photo"}
    description={t ? language.statement42 : "Use camera or upload from gallery" }
    expanded={false}
    onPress={() => {setPhoto(true)}}
    right={props => <List.Icon {...props} icon={photoasset != null ? "check" : "chevron-right"} color={photoasset != null ? Colors.green700 : null} />}>
      
    </List.Accordion>

    <TouchableRipple disabled={basicdone  && alignmentdone  && photoasset != null ? false : true} style={{ marginTop: 20, marginLeft: 20, marginRight: 20,}} onPress={() => {
          setSnack(true);
          setTimeout(function(){setList1(false)}, 2000) 
          }} >
            <Button  mode= "contained" contentStyle={{height: 50,}} labelStyle={{color: 'white'}} style={{ backgroundColor: basicdone  && alignmentdone  && photoasset != null ? Colors.blue700 : 'lavender'}} >{t ? language.statement43 : "Finish" }</Button>
          </TouchableRipple>

          {success ? (
   <Snackbar
   style={{backgroundColor: Colors.green700, color: 'white',}}
     visible={snack}
     onDismiss={onDismissSnackBar3}
     action={{
       label: 'OK',
       onPress: () => {
        onDismissSnackBar3()
       },
     }}>
     Record inserted successfully
   </Snackbar>
 ) : null}
  </List.Section>

  ) : basic && !alignment && !photo && !habits ? (
      <View style={{marginLeft: 10, marginRight: 10,}} >
                  <Title>First Name</Title>
                  <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="First Name"
            selectionColor='white'
            onChangeText={(text) => {setFirstname(text)}}
          />

          <Title>Last Name</Title>
          <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="Last Name"
            selectionColor='white'
            onChangeText={(text) => {setLastname(text)}}
          />
          <Title>Age</Title>
              <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="Age"
            selectionColor='white'
            value={age != null ? age.toString() : "Age"}
            onFocus = {() => {setOpen(true)}}
            onBlur = {() => {setOpen(false)}}
          />
                    <DatePicker
                  modal
                  open={open}
                  date={date}
                  mode="date"
                  title={null}
                  onConfirm={(date) => {
                    setOpen(false)
                    setAge(calculateAge(date))
                      setDate(date)

                  }}
                  onCancel={() => {
                    setOpen(false)
                  }}
          />
          <Title>Gender</Title>
          <RadioButton.Group  onValueChange={(value) => {setGender(value)}} value={gender}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
            <View style={{flex: 1,}}>
            <RadioButton.Item label='Male' value='male' />
           
            </View>
            <View style={{flex: 2, marginLeft: 5,}} >
            <RadioButton.Item label='Female' value='female' />
            </View>
           </View>
          </RadioButton.Group>

          <TouchableRipple disabled={firstname != null && lastname != null && age != null && gender != null ? false : true} style={{ marginTop: 20, marginLeft: 20, marginRight: 20,}} onPress={() => {
            setBasicDone(true);
            setBasic(false);
          }} >
            <Button  mode= "contained" contentStyle={{height: 50,}} labelStyle={{color: 'white'}} style={{ backgroundColor: Colors.blue700}} >Continue</Button>
          </TouchableRipple>
      </View>

  ) : !basic && alignment && !photo && !habits ? (
    <View style={{marginLeft: 10, marginRight: 10, marginTop: 10,}} >
      <Title>Disease Name</Title>
       <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="Disease"
            selectionColor='white'
            value={disease}
            onChangeText={(text) => {setDisease(text)}}
          />
          <Title>Brief Description<Text style={{fontWeight: 'normal', fontSize: 14}}>(optional)</Text></Title>
          <TextInput
            style={{ marginBottom: 10, height: 100,}}
            mode='outlined'
            placeholder="Describe some visible signs and symptoms"
            selectionColor='white'
            value={diseasedesc}
            multiline={true}
            onChangeText = {(text) => {setDiseaseDesc(text)}}
          />

<TouchableRipple disabled={disease != null  ? false : true} style={{ marginTop: 20, marginLeft: 20, marginRight: 20,}} onPress={() => {
            setAlignmentDone(true);
            setAlignment(false);
          }} >
            <Button  mode= "contained" contentStyle={{height: 50,}} labelStyle={{color: 'white'}} style={{ backgroundColor: Colors.blue700}} >Continue</Button>
          </TouchableRipple>
    </View>
  ) :  !basic && !alignment && !photo && habits ? (
    <View style={{marginLeft: 10, marginRight: 10, marginTop: 10,}} >

        <Title>Customer Habits<Text style={{fontWeight: 'normal', fontSize: 14}}>(optional)</Text></Title>
        <Paragraph>Habits may include smoking, blood sugar, existing medication, chronic disease etc</Paragraph>
        <TextInput
          style={{ marginBottom: 10, height: 100,}}
          mode='outlined'
          placeholder="Describe some visible signs and symptoms"
          selectionColor='white'
          value={customerhabits}
          multiline={true}
          onChangeText = {(text) => {setCustomerHabits(text)}}
        />

<TouchableRipple style={{ marginTop: 20, marginLeft: 20, marginRight: 20,}} onPress={() => {
          setHabitsDone(true);
          setHabits(false);
        }} >
          <Button  mode= "contained" contentStyle={{height: 50,}} labelStyle={{color: 'white'}} style={{ backgroundColor: Colors.blue700}} >Continue</Button>
        </TouchableRipple>
  </View>
  ) : (
    indicator ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
        <ActivityIndicator size={30} animating={true} color={Colors.blue700} />
      </View>
    ) : (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {photoasset != null && photoasset.assets != undefined ? (
          photoasset.assets.map((uri) => {
            return (
             <Avatar.Image style={{marginBottom: 20,}} key={uri} size = {200} source={uri} />
            )
          })

      ) : (
         <Avatar.Image style={{marginBottom: 20,}} size = {200} source={require('./assets/doctor.png')} />
      )}
 
     {photoasset != null ? (
             <TouchableRipple style={{borderRadius: 40, marginTop: 10, width: '80%'}} onPress={() => {uploadPhotoToS3()}} >
             <Button mode="outlined" contentStyle={{height: 40,}} labelStyle={{color: "white"}} style={{ borderRadius: 40, backgroundColor: Colors.blue700, borderColor: Colors.blue700}} >Save Photo</Button>
           </TouchableRipple>
     ) : (
       <TouchableRipple style={{borderRadius: 40, marginTop: 10, width: '80%'}} onPress={() => {chooseCameraGallary()}} >
       <Button mode="outlined" contentStyle={{height: 40,}} labelStyle={{color: Colors.blue700}} style={{ borderRadius: 40, borderColor: Colors.blue700}} >Upload Photo</Button>
     </TouchableRipple>
     )}
 
 {success ? (
   <Snackbar
   style={{backgroundColor: Colors.green700, color: 'white',}}
     visible={success}
     onDismiss={onDismissSnackBar1}
     action={{
       label: 'OK',
       onPress: () => {
        onDismissSnackBar1()
       },
     }}>
     Photo saved successfully
   </Snackbar>
 ) : null}
 
 {error ? (
   <Snackbar
   style={{backgroundColor: Colors.red700, color: 'white',}}
     visible={error}
     onDismiss={onDismissSnackBar2}
     action={{
       label: 'OK',
       onPress: () => {
        onDismissSnackBar2()
       },
     }}>
    You are offline! We will retry once you are connected
   </Snackbar>
 ) : null}
     </View>
    )
  )
) :
!list1 && list2 && !list3 ? (
  
  <List.Section>
  <List.Accordion
  style={{left: 0, }}
  title="Add New Client"
  description="Record down your customer's details"
  expanded={false}
  right={props => <List.Icon {...props} icon="chevron-right" />}>

  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title="Update Client"
  description="Change your customer's metadata"
  expanded={false}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title="Delete Client"
  description="Delete your customer's information."
  expanded={false}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
</List.Section>
) : (

  <List.Section>
  <List.Accordion
  style={{left: 0, }}
  title="Add New Client"
  description="Record down your customer's details"
  expanded={false}
  right={props => <List.Icon {...props} icon="chevron-right" />}>

  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title="Update Client"
  description="Change your customer's metadata"
  expanded={false}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title="Delete Client"
  description="Delete your customer's information."
  expanded={false}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
  <Snackbar
   style={{backgroundColor: Colors.green700, color: 'white',}}
     visible={snack}
     onDismiss={onDismissSnackBar3}
     action={{
       label: 'OK',
       onPress: () => {
        onDismissSnackBar3()
       },
     }}>
     Record inserted successfully
   </Snackbar>
</List.Section>
)
}
     </SafeAreaView>
    )
  }

  const Sale = () => {
    const height = (Dimensions.get('window').height) * 1/2;
    const width = (Dimensions.get('window').width)
    const inventory = [
      {name: 'A-testing product', price: '3.00', qty: '69'},
      {name: 'AgoKoff Syrup, Bottle/100ml', price: '2000', qty: '4245'},
      {name: 'Agocold Plus Syrup, Bottle/100ml', price: '2500', qty: '3482' },
      {name: 'Albendazole Tablet, 400mg, Pack/1', price: '600', qty: '41460'},
      {name: 'Alcohol Pads, Box/100', price: '3800', qty: '323'}
    ]
    return(
     <SafeAreaView style={{flex: 1,}}>
        <StatusBar backgroundColor={Colors.blue700}/>
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
           <Appbar.BackAction onPress={() => {setIndex(0)}} />
        <Appbar.Content title="Sales"  style={{color: 'white',}} />
        </Appbar.Header>
        <View style={{flexDirection: 'row'}} >
        <List.Icon color={Colors.blue700} icon="cart" />
        <Title style={{paddingTop: 10, paddingLeft: 20,}}>Manage Inventory</Title>
        </View>
      <View style={{height: height * 0.5, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,}} >
      <Surface style={{  borderTopWidth: 3, borderTopColor: Colors.blue700, width: width * 0.3, marginLeft: 10, marginRight: 5, height: height * 0.5, elevation: 1,}} >
      <View style={{marginTop: 10, marginLeft: 10,}} >
         <List.Icon color={Colors.blue700} icon="plus" />
         </View>
         <View style={{marginTop: 30, marginLeft: 10}} >
          <Title >New</Title>
          <Paragraph>Sell Product</Paragraph>
         </View>
      </Surface>
      <Surface style={{  borderTopWidth: 3, borderTopColor: Colors.green700, width: width * 0.3, marginLeft: 5, marginRight: 5, height: height * 0.5, elevation: 1,}} >
      <View style={{marginTop: 10, marginLeft: 10,}} >
         <List.Icon color={Colors.blue700} icon="view-dashboard" />
         </View>
         <View style={{marginTop: 30, marginLeft: 10}} >
          <Title >Inventory</Title>
          <Paragraph>View Store</Paragraph>
         </View>
      </Surface>
      <Surface style={{  borderTopWidth: 3, borderTopColor: Colors.red700, width: width * 0.3, marginRight: 10, marginLeft: 5, height: height * 0.5, elevation: 1,}} >
      <View style={{marginTop: 10, marginLeft: 10,}} >
         <List.Icon color={Colors.blue700} icon="package" />
         </View>
         <View style={{marginTop: 30, marginLeft: 10}} >
          <Title >Order</Title>
          <Paragraph>Request Inventory</Paragraph>
         </View>
      </Surface>
           </View>
           <Divider style={{marginTop: 5, marginBottom: 5,}} />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Title style={{paddingTop: 10, paddingLeft: 20,}}>Recent Sales</Title>
      <List.Icon color={Colors.blue700} icon="sort" />
      </View>
      <ScrollView>
      <Surface style={{  borderStartWidth: 3, borderStartColor: Colors.blue700, width: width , marginRight: 10, marginLeft: 5, height: height, elevation: 4,}} >
      {inventory.map((data, index) => {
        return (
          <List.Item
          key={index}
          title={data.name}
          description={"USH. "+data.price}
          right={props => <List.Icon {...props} icon="chevron-right" />}
                                        />
        )
      })}
      </Surface>
      </ScrollView>
     </SafeAreaView>
    )
  }

  const Activity = () => {
    const height = (Dimensions.get('window').height) * 1/2;
    const width = (Dimensions.get('window').width)

    const dummyRewards = [
      {date: '2022-03-18', points: 100},
      {date: '2022-03-19', points: 50},
      {date: '2022-03-20', points: 200},
      {date: '2022-03-21', points: 300},
      {date: '2022-03-22', points: 150},
      {date: '2022-03-23', points: 100},
      {date: '2022-03-24', points: 50},
      {date: '2022-03-26', points: 100},
    ];

    const redeemedPoints = [
      {date: '2022-03-18', points: 100},
      {date: '2022-03-19', points: 50},
      {date: '2022-03-20', points: 200},
      {date: '2022-03-21', points: 300},
      {date: '2022-03-22', points: 150},
    ];

    return (
      <SafeAreaView style={{flex: 1,}}>
         <StatusBar backgroundColor={Colors.blue700}/>
         <Appbar.Header style={{backgroundColor: Colors.blue700}} >
           <Appbar.BackAction onPress={() => {setIndex(0)}} />
        <Appbar.Content title="Points"  style={{color: 'white',}} />
        </Appbar.Header>
        <View style={{height: height,}}>
        <LineChart
        data = {{
          labels: ['03/18', "03/19", "03/20", "03/21", "03/22", "03/23"],
          datasets: [
            {
              data: [
                 100,
                150,
                50,
                100,
                200,
                50,
                300
              ]
            }
          ]
        }}
        width = {width}
        height = {height * 0.9}
        yAxisLabel = ""
        yAxisSuffix = "Pnts"
        yAxisInterval = {1}
        chartConfig = {{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0,
          color: (opacity = 1) => 'rgba(255, 255, 255, 1)',
          labelColor: (opacity = 1) => 'rgba(255, 255, 255, 1)',
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
       
        style = {{
          marginVertical: 8,
          borderRadius: 16
        }}
        />
        </View>
        <ScrollView>
          <View style={{height: height * 0.8, flexDirection: 'row'}}>
            <View style={{flex: 1, marginLeft: 10,}} >
              <View style={{alignItems: 'center', marginTop: 20,}}>
              <Paragraph>Earned Points</Paragraph>
              </View>
              <View style={{marginLeft: '10%'}} >
              {dummyRewards.map((data, index) => {
                return (
                  <List.Item
                  key={index}
                  title={data.points}
                  description={data.date}
                    />
                )
              })}
              </View>
            </View>
            <View style={{flex: 2, marginRight: 10,}} >
              <View style={{alignItems: 'center', marginTop: 20,}} >
              <Paragraph>Redeemed Points</Paragraph>
              </View>
              <View style={{marginLeft: '30%'}} >
              {redeemedPoints.map((data, index) => {
                return (
                  <List.Item
                  key={index}
                  title={data.points}
                  description={data.date}
                                    />
                )
              })}
              </View>
            </View>
          </View>
        </ScrollView>

      </SafeAreaView>
    )
  }

  const Account = () => {
    const height = (Dimensions.get('window').height) * 3/4;
    const width = (Dimensions.get('window'). width) ;
    const { signOut } = React.useContext(AuthContext);
    const [firstname, setFirstname] = useState("David");
    const [lastname, setLastname] = useState("Kitavi");
    const [email, setEmail] = useState("daviskitavi98@gmail.com");
    const [lang, setLang] = useState("English")

    const syncLanguage = React.useCallback(() => {
      async function A(){
        var l = await AsyncStorage.getItem('lang');
        switch(l){
          case "ENG":
            setLang("English");
            break;
          case 'KISW':
              setLang("Kiswahili");
              break;
          default:
              setLang("French")
        }
      }
  
      A();
    }, []);

    useEffect(() => {
      async function A(){
        var l = await AsyncStorage.getItem('lang');
        switch(l){
          case "ENG":
            setLang("English");
            break;
          case 'KISW':
              setLang("Kiswahili");
              break;
          default:
              setLang("French")
        }
      }
  
      A();

      var timer = setInterval(function(){syncLanguage()}, 1000);

      return () => {
        clearInterval(timer);
      }
    }, []);

    const handleChangeLanguage = async() => {
        Alert.alert(
          "Language",
          "Choose Preferred language",
          [
            {
              text: "Swahili",
              onPress: async () => {
                await AsyncStorage.setItem("lang", "KISW");
              }
            },
            { text: "English", onPress: async () => {
              await AsyncStorage.setItem("lang", "ENG");
            } },
            { text: "French", onPress: async () => {
              await AsyncStorage.setItem("lang", "FRENCH");
            } },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );
    }
    return (
     <SafeAreaView style={{flex: 1,}}>
        <StatusBar backgroundColor={Colors.blue700}/>
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
           <Appbar.BackAction onPress={() => {setIndex(0)}} />
        <Appbar.Content title="Preference" style={{color: 'white',}} />
        </Appbar.Header>

      <Surface style={{marginTop: 20, elevation: 1, height: height, width: width * 0.9, marginLeft: width * 0.05, marginRight: width * 0.05, }}>
      <List.Item
      title="Edit Names"
      description={firstname + " "+ lastname}
      right={props => <List.Icon {...props} icon="chevron-right" />}
                                    />

<List.Item
      title="Edit Email"
      description={email}
      right={props => <List.Icon {...props} icon="chevron-right" />}

                                    />

<List.Item
      title="Enable Notifications"
      description="ON"
      right={props => <List.Icon {...props} icon="chevron-right" />}

                                    />
  
<List.Item
      title="Change Language"
      description={lang}
      onPress={() => {
        handleChangeLanguage();
      }}
      right={props => <List.Icon {...props} icon="chevron-right" />}

                                    />

<List.Item
      title="Sign Out"
      description="Do you want to exit?"
      right={props => <List.Icon {...props} icon="chevron-right" />}
      onPress={signOut}
                                    />
      </Surface>
     </SafeAreaView>
    )
  }

  const [routes] = React.useState([
    {key: 'dashboard',  title: globalt ? globallang.statement7 : 'Home' , icon: 'home'},
    {key: 'plus', name: 'Client', title: 'New Client', icon: 'plus'},
    {key: 'sale', title: 'Sales', icon: 'cart'},
    {key: 'activity', title: 'Points', icon: 'wallet'},
    {key: 'user', title: 'Account', icon: 'account'}
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: Dashboard,
    plus: Client,
    sale: Sale,
    activity: Activity,
    user: Account,
  });

  return(
    <BottomNavigation
    navigationState={{index, routes}}
    onIndexChange={setIndex}
    renderScene={renderScene}
    barStyle={{backgroundColor: 'white'}}
    activeColor= {Colors.blue700}
    inactiveColor="grey"
    />
  );
}

const App = ({ navigation }) => {
  const [language, setLanguage] = useState({});
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type){
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
          case 'SIGN_IN':
            return {
              ...prevState,
              isSignout: false,
              userToken: action.token,
            };
            case 'SIGN_OUT':
              return {
                ...prevState,
                isSignout: true,
                userToken: null
              };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    //SplashScreen.hide();

    // user authentication
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e){
        console.log(e);
      }

      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();

    // fetching data.
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({type: 'SIGN_IN', token: data.username});
        await AsyncStorage.setItem('userToken', data.username);
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          dispatch({type: 'SIGN_OUT'})
          // delete token from database.
        } catch(e){
          console.log(e);
        }
      },
      changeLanguage: async(data) => {
        await AsyncStorage.setItem('lang', data.lang);
        switch(data.lang){
          case 'ENG': 
            setLanguage({});
            break;
          case 'KISW':
            setLanguage(Swahili);
            break;
          case 'FRENCH':
            setLanguage(French);
            break;
          default:
            console.log("Undefined language -"+data.lang);
        }
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.isLoading ? (
          <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Loading" component={Loading} />
          </Stack.Navigator>
        ): state.userToken == null ? (
          <Stack.Navigator initialRouteName='Welcome'>
             <Stack.Screen options={{headerShown: false}} name="Welcome" component={Welcome} />
          <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
          <Stack.Screen options={{headerShown: false}} name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
        ) : (
          <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
        </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
export default App;
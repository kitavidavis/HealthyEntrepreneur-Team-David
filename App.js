import 'react-native-gesture-handler';
import * as React from 'react';
import { useState, useRef, useEffect, useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ActivityIndicator, HelperText, ProgressBar, TouchableRipple, Chip, BottomNavigation, Appbar, RadioButton, TextInput, Colors, IconButton, Searchbar, FAB, Divider, Card, Title, Paragraph, Surface, List, Badge, Avatar, Snackbar,} from 'react-native-paper';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Pressable,
  Image,
  Dimensions,
  Animated,
  Platform,
  Alert,
  PermissionsAndroid,
  BackHandler,
  Appearance,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LineChart } from "react-native-chart-kit";

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

// language components
import French from './assets/franch';
import Swahili from './assets/swahili';

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

    return (
      <SafeAreaView style={{flex: 1,}} >
        <StatusBar backgroundColor={Colors.blue700}/>
      <Appbar.Header style={{backgroundColor: Colors.blue700}} >
      <Appbar.Content title={t ? language.statement7 : "Home"} titleStyle={{fontSize: 24}} style={{color: 'white', fontSize: 28}} />
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
    const [photo, setPhoto] = useState(false);
    const [alignment, setAlignment] = useState(false);

    return (
     <SafeAreaView style={{flex: 1,}} >
       <StatusBar backgroundColor={Colors.blue700}/>
      
      {!list1 && !list2 && !list3 ? (
      <Appbar.Header style={{backgroundColor: Colors.blue700}} >
      <Appbar.BackAction onPress={() => {setIndex(0)}} />
    <Appbar.Content title="Customers"  style={{color: 'white',}} />
    </Appbar.Header>
      ) : list1 && !list2 && !list3 ? (
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
        <Appbar.BackAction onPress={() => {setList1(false)}} /> 
        <Appbar.Content title="Add New Client" titleStyle={{fontSize: 24}} style={{color: 'white', fontSize: 28}} />
        </Appbar.Header>
      ): !list1 && list2 && !list3 ? (
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
        <Appbar.BackAction onPress={() => {setList2(false)}} /> 
        <Appbar.Content title="Update Customer Info" titleStyle={{fontSize: 24}} style={{color: 'white', fontSize: 28}} />
        </Appbar.Header>
      ): (
        <Appbar.Header style={{backgroundColor: Colors.blue700}} >
        <Appbar.BackAction onPress={() => {setList3(false)}} /> 
        <Appbar.Content title="Delete Customer Info" titleStyle={{fontSize: 24}} style={{color: 'white', fontSize: 28}} />
        </Appbar.Header>
      )}
       
       <View style={{marginTop: 20, marginLeft: 10, marginBottom: 20,}} >
       {basic && list1 && !alignment && !photo ? (
         <View>
          <TouchableRipple style={{width: '10%'}} onPress={() => {setBasic(false)}} >
          <Button icon="arrow-left" />
          </TouchableRipple>
            <Title>Add Basic Info</Title>
         </View>
       ) : !basic && list1 && alignment && !photo ? (
        <View>
        <TouchableRipple style={{width: '10%'}} onPress={() => {setAlignment(false)}} >
        <Button icon="arrow-left" />
        </TouchableRipple>
          <Title>Aillment Description</Title>
       </View>
       ) : !basic && list1 && !alignment && photo ? (
        <View>
        <TouchableRipple style={{width: '10%'}} onPress={() => {setPhoto(false)}} >
        <Button icon="arrow-left" />
        </TouchableRipple>
          <Title>Customer Photo</Title>
       </View>
       ) : !basic && list1 && !alignment && !photo ? (
        <View>
        <TouchableRipple style={{width: '10%'}} onPress={() => {setList1(false)}} >
        <Button icon="arrow-left" />
        </TouchableRipple>
          <Title>Add New Customer</Title>
       </View>
       ): (
        <Title> Manage Clients</Title>
       ) }
       </View>
{!list1 && !list2 && !list3 ? (
  
  <List.Section>
  <List.Accordion
  style={{left: 0, }}
  title="Add New Client"
  description="Record down your customer's details"
  expanded={false}
  onPress={() => {setList1(true)}}
  right={props => <List.Icon {...props} icon="chevron-right" />}>

  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title="Update Client"
  description="Change your customer's metadata"
  expanded={false}
  onPress = {() => {setList2(true)}}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
  <List.Accordion
  style={{left: 0, }}
  title="Delete Client"
  description="Delete your customer's information."
  expanded={false}
  onPress= {() => {setList3(true)}}
  right={props => <List.Icon {...props} icon="chevron-right" />}>
    
  </List.Accordion>
</List.Section>
) : list1 && !list2 && !list3 ? (
  !basic && !alignment && !photo ? (
    <List.Section>
    <List.Accordion
    style={{left: 0, }}
    title="Basic Information"
    expanded={false}
    onPress={() => {setBasic(true)}}
    right={props => <List.Icon {...props} icon="chevron-right" />}>
  
    </List.Accordion>
    <List.Accordion
    style={{left: 0, }}
    title="Customer Aillment"
    expanded={false}
    onPress={() => {setAlignment(true)}}
    right={props => <List.Icon {...props} icon="chevron-right" />}>
      
    </List.Accordion>
    <List.Accordion
    style={{left: 0, }}
    title="Customer Photo"
    expanded={false}
    onPress={() => {setPhoto(true)}}
    right={props => <List.Icon {...props} icon="chevron-right" />}>
      
    </List.Accordion>
  </List.Section>
  ) : basic && !alignment && !photo ? (
      <View style={{marginLeft: 10, marginRight: 10, marginTop: 10,}} >
                  <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="First Name"
            selectionColor='white'
            
          />
          <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="Last Name"
            selectionColor='white'
            
          />
              <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="Age"
            selectionColor='white'
            
          />
          <RadioButton.Group value='male'>
            <RadioButton.Item label='Male' value='male' />
            <RadioButton.Item label='Female' value='female' />
          </RadioButton.Group>

          <TouchableRipple style={{ marginTop: 40, marginLeft: 20, marginRight: 20,}} onPress={() => {}} >
            <Button  mode= "contained" contentStyle={{height: 50,}} labelStyle={{color: 'white'}} style={{ backgroundColor: Colors.blue700}} >Continue</Button>
          </TouchableRipple>
      </View>
  ) : !basic && alignment && !photo ? (
    <View style={{marginLeft: 10, marginRight: 10, marginTop: 10,}} >
       <TextInput
            style={{ marginBottom: 10, height: 40,}}
            mode='outlined'
            placeholder="Disease"
            selectionColor='white'
            
          />
    </View>
  ) : (
    <RadioButton.Group value=''>
    <RadioButton.Item label='Camera' value='true' />
    <RadioButton.Item label='Upload' value='true' />
  </RadioButton.Group>
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
        <Appbar.Content title="Rewards"  style={{color: 'white',}} />
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
      description="David Kitavi"
      right={props => <List.Icon {...props} icon="chevron-right" />}
                                    />

<List.Item
      title="Edit Email"
      description="daviskitavi98@gmail.com"
      right={props => <List.Icon {...props} icon="chevron-right" />}

                                    />

<List.Item
      title="Enable Notifications"
      description="ON"
      right={props => <List.Icon {...props} icon="chevron-right" />}

                                    />
  
<List.Item
      title="Change Language"
      description="English"
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
    {key: 'dashboard',  title: 'Home', icon: 'home'},
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
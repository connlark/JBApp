/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect}  from 'react';
import {Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput, PushNotificationIOS} from 'react-native';
import RNReactNativeSsh from 'react-native-react-native-ssh';
import AwesomeButton from "react-native-really-awesome-button";
import Slider from '@react-native-community/slider';
import { useAsyncStorage } from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-community/async-storage';

import BackgroundFetch from "react-native-background-fetch";

let config = {user: 'root', host: '127.0.0.1:2222', password: 'alpine'};
let command = 'apt-get update && apt-get --just-print upgrade';

var date = new Date();
var output = date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+' '+ (String(date.getHours()).length > 1 ? date.getHours().length:'0'+date.getHours() ) +'-'+Number(Number(date.getMinutes())+1)
console.log(output)
var PushNotification = require('react-native-push-notification');

const localplswork = (title, body) => {
  var t = new Date();
  t.setSeconds(t.getSeconds() + 3)

  PushNotificationIOS.scheduleLocalNotification({
  //  fireDate: t,
    alertBody: body,
    alertTitle: title,
    alertAction: 'view',
    userInfo: { id: String(Math.random()) },
  })
}


BackgroundFetch.configure({
  minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
}, () => {
  localplswork('FETCHING SOURCES','RIGHT NOW')

  console.log("[js] Received background-fetch event");
  // Required: Signal completion of your task to native code
  // If you fail to do this, the OS can terminate your app
  // or assign battery-blame for consuming too much background-time
  AsyncStorage.getItem('@storage_key').then((pass) => {
    let tit,exp = '';
    let configBG = {user: 'root', host: '127.0.0.1:2222', password: pass};


    console.log(configBG)

    RNReactNativeSsh.execute(configBG, command).then(
      result => {
        let startIndex, endIndex = null;
        let retuner = [];
  
        let title = 'f', expanded = 'f';
        for (let index = 0; index < result.length; index++) {
          let element = result[index];
  
          if (element.includes('The following packages will be upgraded:')){
            startIndex = index;
          }
          else if (startIndex){
            if (element.charAt(0) === ' '){
              console.log(element)
              element = element.trim();
              element?.split?.(" ")?.map((element) => {
                retuner.push(element)
              })
            }
            else {
              let me = '🚀 ' + retuner.length +' Updates 🚀'
              let hi = '';
              retuner.map((obj) => {
                hi += obj +'\n'
              })
              localplswork(me, hi)

              console.log(retuner);
  
              title = `🚀 ${returner.length} packages to update!`
              expanded = retuner.toString();

              console.log(expanded,title)

              startIndex = null;
            }
          }
        }

        localplswork(title, expanded)

        console.log('[BackgroundFetch HeadlessTask response: ', 'f');

        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);

      },
      error =>  console.log('Error:', error)
    ).finally(() => {

      console.log('jo')
    });

  })
}, (error) => {
  console.log("[js] RNBackgroundFetch failed to start");
});

// Optional: Query the authorization status.
BackgroundFetch.status((status) => {
  switch(status) {
    case BackgroundFetch.STATUS_RESTRICTED:
      console.log("BackgroundFetch restricted");
      alert('BackgroundFetch denied')
      break;
    case BackgroundFetch.STATUS_DENIED:
      console.log("BackgroundFetch denied");
      alert('BackgroundFetch denied')
      break;
    case BackgroundFetch.STATUS_AVAILABLE:
      console.log("BackgroundFetch is enabled");
      break;
  }
});








const App = () => {
 // const [value, setValue] = useState('')
  const [sliderVal, setSlider] = useState(0.5)
  const [upgrades, setUpgrades] = useState([])
  
  const [value, setValue] = useState('value');
  const { getItem, setItem } = useAsyncStorage('@storage_key');

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };

  const writeItemToStorage = async newValue => {
    await setItem(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    readItemFromStorage();
  }, [setValue]);

  alertme = () => alert('hi');

  parseOutput = (result) => {
    let startIndex, endIndex = null;
    let retuner = [];

    for (let index = 0; index < result.length; index++) {
      const element = result[index];
     // console.log(element)

      if (element.includes('The following packages will be upgraded:')){
        startIndex = index;
      }
      else if (startIndex){
        if (element.charAt(0) === ' '){
          console.log(element)
          element = element.trim();
          element?.split?.(" ")?.map((element) => {
            retuner.push(element)
          })
        }
        else {
          console.log(retuner)
          let hi = '';
          retuner.map((obj) => {
            hi += obj +'\n'
          })
         
          setUpgrades(hi)
          break
        }
      }
    }
  }

  return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{upgrades.toString()} {sliderVal} </Text>
        <Text>Current value: {value}</Text>

        <AwesomeButton
          type="primary"
          onPress={next => {
            /** Do Something **/
            let configBG = {user: 'root', host: '127.0.0.1:2222', password: value};

            RNReactNativeSsh.execute(configBG, command).then(
              result => {
                setValue(result); 
                parseOutput(result)},
              error =>  console.log('Error:', error)
            );

            next();
          }}
        >
          Refresh Me
        </AwesomeButton>

        <TouchableOpacity
        onPress={() =>
          writeItemToStorage(
            Math.random()
              .toString(36)
              .substr(2, 5)
          )
        }
      >
        <Text>Update value</Text>
      </TouchableOpacity>

      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => {
          if (text){
            writeItemToStorage(text)
          }
        }}
        value={value}
      />
        
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#000000"
          thumbTouchSize={{width: 50, height: 40}}
          onValueChange={(e)  => setSlider(e)}
          value={sliderVal}
        />
      </View>
    );
 
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App

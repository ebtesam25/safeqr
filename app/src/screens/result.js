import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import MapView from 'react-native-maps';
import { Chip } from 'react-native-paper';

export default function Result() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [score, setScore] = useState(20);
  const [analysis, setAnalysis] = useState(['Too many redirects','Suspicious domain'])
  const [type, setType] = useState("spam")

  const spam = "https://img.icons8.com/fluency/48/000000/spam.png";
    const ad= "https://img.icons8.com/external-smashingstocks-circular-smashing-stocks/65/000000/external-advertisement-internet-marketing-smashingstocks-circular-smashing-stocks-2.png";
    const useful = 'https://img.icons8.com/color/48/000000/thumb-up--v1.png';
    const malicious = "https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/000000/external-hacker-cryptocurrency-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png";
    const game = "https://img.icons8.com/external-flat-wichaiwi/64/000000/external-game-gamefi-flat-wichaiwi-2.png";
    const unknown = "https://img.icons8.com/color-glass/16/000000/why-us-male.png";
  
    const [markers, setMarkers]= useState([{"latlng":{
        "latitude": 25.76684817404011,
        "longitude": -80.19163068383932,
      },'type':spam}]);



  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{flex:1, backgroundColor:"#000", paddingTop:'15%'}}>
        <MaskedView
            style={{ height: 40 }}
            maskElement={<View
                style={{
                  backgroundColor: 'transparent',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              ><Text style={{fontWeight:'bold', fontSize:30}}>{scanned?"Result":"Scan"}</Text></View>}
            >
               
               <LinearGradient
                colors={['#F62E8E', '#AC1AF0']}
                style={{flex:1}}
                />
        </MaskedView>
      {scanned &&<BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />}
      {!scanned && <View>
          <Text style={{fontWeight:'bold', color:"#FFF", fontSize:15, marginTop:'5%', textAlign:'center'}}>Scanned:{data}</Text>
          <Text style={{backgroundColor:score<25?"red":score>75?"green":"orange", color:"#FFF", width:'40%', alignSelf:'center', textAlign:'center', 
          borderRadius:10, fontWeight:'bold', marginTop:'5%'}}>
              {score<25?"Potentially Dangerous":score>75?"Safe and verified":"No reports"}</Text>
              <Text style={{backgroundColor:"#222", color:"#FFF", width:'30%', alignSelf:'center', textAlign:'center', 
          borderRadius:10, fontWeight:'bold', marginTop:'5%'}}>
              scam</Text>
              <View style={{alignSelf:'center', backgroundColor:"#111", padding:'5%', borderRadius:10, marginTop:'5%'}}>
                  <Text style={{color:"white", fontWeight:'bold'}}>Analysis:</Text>
                  {analysis.map((item)=><View><Text style={{color:"white"}}>{item}</Text></View>)}
                  </View>
                  <View>
                  <Text style={{position:'relative',fontSize:14,margin:'auto', textAlign:'center', color:'#FFF', fontFamily:'Roboto', marginTop:'1.5%',alignSelf:'center'}} >Add a pin to the map</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'80%', flexWrap:'wrap', alignSelf:'center'}}>
                    <TouchableOpacity onPress={()=>setType(spam)}><Chip style={{width:100, marginVertical:'5%'}} avatar={<Image source={{uri:spam}} style={{width:30, height:30}}></Image>} >spam</Chip></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setType(malicious)}><Chip style={{width:100, marginVertical:'5%'}} avatar={<Image source={{uri:malicious}} style={{width:30, height:30}}></Image>} >malicious</Chip></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setType(ad)}><Chip style={{width:100, marginVertical:'5%'}} avatar={<Image source={{uri:ad}} style={{width:30, height:30}}></Image>} >ad</Chip></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setType(useful)}><Chip style={{width:100, marginVertical:'5%'}} avatar={<Image source={{uri:useful}} style={{width:30, height:30}}></Image>} >useful</Chip></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setType(game)}><Chip style={{width:100, marginVertical:'5%'}} avatar={<Image source={{uri:game}} style={{width:30, height:30}}></Image>} >game</Chip></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setType(unknown)}><Chip style={{width:100, marginVertical:'5%'}} avatar={<Image source={{uri:unknown}} style={{width:30, height:30}}></Image>} >unknown</Chip></TouchableOpacity></View>
                      </View>
                      <MapView style={{width: 300,height: 200, alignSelf:'center'}} 
                        initialRegion={{
                            latitude: 25.7664362,
                            longitude: -80.1915964,
                            latitudeDelta: .005,
                            longitudeDelta: .005
                            }} 
                            onPress={(e) => setMarkers([...markers,{ latlng: e.nativeEvent.coordinate, type:type}])}>
                            {
                                markers.map((marker, i) => (
                                    <MapView.Marker key={i} coordinate={marker.latlng} image={{uri:marker.type}} >
                                    {console.log(marker.latlng)}
                                    </MapView.Marker>
                                    
                                    
                                ))}
                        </MapView>
                        <LinearGradient
                    colors={['#B21ED7', '#2A49E1']}
                    style={{width:'50%', height:50, borderRadius:30, justifyContent:'center', alignSelf:'center', marginTop:'5%'}}
                    >
                        <TouchableOpacity onPress={()=>setScanned(false)}>
                        <Text style={{fontWeight:'bold', textAlign:'center', textAlignVertical:'center', color:"#FFF"}}>Add Pin</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                  <LinearGradient
                    colors={['#2A49E1','#B21ED7']}
                    style={{width:'50%', height:50, borderRadius:30, justifyContent:'center', alignSelf:'center', marginTop:'5%'}}
                    >
                        <TouchableOpacity onPress={()=>setScanned(false)}>
                        <Text style={{fontWeight:'bold', textAlign:'center', textAlignVertical:'center', color:"#FFF"}}>Scan Again</Text>
                        </TouchableOpacity>
                    </LinearGradient>

          </View>}
    </View>
  );
}
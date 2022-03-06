import { Text, View, Image } from 'react-native';
import {useTailwind} from 'tailwind-rn';
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function Scan() {
	const tailwind = useTailwind();
    const navigation = useNavigation();

	return(
    <View style={{backgroundColor:"#000", flex:1, paddingTop:'25%'}}>
        <MaskedView
            style={{ height: 60 }}
            maskElement={<View
                style={{
                  backgroundColor: 'transparent',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              ><Text style={{fontWeight:'bold', fontSize:50}}>SafeQR</Text></View>}
            >
               
               <LinearGradient
                colors={['#F62E8E', '#AC1AF0']}
                style={{flex:1}}
                />
        </MaskedView>
   <Image source={require('../assets/bg.png')} style={{alignSelf:'center', marginVertical:'15%'}}></Image>
    <LinearGradient
        colors={['#B21ED7', '#2A49E1']}
        style={{width:'50%', height:50, borderRadius:30, justifyContent:'center', alignSelf:'center'}}
        >
            <TouchableOpacity onPress={()=>navigation.navigate('Result')}>
            <Text style={{fontWeight:'bold', textAlign:'center', textAlignVertical:'center', color:"#FFF"}}>Scan Now</Text>
            </TouchableOpacity>
        </LinearGradient>
    </View>
    )
};
import React from 'react';
import { View, SafeAreaView, Text, Image, Touchable, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Cards from '../../components/old/ItemCard';
const LabScreen = () => {
    return (
        // className='space-y-2'
        <SafeAreaView className='flex-1 justify-around bg-black'>
            <ScrollView>
                <View className='space-y-2'>
                    <Text style={{ fontSize: wp('10'), }} className='text-center text-4xl font-bold text-gray-700'>
                        Welcom to lab
                    </Text>
                    <View className='space-y-2'>
                        <Cards />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default LabScreen
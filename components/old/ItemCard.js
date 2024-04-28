import React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Text, Image } from "react-native";
import { cardsData } from "../../constants/index";

export default function Cards() {
    return (
        cardsData.map((item, index) => {
            return (
                <ItemCard item={item} key={index} />
            )
        })
    )
}

const ItemCard = ({ item }) => {
    return (
        // className="font-semibold text-gray-600"
        <View style={{ height: hp(20) }} className='space-y-2'>
            <Text style={{ fontSize: wp(6.5), }} className='font-semibold text-gray-600'></Text>
            <View className={`bg-${item.color} p-10 rounded-xl space-y-1 m-4`}>
                <View className="flex-row items-center space-x-2">
                    <Image source={item.img} style={{ height: hp(4), width: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">
                        {item.text}
                    </Text>
                </View>
            </View>
        </View>
    );
}
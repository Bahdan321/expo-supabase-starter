import React from "react";
import { View, Text, Image } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';

export default function ProfileCard({ item }) {
    return (
        <View style={{
            backgroundColor: '#8FBC8F',
            borderRadius: 60,
            height: 350,
            width: 250,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{
                flex: 2,
                justifyContent: 'center',
                paddingTop: 0,
            }}>
                <Text style={{
                    fontSize: wp('20'),
                    fontWeight: 'bold',
                    color: '#fff',
                }}>
                    {item.number}
                </Text>
            </View>
            <View style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingBottom: 10,
            }}>
                <Text style={{
                    fontSize: wp('10'),
                    fontWeight: 'bold',
                    color: '#fff',
                }}>
                    {item.text}
                </Text>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Alert } from 'react-native';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileCard from '../../components/old/ProfileCard';
import Carousel from 'react-native-snap-carousel';
import { profileData } from '../../constants';
import { useSupabase } from "@/context/supabase-provider";

export default function ProfileScreen() {
    const { signOut } = useSupabase();
    const { session } = useSupabase();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    function getName(name: string) {
        const nameArray = name.split('@')
        setEmail(nameArray[0])
    }

    // useEffect(() => {
    //     if (session) getProfile()
    // }, [session])

    async function onSubmit() {
        setLoading(true)
        try {
            await signOut();
            console.log("Ливнул с сервака")

        } catch (error: Error | any) {
            console.log(error.message);
        }
        setLoading(false)
    }

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error, status } = await useSupabase
                .from('users')
                .select(`email`)
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setEmail(data.email)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            getName(email)
            setLoading(false)
        }
    }

    async function updateProfile({
        username,
    }: {
        username: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const updates = {
                id: session?.user.id,
                username,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }


    return (
        <ScrollView>
            <View
                className="p-3 rounded-xl space-y-1 m-4"
                style={{
                    alignItems: 'center',
                    marginVertical: 22,
                }}
            >
                <Image
                    source={require('../../assets/images/7.png')}
                    style={{
                        height: 170,
                        width: 170,
                        borderRadius: 100,
                        // marginBottom: 10,
                        marginTop: 10,
                    }}
                />
            </View>

            <View>
                <View style={{
                    flexDirection: 'column',
                    marginBottom: 6,
                }}>
                    <Text style={{ fontSize: wp('9'), }} className='text-center text-4xl font-bold text-gray-700'>
                        {email}
                    </Text>
                    <Text style={{ fontSize: wp('6'), }} className='text-center text-4xl font-bold text-gray-950'>
                        Звание игрока
                    </Text>
                </View>
            </View>

            <View>
                <Carousel
                    containerCustomStyle={{ overflow: 'visible' }}
                    data={profileData}
                    renderItem={({ item }) => <ProfileCard item={item} />}
                    firstItem={1}
                    inactiveSlideOpacity={0.75} // opacity of inactive slides
                    inactiveSlideScale={0.77} // size of inactive slides
                    sliderWidth={400} // actuall slide width
                    itemWidth={260} // card width
                    slideStyle={{ display: 'flex', alignItems: 'center' }}
                />
            </View>
            {loading ? <ActivityIndicator size='large' color='#0000ff' />
                :
                <>
                    <View className="bg-gray-700 p-2 rounded-xl space-y-1 m-4 mx-10">
                        <TouchableOpacity onPress={() => {
                            onSubmit();
                        }}>
                            <Text style={{ fontSize: wp(4.5), }} className='text-center text-gray-400 m-3 font-bold'>
                                Ливнуть с позором
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
            <StatusBar style="auto" />
        </ScrollView>
    );
};

// export default ProfileScreen

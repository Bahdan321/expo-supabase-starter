import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet } from 'react-native';
import { Camera, CameraType, } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import CameraButton from '../../components/old/CameraButton';
const HuntScreen = () => {


    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    useEffect(() => {
        // Когда компонент размонтируется, остановите камеру
        return () => {
            if (cameraRef.current) {
                cameraRef.current.stopPreview();
            }
        };
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                await cameraRef.current.resumePreview(); // Перезапуск превью перед съемкой
                const data = await cameraRef.current.takePictureAsync();
                setImage(data.uri);
            } catch (e) {
                console.log(e);
            }
        }
    }

    const saveImage = async () => {
        if (image) {
            try {
                await MediaLibrary.createAssetAsync(image);
                alert("Фоточка отправлена")
                setImage(null);
            } catch (e) {
                console.log(e);
            }
        }
    }

    const uploadImage = async () => {
        try {
            // Replace 'image.jpg' with the correct image filename and path

            if (!image) {
                throw new Error('Image not found');
            }
            console.log(typeof image)

            const formData = new FormData();
            formData.append('file', {
                uri: image,
                name: 'abc4.jpg',
                type: `image/jpeg`,
            });
            console.log(1);
            console.log(typeof formData);
            console.log(2);

            fetch("http://192.168.0.16:8000/zombie_faces/create_and_open2", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((response) => {
                    // Handle response
                    console.log(response);
                    console.log("Image uploaded successfully");
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error uploading image:", error);
                });
        }
        catch (error) {
            console.error(error);
        }
    };

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>
    }

    const handleCameraReady = () => {
        if (cameraRef.current) {
            cameraRef.current.resumePreview(); // Перезапуск камеры при каждом монтировании компонента

        }
    };

    return (
        <View style={styles.container}>
            {!image ?
                <Camera
                    style={styles.camera}
                    type={type}
                    flashMode={flash}
                    ref={cameraRef}
                    ratio="16:9"
                    onCameraReady={handleCameraReady}
                >
                    <View style={{ paddingHorizontal: 50, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <CameraButton icon={'repeat-outline'} size={40} color={'white'} onPress={() => {
                            setType(type === CameraType.back ? CameraType.front : CameraType.back);
                        }} />
                        <CameraButton icon={flash === Camera.Constants.FlashMode.off ? "flash-outline" : "flash"} size={40} color={'white'} onPress={() => {
                            setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off);
                        }} />
                    </View>
                </Camera>
                :
                <Image source={{ uri: image }} style={styles.camera} />
            }
            <View>
                {image ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50, }}>
                        <CameraButton title={'Переделать'} icon='reload-outline' color={'white'} onPress={() => setImage(null)} />
                        <CameraButton title={'Продолжить'} icon='checkmark-outline' color={'white'} onPress={() => uploadImage()} />
                    </View>
                    :
                    <CameraButton icon='ellipse-outline' size={40} color={'white'} onPress={takePicture} />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        paddingBottom: 85,
        paddingTop: 85,
        borderRadius: 15,
    },
    camera: {
        flex: 1,
        borderRadius: 20,
    }
});

export default HuntScreen
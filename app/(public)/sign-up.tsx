import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View, Image, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import * as z from "zod";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';


import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z
	.object({
		email: z.string().email("Пожалуйста, введите действительный адрес электронной почты"),
		password: z
			.string()
			.min(8, "Минималка 8 символов")
			.max(64, "Максималка 64 символа")
			.regex(
				/^(?=.*[a-z])/,
				"Ваш пароль должен содержать хотя бы одну строчную букву",
			)
			.regex(
				/^(?=.*[A-Z])/,
				"Ваш пароль должен содержать хотя бы одну заглавную букву",
			)
			.regex(/^(?=.*[0-9])/, "Ваш пароль должен содержать хотя бы одну цифру")
			.regex(
				/^(?=.*[!@#$%^&*])/,
				"Ваш пароль должен содержать хотя бы один специальный символ",
			),
		confirmPassword: z.string().min(8, "Пожалуйста, введите не менее 8 символов"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Ваши пароли не совпадают",
		path: ["confirmPassword"],
	});

export default function SignUp() {
	const { signUp } = useSupabase();
	const router = useRouter();
	const [image, SetImage] = useState();
	const [loading, setLoading] = useState(false)

	const pickImage = async () => {
		try {
			await ImagePicker.requestCameraPermissionsAsync();
			let result = await ImagePicker.launchCameraAsync({
				cameraType: ImagePicker.CameraType.front,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});
			if (!result.canceled) {
				await saveImage(result.assets[0].uri)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const saveImage = async (image: any) => {
		try {
			SetImage(image)
		} catch (error) {
			console.log(error)
		}
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		setLoading(true)
		try {
			await signUp(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
		setLoading(false)
	}

	return (
		<SafeAreaView className='flex-1 flex justify-around bg-black'>
			<KeyboardAvoidingView behavior='padding'>
				<View className='space-y-0' >
					<Text style={{ fontSize: wp('18'), }} className='text-center text-1xl font-bold text-gray-700'>
						Welcome to
					</Text>
					<Text style={{ fontSize: wp('15'), }} className='text-left text-1xl font-extrabold text-gray-400 m-3'>
						Epidemo
					</Text>
					<View className="p-3 rounded-xl space-y-1 m-4">
						<TouchableOpacity onPress={pickImage}>
							{image ? <Image source={{ uri: image }} className="w-40 h-40 rounded-full mx-auto  bg-transparent" />
								:
								<Image source={require('../../assets/images/7.png')} className="w-40 h-40 rounded-full mx-auto bg-transparent" />
							}
						</TouchableOpacity>
					</View>
					<Form {...form}>
						<View className="m-2">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormInput
										label="Email"
										placeholder="Email"
										autoCapitalize="none"
										autoComplete="email"
										autoCorrect={false}
										keyboardType="email-address"
										{...field}
									/>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormInput
										label="Password"
										placeholder="Password"
										autoCapitalize="none"
										autoCorrect={false}
										secureTextEntry
										{...field}
									/>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormInput
										label="Confirm Password"
										placeholder="Confirm password"
										autoCapitalize="none"
										autoCorrect={false}
										secureTextEntry
										{...field}
									/>
								)}
							/>
						</View>
					</Form>
					{loading ? <ActivityIndicator size='large' color='#0000ff' />
						:
						<>
							<View className="gap-y-4 m-4">
								<Button
									size="default"
									variant="default"
									onPress={form.handleSubmit(onSubmit)}
								>
									{form.formState.isSubmitting ? (
										<ActivityIndicator size="small" />
									) : (
										<Text>Зарегистрироваться</Text>
									)}
								</Button>
								<Muted
									className="text-center"
									onPress={() => {
										router.push("/sign-in");
									}}
								>
									Уже есть аккаунт?{" "}
									<Muted className="text-background">Войти</Muted>
								</Muted>
								<View>
									<View className='flex-row justify-center'>
										<Text style={{ fontSize: wp(2.5), }} className='text-center text-gray-400 m-1 font-bold'>
											При регистрации вы соглашаетесь с
										</Text>
										<TouchableOpacity onPress={() => { }}>
											<Text style={{ fontSize: wp(2.5), }} className='text-center text-gray-400 m-1 font-bold'>
												условиями использования
											</Text>
										</TouchableOpacity>
									</View>
									<Text style={{ fontSize: wp(2.5), }} className='text-center text-gray-600 m-2 font-bold'>
										При регистрации указывайте ваше настоящее фото, для лучшего опыта
									</Text>
									<Text style={{ fontSize: wp(2.5), }} className='text-center text-gray-600 font-bold'>
										И без шалунства:3
									</Text>
								</View>
							</View>
						</>
					}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView >
	);
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import * as z from "zod";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';


import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(8, "Please enter at least 8 characters.")
		.max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
	const { signInWithPassword } = useSupabase();
	const router = useRouter();
	const [loading, setLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		setLoading(true)
		try {
			await signInWithPassword(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.log(error.message);
		}
		setLoading(false)
	}

	return (
		<SafeAreaView className='flex-1 flex justify-around  bg-black'>
			<KeyboardAvoidingView behavior='padding'>
				<View className="mx-2">
					<TouchableOpacity onPress={() => {
						router.push("/sign-up");
					}}>
						<Ionicons name='arrow-back' color='gray' size={30} />
					</TouchableOpacity>
				</View>
				<View className='space-y-0' >
					<Text style={{ fontSize: wp('18'), }} className='text-center text-1xl font-bold text-gray-700'>
						Welcome back
					</Text>
					<View className='flex-row'>
						<Text style={{ fontSize: wp('14'), }} className='text-left text-1xl font-bold text-gray-700 m-3'>
							to
						</Text>
						<Text style={{ fontSize: wp('14'), }} className='text-left text-1xl font-extrabold text-gray-400 m-3'>
							Epidemo
						</Text>
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
						</View>
					</Form>
					{loading ? <ActivityIndicator size='large' color='#0000ff' />
						:
						<>
							<View className="m-4">
								<Button
									size="default"
									variant="default"
									onPress={form.handleSubmit(onSubmit)}
								>
									{form.formState.isSubmitting ? (
										<ActivityIndicator size="small" />
									) : (
										<Text>Войти</Text>
									)}
								</Button>
							</View>
						</>
					}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView >
	);
}

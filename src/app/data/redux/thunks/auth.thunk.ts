import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	LoginParams,
	LoginResponse,
	RegFinishResponse,
	RegResponse,
	RegisterParams,
	AuthServices,
} from '../..';

export const loginThunk = createAsyncThunk<
	LoginResponse,
	LoginParams,
	{ rejectValue: string }
>('auth/login', async (loginParams: LoginParams, { rejectWithValue }) => {
	try {
		const { user, token, response, message } =
			await AuthServices.login(loginParams);
		if (response !== 'success') throw new Error(message);
		return { user, token, response };
	} catch (error: any) {
		return rejectWithValue(error.message);
	}
});

export const registerThunk = createAsyncThunk<
	RegResponse,
	RegisterParams,
	{ rejectValue: string }
>(
	'auth/register',
	async (registroParams: RegisterParams, { rejectWithValue }) => {
		try {
			const response = await AuthServices.register(registroParams);
			const registerResponse: RegResponse = response.data;
			if (registerResponse.response !== 'success') throw new Error(registerResponse.error);
			console.log(registerResponse)
			return registerResponse;
		} catch (error) {
			return rejectWithValue(error as string);
		}
	},
);

export const registerFinishThunk = createAsyncThunk<
	RegFinishResponse,
	RegisterParams,
	{ rejectValue: string }
>('auth/finish', async (finishParams: RegisterParams, { rejectWithValue }) => {
	try {
		const response = await AuthServices.registerFinish(finishParams);
		const finishResponse: RegFinishResponse = response;
		if (finishResponse.response !== 'success') throw new Error(finishResponse.message);
		return finishResponse;
	} catch (error) {
		return rejectWithValue(error as string);
	}
});

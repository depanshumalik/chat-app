import { toast } from 'react-toastify';
import * as api from '../../utils/Api';
import { toastOptions } from '../../utils/constants';
import { userActions } from '../Reducers/user';


export const fetchChats = (formData) => {
    return async dispatch => {
        try {
            const data = await api.axiosGetAllMessages(formData);


            console.log('response.data')
            console.log(data)
            if (data.status !== 200) {
                data.data.message ? toast.error(data.data.message, toastOptions) : toast.error("Something went wrong", toastOptions)
            } else {
                dispatch(
                    userActions.FETCH_CHATS(data.data)
                );
            }

        } catch (error) {
            console.log(error)
        }
    }
}

export const updateChats = (formData) => {
    return async dispatch => {
        try {
            const data = await api.axiosSendMessage(formData);


            console.log(data)
            if (data.status !== 200) {
                data.data.message ? toast.error(data.data.message, toastOptions) : toast.error("Something went wrong", toastOptions)
            } else {
                dispatch(
                    userActions.UPDATE_CHATS(formData)
                );
            }

        } catch (error) {
            console.log(error)
        }
    }
}

export const signin = (response) => {
    return async dispatch => {
        try {
            localStorage.setItem('chat-app-user', JSON.stringify(response));
            dispatch(userActions.CHANGE_LOGIN(true));
        } catch (error) {
            console.log(error)
        }
    }
}


export const signout = () => {
    return async dispatch => {
        try {
            localStorage.removeItem("chat-app-user");
            dispatch(userActions.CHANGE_LOGIN(false));
        } catch (error) {
            console.log(error)
        }
    }
}

export const isSignin = () => {
    console.log("aasa", localStorage.getItem('chat-app-user'));
    return async dispatch => {
        localStorage.getItem('chat-app-user') ? dispatch(userActions.CHANGE_LOGIN(true)) : dispatch(userActions.CHANGE_LOGIN(false));
    }
}
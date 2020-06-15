import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';


//const uri = Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://10.0.2.2:4000/'

const uri='https://thawing-reaches-52246.herokuapp.com/';
const httpLink = createHttpLink({
    uri
});

const authLink = setContext(async (_, { headers }) => {
    //leer token    
    const token = await AsyncStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token
        }
    }
});

console.log(authLink);



const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;
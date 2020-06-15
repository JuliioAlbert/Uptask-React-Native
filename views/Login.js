import React, { useState } from 'react';
import { Container, Button, Text, H1, Input, Form, Item, Toast } from 'native-base';
import { View, StatusBar, ToastAndroid } from 'react-native'
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';

const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input:AutenticarInput) {
         autenticarUsuario(input:$input){
            token
        }
}
`;
const Login = () => {

    //Navegacion 
    const navigation = useNavigation();
    const [email, guardarEmail] = useState('');
    const [password, guardarPassoword] = useState('');
    const [mensaje, guardarMensaje] = useState(null);
    //Mutation de apollo
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

    //Cuando el usuario presione Iniciar Sesion
    const handleSubmit = async () => {
        //Validar 
        if (email === '' || password === '') {
            //Mostrar Error
            guardarMensaje('Todos los Campos son Obligatorio');
            return;
        }

        try {
            //Autenticar usuario
            const { data } = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            });

           const {token } = data.autenticarUsuario;

           //Colocar  token en storage
           await AsyncStorage.setItem('token', token);
           //Redireccionar a proyectos
            navigation.navigate('Proyectos');
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error', ''));
        }


    }


    const monstrarAlerta = () => {
        ToastAndroid.show(mensaje, ToastAndroid.SHORT);
    }


    return (
        <>
            <StatusBar
                hidden={false}
                showHideTransition='slide'
                backgroundColor="#e84347"
                barStyle="light-content"

            />
            <Container style={[globalStyles.contenedor, { backgroundColor: '#e84347' }]}>
                <View style={globalStyles.contenido}>
                    <H1 style={globalStyles.titulo}>UpTask</H1>

                    <Form>
                        <Item inlineLabel last style={globalStyles.input}>
                            <Input
                                
                                placeholder="Email"
                                keyboardType="email-address"
                                onChangeText={texto => guardarEmail(texto)}
                            />
                        </Item>

                        <Item inlineLabel last style={globalStyles.input}>
                            <Input
                                secureTextEntry={true}
                                placeholder="Password"
                                onChangeText={texto => guardarPassoword(texto)}
                            />
                        </Item>

                    </Form>

                    <Button
                        block
                        square
                        style={globalStyles.boton}
                        onPress={() => handleSubmit()}
                    >
                        <Text style={globalStyles.botonText}>Iniciar Sesion</Text>
                    </Button>

                    <Text
                        onPress={() => navigation.navigate('CrearCuenta')}
                        style={globalStyles.enlace}>Crear Cuenta</Text>
                </View>
                {mensaje && monstrarAlerta()}
            </Container>
        </>
    );
}

export default Login;
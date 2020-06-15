import React, { useState } from 'react';
import { Container, Button, Text, H1, Input, Form, Item, Toast } from 'native-base';
import { View, StatusBar, ToastAndroid } from 'react-native'
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

//Apollo 
import { gql, useMutation } from '@apollo/client';

const NUEVA_CUENTA = gql`  
    mutation crearUsuario($input: UsuarioInput){
        crearUsuario(input:$input)
    }
`;

const CrearCuenta = () => {


    //Navegacion 

    const navigation = useNavigation();

    //Mutacion de Apollo 
    const [crearUsuario] = useMutation(NUEVA_CUENTA);


    const [nombre, guardarNombre] = useState('');
    const [email, guardarEmail] = useState('');
    const [password, guardarPassoword] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    const handleSubmit = async () => {
        //Validar 
        if (nombre === '' || email === '' || password === '') {
            //Mostrar Error
            guardarMensaje('Todos los Campos son Obligatorio');
            return;
        }

        //password de 6 caracteres 
        if (password.length < 6) {
            guardarMensaje('El password debe ser almenos de 6 caracteres');
            return;
        }

        //Guardar
        try {
            const {data} = await crearUsuario({
                variables: {
                    input:{
                        nombre,
                        email,
                        password
                    }
                }
            });

            guardarMensaje(data.crearUsuario);
            navigation.navigate('Login');
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
                backgroundColor="#28303b"
                barStyle={"light-content"}
            />
            <Container style={[globalStyles.contenedor, { backgroundColor: '#e84347' }]}>
                <View style={globalStyles.contenido}>
                    <H1 style={globalStyles.titulo}>UpTask</H1>

                    <Form>

                        <Item inlineLabel  last style={globalStyles.input}>
                            <Input
                                placeholder="Nombre"
                                onChangeText={texto => guardarNombre(texto)}
                            />
                        </Item>

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
                        <Text style={globalStyles.botonText}>Crear Cuenta</Text>
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

export default CrearCuenta;
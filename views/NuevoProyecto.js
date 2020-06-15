import React, { useState } from 'react';
import { Text, Container, Button, Form, H1, Item, Input, View } from 'native-base';
import { ToastAndroid } from 'react-native'
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';

const NUEVO_PROYECTO = gql`
    mutation nuevoProyecto($input:ProyectoInput){
        nuevoProyecto(input:$input){
            nombre
            id
        }
    }
`;

//Actualizar el Cache
const OBTENER_PROYECTOS = gql`
    query obtenerProyectos{
        obtenerProyectos{
            id,
            nombre
        }
    }
`;

const NuevoProyecto = () => {

    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    //Navegacion 
    const navigation = useNavigation();

    //apollo
    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, { data: { nuevoProyecto } }) {
            const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS });
            cache.writeQuery({
                query:OBTENER_PROYECTOS,
                data:{obtenerProyectos: obtenerProyectos.concat([nuevoProyecto])}
            })
        }
    });

    const monstrarAlerta = () => {
        ToastAndroid.show(mensaje, ToastAndroid.SHORT);
    }

    //Cuando hacemos submit
    const handleSubmit = async () => {
        //Validar
        if (nombre === '') {
            guardarMensaje('Debes colocar un nombre')
            return;
        }

        //Guardar el Proyecto en la base de datos
        try {
            const { data } = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            });

            console.log(data);
            guardarMensaje('Proyecto Creado Correctamente');
            navigation.navigate('Proyectos');

        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
        }

    }



    return (
        <Container style={[globalStyles.contenedor, { backgroundColor: '#e84347' }]}>
            <View style={globalStyles.contenido}>

                <H1 style={globalStyles.subtitulo}>Nuevo Proyecto</H1>

                <Form>
                    <Item inlineLabel last style={globalStyles.input}>
                        <Input
                            placeholder="Nombre del Proyecto"
                            onChangeText={texto => guardarNombre(texto)}
                        />
                    </Item>
                </Form>

                <Button
                    square
                    onPress={() => handleSubmit()}
                    block
                    style={[globalStyles.boton, { marginTop: 30 }]}
                >
                    <Text style={globalStyles.botonText}>Crear Proyecto</Text>
                </Button>

                {mensaje && monstrarAlerta()}
            </View>
        </Container>
    );
}

export default NuevoProyecto;
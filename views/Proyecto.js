import React, { useState } from 'react';
import { Container, Button, Text, H2, List, Content, Form, Item, Input } from 'native-base';
import globalStyles from '../styles/global';
import { ToastAndroid, StyleSheet } from 'react-native';
import { gql, useMutation, useQuery } from '@apollo/client';
import Tarea from '../components/Tarea';



const NUEVA_TAREA = gql`
        mutation nuevaTarea($input:TareaInput){
            nuevaTarea(input:$input){
                nombre
                id
                proyecto
                estado
            }
        }
`;

const OBTENER_TAREAS = gql`
    query obtenerTareas($input: ProyectoIDInput){
        obtenerTareas(input: $input){
            id
            nombre
            estado
        }
    }
`;


const Proyecto = ({ route }) => {

    //state del compinenteTareaInput
    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    //Apollo crear Tareas 
    const [nuevaTarea] = useMutation(NUEVA_TAREA, {
        update(cache, { data: { nuevaTarea } }) {
            const { obtenerTareas } = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: route.params.id
                    }
                }
            });

            cache.writeQuery({
                query:OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: route.params.id
                    }
                },
                data:{
                    obtenerTareas:[...obtenerTareas, nuevaTarea]
                }
            })
        }
    });

    //Apollo obtener Tareas
    const { data, loading, error } = useQuery(OBTENER_TAREAS, {
        variables: {
            input: {
                proyecto: route.params.id
            }
        }
    });

    console.log(data);


    //Funcion Submit
    const handleSubmit = async () => {
        if (nombre === '') {
            guardarMensaje('El nombre de la tarea es Obligatorio')
            return;
        }

        //Almacenarlo en la bd
        try {
            const { data } = await nuevaTarea({
                variables: {
                    input: {
                        nombre,
                        proyecto: route.params.id
                    }
                }
            });

            console.log(data);
            guardarNombre('');
            guardarMensaje('Se Agrego Tarea Correctamente');
            setTimeout(() => {
                guardarMensaje(null);

            }, 3000);

        } catch (error) {
            console.log(error);
        }




    }
    /*     console.log(route.params); */

    const monstrarAlerta = () => {
        ToastAndroid.show(mensaje, ToastAndroid.SHORT);
    }

    //Si apollo esta Consultando 
    if (loading) return <Text>Cargando</Text>


    return (
        <Container style={[globalStyles.contenedor], { backgroundColor: '#e84347' }}>
            <Form style={{ marginHorizontal: '2.5%', marginTop: 20 }}>
                <Item inlineLabel last style={globalStyles.input}>
                    <Input
                        placeholder="Nombre de la Tarea"
                        value={nombre}
                        onChangeText={texto => guardarNombre(texto)}
                    />
                </Item>
                <Button
                    square
                    block
                    style={globalStyles.boton}
                    onPress={() => handleSubmit()}
                >
                    <Text style={globalStyles.botonText}>Crear Tarea</Text>
                </Button>

            </Form>
            <H2 style={globalStyles.subtitulo}>Tareas:{route.params.nombre}</H2>

            <Content>
                <List style={styles.contenido}>
                    {data.obtenerTareas.map(tarea => (
                        <Tarea
                            proyectoID={route.params.id}
                            tarea={tarea}
                            key={tarea.id} />
                    ))}
                </List>
            </Content>

            {mensaje && monstrarAlerta()}
        </Container>
    );
}

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#fff',
        marginHorizontal: '2.5%'
    }
});

export default Proyecto;
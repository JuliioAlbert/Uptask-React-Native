import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { Container, Button, Text, H2, Content, List, ListItem, Left, Right } from 'native-base';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

import { useQuery, gql } from '@apollo/client';

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos{
        obtenerProyectos{
            id,
            nombre
        }
    }
`;

const Proyectos = () => {

    const navigation = useNavigation();

    //apollo 
    const { data, loading, error } = useQuery(OBTENER_PROYECTOS);
    //State

    console.log(data);
    console.log(loading);
    console.log(error);

    if(loading) return <Text>Cargando</Text>
    return (
        <>
            <StatusBar
                hidden={false}
                showHideTransition='slide'
                backgroundColor="#28303b"
                barStyle="light-content"
            />
            <Container style={[globalStyles.contenedor, { backgroundColor: '#e84347' }]}>
                <Button
                    square
                    onPress={() => navigation.navigate('NuevoProyecto')}
                    block
                    style={[globalStyles.boton, { marginTop: 30 }]}
                >
                    <Text style={globalStyles.botonText}>Nuevo Proyecto</Text>
                </Button>

                <H2 style={globalStyles.subtitulo}>Selecciona un Proyecto</H2>

                <Content>
                    <List style={styles.contenido}>
                        {data.obtenerProyectos.map(proyecto => (
                            <ListItem
                                key={proyecto.id}
                                onPress={() => navigation.navigate('Proyecto', proyecto)}
                            >
                                <Left>
                                    <Text>{proyecto.nombre}</Text>
                                </Left>
                                <Right>

                                </Right>
                            </ListItem>

                        ))}
                    </List>
                </Content>
            </Container>
        </>
    );
}

const styles = StyleSheet.create({
    contenido: {
        backgroundColor: '#fff',
        marginHorizontal: '2.5%'
    }
})

export default Proyectos;
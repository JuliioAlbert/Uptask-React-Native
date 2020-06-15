import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    contenedor: {
        flex: 1
    },
    contenido: {
        flexDirection: "column",
        justifyContent: "center",
        marginHorizontal: "2.5%",
        flex: 1
    },
    titulo:{
        textAlign:"center",
        fontSize:30,
        marginBottom:20,
        fontWeight:"bold",
        color:'#fff'
    },
    input:{
        backgroundColor:'#fff',
        marginBottom:20,
    },
    boton:{
        backgroundColor:'#28303b',
        borderRadius:20
    },
    botonText:{
        textTransform:"uppercase",
        fontWeight:"bold",
        color:'#fff'
    },
    enlace:{
        color:'#fff',
        marginTop:60,
        textAlign:"center",
        fontWeight:"bold",
        fontSize:18,
        textTransform:"uppercase"
    },
    subtitulo:{
        color:'#fff',
        marginTop:20,
        textAlign:"center",
        fontWeight:"bold",
        fontSize:26,
        textTransform:"uppercase"  
    }
});

export default globalStyles;
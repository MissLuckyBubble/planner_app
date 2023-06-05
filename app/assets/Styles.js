import { Colors } from "./Colors";

export const commonStyles = {
    button: {
        width: 300,
        height: 50,
        backgroundColor: Colors.highlight,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    btntext: {
        fontSize: 18,
        color: Colors.dark
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: 340,
        padding: 5,
        borderRadius: 10,
        borderColor: Colors.primary,
        borderWidth: 2,
        marginRight: 10
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: Colors.dark,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        textAlign: 'center'
    },
    simpleText: {
        margin:5,
        marginBottom:10,
        color:Colors.dark,
        fontSize: 16,
    }
};
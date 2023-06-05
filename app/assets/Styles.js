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
        width:340,
        padding: 5,
        borderRadius: 10,
        borderColor: Colors.primary,
        borderWidth: 2,
        marginRight: 10
    },
};
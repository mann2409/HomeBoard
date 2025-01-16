import { Alert } from 'react-native';

export const showDeleteConfirmation = () => {
    return new Promise((resolve) => {
        Alert.alert(
            "Delete To-Do Item",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => resolve(false),
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => resolve(true),
                }
            ],
            { cancelable: true }
        );
    });
};

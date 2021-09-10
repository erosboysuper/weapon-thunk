export const removeReadAlert = (alertItems, id) => {
    const filterdAlertItems = alertItems.filter( alertItem => alertItem.id !== id);
    return filterdAlertItems;
}
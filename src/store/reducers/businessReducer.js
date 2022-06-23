const businessReducer = (state = {}, action) => {
    switch (action.type) {
        case "SWITCH_BUSINESS": {
            const busObj = action.payload
            return {...state, ...busObj};
        }
        case "SWITCH_BUSINESS_ERR":
            return state;
        default:
            return state;
    }
};


export default businessReducer;
const businessReducer = (state = {}, action) => {
    switch (action.type) {
        case "SWITCH_BUSINESS":
            return {...state, business: action.payload};
        case "SWITCH_BUSINESS_ERR":
            return state;
        default:
            return state;
    }
};


export default businessReducer;
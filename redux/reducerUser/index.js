var initialState = {
    kullaniciId: '211324',
    tckn:'121541511'
   
};

export default function reducerUser(state = initialState, action) {
    switch (action.type) {
        case 'UpdateId':
            return Object.assign({}, state, { kullaniciId: action.payload.kullaniciId });
        case 'UpdateTC':
                return Object.assign({}, state, { tckn: action.payload.tckn });
        default:
            return state;
    }
}
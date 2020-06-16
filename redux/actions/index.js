import {store} from '../../App'

export function UpdateId(KullaniciID)
{
    var herhangibirobje={
            type : 'UpdateId',
            payload: {
                kullaniciId: KullaniciID
            }     
    };
    store.dispatch(herhangibirobje);

}
export function UpdateTC(Tckn)
{
    var hangibirobje={
            type : 'UpdateTC',
            payload: {
                tckn: Tckn
            }     
    };
    store.dispatch(hangibirobje);

}


import axios from "axios";

const productsApi = axios.create({
    baseURL: 'http://localhost:3100'
});

export { productsApi };

//se pone así porque se van a poner interceptores, por eso ponemos el export asi.
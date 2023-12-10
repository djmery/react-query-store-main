import { useParams } from "react-router-dom";
import { ProductCard, useProduct } from "..";
import { useEffect } from "react";



export const ProductById = () => {

    const { id } = useParams();

    const { isLoading, product } = useProduct({ id: +id! })
    // +id! - el mas para transformarlo a número y el ! que siempre lo voy a recibir

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);


    return (
        <div className="flex-col">
            <h1 className="text-2xl font-bold">Producto</h1>

            {isLoading && <p>Cargando...</p>}
            {
                product && <ProductCard product={product} fullDescription={true} />
                // se puede poner solo fullDescription  sin el true es redundante.
            }

        </div>
    )
}
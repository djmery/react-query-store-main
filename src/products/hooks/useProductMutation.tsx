import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, productActions } from "..";

export const useProductMutation = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: productActions.createProduct,

        onMutate: (product) => {
            console.log('Mutando - Optimistic Update');

            // Optimistic Product
            const optimisticProduct = { id: Math.random(), ...product }
            console.log({ optimisticProduct });

            // Almacenar el producto en cache del query client
            queryClient.setQueryData<Product[]>(
                ['products', { filterKey: product.category }],
                (old) => (old) ? [...old, optimisticProduct] : [optimisticProduct],
            );

            return { optimisticProduct }; // retorna un objeto con el producto optimista
        },

        onSuccess: (product, variables, context) => {

            console.log({ product, variables, context });
            // queryClient.invalidateQueries({
            //     // de esta forma invalida el query
            //     queryKey: ['products', { 'filterKey': data.category }],
            // })

            queryClient.removeQueries({
                queryKey: ['product', context?.optimisticProduct.id]
            });


            queryClient.setQueryData<Product[]>(
                ['products', { filterKey: product.category }],
                (old) => {
                    if (!old) return [product];
                    return old.map(cacheProduct => {
                        return (cacheProduct.id === context?.optimisticProduct.id) ? product : cacheProduct;  // si el id del producto optimista es igual al id del producto cache, entonces actualiza el producto cache, sino lo agrega al cache
                    })
                }
            )
        },

        onError: (error, variables, context) => {
            console.log({ error, variables, context });
            queryClient.removeQueries({
                queryKey: ['product', context?.optimisticProduct.id]
            });

            queryClient.setQueryData<Product[]>(
                ['products', { filterKey: variables.category }],
                (old) => {
                    if (!old) return [];
                    return old?.filter(cacheProduct => cacheProduct.id !== context?.optimisticProduct.id); // si el id del producto optimista es igual al id del producto cache, entonces actualiza el producto cache, sino lo agrega al cache
                }
            )

        }

    })

    return {
        mutation
    }
}

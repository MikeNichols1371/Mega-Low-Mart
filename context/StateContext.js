import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();
export const StateContext = ( { children } ) => {
    const [showCart, setShowCart] = useState( false );
    const [cartItems, setCartItems] = useState( [] );
    const [totalPrice, setTotalPrice] = useState( 0 );
    const [totalQuantity, setTotalQuantity] = useState( 0 );
    const [qty, setQty] = useState( 1 );
    
    let productFound;
    let index;
    
    useEffect( () => {
        const storage = localStorage.getItem( 'cart' );
        const cartData = JSON.parse( storage );
        if( cartData !== null ){
            setCartItems( cartData );
            cartData.map( ( item ) => { 
                setTotalPrice( ( prevTotalPrice ) => prevTotalPrice + item.price * item.quantity );
                setTotalQuantity( ( prevTotalQuantity ) => prevTotalQuantity + item.quantity );
            })}
    }, [] )
    const onAdd = ( product, quantity ) => {
        const checkProductInCart = cartItems.find(( item ) => item._id === product._id );
        setTotalPrice( ( prevTotalPrice ) => prevTotalPrice + product.price * quantity);
        setTotalQuantity( ( prevTotalQuantity ) => prevTotalQuantity + quantity );
        setQty( 1 );
        localStorage.setItem( 'cart', JSON.stringify( cartItems ));

        if( checkProductInCart ){
            const updatedCartItems = cartItems.map( ( cartProduct ) => {
                if( cartProduct._id === product._id ){
                    return {
                        ...cartProduct, 
                        quantity: cartProduct.quantity + quantity
                    }
                }
            })
            setCartItems( updatedCartItems );
            localStorage.setItem( 'cart', JSON.stringify( updatedCartItems ));
        }
        else{ 
            product.quantity = quantity;
            setCartItems( [ ...cartItems, { ...product } ]);
            localStorage.setItem( 'cart', JSON.stringify( [ ...cartItems, { ...product } ] ));
        }
        toast.success( `${ qty } ${ product.name } added to the cart.`); 
    }

    const onRemove= ( product ) => { 
        productFound = cartItems.find(( item ) => item._id === product._id );
        const newCartItems = cartItems.filter( ( item ) => item._id !== product._id );
        setTotalPrice( ( prevTotalPrice ) => prevTotalPrice - productFound.price * productFound.quantity );
        setTotalQuantity( ( prevTotalQuantity ) => prevTotalQuantity - productFound.quantity );
        setCartItems( newCartItems );
        localStorage.setItem( 'cart', JSON.stringify( newCartItems ));
    }

    const toggleCartItemQuantity = ( id, value ) => {
        productFound = cartItems.find( ( item ) => item._id === id );
        index = cartItems.findIndex( ( product ) => product._id === id );
        const newCartItems = cartItems.filter( ( item ) => item._id !== id );

        if( value === 'inc' ){
            newCartItems.splice( index, 0, { ...productFound, quantity: productFound.quantity + 1 } );
            setCartItems( newCartItems ); 
            setTotalPrice( ( prevTotalPrice ) => prevTotalPrice + productFound.price ); 
            setTotalQuantity( ( prevTotalQuantity ) => prevTotalQuantity + 1 );
            localStorage.setItem( 'cart', JSON.stringify( newCartItems ) );
        }
        else if( value === "dec" ){
            if( productFound.quantity > 1 ){
            newCartItems.splice( index, 0, { ...productFound, quantity: productFound.quantity - 1 } );
            setCartItems( newCartItems ); 
            setTotalPrice( ( prevTotalPrice ) => prevTotalPrice - productFound.price ); 
            setTotalQuantity( ( prevTotalQuantity ) => prevTotalQuantity - 1 );
            localStorage.setItem( 'cart', JSON.stringify( newCartItems ) );
            }
        }
    }
    const increaseQty = () => {
        setQty( ( qty ) => qty + 1 );
    }
    const decreaseQty = () => {
        setQty( ( qty ) => { 
            if( qty - 1 < 1 ){
                return 1;
            }; 
            return qty - 1 ;
        });
    }

    return (
        <Context.Provider value={{ 
            showCart,
            cartItems,
            setCartItems,
            totalPrice,
            setTotalPrice,
            totalQuantity,
            setTotalQuantity,
            qty,
            increaseQty,
            decreaseQty,
            onAdd,
            setShowCart, 
            toggleCartItemQuantity,
            onRemove,  }}>
            { children }
        </Context.Provider>
    )
}

export const useStateContext = () => useContext( Context );
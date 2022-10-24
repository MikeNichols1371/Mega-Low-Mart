import Stripe from 'stripe';

const stripe = new Stripe( `${ process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY }` );

// More on Stripe at https://stripe.com/docs/checkout/quickstart?client=next
export default async function handler( req, res ) {
    console.log( req.body.cartItems )

  if ( req.method === 'POST' ) {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: [ 'card' ],
        billing_address_collection: 'auto',
        shipping_options: [
            { shipping_rate: 'shr_1LvOyXHjFVZju5N2UeChBmk5' },
            { shipping_rate: 'shr_1LvP3CHjFVZju5N2Jgc61mpw' },
        ],
        line_items: req.body.cartItems.map( ( item ) => {
          const img = item.image[ 0 ].asset._ref;
          const newImage = img.replace( ' image-', 'https://cdn.sanity.io/images/j3kuu7bw/production/').replace( '-webp', '.webp' );
          console.log('img', img)
          console.log('new img', newImage)
          
          return {
            price_data: { currency: 'USD', 
            product_data: {
              name: item.name,
              images: [ newImage ] 
            },
            unit_amount: item.price * 100 
            },
            adjustable_quantity: { 
              enabled: true, 
              minimum: 1
            }, 
            quantity: item.quantity
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create( params );
      res.status( 200 ).json( session );
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
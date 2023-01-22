import express, { application } from "express";
import cors from "cors";
import { client } from "./server.js";
import { v4 as uuidv4 } from 'uuid';
import Stripe from "stripe" ;
const stripe = new Stripe(process.env.STRIPE,{apiVersion : '2022-11-15',})
const PORT = 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Server created successfully");
});
app.get("/api/foods/getfoods", async (req,res)=>{
    try{
    const food = await client.db("FoodDeliveryApp")
                             .collection("FoodItems")
                             .find({})
                             .toArray();
    // console.log(food);
    res.send(food)
    }
    catch (err){
        return res.status(400).json({message : err})
    }

})


app.post('/api/orders/placeorder', async (req,res)=>{

    const {token,subtotal,cartItems} = req.body

    try {
        // console.log(Stripe)
        const customer = await stripe.customers.create({
            email : token.email,
            source : token.id
        })
        // console.log(customer)

        if(customer){
            res.send("Order placed successfully")
        }
        else{
            res.send("Payment failed")
        }

    } catch (error) {
        return res.status(400).json({message : "Something went wrong" + error}) 
    }

})


const port = process.env.PORT || 5000;
app.listen(port,()=>console.log("Port",PORT,"hpy","is working"));
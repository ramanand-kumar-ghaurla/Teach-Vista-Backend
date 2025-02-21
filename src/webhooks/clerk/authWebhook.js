import { Webhook } from "svix"; 
import { configDotenv } from "dotenv";
import { User } from "../../models/user.model.js";
import {clerkClient } from '@clerk/express'
configDotenv()

const userCreateWebhook = async(req, res) => {
    try {
       
        const rawBody = JSON.stringify(req.body);
        const svixHeader = req.headers;

        const wh = new Webhook(process.env.CLERK_SIGNING_SECRET);
        const evt = wh.verify(rawBody, svixHeader);

        const { id, ...attributes } = evt.data;
        const evtType = evt.type;

        if (evtType === 'user.created') {
           
            await clerkClient.users.updateUserMetadata(evt?.data?.id,{
                publicMetadata:{
                    role:'Student'
                }
            })
            
            const user = await User.create({
                clerkId:evt?.data?.id ,
                firstName: evt?.data?.first_name,
                lastName: evt?.data?.last_name,
                email: evt?.data?.email_addresses[0]?.email_address,
                role : evt?.data?.public_metadata?.role ,
            })

          
           
                }

                if (evtType === 'user.updated') {
                    
                    
                    const clerkId = evt.data.id

                    if(!clerkId){
                        throw new Error('clerk id is missing ')

                    }
                  
                    const {first_name,last_name,public_metadata} = evt.data

                    if(!first_name || !last_name || !public_metadata){
                        throw new Error('all fields are require')
                    }

                    const user = await User.findOneAndUpdate({clerkId:clerkId},{
                        $set:{
                            firstName:first_name,
                            lastName:last_name,
                            role:role || 'Student'
                            }
                    },{new:true, overwriteDiscriminatorKey:true})

                    

                        }

                        if (evtType === 'user.deleted') {
                            
                            const clerkId = evt.data.id

                            if(!clerkId){
                                throw new Error('clerk id is missing ')
        
                            }
                          
                          
                           const user = await User.findOne({clerkId:clerkId})
                          
                                
                           const response = await User.findOneAndDelete({clerkId:clerkId})
                           
                                
                        }

        
        res.status(200).json({
            success: true,
            message: 'Webhook received',
        });
    } catch (error) {
        console.log('error in webhook', error);
        res.status(500).json({
            success: false,
            message: 'Webhook handling failed',
        });
    }
};

export {
    userCreateWebhook
}
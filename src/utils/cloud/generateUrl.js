import { configDotenv } from "dotenv"

configDotenv()

export const generateCloudFrontURLFromKey = async(key)=>{
    try {

        if(!key){
            throw new Error("key is mendatory for url generation");
            
        }
        
        const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN

        const lectureCloudfrontURL = ` ${cloudfrontDomain}/${key}`

        return lectureCloudfrontURL
    } catch (error) {
        
        throw new Error(" error in generating cloudfront url of transcoded lecture video");
        
    }
}
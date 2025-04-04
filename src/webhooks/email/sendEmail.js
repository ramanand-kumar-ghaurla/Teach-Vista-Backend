import {createTransport} from 'nodemailer'
import { configDotenv } from 'dotenv'

configDotenv()

const transporter = createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_EMAIL_PASSWORD
    },
  
})

const sendSuccessTranscodinEmail = async( userEmail,lectureURL,username,lectureTitle)=>{

  try {
    
  
    const response = await  transporter.sendMail({
          from:process.env.USER_EMAIL,
          to:userEmail,
          envelope:{
              from:process.env.USER_EMAIL,
              to:userEmail
          },
          
          priority:'high',
          subject:'Update About Successfull Processing of Lecture Video',
          html:`
           <p>Dear ${username},</p>
            <p>We are pleased to inform you that the lecture upload by you with title <strong>"${lectureTitle}"</strong> has been processed successfully.</p>
          <p>You may review the lecture at the following link:</p>
          <p><a href="${lectureURL}">Review Lecture</a></p>
          <p>If you have any questions or require further assistance, please do not hesitate to reach out.</p>
          <p> Team <strong> "TeachVista"</strong> </p>
          <p><strong>Note:</strong> This is an automated email. Please do not reply.</p>

    `
      })
      console.log('response of sent email',response)
  } catch (error) {
    console.log('error in sending email of success ',error)
    throw new Error("error in sending success email");
    
  }
}

const sendFailureTranscodingEmail = async(userEmail,username,lectureTitle)=>{
try {
    
      const response= await transporter.sendMail({
            from:process.env.USER_EMAIL,
            to:userEmail,
            envelope:{
                from:process.env.USER_EMAIL,
                to:userEmail
            },
            priority:'high',
            subject:'Action Required: Lecture Processing Failed',
            html:`
             <p>Dear ${username},</p>
            <p>We regret to inform you that the lecture uploaded by you with title <strong>"${lectureTitle}"</strong> could not be processed due to an error.</p>
            <p>Please upload the lecture again to ensure it is properly transcoded.</p> 
             <p>We apologize for any inconvenience caused.</p>
             <p> Team <strong> "TeachVista"</strong> </p>
            //  add a fallback url here to upload only video
            <p><strong>Note:</strong> This is an automated email. Please do not reply.</p>

             `
        })

        console.log('response of sent email',response)
} catch (error) {
    console.log('error in sending video Processing failure email ',error)
    throw new Error("error in sending video Processing failure email");
}
}

export { sendSuccessTranscodinEmail,
    sendFailureTranscodingEmail
}
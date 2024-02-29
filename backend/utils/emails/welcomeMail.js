// Import the necessary modules here
import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (user) => {
  // Write your code here
  const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'codingninjas2k16@gmail.com',
      pass:'slwvvlczduktvhdj'
    }
  })
  const mailContent=`<center><img src='https://files.codingninjas.in/logo1-32230.png?_ga=2.22857149.762598547.1708516278-1130532420.1693220522'><br/><h1 style='color:purple'>Welcome To StoreFleet</h1><p style='color:purple'>Hello, ${user.name}</p><p style='color:purple'>Thank you for registering with storefleet. We are excited to have as a member of our community</center>`;
  let mailoptions={
    from:'codingninjas2k16@gmail.com',
    to:user.email,
    subject:`Welcome to StoreFleet`,
    html:mailContent
  }
  try {
    transporter.sendMail(mailoptions,function(error,info){
      if(error){
        console.log(error);
        throw error;
        // throw new Error('Email could not be sent. Please check your internet connection');
      }
      else{
        console.log('Success: Email sent to '+user.email);
      }
    })
  }
    // console.log('Sucess: Email sent to '+recieverMail);
   catch (error) {
    console.log('Email failed with error-'+error);
    // throw error;
    if(error.code==='EDNS')
    throw 'Email could not be sent. Please check your internet connection';
  }
};

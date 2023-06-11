import { initializeApp } from "firebase/app";
export const firebaseConfig = {
  apiKey: "AIzaSyBxItFltQlcaFl5OqDlSyQbX1BuEXieVnY",
  authDomain: "betterstay-33577.firebaseapp.com",
  projectId: "betterstay-33577",
  storageBucket: "betterstay-33577.appspot.com",
  messagingSenderId: "132048561469",
  appId: "1:132048561469:web:46b87f20cabbcf61751154"
};

const app = initializeApp(firebaseConfig);
import {doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from 'react';

export default async function handler(req, res) {
  const { name, lastName, email, phone, checkIn, checkOut, propertyID, paid} = req.body; 
  if(name && lastName && email && phone && checkIn && checkOut && propertyID && paid){

    const db = getFirestore(app);
    const tokenRef = doc(db, "token", "token");
    const docSnap = await getDoc(tokenRef);
    let token;
    if (docSnap.exists()) {
        token = docSnap.data().token;
    } else {
      console.log("TOKEN NOT FOUND IN FIREBASE");
    }

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        guest: {firstName: name , lastName, phone: phone, email: email},
        listingId: propertyID,
        checkInDateLocalized: checkIn,
        checkOutDateLocalized: checkOut,
        status: 'confirmed'
      })
    };

    const options2 = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify({paymentMethod: {method: 'CASH'}, amount: paid})
    };

    console.log("*** PAID : " +paid);
  
    fetch('https://open-api.guesty.com/v1/reservations', options)
      .then(response => response.json())
      .then(response => fetch('https://open-api.guesty.com/v1/reservations/'+ response.id +'/payments', options2))
      .catch(err => console.error(err));

  }
    res.status(200).json( "done" );
}
import { waitForElementToBeRemoved } from '@testing-library/react';
import React, { useState } from 'react';

function DependentSelection(props){

    let contactInfo = [];
    const [ removeContact, setRemoveContact ] = useState(false);



    function getDependentInfo(){

        props.onFetchingData(true);

        //Get camperInfo & contact info from dynamics to populate the edit form
        fetch(`https://localhost:44398/camperinfo/getInfo/?contactid=%27${props.id}%27`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        })
        .then(result => {
            return result.json()
    
        .then(data => {
            // console.log(data.value);
            let dependentDetails = {};
            dependentDetails.firstname = props.firstname;
            dependentDetails.lastname = props.lastname;
            dependentDetails.contactid = props.id
            contactInfo[0] = data.value[0];
            contactInfo[1] = dependentDetails;

            props.onContactInfoHandler(contactInfo);
            
            //Once we get the camper info data, fetch the contact info
            /*
            fetch(`https://localhost:44398/contacts/getContactById/?contactid=%27${props.id}%27`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(result => {
                return result.json()

                .then(data => {
                    // console.log(data);
                    contactInfo[1] = data.value[0];

                    //Pass the data to the function in the parent
                    props.onContactInfoHandler(contactInfo);

                });
            }).catch(err => {console.log(err)});
            */

            ///////////////////////////////////////////////////////////////
            
          });
        })
        .catch(err => {
            console.log(err);
        });
    }





    function contactSelected(){
        if (removeContact){
            props.onRemoveContact(props.id);
        } else {
            let obj = { id: props.id, firstname: props.firstname, lastname: props.lastname };
            props.onAddContact(obj);
        }

        let removeContactLocal = removeContact;
        removeContactLocal = !removeContactLocal;
        setRemoveContact(removeContactLocal);
    }

    return(
        <span>
            <input type="checkbox" className="react-eventForm-checkbox" id={props.id} onClick={contactSelected}></input>
            <label htmlFor={props.id}>{props.name}</label>
            <button disabled={props.disableBtn} type="button" className="react-eventForm-editDependent" onClick={getDependentInfo}>Edit</button>
        </span>
    );
}

export default DependentSelection;